import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResume, downloadPdf } from '../api/resumeApi'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import ClassicTemplate from '../templates/ClassicTemplate'
import ModernTemplate from '../templates/ModernTemplate'

export default function ResumePreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [template, setTemplate] = useState('classic')
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  useEffect(() => {
    if (id) {
      getResume(id).then(r => {
        setResume(r.data)
        setTemplate(r.data.template || 'classic')
      }).finally(() => setLoading(false))
    }
  }, [id])

  const handleDownloadPdf = async () => {
    try {
      const res = await downloadPdf(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `${resume?.title || 'resume'}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch (e) { alert('PDF generation failed. Please try again.') }
  }

  const handlePrint = () => window.print()

  if (loading) return <div className="page-layout"><Navbar /><div className="loading-spinner"><div className="spinner" /></div></div>

  return (
    <div className="page-layout">
      <Navbar />
      <main className="preview-page">
        <div className="preview-controls">
          <div className="controls-left">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
            <button className="btn btn-ghost" onClick={() => navigate(`/score/${id}`)}>📊 Analyze ATS Score</button>
          </div>
          <div className="template-switcher">
            <button className={`tmpl-btn ${template === 'classic' ? 'active' : ''}`} onClick={() => setTemplate('classic')}>Classic</button>
            <button className={`tmpl-btn ${template === 'modern' ? 'active' : ''}`} onClick={() => setTemplate('modern')}>Modern</button>
          </div>
          <div className="controls-right">
            <button className="btn btn-primary" onClick={handleDownloadPdf}>📥 Download PDF</button>
            <button className="btn btn-secondary" onClick={handlePrint}>🖨️ Print</button>
            <button className="btn btn-ghost" onClick={() => navigate(`/builder/${id}`)}>✏️ Edit</button>
          </div>
        </div>

        <div className="preview-container print-area" ref={printRef}>
          {template === 'classic'
            ? <ClassicTemplate resume={resume} />
            : <ModernTemplate resume={resume} />}
        </div>
      </main>
    </div>
  )
}
