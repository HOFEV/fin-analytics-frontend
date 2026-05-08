import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEducationArticles } from '../api/educationApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const initialFilters = {
    search: '',
    category: '',
}

export default function EducationPage() {
    const [articlesPage, setArticlesPage] = useState(null)
    const [filters, setFilters] = useState(initialFilters)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadArticles(initialFilters)
    }, [])

    async function loadArticles(filtersForRequest = filters) {
        try {
            setLoading(true)
            setError('')

            const data = await getEducationArticles({
                ...filtersForRequest,
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

    function handleFilterChange(event) {
        const { name, value } = event.target

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    function handleFilterSubmit(event) {
        event.preventDefault()
        loadArticles(filters)
    }

    function handleResetFilters() {
        setFilters(initialFilters)
        loadArticles(initialFilters)
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

                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => loadArticles(filters)}
                >
                    Перезагрузить список
                </button>
            </div>

            <form className="filters-card" onSubmit={handleFilterSubmit}>
                <div className="filters-card__header">
                    <h2>Поиск и фильтрация</h2>

                    <p>
                        Параметры поиска передаются на backend как query-параметры endpoint
                        GET /api/education/articles.
                    </p>
                </div>

                <div className="filters-grid filters-grid--education">
                    <label>
                        Поиск по статье
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Например, инфляция"
                        />
                    </label>

                    <label>
                        Категория
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">Все категории</option>
                            <option value="basic">Базовые понятия</option>
                            <option value="instruments">Инструменты</option>
                        </select>
                    </label>
                </div>

                <div className="filters-actions">
                    <button type="submit" className="button">
                        Применить
                    </button>

                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={handleResetFilters}
                    >
                        Сбросить
                    </button>
                </div>
            </form>

            <ErrorMessage message={error} />

            {!error && articlesPage?.content?.length === 0 && (
                <div className="state">
                    Обучающие статьи не найдены по заданным условиям.
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