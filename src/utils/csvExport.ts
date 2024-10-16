import { Article } from '@/types/types'

export const convertArticlesToCSV = (articles: Article[]): string => {
    const headers = ['Title', 'Authors', 'Year', 'Abstract', 'Journal', 'Keywords']
    const rows = articles.map(article => [
        article.title,
        article.authors.join('; '),
        article.year.toString(),
        article.abstract,
        article.journal,
        article.keywords.join('; ')
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return csvContent
}

export const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
