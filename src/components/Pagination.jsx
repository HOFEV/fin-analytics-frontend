export default function Pagination({
                                       page,
                                       size,
                                       totalPages,
                                       totalElements,
                                       first,
                                       last,
                                       onPageSizeChange,
                                       onGoToPage,
                                   }) {
    const visibleTotalPages = totalPages || 1

    return (
        <div className="pagination">
            <div className="pagination__info">
                Страница {page + 1} из {visibleTotalPages}. Всего записей: {totalElements}.
            </div>

            <div className="pagination__controls">
                <label className="pagination__size">
                    Записей на странице
                    <select value={size} onChange={onPageSizeChange}>
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>

                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => onGoToPage(0)}
                    disabled={first}
                >
                    Первая
                </button>

                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => onGoToPage(page - 1)}
                    disabled={first}
                >
                    Назад
                </button>

                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => onGoToPage(page + 1)}
                    disabled={last}
                >
                    Вперёд
                </button>

                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => onGoToPage(totalPages - 1)}
                    disabled={last}
                >
                    Последняя
                </button>
            </div>
        </div>
    )
}