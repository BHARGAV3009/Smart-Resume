import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      authLogin({ name: res.data.name, email: res.data.email, userId: res.data.userId }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">📄</div>
          <h1>Smart Resume Builder</h1>
          <p>Create ATS-optimized resumes and land your dream job</p>
          <ul className="auth-features">
            <li>✨ Professional Templates</li>
            <li>📊 ATS Score Analyzer</li>
            <li>📥 PDF Export</li>
            <li>🔒 Secure & Private</li>
          </ul>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-sub">Sign in to your account</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required autoComplete="username" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
