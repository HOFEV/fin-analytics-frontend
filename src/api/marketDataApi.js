import { apiRequest } from './apiClient'

export function refreshBondsMarketData() {
    return apiRequest('/market-data/refresh/bonds', {
        method: 'POST',
    })
}

export function refreshFundsMarketData() {
    return apiRequest('/market-data/refresh/funds', {
        method: 'POST',
    })
}