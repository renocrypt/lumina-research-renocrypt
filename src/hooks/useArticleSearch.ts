import { useState, useEffect } from 'react'
import { Article } from '@/types/types'
import { searchSemanticScholar, searchArxiv, searchOpenAlex, SearchParams, SearchResult } from '@/api'

const CACHE_KEY = 'recentSearches'
const CURRENT_SEARCH_KEY = 'currentSearch'
const MAX_RECENT_SEARCHES = 10
const ITEMS_PER_PAGE = 10

interface CurrentSearchState {
    query: string;
    source: 'semantic-scholar' | 'arxiv' | 'openalex';
    articles: Article[];
    offset: number;
    hasMore: boolean;
}

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
        loadFromLocalStorage()
    }, [])

    const loadFromLocalStorage = () => {
        const cachedSearches = localStorage.getItem(CACHE_KEY)
        if (cachedSearches) {
            try {
                const parsedSearches = JSON.parse(cachedSearches)
                if (Array.isArray(parsedSearches) && parsedSearches.every(search =>
                    typeof search.query === 'string' &&
                    typeof search.source === 'string' &&
                    typeof search.timestamp === 'number'
                )) {
                    setRecentSearches(parsedSearches)
                } else {
                    localStorage.removeItem(CACHE_KEY)
                }
            } catch (error) {
                console.error('Error parsing recent searches from localStorage:', error)
                localStorage.removeItem(CACHE_KEY)
            }
        }

        const cachedCurrentSearch = localStorage.getItem(CURRENT_SEARCH_KEY)
        if (cachedCurrentSearch) {
            try {
                const currentSearch: CurrentSearchState = JSON.parse(cachedCurrentSearch)
                setArticles(currentSearch.articles)
                setCurrentOffset(currentSearch.offset)
                setCurrentQuery(currentSearch.query)
                setCurrentSource(currentSearch.source)
                setHasMore(currentSearch.hasMore)
            } catch (error) {
                console.error('Error parsing current search from localStorage:', error)
                localStorage.removeItem(CURRENT_SEARCH_KEY)
            }
        }
    }

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

        try {
            const cachedSearch = recentSearches.find(s => s.query === query && s.source === source)
            if (cachedSearch) {
                await loadAllArticlesForSearch(query, source)
            } else {
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

                // Save current search state
                saveCurrentSearchState(query, source, result.articles, result.nextOffset || ITEMS_PER_PAGE, result.hasMore)
            }
        } catch (err) {
            console.error(`Error in searchArticles for ${source}:`, err)
            setError(`An error occurred while fetching articles from ${source}: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setLoading(false)
        }
    }

    const loadAllArticlesForSearch = async (query: string, source: 'semantic-scholar' | 'arxiv' | 'openalex') => {
        let allArticles: Article[] = []
        let offset = 0
        let hasMore = true

        while (hasMore) {
            const result = await performSearch({ query, offset, limit: ITEMS_PER_PAGE }, source)
            allArticles = [...allArticles, ...result.articles]
            offset = result.nextOffset || offset + ITEMS_PER_PAGE
            hasMore = result.hasMore

            if (!result.hasMore) break
        }

        setArticles(allArticles)
        setCurrentOffset(offset)
        setHasMore(hasMore)
        saveCurrentSearchState(query, source, allArticles, offset, hasMore)
    }

    const loadMoreArticles = async () => {
        if (!currentQuery || loading) return

        setLoading(true)
        setError(null)

        try {
            const result = await performSearch({ query: currentQuery, offset: currentOffset, limit: ITEMS_PER_PAGE }, currentSource)

            const updatedArticles = [...articles, ...result.articles]
            setArticles(updatedArticles)
            setHasMore(result.hasMore)
            setCurrentOffset(result.nextOffset || currentOffset + ITEMS_PER_PAGE)

            // Update current search state in localStorage
            saveCurrentSearchState(currentQuery, currentSource, updatedArticles, result.nextOffset || currentOffset + ITEMS_PER_PAGE, result.hasMore)
        } catch (err) {
            console.error(`Error in loadMoreArticles for ${currentSource}:`, err)
            setError(`An error occurred while fetching more articles from ${currentSource}: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setLoading(false)
        }
    }

    const saveCurrentSearchState = (query: string, source: 'semantic-scholar' | 'arxiv' | 'openalex', articles: Article[], offset: number, hasMore: boolean) => {
        const currentSearchState: CurrentSearchState = {
            query,
            source,
            articles,
            offset,
            hasMore
        }
        localStorage.setItem(CURRENT_SEARCH_KEY, JSON.stringify(currentSearchState))
    }

    return { articles, loading, error, searchArticles, recentSearches, hasMore, loadMoreArticles }
}
