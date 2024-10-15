import { useState } from 'react'
import { Article } from '../types'
import { searchSemanticScholar, searchArxiv, searchOpenAlex } from '../api'

export const useArticleSearch = () => {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const searchArticles = async (query: string, source: 'semantic-scholar' | 'arxiv' | 'openalex') => {
        setLoading(true)
        setError(null)

        try {
            let results: Article[]

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

            setArticles(results)
        } catch (err) {
            setError('An error occurred while fetching articles')
        } finally {
            setLoading(false)
        }
    }

    return { articles, loading, error, searchArticles }
}