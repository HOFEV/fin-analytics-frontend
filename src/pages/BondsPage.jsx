import { Link } from 'react-router-dom'

export default function BondsPage() {
    return (
        <section>
            <div className="page-header">
                <h1>Облигации</h1>

                <p>
                    На этой странице будет отображаться список облигаций, полученный из
                    backend через endpoint GET /api/bonds.
                </p>
            </div>

            <div className="card">
                <h2>Проверочная карточка</h2>

                <p>
                    Если эта страница открывается, значит маршрут /bonds работает
                    корректно.
                </p>

                <Link to="/bonds/1" className="button">
                    Открыть тестовую облигацию
                </Link>
            </div>
        </section>
    )
}