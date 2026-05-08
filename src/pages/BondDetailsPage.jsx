import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { calculateBond, getBondById } from '../api/bondsApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
    formatDate,
    formatDateTime,
    formatMoney,
    formatPercent,
} from '../utils/formatters'

const initialCalculationForm = {
    investmentAmount: 100000,
    termMonths: 12,
    brokerCommissionPercent: 0.3,
    taxPercent: 13,
}

export default function BondDetailsPage() {
    const { id } = useParams()

    const [bond, setBond] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [calculationForm, setCalculationForm] = useState(initialCalculationForm)
    const [calculationResult, setCalculationResult] = useState(null)
    const [calculationLoading, setCalculationLoading] = useState(false)
    const [calculationError, setCalculationError] = useState('')

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

    function handleCalculationFormChange(event) {
        const { name, value } = event.target

        setCalculationForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleCalculationSubmit(event) {
        event.preventDefault()

        try {
            setCalculationLoading(true)
            setCalculationError('')
            setCalculationResult(null)

            const payload = {
                investmentAmount: Number(calculationForm.investmentAmount),
                termMonths: Number(calculationForm.termMonths),
                brokerCommissionPercent: Number(calculationForm.brokerCommissionPercent),
                taxPercent: Number(calculationForm.taxPercent),
            }

            const data = await calculateBond(id, payload)
            setCalculationResult(data)
        } catch (err) {
            setCalculationError(err.message || 'Не удалось выполнить расчёт')
        } finally {
            setCalculationLoading(false)
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
                        Карточка облигации содержит основные параметры ценной бумаги и форму
                        расчёта результата инвестирования.
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

            <div className="calculation-section">
                <div className="details-card">
                    <h2>Расчёт инвестирования</h2>

                    <form className="form" onSubmit={handleCalculationSubmit}>
                        <label>
                            Сумма инвестирования, ₽
                            <input
                                type="number"
                                name="investmentAmount"
                                value={calculationForm.investmentAmount}
                                onChange={handleCalculationFormChange}
                                min="0"
                                step="1000"
                            />
                        </label>

                        <label>
                            Срок инвестирования, месяцев
                            <input
                                type="number"
                                name="termMonths"
                                value={calculationForm.termMonths}
                                onChange={handleCalculationFormChange}
                                min="1"
                                step="1"
                            />
                        </label>

                        <label>
                            Комиссия брокера, %
                            <input
                                type="number"
                                name="brokerCommissionPercent"
                                value={calculationForm.brokerCommissionPercent}
                                onChange={handleCalculationFormChange}
                                min="0"
                                step="0.01"
                            />
                        </label>

                        <label>
                            Налог, %
                            <input
                                type="number"
                                name="taxPercent"
                                value={calculationForm.taxPercent}
                                onChange={handleCalculationFormChange}
                                min="0"
                                step="0.01"
                            />
                        </label>

                        <button type="submit" className="button" disabled={calculationLoading}>
                            {calculationLoading ? 'Расчёт...' : 'Рассчитать'}
                        </button>
                    </form>

                    <ErrorMessage message={calculationError} />
                </div>

                <div className="details-card">
                    <h2>Пояснение</h2>

                    <p className="muted-text">
                        Для расчёта укажите сумму инвестирования, срок, комиссию брокера и
                        ставку налога. Сервис рассчитает примерное количество приобретаемых
                        бумаг, использованную сумму, остаток денежных средств и ожидаемый
                        финансовый результат.
                    </p>

                    <p className="muted-text">
                        Итоговые значения носят справочный характер и помогают предварительно
                        оценить параметры вложения. Расчёт не является индивидуальной
                        инвестиционной рекомендацией.
                    </p>

                    <p className="muted-text">
                        Введённые параметры используются только для текущего расчёта и не
                        сохраняются в системе.
                    </p>
                </div>
            </div>

            {calculationResult && (
                <div className="result-card">
                    <h2>Результат расчёта</h2>

                    <div className="result-grid">
                        <ResultItem label="Цена облигации" value={formatMoney(calculationResult.currentPrice)} />
                        <ResultItem label="Размер лота" value={calculationResult.lotSize} />
                        <ResultItem label="Цена лота" value={formatMoney(calculationResult.lotPrice)} />
                        <ResultItem label="Количество лотов" value={calculationResult.quantityLots} />
                        <ResultItem label="Количество бумаг" value={calculationResult.quantityBonds} />
                        <ResultItem label="Использованная сумма" value={formatMoney(calculationResult.usedAmount)} />
                        <ResultItem label="Остаток" value={formatMoney(calculationResult.unusedAmount)} />
                        <ResultItem label="Валовый доход" value={formatMoney(calculationResult.grossIncome)} />
                        <ResultItem label="Комиссия" value={formatMoney(calculationResult.commissionAmount)} />
                        <ResultItem label="Налог" value={formatMoney(calculationResult.taxAmount)} />
                        <ResultItem label="Чистый доход" value={formatMoney(calculationResult.netIncome)} />
                        <ResultItem label="Итоговая сумма" value={formatMoney(calculationResult.finalAmount)} />
                        <ResultItem
                            label="Годовая доходность"
                            value={formatPercent(calculationResult.annualizedReturnPercent)}
                        />
                    </div>

                    <div className="explanation">
                        <h3>Текстовое пояснение</h3>
                        <p>{calculationResult.explanation}</p>
                    </div>
                </div>
            )}
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

function ResultItem({ label, value }) {
    return (
        <div className="result-item">
            <span>{label}</span>
            <strong>{value ?? '—'}</strong>
        </div>
    )
}