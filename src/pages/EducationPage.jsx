import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEducationArticles } from '../api/educationApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Pagination from '../components/Pagination'

const initialFilters = {
    search: '',
    category: '',
}

const categoryOptions = [
    {
        label: 'Базовые понятия',
        value: 'basic',
    },
    {
        label: 'Инструменты',
        value: 'instruments',
    },
]

export default function EducationPage() {
    const [articlesPage, setArticlesPage] = useState(null)
    const [filters, setFilters] = useState(initialFilters)

    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadArticles(initialFilters, 0, pageSize)
    }, [])

    async function loadArticles(
        filtersForRequest = filters,
        pageForRequest = currentPage,
        sizeForRequest = pageSize,
    ) {
        try {
            setLoading(true)
            setError('')

            const data = await getEducationArticles({
                ...filtersForRequest,
                page: pageForRequest,
                size: sizeForRequest,
            })

            setArticlesPage(data)
            setCurrentPage(data.page)
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

        setCurrentPage(0)
        loadArticles(filters, 0, pageSize)
    }

    function handleResetFilters() {
        setFilters(initialFilters)
        setCurrentPage(0)
        loadArticles(initialFilters, 0, pageSize)
    }

    function handlePageSizeChange(event) {
        const newPageSize = Number(event.target.value)

        setPageSize(newPageSize)
        setCurrentPage(0)
        loadArticles(filters, 0, newPageSize)
    }

    function handleGoToPage(page) {
        if (!articlesPage) {
            return
        }

        const lastPageIndex = Math.max(articlesPage.totalPages - 1, 0)
        const safePage = Math.min(Math.max(page, 0), lastPageIndex)

        setCurrentPage(safePage)
        loadArticles(filters, safePage, pageSize)
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
                    onClick={() => loadArticles(filters, currentPage, pageSize)}
                >
                    Перезагрузить список
                </button>
            </div>

            <form className="filters-card" onSubmit={handleFilterSubmit}>
                <div className="filters-card__header">
                    <h2>Поиск и фильтрация</h2>

                    <p>
                        В интерфейсе отображается название категории, а в backend
                        передаётся её slug. Это позволяет не привязывать API к русскому
                        отображаемому названию.
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

                            {categoryOptions.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
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

                    <Pagination
                        page={articlesPage.page}
                        size={pageSize}
                        totalPages={articlesPage.totalPages}
                        totalElements={articlesPage.totalElements}
                        first={articlesPage.first}
                        last={articlesPage.last}
                        onPageSizeChange={handlePageSizeChange}
                        onGoToPage={handleGoToPage}
                    />
                </>
            )}
        </section>
    )
}