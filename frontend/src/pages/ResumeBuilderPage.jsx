import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResume, createResume, updateResume } from '../api/resumeApi'
import Navbar from '../components/Navbar'

const EMPTY_PERSONAL = { fullName: '', email: '', phone: '', location: '', summary: '', linkedIn: '', github: '' }
const EMPTY_EDU = { institution: '', degree: '', year: '', gpa: '' }
const EMPTY_SKILL = { skillName: '' }
const EMPTY_PROJ = { projectName: '', description: '', techStack: '', link: '' }
const EMPTY_EXP = { company: '', role: '', duration: '', description: '' }
const EMPTY_CERT = { certName: '', issuer: '', year: '' }

const SECTIONS = [
  { key: 'personal', label: '👤 Personal Info', icon: '👤' },
  { key: 'education', label: '🎓 Education', icon: '🎓' },
  { key: 'skills', label: '💡 Skills', icon: '💡' },
  { key: 'experience', label: '💼 Experience', icon: '💼' },
  { key: 'projects', label: '🚀 Projects', icon: '🚀' },
  { key: 'certifications', label: '🏆 Certifications', icon: '🏆' },
]

function ArraySection({ title, items, setItems, renderForm, empty, addLabel }) {
  const [adding, setAdding] = useState(false)
  const [editIdx, setEditIdx] = useState(null)
  const [form, setForm] = useState({ ...empty })

  const handleSave = () => {
    if (editIdx !== null) {
      const updated = [...items]; updated[editIdx] = form; setItems(updated); setEditIdx(null)
    } else {
      setItems([...items, { ...form, id: Date.now() }])
    }
    setAdding(false); setForm({ ...empty })
  }

  const handleEdit = (idx) => { setEditIdx(idx); setForm({ ...items[idx] }); setAdding(true) }
  const handleDelete = (idx) => setItems(items.filter((_, i) => i !== idx))
  const handleCancel = () => { setAdding(false); setEditIdx(null); setForm({ ...empty }) }

  return (
    <div className="section-block">
      {items.map((item, idx) => (
        <div key={item.id || idx} className="entry-card">
          <div className="entry-content">{renderForm(item, null)}</div>
          <div className="entry-actions">
            <button className="btn btn-ghost btn-xs" onClick={() => handleEdit(idx)}>Edit</button>
            <button className="btn btn-ghost btn-xs btn-danger" onClick={() => handleDelete(idx)}>Remove</button>
          </div>
        </div>
      ))}
      {adding && (
        <div className="add-form">
          {renderForm(form, (field, val) => setForm(f => ({ ...f, [field]: val })))}
          <div className="add-form-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
      {!adding && (
        <button className="btn btn-outline btn-sm" onClick={() => { setAdding(true); setEditIdx(null); setForm({ ...empty }) }}>
          + {addLabel}
        </button>
      )}
    </div>
  )
}

export default function ResumeBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('personal')
  const [template, setTemplate] = useState('classic')
  const [title, setTitle] = useState('My Resume')
  const [personal, setPersonal] = useState({ ...EMPTY_PERSONAL })
  const [educations, setEducations] = useState([])
  const [skills, setSkills] = useState([])
  const [experiences, setExperiences] = useState([])
  const [projects, setProjects] = useState([])
  const [certifications, setCertifications] = useState([])
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(id || null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (id) {
      getResume(id).then(r => {
        const d = r.data
        setTitle(d.title || 'My Resume')
        setTemplate(d.template || 'classic')
        setPersonal({ fullName: d.fullName || '', email: d.email || '', phone: d.phone || '', location: d.location || '', summary: d.summary || '', linkedIn: d.linkedIn || '', github: d.github || '' })
        setEducations(d.educations || [])
        setSkills(d.skills || [])
        setExperiences(d.experiences || [])
        setProjects(d.projects || [])
        setCertifications(d.certifications || [])
        setSavedId(id)
      })
    }
  }, [id])

  const handleSave = async () => {
    setSaving(true); setMsg('')
    const payload = { title, template, ...personal, educations, skills, experiences, projects, certifications }
    try {
      let res
      if (savedId) { res = await updateResume(savedId, payload) }
      else { res = await createResume(payload); setSavedId(res.data.id) }
      setMsg('✅ Resume saved successfully!')
      setTimeout(() => setMsg(''), 3000)
    } catch (e) { setMsg('❌ Save failed. Please try again.') }
    finally { setSaving(false) }
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="section-block">
            <div className="form-row">
              <div className="form-group"><label>Full Name</label><input value={personal.fullName} onChange={e => setPersonal(p => ({ ...p, fullName: e.target.value }))} placeholder="John Doe" /></div>
              <div className="form-group"><label>Email</label><input value={personal.email} onChange={e => setPersonal(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Phone</label><input value={personal.phone} onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 890" /></div>
              <div className="form-group"><label>Location</label><input value={personal.location} onChange={e => setPersonal(p => ({ ...p, location: e.target.value }))} placeholder="New York, USA" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>LinkedIn</label><input value={personal.linkedIn} onChange={e => setPersonal(p => ({ ...p, linkedIn: e.target.value }))} placeholder="linkedin.com/in/johndoe" /></div>
              <div className="form-group"><label>GitHub</label><input value={personal.github} onChange={e => setPersonal(p => ({ ...p, github: e.target.value }))} placeholder="github.com/johndoe" /></div>
            </div>
            <div className="form-group"><label>Professional Summary</label><textarea rows={4} value={personal.summary} onChange={e => setPersonal(p => ({ ...p, summary: e.target.value }))} placeholder="Write a brief professional summary..." /></div>
          </div>
        )
      case 'education':
        return <ArraySection title="Education" items={educations} setItems={setEducations} empty={EMPTY_EDU} addLabel="Add Education"
          renderForm={(item, set) => (
            <div>
              <div className="form-row">
                <div className="form-group"><label>Institution</label><input value={item.institution} onChange={set ? e => set('institution', e.target.value) : undefined} readOnly={!set} placeholder="University Name" /></div>
                <div className="form-group"><label>Degree</label><input value={item.degree} onChange={set ? e => set('degree', e.target.value) : undefined} readOnly={!set} placeholder="B.Tech Computer Science" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Year</label><input value={item.year} onChange={set ? e => set('year', e.target.value) : undefined} readOnly={!set} placeholder="2020 - 2024" /></div>
                <div className="form-group"><label>GPA</label><input value={item.gpa} onChange={set ? e => set('gpa', e.target.value) : undefined} readOnly={!set} placeholder="3.8/4.0" /></div>
              </div>
            </div>
          )} />
      case 'skills':
        return (
          <div className="section-block">
            <div className="skills-chips">{skills.map((s, i) => (<span key={i} className="skill-chip">{s.skillName}<button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}>×</button></span>))}</div>
            <div className="skill-add-row">
              <input id="skill-input" placeholder="Type a skill and press Enter" onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) { setSkills([...skills, { skillName: e.target.value.trim() }]); e.target.value = '' } }} />
              <button className="btn btn-outline btn-sm" onClick={() => { const inp = document.getElementById('skill-input'); if (inp.value.trim()) { setSkills([...skills, { skillName: inp.value.trim() }]); inp.value = '' } }}>Add</button>
            </div>
          </div>
        )
      case 'experience':
        return <ArraySection title="Experience" items={experiences} setItems={setExperiences} empty={EMPTY_EXP} addLabel="Add Experience"
          renderForm={(item, set) => (
            <div>
              <div className="form-row">
                <div className="form-group"><label>Company</label><input value={item.company} onChange={set ? e => set('company', e.target.value) : undefined} readOnly={!set} placeholder="Google Inc." /></div>
                <div className="form-group"><label>Role</label><input value={item.role} onChange={set ? e => set('role', e.target.value) : undefined} readOnly={!set} placeholder="Software Engineer" /></div>
              </div>
              <div className="form-group"><label>Duration</label><input value={item.duration} onChange={set ? e => set('duration', e.target.value) : undefined} readOnly={!set} placeholder="Jan 2022 - Present" /></div>
              <div className="form-group"><label>Description</label><textarea rows={3} value={item.description} onChange={set ? e => set('description', e.target.value) : undefined} readOnly={!set} placeholder="Describe your responsibilities and achievements..." /></div>
            </div>
          )} />
      case 'projects':
        return <ArraySection title="Projects" items={projects} setItems={setProjects} empty={EMPTY_PROJ} addLabel="Add Project"
          renderForm={(item, set) => (
            <div>
              <div className="form-row">
                <div className="form-group"><label>Project Name</label><input value={item.projectName} onChange={set ? e => set('projectName', e.target.value) : undefined} readOnly={!set} placeholder="My Awesome Project" /></div>
                <div className="form-group"><label>Tech Stack</label><input value={item.techStack} onChange={set ? e => set('techStack', e.target.value) : undefined} readOnly={!set} placeholder="React, Node.js, MongoDB" /></div>
              </div>
              <div className="form-group"><label>Project Link</label><input value={item.link} onChange={set ? e => set('link', e.target.value) : undefined} readOnly={!set} placeholder="https://github.com/..." /></div>
              <div className="form-group"><label>Description</label><textarea rows={3} value={item.description} onChange={set ? e => set('description', e.target.value) : undefined} readOnly={!set} placeholder="Describe what the project does..." /></div>
            </div>
          )} />
      case 'certifications':
        return <ArraySection title="Certifications" items={certifications} setItems={setCertifications} empty={EMPTY_CERT} addLabel="Add Certification"
          renderForm={(item, set) => (
            <div>
              <div className="form-row">
                <div className="form-group"><label>Certification Name</label><input value={item.certName} onChange={set ? e => set('certName', e.target.value) : undefined} readOnly={!set} placeholder="AWS Certified Developer" /></div>
                <div className="form-group"><label>Issuer</label><input value={item.issuer} onChange={set ? e => set('issuer', e.target.value) : undefined} readOnly={!set} placeholder="Amazon Web Services" /></div>
              </div>
              <div className="form-group"><label>Year</label><input value={item.year} onChange={set ? e => set('year', e.target.value) : undefined} readOnly={!set} placeholder="2024" /></div>
            </div>
          )} />
      default: return null
    }
  }

  return (
    <div className="page-layout">
      <Navbar />
      <main className="builder-page">
        <div className="builder-header">
          <div className="builder-title-row">
            <input className="title-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resume Title" />
            <div className="template-select">
              <label>Template:</label>
              <select value={template} onChange={e => setTemplate(e.target.value)}>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
              </select>
            </div>
          </div>
          <div className="builder-actions">
            {msg && <span className="save-msg">{msg}</span>}
            <button className="btn btn-secondary" onClick={() => savedId && navigate(`/preview/${savedId}`)}>👁 Preview</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save Resume'}</button>
          </div>
        </div>

        <div className="builder-layout">
          <aside className="builder-sidebar">
            {SECTIONS.map(s => (
              <button key={s.key} className={`sidebar-btn ${activeSection === s.key ? 'active' : ''}`}
                onClick={() => setActiveSection(s.key)}>
                <span>{s.icon}</span> {s.label.replace(/^\S+ /, '')}
              </button>
            ))}
          </aside>
          <div className="builder-content">
            <div className="section-title">
              <h2>{SECTIONS.find(s => s.key === activeSection)?.label}</h2>
            </div>
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  )
}
