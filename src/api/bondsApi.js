import { apiRequest } from './apiClient'
import { buildUrl } from '../utils/queryParams'

export function getBonds(params = {}) {
    return apiRequest(buildUrl('/bonds', params))
}

export function getBondById(id) {
    return apiRequest(`/bonds/${id}`)
}

export function calculateBond(id, payload) {
    return apiRequest(`/bonds/${id}/calculate`, {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}