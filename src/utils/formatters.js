export function formatMoney(value) {
    if (value === null || value === undefined) {
        return '—'
    }

    return `${Number(value).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ₽`
}

export function formatPercent(value) {
    if (value === null || value === undefined) {
        return '—'
    }

    return `${Number(value).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} %`
}

export function formatDate(value) {
    if (!value) {
        return '—'
    }

    return new Date(value).toLocaleDateString('ru-RU')
}

export function formatDateTime(value) {
    if (!value) {
        return '—'
    }

    return new Date(value).toLocaleString('ru-RU')
}