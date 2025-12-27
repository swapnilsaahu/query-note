import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashBoardPage from './pages/DashboardPage'
import ProtectedRoute from './utils/ProtectedRoute'
import AppAuth from './utils/AppAuth'
import NoteDisplay from './components/NoteDisplay'
import SearchBot from './components/SearchBot'

function App() {
    return (
        <>
            <AppAuth>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='register' element={<RegisterPage />} />
                        <Route path='login' element={<LoginPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path='dashboard' element={<DashBoardPage />} />
                            <Route path='notes/:tag' element={<NoteDisplay />} />
                            <Route path='/search-bot' element={<SearchBot />} />
                        </Route>
                    </Routes>
                </BrowserRouter >
            </AppAuth >
        </>
    )
}

export default App
