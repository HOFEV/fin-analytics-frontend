import { apiRequest } from './apiClient'
import { buildUrl } from '../utils/queryParams'

export function getEducationArticles(params = {}) {
    return apiRequest(buildUrl('/education/articles', params))
}

export function getEducationArticleBySlug(slug) {
    return apiRequest(`/education/articles/${slug}`)
}