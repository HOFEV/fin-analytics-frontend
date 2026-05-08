import { useEffect, useState } from 'react'
import { getFunds } from '../api/fundsApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function FundsPage() {
    const [fundsPage, setFundsPage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadFunds()
    }, [])

    async function loadFunds() {
        try {
            setLoading(true)
            setError('')

            const data = await getFunds({
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

                <button type="button" className="button button--secondary" onClick={loadFunds}>
                    Перезагрузить список
                </button>
            </div>

            <ErrorMessage message={error} />

            {!error && fundsPage?.content?.length === 0 && (
                <div className="state">
                    Фонды не найдены. Возможно, данные ещё не были загружены из MOEX.
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