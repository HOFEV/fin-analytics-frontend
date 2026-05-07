import { apiRequest } from './apiClient'

export function getBonds(params = {}) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    const path = queryString ? `/bonds?${queryString}` : '/bonds'

    return apiRequest(path)
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