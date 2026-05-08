import { Link } from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <section className="not-found">
            <div className="card">
                <div className="not-found__code">404</div>

                <h1>Страница не найдена</h1>

                <p>
                    Запрошенный раздел отсутствует в клиентской части приложения. Возможно,
                    адрес был введён с ошибкой или страница ещё не реализована.
                </p>

                <div className="not-found__actions">
                    <Link to="/" className="button">
                        Вернуться на главную
                    </Link>

                    <Link to="/bonds" className="button button--secondary">
                        Перейти к облигациям
                    </Link>
                </div>
            </div>
        </section>
    )
}