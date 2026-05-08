import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEducationArticles } from '../api/educationApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function EducationPage() {
    const [articlesPage, setArticlesPage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadArticles()
    }, [])

    async function loadArticles() {
        try {
            setLoading(true)
            setError('')

            const data = await getEducationArticles({
                page: 0,
                size: 20,
            })

            setArticlesPage(data)
        } catch (err) {
            setError(err.message || 'Не удалось загрузить обучающие статьи')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loading text="Загрузка обучающих материалов..." />
    }

    return (
        <section>
            <div className="page-header page-header--row">
                <div>
                    <h1>Обучение</h1>

                    <p>
                        В разделе собраны краткие образовательные материалы, которые
                        объясняют базовые понятия финансового рынка и инструменты,
                        используемые в сервисе.
                    </p>
                </div>

                <button type="button" className="button button--secondary" onClick={loadArticles}>
                    Перезагрузить список
                </button>
            </div>

            <ErrorMessage message={error} />

            {!error && articlesPage?.content?.length === 0 && (
                <div className="state">
                    Обучающие статьи не найдены.
                </div>
            )}

            {!error && articlesPage?.content?.length > 0 && (
                <>
                    <div className="articles-grid">
                        {articlesPage.content.map((article) => (
                            <article className="article-card" key={article.id}>
                                <div className="article-card__category">
                                    {article.categoryName || 'Без категории'}
                                </div>

                                <h2>{article.title}</h2>

                                <p>{article.summary}</p>

                                <Link to={`/education/${article.slug}`} className="article-card__link">
                                    Открыть статью
                                </Link>
                            </article>
                        ))}
                    </div>

                    <div className="pagination-info">
                        Страница {articlesPage.page + 1} из {articlesPage.totalPages || 1}. Всего
                        записей: {articlesPage.totalElements}.
                    </div>
                </>
            )}
        </section>
    )
}