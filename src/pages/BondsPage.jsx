import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBonds } from '../api/bondsApi'
import { refreshBondsMarketData } from '../api/marketDataApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const initialFilters = {
    minPrice: '',
    maxPrice: '',
    minYield: '',
    maxYield: '',
    riskRating: '',
}

export default function BondsPage() {
    const [bondsPage, setBondsPage] = useState(null)
    const [filters, setFilters] = useState(initialFilters)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const [error, setError] = useState('')
    const [refreshError, setRefreshError] = useState('')
    const [refreshMessage, setRefreshMessage] = useState('')

    useEffect(() => {
        loadBonds(initialFilters)
    }, [])

    async function loadBonds(filtersForRequest = filters) {
        try {
            setLoading(true)
            setError('')

            const data = await getBonds({
                ...filtersForRequest,
                page: 0,
                size: 20,
            })

            setBondsPage(data)
        } catch (err) {
            setError(err.message || 'Не удалось загрузить список облигаций')
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
        loadBonds(filters)
    }

    function handleResetFilters() {
        setFilters(initialFilters)
        setRefreshMessage('')
        loadBonds(initialFilters)
    }

    async function handleRefreshMarketData() {
        try {
            setRefreshing(true)
            setRefreshError('')
            setRefreshMessage('')

            await refreshBondsMarketData()

            setRefreshMessage('Рыночные данные по облигациям обновлены.')
            await loadBonds(filters)
        } catch (err) {
            setRefreshError(err.message || 'Не удалось обновить данные по облигациям')
        } finally {
            setRefreshing(false)
        }
    }

    if (loading) {
        return <Loading text="Загрузка облигаций..." />
    }

    return (
        <section>
            <div className="page-header page-header--row">
                <div>
                    <h1>Облигации</h1>

                    <p>
                        В разделе отображаются облигации российского рынка. Для каждой
                        бумаги показаны основные параметры: тикер, эмитент, текущая цена,
                        годовая доходность, дата погашения и риск-рейтинг.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => loadBonds(filters)}
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
                        GET /api/bonds.
                    </p>
                </div>

                <div className="filters-grid">
                    <label>
                        Цена от, ₽
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            min="0"
                            step="0.01"
                            placeholder="Например, 900"
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
                            placeholder="Например, 1000"
                        />
                    </label>

                    <label>
                        Доходность от, %
                        <input
                            type="number"
                            name="minYield"
                            value={filters.minYield}
                            onChange={handleFilterChange}
                            step="0.01"
                            placeholder="Например, 8"
                        />
                    </label>

                    <label>
                        Доходность до, %
                        <input
                            type="number"
                            name="maxYield"
                            value={filters.maxYield}
                            onChange={handleFilterChange}
                            step="0.01"
                            placeholder="Например, 12"
                        />
                    </label>

                    <label>
                        Риск-рейтинг
                        <select
                            name="riskRating"
                            value={filters.riskRating}
                            onChange={handleFilterChange}
                        >
                            <option value="">Любой</option>
                            <option value="AAA">AAA</option>
                            <option value="AA">AA</option>
                            <option value="A">A</option>
                            <option value="BBB">BBB</option>
                            <option value="BB">BB</option>
                            <option value="B">B</option>
                            <option value="CCC">CCC</option>
                            <option value="CC">CC</option>
                            <option value="C">C</option>
                        </select>
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

            {!error && bondsPage?.content?.length === 0 && (
                <div className="state">
                    Облигации не найдены по заданным условиям фильтрации.
                </div>
            )}

            {!error && bondsPage?.content?.length > 0 && (
                <>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th>Тикер</th>
                                <th>Эмитент</th>
                                <th>Цена</th>
                                <th>Доходность</th>
                                <th>Погашение</th>
                                <th>Рейтинг</th>
                                <th></th>
                            </tr>
                            </thead>

                            <tbody>
                            {bondsPage.content.map((bond) => (
                                <tr key={bond.id}>
                                    <td>{bond.name}</td>
                                    <td>{bond.ticker}</td>
                                    <td>{bond.issuerName || '—'}</td>
                                    <td>{formatMoney(bond.currentPrice)}</td>
                                    <td>{formatPercent(bond.annualYieldPercent)}</td>
                                    <td>{formatDate(bond.maturityDate)}</td>
                                    <td>{bond.riskRating || '—'}</td>
                                    <td>
                                        <Link to={`/bonds/${bond.id}`} className="table-link">
                                            Открыть
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-info">
                        Страница {bondsPage.page + 1} из {bondsPage.totalPages || 1}. Всего
                        записей: {bondsPage.totalElements}.
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

function formatDate(value) {
    if (!value) {
        return '—'
    }

    return new Date(value).toLocaleDateString('ru-RU')
}