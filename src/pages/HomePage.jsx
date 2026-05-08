import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <section className="home-page">
            <div className="hero">
                <div>
                    <h1>Интернет-сервис финансовой аналитики ценных бумаг</h1>

                    <p>
                        Сервис предназначен для просмотра рыночных данных по российским
                        ценным бумагам, анализа облигаций, оценки результата инвестирования
                        и изучения базовых материалов по финансовым инструментам.
                    </p>

                    <div className="hero__actions">
                        <Link to="/education" className="button">
                            Начать с обучения
                        </Link>

                        <Link to="/bonds" className="button button--secondary">
                            Перейти к облигациям
                        </Link>

                        <Link to="/funds" className="button button--secondary">
                            Перейти к фондам
                        </Link>
                    </div>
                </div>
            </div>

            <div className="home-section">
                <div className="section-title">
                    <h2>Основные разделы сервиса</h2>

                    <p>
                        Если вы только начинаете знакомиться с инвестициями, рекомендуется
                        начать с раздела «Обучение»: в нём собраны базовые понятия и
                        краткие объяснения финансовых инструментов.
                    </p>
                </div>

                <div className="home-cards-grid">
                    <Link to="/bonds" className="home-card">
                        <div className="home-card__number">01</div>

                        <h3>Облигации</h3>

                        <p>
                            Просмотр списка облигаций, фильтрация по цене, доходности и
                            риск-рейтингу, переход к карточке бумаги и расчёт результата
                            инвестирования.
                        </p>
                    </Link>

                    <Link to="/funds" className="home-card">
                        <div className="home-card__number">02</div>

                        <h3>Фонды</h3>

                        <p>
                            Просмотр списка фондов, текущей цены, минимальной суммы покупки и
                            рассчитанной доходности за прошлый год.
                        </p>
                    </Link>

                    <Link to="/education" className="home-card">
                        <div className="home-card__number">03</div>

                        <h3>Обучение</h3>

                        <p>
                            Образовательные статьи по базовым финансовым понятиям и
                            инвестиционным инструментам.
                        </p>
                    </Link>
                </div>
            </div>

            <div className="home-section">
                <div className="section-title">
                    <h2>Как пользоваться сервисом</h2>

                    <p>
                        Сервис помогает предварительно оценить финансовые инструменты и
                        сравнить их по ключевым параметрам. Представленные данные не
                        являются индивидуальной инвестиционной рекомендацией.
                    </p>
                </div>

                <div className="feature-list">
                    <div className="feature-item">
                        <strong>Изучите базовые понятия</strong>

                        <span>
              В разделе «Обучение» можно ознакомиться с основными терминами:
              инфляцией, облигациями и другими понятиями, необходимыми для
              понимания финансовых инструментов.
            </span>
                    </div>

                    <div className="feature-item">
                        <strong>Сравните доступные инструменты</strong>

                        <span>
              В разделах «Облигации» и «Фонды» можно просмотреть списки
              инструментов, их текущие цены, доходность и другие параметры.
            </span>
                    </div>

                    <div className="feature-item">
                        <strong>Используйте фильтры</strong>

                        <span>
              Фильтры позволяют быстрее найти инструменты, подходящие по цене,
              доходности или уровню риска.
            </span>
                    </div>

                    <div className="feature-item">
                        <strong>Рассчитайте результат по облигации</strong>

                        <span>
              В карточке облигации можно указать сумму, срок инвестирования,
              комиссию и налог, после чего сервис рассчитает примерный
              финансовый результат.
            </span>
                    </div>
                </div>
            </div>
        </section>
    )
}