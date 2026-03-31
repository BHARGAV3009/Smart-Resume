import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const res = await register(form)
      authLogin({ name: res.data.name, email: res.data.email, userId: res.data.userId }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">📄</div>
          <h1>Smart Resume Builder</h1>
          <p>Join thousands of professionals who've landed their dream jobs</p>
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
          <h2>Create Account</h2>
          <p className="auth-sub">Start building your perfect resume</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe"
                value={form.name} onChange={handleChange} required autoComplete="name" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required autoComplete="username" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Min. 8 characters"
                value={form.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
