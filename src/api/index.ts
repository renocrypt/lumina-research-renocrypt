import { Article } from '@/types/types'

const API_ENDPOINTS = {
    SEMANTIC_SCHOLAR: 'https://api.semanticscholar.org/graph/v1/paper/search',
    ARXIV: 'https://export.arxiv.org/api/query',
    OPENALEX: 'https://api.openalex.org/works',
}

export const searchSemanticScholar = async (query: string): Promise<Article[]> => {
    try {
        // Fetch papers from the Semantic Scholar API without an API key
        const response = await fetch(`${API_ENDPOINTS.SEMANTIC_SCHOLAR}?query=${encodeURIComponent(query)}&limit=10&fields=title,authors,year,abstract,venue,topics`);

        if (!response.ok) {
            throw new Error(`Semantic Scholar API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Map the returned data to the Article format
        return data.data.map((item: any) => ({
            id: item.paperId,
            title: item.title,
            authors: item.authors.map((author: any) => author.name),
            abstract: item.abstract || 'No abstract available',
            year: item.year || 'N/A',
            journal: item.venue || 'Unknown',
            keywords: item.topics?.map((topic: any) => topic.topic) || [],
        }));
    } catch (error) {
        console.error('Error fetching data from Semantic Scholar:', error);
        return [];
    }
};


export const searchArxiv = async (query: string): Promise<Article[]> => {
    const response = await fetch(`${API_ENDPOINTS.ARXIV}?search_query=${encodeURIComponent(query)}&start=0&max_results=10`)
    const data = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data, 'text/xml')
    const entries = xmlDoc.getElementsByTagName('entry')

    return Array.from(entries).map((entry: any) => ({
        id: entry.getElementsByTagName('id')[0].textContent,
        title: entry.getElementsByTagName('title')[0].textContent,
        authors: Array.from(entry.getElementsByTagName('author')).map((author: any) => author.getElementsByTagName('name')[0].textContent),
        abstract: entry.getElementsByTagName('summary')[0].textContent,
        year: new Date(entry.getElementsByTagName('published')[0].textContent).getFullYear(),
        journal: 'arXiv',
        keywords: [],
    }))
}

export const searchOpenAlex = async (query: string): Promise<Article[]> => {
    const response = await fetch(`${API_ENDPOINTS.OPENALEX}?search=${encodeURIComponent(query)}`)
    const data = await response.json()
    return data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        authors: item.authorships.map((authorship: any) => authorship.author.display_name),
        abstract: item.abstract,
        year: new Date(item.publication_date).getFullYear(),
        journal: item.host_venue?.display_name || 'Unknown',
        keywords: item.concepts.map((concept: any) => concept.display_name),
    }))
}