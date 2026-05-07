const API_BASE_URL = '/api'

export async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    })

    const contentType = response.headers.get('content-type')
    const hasJsonBody = contentType && contentType.includes('application/json')

    const data = hasJsonBody ? await response.json() : null

    if (!response.ok) {
        const error = new Error(getErrorMessage(data, response.status))
        error.status = response.status
        error.data = data
        throw error
    }

    return data
}

function getErrorMessage(data, status) {
    if (!data) {
        return `Ошибка запроса. Код ответа: ${status}`
    }

    if (data.message) {
        return data.message
    }

    if (data.error) {
        return data.error
    }

    if (data.details && Array.isArray(data.details)) {
        return data.details.join(', ')
    }

    return `Ошибка запроса. Код ответа: ${status}`
}