import { Link, useParams } from 'react-router-dom'

export default function BondDetailsPage() {
    const { id } = useParams()

    return (
        <section>
            <Link to="/bonds" className="back-link">
                ← Назад к облигациям
            </Link>

            <div className="page-header">
                <h1>Карточка облигации</h1>

                <p>
                    Открыта страница облигации с id: <strong>{id}</strong>.
                </p>
            </div>

            <div className="card">
                <p>
                    На следующем этапе здесь будет загружаться карточка облигации через
                    endpoint GET /api/bonds/{id}.
                </p>
            </div>
        </section>
    )
}