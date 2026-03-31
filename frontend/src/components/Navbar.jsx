import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/dashboard')}>
        <span className="nav-logo">📄</span>
        <span className="nav-title">SmartResume</span>
      </div>
      <div className="nav-links">
        <button className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="nav-link" onClick={() => navigate('/builder')}>+ New Resume</button>
      </div>
      <div className="nav-user">
        <div className="nav-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <span className="nav-name">{user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}
