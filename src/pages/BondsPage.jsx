import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBonds } from '../api/bondsApi'
import { refreshBondsMarketData } from '../api/marketDataApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Pagination from '../components/Pagination'
import { formatDate, formatMoney, formatPercent } from '../utils/formatters'

const initialFilters = {
    minPrice: '',
    maxPrice: '',
    minYield: '',
    maxYield: '',
    riskRating: '',
}

const initialSortConfig = {
    field: '',
    direction: '',
}

export default function BondsPage() {
    const [bondsPage, setBondsPage] = useState(null)
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
        loadBonds(initialFilters, 0, pageSize, initialSortConfig)
    }, [])

    async function loadBonds(
        filtersForRequest = filters,
        pageForRequest = currentPage,
        sizeForRequest = pageSize,
        sortForRequest = sortConfig,
    ) {
        try {
            setLoading(true)
            setError('')

            const data = await getBonds({
                ...filtersForRequest,
                page: pageForRequest,
                size: sizeForRequest,
                sort: buildSortParam(sortForRequest),
            })

            setBondsPage(data)
            setCurrentPage(data.page)
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
        setCurrentPage(0)
        loadBonds(filters, 0, pageSize, sortConfig)
    }

    function handleResetFilters() {
        setFilters(initialFilters)
        setRefreshMessage('')
        setCurrentPage(0)
        loadBonds(initialFilters, 0, pageSize, sortConfig)
    }

    function handlePageSizeChange(event) {
        const newPageSize = Number(event.target.value)

        setPageSize(newPageSize)
        setCurrentPage(0)
        loadBonds(filters, 0, newPageSize, sortConfig)
    }

    function handleGoToPage(page) {
        if (!bondsPage) {
            return
        }

        const lastPageIndex = Math.max(bondsPage.totalPages - 1, 0)
        const safePage = Math.min(Math.max(page, 0), lastPageIndex)

        setCurrentPage(safePage)
        loadBonds(filters, safePage, pageSize, sortConfig)
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

        loadBonds(filters, 0, pageSize, nextSortConfig)
    }

    async function handleRefreshMarketData() {
        try {
            setRefreshing(true)
            setRefreshError('')
            setRefreshMessage('')

            await refreshBondsMarketData()

            setRefreshMessage('Рыночные данные по облигациям обновлены.')
            await loadBonds(filters, currentPage, pageSize, sortConfig)
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
                        onClick={() => loadBonds(filters, currentPage, pageSize, sortConfig)}
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
                                        label="Доходность"
                                        field="annualYieldPercent"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th>
                                    <SortButton
                                        label="Погашение"
                                        field="maturityDate"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th>
                                    <SortButton
                                        label="Рейтинг"
                                        field="riskRating"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </th>
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

                    <Pagination
                        page={bondsPage.page}
                        size={pageSize}
                        totalPages={bondsPage.totalPages}
                        totalElements={bondsPage.totalElements}
                        first={bondsPage.first}
                        last={bondsPage.last}
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