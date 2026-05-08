import { useEffect, useState } from 'react'
import { getFunds } from '../api/fundsApi'
import { refreshFundsMarketData } from '../api/marketDataApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const initialFilters = {
    minPrice: '',
    maxPrice: '',
    minReturn1y: '',
    maxReturn1y: '',
}

export default function FundsPage() {
    const [fundsPage, setFundsPage] = useState(null)
    const [filters, setFilters] = useState(initialFilters)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const [error, setError] = useState('')
    const [refreshError, setRefreshError] = useState('')
    const [refreshMessage, setRefreshMessage] = useState('')

    useEffect(() => {
        loadFunds(initialFilters)
    }, [])

    async function loadFunds(filtersForRequest = filters) {
        try {
            setLoading(true)
            setError('')

            const data = await getFunds({
                ...filtersForRequest,
                page: 0,
                size: 20,
            })

            setFundsPage(data)
        } catch (err) {
            setError(err.message || 'Не удалось загрузить список фондов')
        } finally {
            setLoading(false)
        }
    }

    function handleFilterChange(event) {
        const { name, value } = event.target

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    function handleFilterSubmit(event) {
        event.preventDefault()
        setRefreshMessage('')
        loadFunds(filters)
    }

    function handleResetFilters() {
        setFilters(initialFilters)
        setRefreshMessage('')
        loadFunds(initialFilters)
    }

    async function handleRefreshMarketData() {
        try {
            setRefreshing(true)
            setRefreshError('')
            setRefreshMessage('')

            await refreshFundsMarketData()

            setRefreshMessage('Рыночные данные по фондам обновлены.')
            await loadFunds(filters)
        } catch (err) {
            setRefreshError(err.message || 'Не удалось обновить данные по фондам')
        } finally {
            setRefreshing(false)
        }
    }

    if (loading) {
        return <Loading text="Загрузка фондов..." />
    }

    return (
        <section>
            <div className="page-header page-header--row">
                <div>
                    <h1>Фонды</h1>

                    <p>
                        В разделе отображаются фонды из whitelist. Для каждого фонда
                        показываются тикер, текущая цена, минимальная сумма покупки,
                        рассчитанная доходность за год и дата последнего обновления
                        рыночных данных.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => loadFunds(filters)}
                        disabled={refreshing}
                    >
                        Перезагрузить список
                    </button>

                    <button
                        type="button"
                        className="button"
                        onClick={handleRefreshMarketData}
                        disabled={refreshing}
                    >
                        {refreshing ? 'Обновление...' : 'Обновить данные из MOEX'}
                    </button>
                </div>
            </div>

            <form className="filters-card" onSubmit={handleFilterSubmit}>
                <div className="filters-card__header">
                    <h2>Фильтры</h2>

                    <p>
                        Фильтры передаются на backend как query-параметры endpoint
                        GET /api/funds.
                    </p>
                </div>

                <div className="filters-grid filters-grid--funds">
                    <label>
                        Цена от, ₽
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            min="0"
                            step="0.01"
                            placeholder="Например, 10"
                        />
                    </label>

                    <label>
                        Цена до, ₽
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            min="0"
                            step="0.01"
                            placeholder="Например, 300"
                        />
                    </label>

                    <label>
                        Доходность за год от, %
                        <input
                            type="number"
                            name="minReturn1y"
                            value={filters.minReturn1y}
                            onChange={handleFilterChange}
                            step="0.01"
                            placeholder="Например, 20"
                        />
                    </label>

                    <label>
                        Доходность за год до, %
                        <input
                            type="number"
                            name="maxReturn1y"
                            value={filters.maxReturn1y}
                            onChange={handleFilterChange}
                            step="0.01"
                            placeholder="Например, 30"
                        />
                    </label>
                </div>

                <div className="filters-actions">
                    <button type="submit" className="button">
                        Применить фильтры
                    </button>

                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={handleResetFilters}
                    >
                        Сбросить
                    </button>
                </div>
            </form>

            <ErrorMessage message={error} />
            <ErrorMessage message={refreshError} />

            {refreshMessage && (
                <div className="state state--success">
                    {refreshMessage}
                </div>
            )}

            {!error && fundsPage?.content?.length === 0 && (
                <div className="state">
                    Фонды не найдены по заданным условиям фильтрации.
                </div>
            )}

            {!error && fundsPage?.content?.length > 0 && (
                <>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th>Тикер</th>
                                <th>Текущая цена</th>
                                <th>Минимальная сумма</th>
                                <th>Доходность за год</th>
                                <th>Дата обновления</th>
                            </tr>
                            </thead>

                            <tbody>
                            {fundsPage.content.map((fund) => (
                                <tr key={fund.id}>
                                    <td>{fund.name}</td>
                                    <td>{fund.ticker}</td>
                                    <td>{formatMoney(fund.currentPrice)}</td>
                                    <td>{formatMoney(fund.minInvestmentAmount)}</td>
                                    <td>{formatPercent(fund.return1yPercent)}</td>
                                    <td>{formatDateTime(fund.lastMarketDataAt)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-info">
                        Страница {fundsPage.page + 1} из {fundsPage.totalPages || 1}. Всего
                        записей: {fundsPage.totalElements}.
                    </div>
                </>
            )}
        </section>
    )
}

function formatMoney(value) {
    if (value === null || value === undefined) {
        return '—'
    }

    return `${Number(value).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ₽`
}

function formatPercent(value) {
    if (value === null || value === undefined) {
        return '—'
    }

    return `${Number(value).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} %`
}

function formatDateTime(value) {
    if (!value) {
        return '—'
    }

    return new Date(value).toLocaleString('ru-RU')
}