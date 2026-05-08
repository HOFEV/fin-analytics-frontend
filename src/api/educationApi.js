import { apiRequest } from './apiClient'

export function getEducationArticles(params = {}) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    const path = queryString
        ? `/education/articles?${queryString}`
        : '/education/articles'

    return apiRequest(path)
}

export function getEducationArticleBySlug(slug) {
    return apiRequest(`/education/articles/${slug}`)
}