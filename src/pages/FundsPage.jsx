import { useEffect, useState } from 'react'
import { getFunds } from '../api/fundsApi'
import { refreshFundsMarketData } from '../api/marketDataApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Pagination from '../components/Pagination'
import { formatDateTime, formatMoney, formatPercent } from '../utils/formatters'

const initialFilters = {
    minPrice: '',
    maxPrice: '',
    minReturn1y: '',
    maxReturn1y: '',
}

const initialSortConfig = {
    field: '',
    direction: '',
}

export default function FundsPage() {
    const [fundsPage, setFundsPage] = useState(null)
    const [filters, setFilters] = useState(initialFilters)
    const [sortConfig, setSortConfig] = useState(initialSortConfig)

    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const [error, setError] = useState('')
    const [refreshError, setRefreshError] = useState('')
    const [refreshMessage, setRefreshMessage] = useState('')

    useEffect(() => {
        loadFunds(initialFilters, 0, pageSize, initialSortConfig)
    }, [])

    async function loadFunds(
        filtersForRequest = filters,
        pageForRequest = currentPage,
        sizeForRequest = pageSize,
        sortForRequest = sortConfig,
    ) {
        try {
            setLoading(true)
            setError('')

            const data = await getFunds({
                ...filtersForRequest,
                page: pageForRequest,
                size: sizeForRequest,
                sort: buildSortParam(sortForRequest),
            })

            setFundsPage(data)
            setCurrentPage(data.page)
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
        setCurrentPage(0)
        loadFunds(filters, 0, pageSize, sortConfig)
    }

    function handleResetFilters() {
        setFilters(initialFilters)
        setRefreshMessage('')
        setCurrentPage(0)
        loadFunds(initialFilters, 0, pageSize, sortConfig)
    }

    function handlePageSizeChange(event) {
        const newPageSize = Number(event.target.value)

        setPageSize(newPageSize)
        setCurrentPage(0)
        loadFunds(filters, 0, newPageSize, sortConfig)
    }

    function handleGoToPage(page) {
        if (!fundsPage) {
            return
        }

        const lastPageIndex = Math.max(fundsPage.totalPages - 1, 0)
        const safePage = Math.min(Math.max(page, 0), lastPageIndex)

        setCurrentPage(safePage)
        loadFunds(filters, safePage, pageSize, sortConfig)
    }

    function handleSort(field) {
        const nextDirection =
            sortConfig.field === field && sortConfig.direction === 'desc'
                ? 'asc'
                : 'desc'

        const nextSortConfig = {
            field,
            direction: nextDirection,
        }

        setSortConfig(nextSortConfig)
        setRefreshMessage('')
        setCurrentPage(0)

        loadFunds(filters, 0, pageSize, nextSortConfig)
    }

    async function handleRefreshMarketData() {
        try {
            setRefreshing(true)
            setRefreshError('')
            setRefreshMessage('')

            await refreshFundsMarketData()

            setRefreshMessage('Рыночные данные по фондам обновлены.')
            await loadFunds(filters, currentPage, pageSize, sortConfig)
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
                        В данном разделе отображаются фонды. Для каждого фонда показываются
                        тикер, текущая цена, рассчитанная доходность за год и дата
                        последнего обновления рыночных данных.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => loadFunds(filters, currentPage, pageSize, sortConfig)}
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
                                <th>
                                    <SortButton
                                        label="Цена"
                                        field="currentPrice"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th>
                                    <SortButton
                                        label="Доходность за год"
                                        field="return1yPercent"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th>Дата обновления</th>
                            </tr>
                            </thead>

                            <tbody>
                            {fundsPage.content.map((fund) => (
                                <tr key={fund.id}>
                                    <td>{fund.name}</td>
                                    <td>{fund.ticker}</td>
                                    <td>{formatMoney(fund.currentPrice)}</td>
                                    <td>{formatPercent(fund.return1yPercent)}</td>
                                    <td>{formatDateTime(fund.lastMarketDataAt)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={fundsPage.page}
                        size={pageSize}
                        totalPages={fundsPage.totalPages}
                        totalElements={fundsPage.totalElements}
                        first={fundsPage.first}
                        last={fundsPage.last}
                        onPageSizeChange={handlePageSizeChange}
                        onGoToPage={handleGoToPage}
                    />
                </>
            )}
        </section>
    )
}

function SortButton({ label, field, sortConfig, onSort }) {
    const isActive = sortConfig.field === field
    const icon = getSortIcon(isActive, sortConfig.direction)

    return (
        <button
            type="button"
            className={isActive ? 'sort-button sort-button--active' : 'sort-button'}
            onClick={() => onSort(field)}
            title={`Сортировать по полю "${label}"`}
        >
            <span>{label}</span>
            <span className="sort-button__icon">{icon}</span>
        </button>
    )
}

function getSortIcon(isActive, direction) {
    if (!isActive) {
        return '↕'
    }

    return direction === 'desc' ? '↓' : '↑'
}

function buildSortParam(sortConfig) {
    if (!sortConfig.field || !sortConfig.direction) {
        return ''
    }

    return `${sortConfig.field},${sortConfig.direction}`
}