export function buildQueryString(params = {}) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    return searchParams.toString()
}

export function buildUrl(path, params = {}) {
    const queryString = buildQueryString(params)

    return queryString ? `${path}?${queryString}` : path
}