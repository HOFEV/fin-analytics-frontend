import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBondById } from '../api/bondsApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function BondDetailsPage() {
    const { id } = useParams()

    const [bond, setBond] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadBond()
    }, [id])

    async function loadBond() {
        try {
            setLoading(true)
            setError('')

            const data = await getBondById(id)
            setBond(data)
        } catch (err) {
            setError(err.message || 'Не удалось загрузить карточку облигации')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loading text="Загрузка карточки облигации..." />
    }

    if (error) {
        return (
            <section>
                <Link to="/bonds" className="back-link">
                    ← Назад к облигациям
                </Link>

                <ErrorMessage message={error} />
            </section>
        )
    }

    return (
        <section>
            <Link to="/bonds" className="back-link">
                ← Назад к облигациям
            </Link>

            <div className="page-header page-header--row">
                <div>
                    <h1>{bond.name}</h1>

                    <p>
                        Карточка облигации содержит основные параметры ценной бумаги,
                        полученные из backend. На следующем этапе в этот раздел будет
                        добавлена форма расчёта результата инвестирования.
                    </p>
                </div>

                <button type="button" className="button button--secondary" onClick={loadBond}>
                    Обновить карточку
                </button>
            </div>

            <div className="details-grid">
                <div className="details-card">
                    <h2>Основная информация</h2>

                    <dl className="details-list">
                        <DetailsRow label="ID" value={bond.id} />
                        <DetailsRow label="Название" value={bond.name} />
                        <DetailsRow label="Тикер" value={bond.ticker} />
                        <DetailsRow label="Эмитент" value={bond.issuerName || '—'} />
                        <DetailsRow label="Риск-рейтинг" value={bond.riskRating || '—'} />
                    </dl>
                </div>

                <div className="details-card">
                    <h2>Рыночные параметры</h2>

                    <dl className="details-list">
                        <DetailsRow label="Текущая цена" value={formatMoney(bond.currentPrice)} />
                        <DetailsRow
                            label="Минимальная сумма покупки"
                            value={formatMoney(bond.minInvestmentAmount)}
                        />
                        <DetailsRow
                            label="Годовая доходность"
                            value={formatPercent(bond.annualYieldPercent)}
                        />
                        <DetailsRow label="Дата погашения" value={formatDate(bond.maturityDate)} />
                        <DetailsRow
                            label="Дата обновления данных"
                            value={formatDateTime(bond.lastMarketDataAt)}
                        />
                    </dl>
                </div>
            </div>

            <div className="card card--mt">
                <h2>Примечание по расчёту</h2>

                <p>
                    В текущей версии backend расчёт по облигации выполняется отдельным
                    запросом POST /api/bonds/{bond.id}/calculate. Расчёты не сохраняются в
                    базе данных и используются только для отображения результата на
                    странице.
                </p>
            </div>
        </section>
    )
}

function DetailsRow({ label, value }) {
    return (
        <div>
            <dt>{label}</dt>
            <dd>{value ?? '—'}</dd>
        </div>
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

function formatDateTime(value) {
    if (!value) {
        return '—'
    }

    return new Date(value).toLocaleString('ru-RU')
}