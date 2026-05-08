import { apiRequest } from './apiClient'
import { buildUrl } from '../utils/queryParams'

export function getFunds(params = {}) {
    return apiRequest(buildUrl('/funds', params))
}