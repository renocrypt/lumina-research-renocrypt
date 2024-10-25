import { useState, useCallback, useEffect } from 'react'
import { Article } from '@/types/types'
import { searchSemanticScholar, searchArxiv, searchOpenAlex, SearchParams, SearchResult } from '@/api'

const ITEMS_PER_PAGE = 30

interface StoredSearch {
    query: string;
    source: 'semantic-scholar' | 'arxiv' | 'openalex';
    articles: Article[];
    offset: number;
    hasMore: boolean;
    timestamp: number;
}

export const useArticleSearch = () => {
    const [currentArticles, setCurrentArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)
    const [currentOffset, setCurrentOffset] = useState(0)
    const [currentQuery, setCurrentQuery] = useState('')
    const [currentSource, setCurrentSource] = useState<'semantic-scholar' | 'arxiv' | 'openalex'>('arxiv')
    const [recentSearches, setRecentSearches] = useState<StoredSearch[]>([])

    useEffect(() => {
        loadSearchesFromLocalStorage()
    }, [])

    const loadSearchesFromLocalStorage = () => {
        const savedSearches = localStorage.getItem('recentSearches')
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches))
        }
    }

    const saveSearchToLocalStorage = (newSearch: StoredSearch) => {
        const updatedSearches = [newSearch, ...recentSearches.filter(s => s.query !== newSearch.query || s.source !== newSearch.source)]
        setRecentSearches(updatedSearches)
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
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
                throw new Error(`Unsupported source: ${source}`)
        }
    }

    const searchArticles = useCallback(async (query: string, source: 'semantic-scholar' | 'arxiv' | 'openalex') => {
        setLoading(true)
        setError(null)
        setCurrentQuery(query)
        setCurrentSource(source)
        setCurrentOffset(0)

        try {
            const result = await performSearch({ query, offset: 0, limit: ITEMS_PER_PAGE }, source)
            setCurrentArticles(result.articles)
            setHasMore(result.hasMore)
            setCurrentOffset(result.nextOffset || ITEMS_PER_PAGE)

            const newSearch: StoredSearch = {
                query,
                source,
                articles: result.articles,
                offset: result.nextOffset || ITEMS_PER_PAGE,
                hasMore: result.hasMore,
                timestamp: Date.now()
            }
            saveSearchToLocalStorage(newSearch)
        } catch (err) {
            console.error(`Error in searchArticles for ${source}:`, err)
            setError(`An error occurred while fetching articles from ${source}: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setLoading(false)
        }
    }, [recentSearches])

    const loadMoreArticles = async () => {
        if (!currentQuery || loading) return

        setLoading(true)
        setError(null)

        try {
            const result = await performSearch({ query: currentQuery, offset: currentOffset, limit: ITEMS_PER_PAGE }, currentSource)

            const updatedArticles = [...currentArticles, ...result.articles]
            setCurrentArticles(updatedArticles)
            setHasMore(result.hasMore)
            setCurrentOffset(result.nextOffset || currentOffset + ITEMS_PER_PAGE)

            // Update the current search in recentSearches
            const updatedSearches = recentSearches.map(search =>
                search.query === currentQuery && search.source === currentSource
                    ? { ...search, articles: updatedArticles, offset: result.nextOffset || currentOffset + ITEMS_PER_PAGE, hasMore: result.hasMore }
                    : search
            )
            setRecentSearches(updatedSearches)
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
        } catch (err) {
            console.error(`Error in loadMoreArticles for ${currentSource}:`, err)
            setError(`An error occurred while fetching more articles from ${currentSource}: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setLoading(false)
        }
    }

    const loadPastSearch = (query: string, source: 'semantic-scholar' | 'arxiv' | 'openalex') => {
        const pastSearch = recentSearches.find(s => s.query === query && s.source === source)
        if (pastSearch) {
            setCurrentArticles(pastSearch.articles)
            setCurrentQuery(pastSearch.query)
            setCurrentSource(pastSearch.source)
            setCurrentOffset(pastSearch.offset)
            setHasMore(pastSearch.hasMore)
        }
    }

    return {
        articles: currentArticles,
        loading,
        error,
        hasMore,
        searchArticles,
        loadMoreArticles,
        recentSearches,
        loadPastSearch,
    }
}
