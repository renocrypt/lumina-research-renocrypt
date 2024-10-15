import { useState, useEffect } from 'react'
import { Article } from '@/types/types'
import { searchSemanticScholar, searchArxiv, searchOpenAlex, SearchParams, SearchResult } from '@/api'

const CACHE_KEY = 'recentSearches'
const MAX_RECENT_SEARCHES = 10
const ITEMS_PER_PAGE = 10

export const useArticleSearch = () => {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [recentSearches, setRecentSearches] = useState<{ query: string, source: string, timestamp: number }[]>([])
    const [hasMore, setHasMore] = useState(false)
    const [currentOffset, setCurrentOffset] = useState(0)
    const [currentQuery, setCurrentQuery] = useState('')
    const [currentSource, setCurrentSource] = useState<'semantic-scholar' | 'arxiv' | 'openalex'>('semantic-scholar')

    useEffect(() => {
        const cachedSearches = localStorage.getItem(CACHE_KEY)
        if (cachedSearches) {
            try {
                const parsedSearches = JSON.parse(cachedSearches)
                // Check if the stored searches match the new structure
                if (Array.isArray(parsedSearches) && parsedSearches.every(search =>
                    typeof search.query === 'string' &&
                    typeof search.source === 'string' &&
                    typeof search.timestamp === 'number'
                )) {
                    setRecentSearches(parsedSearches)
                } else {
                    // If the structure doesn't match, clear the localStorage
                    localStorage.removeItem(CACHE_KEY)
                }
            } catch (error) {
                console.error('Error parsing recent searches from localStorage:', error)
                localStorage.removeItem(CACHE_KEY)
            }
        }
    }, [])

    const performSearch = async (params: SearchParams, source: 'semantic-scholar' | 'arxiv' | 'openalex'): Promise<SearchResult> => {
        switch (source) {
            case 'semantic-scholar':
                return await searchSemanticScholar(params)
            case 'arxiv':
                return await searchArxiv(params)
            case 'openalex':
                return await searchOpenAlex(params)
            default:
                throw new Error('Invalid source')
        }
    }

    const searchArticles = async (query: string, source: 'semantic-scholar' | 'arxiv' | 'openalex') => {
        setLoading(true)
        setError(null)
        setCurrentQuery(query)
        setCurrentSource(source)
        setCurrentOffset(0)

        try {
            const result = await performSearch({ query, offset: 0, limit: ITEMS_PER_PAGE }, source)

            setArticles(result.articles)
            setHasMore(result.hasMore)
            setCurrentOffset(result.nextOffset || ITEMS_PER_PAGE)

            // Update recent searches
            const updatedSearches = [
                { query, source, timestamp: Date.now() },
                ...recentSearches.filter(s => s.query !== query || s.source !== source)
            ].slice(0, MAX_RECENT_SEARCHES)

            setRecentSearches(updatedSearches)
            localStorage.setItem(CACHE_KEY, JSON.stringify(updatedSearches))
        } catch (err) {
            console.error(`Error in searchArticles for ${source}:`, err)
            setError(`An error occurred while fetching articles from ${source}: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setLoading(false)
        }
    }

    const loadMoreArticles = async () => {
        if (!currentQuery || loading) return

        setLoading(true)
        setError(null)

        try {
            const result = await performSearch({ query: currentQuery, offset: currentOffset, limit: ITEMS_PER_PAGE }, currentSource)

            setArticles(prevArticles => [...prevArticles, ...result.articles])
            setHasMore(result.hasMore)
            setCurrentOffset(result.nextOffset || currentOffset + ITEMS_PER_PAGE)
        } catch (err) {
            console.error(`Error in loadMoreArticles for ${currentSource}:`, err)
            setError(`An error occurred while fetching more articles from ${currentSource}: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setLoading(false)
        }
    }

    return { articles, loading, error, searchArticles, recentSearches, hasMore, loadMoreArticles }
}
