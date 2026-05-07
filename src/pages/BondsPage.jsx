import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBonds } from '../api/bondsApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function BondsPage() {
    const [bondsPage, setBondsPage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadBonds()
    }, [])

    async function loadBonds() {
        try {
            setLoading(true)
            setError('')

            const data = await getBonds({
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

                <button type="button" className="button button--secondary" onClick={loadBonds}>
                    Обновить список
                </button>
            </div>

            <ErrorMessage message={error} />

            {!error && bondsPage?.content?.length === 0 && (
                <div className="state">
                    Облигации не найдены. Возможно, данные ещё не были загружены из MOEX.
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