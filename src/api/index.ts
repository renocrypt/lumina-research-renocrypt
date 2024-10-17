import { Article } from '@/types/types'

const API_ENDPOINTS = {
    SEMANTIC_SCHOLAR: 'https://api.semanticscholar.org/graph/v1/paper/search',
    ARXIV: 'https://export.arxiv.org/api/query',
    OPENALEX: 'https://api.openalex.org/works',
}

export interface SearchParams {
    query: string;
    offset: number;
    limit: number;
}

export interface SearchResult {
    articles: Article[];
    hasMore: boolean;
    nextOffset?: number;
}

interface SemanticScholarItem {
    paperId: string;
    title: string;
    authors: { name: string }[];
    abstract?: string;
    year?: number;
    venue?: string;
    s2FieldsOfStudy?: { category: string }[];
    publicationTypes?: string[];
    openAccessPdf?: { url: string };
}

interface OpenAlexItem {
    id: string;
    title: string;
    authorships: { author: { display_name: string } }[];
    abstract?: string;
    publication_date: string;
    host_venue?: { display_name: string };
    concepts: { display_name: string }[];
}

export const searchSemanticScholar = async ({ query, offset, limit }: SearchParams): Promise<SearchResult> => {
    try {
        const fields = 'paperId,title,authors,year,abstract,venue,publicationTypes,openAccessPdf,s2FieldsOfStudy';
        const response = await fetch(`${API_ENDPOINTS.SEMANTIC_SCHOLAR}?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}&fields=${fields}`);

        if (!response.ok) {
            throw new Error(`Semantic Scholar API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        const articles = data.data.map((item: SemanticScholarItem) => ({
            id: item.paperId,
            title: item.title,
            authors: item.authors.map(author => author.name),
            abstract: item.abstract || 'No abstract available',
            year: item.year || 'N/A',
            journal: item.venue || 'Unknown',
            keywords: item.s2FieldsOfStudy?.map(field => field.category) || [],
            publicationType: item.publicationTypes?.[0] || 'Unknown',
            openAccessPdf: item.openAccessPdf?.url || null,
        }));

        return {
            articles,
            hasMore: data.next !== null,
            nextOffset: offset + limit,
        };
    } catch (error) {
        console.error('Error fetching data from Semantic Scholar:', error);
        return { articles: [], hasMore: false };
    }
};

export const searchArxiv = async ({ query, offset, limit }: SearchParams): Promise<SearchResult> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.ARXIV}?search_query=${encodeURIComponent(query)}&start=${offset}&max_results=${limit}`)
        const data = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(data, 'text/xml')
        const entries = xmlDoc.getElementsByTagName('entry')

        const articles = Array.from(entries).map((entry: Element) => ({
            id: entry.getElementsByTagName('id')[0]?.textContent || '',
            title: entry.getElementsByTagName('title')[0]?.textContent || '',
            authors: Array.from(entry.getElementsByTagName('author')).map((author: Element) => author.getElementsByTagName('name')[0]?.textContent || ''),
            abstract: entry.getElementsByTagName('summary')[0]?.textContent || '',
            year: new Date(entry.getElementsByTagName('published')[0]?.textContent || '').getFullYear(),
            journal: 'arXiv',
            keywords: [],
        }));

        return {
            articles,
            hasMore: articles.length === limit,
            nextOffset: offset + limit,
        };
    } catch (error) {
        console.error('Error fetching data from arXiv:', error);
        return { articles: [], hasMore: false };
    }
}

export const searchOpenAlex = async ({ query, offset, limit }: SearchParams): Promise<SearchResult> => {
    try {
        const page = Math.floor(offset / limit) + 1;
        const response = await fetch(`${API_ENDPOINTS.OPENALEX}?search=${encodeURIComponent(query)}&page=${page}&per-page=${limit}`)
        const data = await response.json()
        const articles = data.results.map((item: OpenAlexItem) => ({
            id: item.id,
            title: item.title,
            authors: item.authorships.map(authorship => authorship.author.display_name),
            abstract: item.abstract || 'No abstract available',
            year: new Date(item.publication_date).getFullYear(),
            journal: item.host_venue?.display_name || 'Unknown',
            keywords: item.concepts.map(concept => concept.display_name),
        }));

        return {
            articles,
            hasMore: data.meta.page < data.meta.pages,
            nextOffset: offset + limit,
        };
    } catch (error) {
        console.error('Error fetching data from OpenAlex:', error);
        return { articles: [], hasMore: false };
    }
}
