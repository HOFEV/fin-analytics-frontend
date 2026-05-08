import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import BondsPage from './pages/BondsPage'
import BondDetailsPage from './pages/BondDetailsPage'
import FundsPage from './pages/FundsPage'
import EducationPage from './pages/EducationPage'
import ArticlePage from './pages/ArticlePage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="bonds" element={<BondsPage />} />
                    <Route path="bonds/:id" element={<BondDetailsPage />} />
                    <Route path="funds" element={<FundsPage />} />
                    <Route path="education" element={<EducationPage />} />
                    <Route path="education/:slug" element={<ArticlePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}