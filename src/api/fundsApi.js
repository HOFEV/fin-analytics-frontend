import { apiRequest } from './apiClient'

export function getFunds(params = {}) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    const path = queryString ? `/funds?${queryString}` : '/funds'

    return apiRequest(path)
}