const API_BASE_URL = '/api'

export async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    })

    const data = await readResponseBody(response)

    if (!response.ok) {
        const error = new Error(getErrorMessage(data, response.status))
        error.status = response.status
        error.data = data
        throw error
    }

    return data
}

async function readResponseBody(response) {
    const contentType = response.headers.get('content-type') || ''

    if (response.status === 204) {
        return null
    }

    if (contentType.includes('application/json')) {
        try {
            return await response.json()
        } catch {
            return null
        }
    }

    try {
        const text = await response.text()
        return text || null
    } catch {
        return null
    }
}

function getErrorMessage(data, status) {
    if (!data) {
        return getDefaultStatusMessage(status)
    }

    if (typeof data === 'string') {
        return data
    }

    if (data.message) {
        return data.message
    }

    if (data.detail) {
        return data.detail
    }

    if (data.error) {
        return data.error
    }

    if (Array.isArray(data.details) && data.details.length > 0) {
        return data.details.join(', ')
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return formatErrorsArray(data.errors)
    }

    if (Array.isArray(data.fieldErrors) && data.fieldErrors.length > 0) {
        return formatFieldErrors(data.fieldErrors)
    }

    if (Array.isArray(data.violations) && data.violations.length > 0) {
        return formatFieldErrors(data.violations)
    }

    return getDefaultStatusMessage(status)
}

function formatErrorsArray(errors) {
    return errors
        .map((error) => {
            if (typeof error === 'string') {
                return error
            }

            if (error.message) {
                return error.message
            }

            if (error.defaultMessage) {
                return error.defaultMessage
            }

            return JSON.stringify(error)
        })
        .join(', ')
}

function formatFieldErrors(errors) {
    return errors
        .map((error) => {
            const field = error.field || error.property || error.path
            const message = error.message || error.defaultMessage || 'некорректное значение'

            return field ? `${field}: ${message}` : message
        })
        .join(', ')
}

function getDefaultStatusMessage(status) {
    if (status === 400) {
        return 'Некорректный запрос. Проверьте введённые данные.'
    }

    if (status === 404) {
        return 'Запрашиваемые данные не найдены.'
    }

    if (status === 409) {
        return 'Операция не может быть выполнена из-за текущего состояния данных.'
    }

    if (status >= 500) {
        return 'Ошибка сервера. Повторите запрос позже.'
    }

    return `Ошибка запроса. Код ответа: ${status}`
}