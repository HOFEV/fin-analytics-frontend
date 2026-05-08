import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEducationArticleBySlug } from '../api/educationApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { formatDateTime } from '../utils/formatters'

export default function ArticlePage() {
    const { slug } = useParams()

    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadArticle()
    }, [slug])

    async function loadArticle() {
        try {
            setLoading(true)
            setError('')

            const data = await getEducationArticleBySlug(slug)
            setArticle(data)
        } catch (err) {
            setError(err.message || 'Не удалось загрузить статью')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loading text="Загрузка статьи..." />
    }

    if (error) {
        return (
            <section>
                <Link to="/education" className="back-link">
                    ← Назад к обучению
                </Link>

                <ErrorMessage message={error} />
            </section>
        )
    }

    return (
        <section>
            <Link to="/education" className="back-link">
                ← Назад к обучению
            </Link>

            <article className="article-page">
                <div className="article-page__meta">
                    {article.categoryName || 'Без категории'}
                </div>

                <h1>{article.title}</h1>

                <p className="article-page__summary">
                    {article.summary}
                </p>

                <div className="article-page__dates">
                    <span>Создано: {formatDateTime(article.createdAt)}</span>
                    <span>Обновлено: {formatDateTime(article.updatedAt)}</span>
                </div>

                <div className="article-page__content">
                    <p>{article.content}</p>
                </div>
            </article>
        </section>
    )
}