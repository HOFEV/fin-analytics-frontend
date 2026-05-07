import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <section className="hero">
            <h1>Интернет-сервис финансовой аналитики ценных бумаг</h1>

            <p>
                Сервис предназначен для просмотра рыночных данных по российским ценным
                бумагам, анализа облигаций, оценки доходности и изучения базовых
                материалов по инвестиционным инструментам.
            </p>

            <div className="hero__actions">
                <Link to="/bonds" className="button">
                    Перейти к облигациям
                </Link>
            </div>
        </section>
    )
}