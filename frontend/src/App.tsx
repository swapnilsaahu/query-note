import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashBoardPage from './pages/DashboardPage'

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='register' element={<RegisterPage />} />
                <Route path='login' element={<LoginPage />} />
                <Route path='dashboard' element={<DashBoardPage />} />
            </Routes>
        </>
    )
}

export default App
