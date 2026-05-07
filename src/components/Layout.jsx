import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="app">
            <header className="header">
                <div className="container header__inner">
                    <div className="logo">FinAnalytics</div>

                    <nav className="nav">
                        <NavLink to="/" className="nav__link">
                            Главная
                        </NavLink>

                        <NavLink to="/bonds" className="nav__link">
                            Облигации
                        </NavLink>

                        <NavLink to="/funds" className="nav__link">
                            Фонды
                        </NavLink>

                        <NavLink to="/education" className="nav__link">
                            Обучение
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}