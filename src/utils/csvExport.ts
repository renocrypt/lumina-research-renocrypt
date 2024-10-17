import { Article } from '@/types/types'

const escapeCSV = (cell: string): string => {
    // Replace double quotes with two double quotes
    const escaped = cell.replace(/"/g, '""');
    // Wrap the cell in quotes if it contains commas, newlines, or quotes
    if (/[",\n\r]/.test(escaped)) {
        return `"${escaped}"`;
    }
    return escaped;
};

export const convertArticlesToCSV = (articles: Article[]): string => {
    const headers = ['Title', 'Authors', 'Year', 'Abstract', 'Journal', 'Keywords', 'ID', 'Publication Type', 'Open Access PDF']
    const rows = articles.map(article => [
        article.title,
        article.authors.join('; '),
        article.year.toString(),
        article.abstract,
        article.journal,
        article.keywords.join('; '),
        article.id,
    ])

    const csvContent = [
        headers.map(escapeCSV).join(','),
        ...rows.map(row => row.map(cell => escapeCSV(String(cell))).join(','))
    ].join('\n')

    return csvContent
}

export const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
}
