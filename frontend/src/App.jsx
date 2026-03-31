import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import ResumePreviewPage from './pages/ResumePreviewPage'
import ScorePage from './pages/ScorePage'

function ProtectedRoute() {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/" replace />
}

function PublicRoute() {
  const { token } = useAuth()
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/builder" element={<ResumeBuilderPage />} />
            <Route path="/builder/:id" element={<ResumeBuilderPage />} />
            <Route path="/preview/:id" element={<ResumePreviewPage />} />
            <Route path="/score/:id" element={<ScorePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
