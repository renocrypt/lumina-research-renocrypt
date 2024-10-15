import { useState, useEffect } from 'react'
import { Article } from '@/types/types'
import { searchSemanticScholar, searchArxiv, searchOpenAlex } from '@/api'

const CACHE_KEY = 'recentSearches'
const MAX_RECENT_SEARCHES = 10

export const useArticleSearch = () => {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [recentSearches, setRecentSearches] = useState<{ query: string, source: string, results: Article[], timestamp: number }[]>([])

    useEffect(() => {
        const cachedSearches = localStorage.getItem(CACHE_KEY)
        if (cachedSearches) {
            setRecentSearches(JSON.parse(cachedSearches))
        }
    }, [])

    const searchArticles = async (query: string, source: 'semantic-scholar' | 'arxiv' | 'openalex') => {
        setLoading(true)
        setError(null)

        try {
            let results: Article[]

            // Check if the search is already in the cache
            const cachedSearch = recentSearches.find(s => s.query === query && s.source === source)
            if (cachedSearch) {
                results = cachedSearch.results
            } else {
                // Perform the search if not in cache
                switch (source) {
                    case 'semantic-scholar':
                        results = await searchSemanticScholar(query)
                        break
                    case 'arxiv':
                        results = await searchArxiv(query)
                        break
                    case 'openalex':
                        results = await searchOpenAlex(query)
                        break
                    default:
                        throw new Error('Invalid source')
                }

                // Update recent searches with timestamp
                const updatedSearches = [
                    { query, source, results, timestamp: Date.now() },
                    ...recentSearches.filter(s => s.query !== query || s.source !== source)
                ].slice(0, MAX_RECENT_SEARCHES)

                setRecentSearches(updatedSearches)
                localStorage.setItem(CACHE_KEY, JSON.stringify(updatedSearches))
            }

            setArticles(results)
        } catch (err) {
            console.error(`Error in searchArticles for ${source}:`, err)
            setError(`An error occurred while fetching articles from ${source}: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setLoading(false)
        }
    }

    return { articles, loading, error, searchArticles, recentSearches }
}
