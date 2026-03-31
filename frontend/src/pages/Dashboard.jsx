import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getResumes, deleteResume } from '../api/resumeApi'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const cards = [
  { icon: '✏️', title: 'Create Resume', desc: 'Build a new professional resume', action: 'new', color: 'card-indigo' },
  { icon: '📋', title: 'My Resumes', desc: 'View and manage your saved resumes', action: 'list', color: 'card-purple' },
  { icon: '📊', title: 'ATS Analyzer', desc: 'Score and optimize your resume', action: 'score', color: 'card-teal' },
]

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchResumes() }, [])

  const fetchResumes = async () => {
    try { const r = await getResumes(); setResumes(r.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this resume?')) return
    await deleteResume(id)
    fetchResumes()
  }

  const handleCard = (action) => {
    if (action === 'new') navigate('/builder')
    else if (action === 'list') {
      const section = document.getElementById('resumes-section')
      if (section) section.scrollIntoView({ behavior: 'smooth' })
    }
    else if (action === 'score') {
      if (resumes.length > 0) navigate(`/score/${resumes[0].id}`)
      else alert('Create a resume first!')
    }
  }

  return (
    <div className="page-layout">
      <Navbar />
      <main className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, <span className="accent">{user?.name || 'User'}</span> 👋</h1>
          <p>Manage your resumes and track your ATS performance</p>
        </div>

        <div className="dash-cards">
          {cards.map(c => (
            <div key={c.action} className={`dash-card ${c.color}`} onClick={() => handleCard(c.action)}>
              <div className="dash-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="dash-card-arrow">→</span>
            </div>
          ))}
        </div>

        <div id="resumes-section" className="resume-list-section">
          <div className="section-header">
            <h2>Your Resumes</h2>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/builder')}>+ New Resume</button>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No resumes yet</h3>
              <p>Create your first professional resume to get started</p>
              <button className="btn btn-primary" onClick={() => navigate('/builder')}>Create Resume</button>
            </div>
          ) : (
            <div className="resume-grid">
              {resumes.map(r => (
                <div key={r.id} className="resume-card" onClick={() => navigate(`/preview/${r.id}`)}>
                  <div className="resume-card-header">
                    <div className="resume-icon">📄</div>
                    <span className={`template-badge badge-${r.template}`}>{r.template}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.fullName || 'No name'}</p>
                  <div className="resume-card-actions">
                    <button className="btn btn-ghost btn-xs" onClick={e => { e.stopPropagation(); navigate(`/builder/${r.id}`) }}>Edit</button>
                    <button className="btn btn-ghost btn-xs" onClick={e => { e.stopPropagation(); navigate(`/preview/${r.id}`) }}>Preview</button>
                    <button className="btn btn-ghost btn-xs btn-danger" onClick={e => handleDelete(r.id, e)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
