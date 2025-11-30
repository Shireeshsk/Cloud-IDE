import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Features from './pages/Features'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Dashboard from './pages/Dashboard'
import FolderEditor from './pages/FolderEditor'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import Loader from './components/Loader'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  const { loadUser, loading } = useAuthStore()

  useEffect(() => {
    loadUser()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route path='/' element={<PublicRoute><Home /></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/Features' element={<PublicRoute><Features /></PublicRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/folder/:folderId" element={<ProtectedRoute><FolderEditor /></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  )
}