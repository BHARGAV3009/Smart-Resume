import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { analyzeResume, getScore } from '../api/scoreApi'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import Navbar from '../components/Navbar'

export default function ScorePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    getScore(id).then(r => setScore(r.data)).catch(() => {})
  }, [id])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const r = await analyzeResume(id)
      setScore(r.data)
    } catch (e) { alert('Analysis failed: ' + (e.response?.data?.message || e.message)) }
    finally { setAnalyzing(false) }
  }

  const getColor = (val) => {
    if (val >= 75) return '#10B981'
    if (val >= 50) return '#F59E0B'
    return '#EF4444'
  }

  const getLabel = (val) => {
    if (val >= 75) return 'Excellent'
    if (val >= 50) return 'Good'
    if (val >= 25) return 'Fair'
    return 'Needs Work'
  }

  const chartData = score ? [
    { name: 'ATS Score', value: Math.round(score.atsScore), fill: getColor(score.atsScore) },
    { name: 'Keyword Score', value: Math.round(score.keywordScore), fill: '#6366F1' },
    { name: 'Formatting Score', value: Math.round(score.formattingScore), fill: '#8B5CF6' },
  ] : []

  return (
    <div className="page-layout">
      <Navbar />
      <main className="score-page">
        <div className="score-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
          <h1>ATS Score Analyzer</h1>
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? '🔍 Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </div>

        {!score && !analyzing && (
          <div className="score-empty">
            <div className="score-empty-icon">🎯</div>
            <h2>Ready to Analyze</h2>
            <p>Click "Analyze Resume" to get your ATS compatibility score and improvement suggestions</p>
          </div>
        )}

        {score && (
          <div className="score-results">
            <div className="score-main-card">
              <div className="score-ring-container">
                <div className="score-ring" style={{ '--score-color': getColor(score.atsScore) }}>
                  <span className="score-number">{Math.round(score.atsScore)}</span>
                  <span className="score-max">/100</span>
                </div>
                <div className="score-label" style={{ color: getColor(score.atsScore) }}>
                  {getLabel(score.atsScore)}
                </div>
                <p className="score-desc">Overall ATS Score</p>
              </div>

              <div className="score-breakdown">
                <div className="score-item">
                  <div className="score-item-label">🔍 Keyword Match</div>
                  <div className="score-bar-container">
                    <div className="score-bar" style={{ width: `${score.keywordScore}%`, background: '#6366F1' }} />
                  </div>
                  <span>{Math.round(score.keywordScore)}%</span>
                </div>
                <div className="score-item">
                  <div className="score-item-label">📋 Formatting</div>
                  <div className="score-bar-container">
                    <div className="score-bar" style={{ width: `${score.formattingScore}%`, background: '#8B5CF6' }} />
                  </div>
                  <span>{Math.round(score.formattingScore)}%</span>
                </div>
              </div>
            </div>

            <div className="score-chart-card">
              <h3>Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={chartData} startAngle={180} endAngle={0}>
                  <RadialBar minAngle={15} dataKey="value" cornerRadius={10} maxBarSize={20} />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip formatter={(val) => `${val}%`} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {score.suggestions && score.suggestions.length > 0 && (
              <div className="suggestions-card">
                <h3>💡 Improvement Suggestions</h3>
                <ul className="suggestions-list">
                  {score.suggestions.map((s, i) => (
                    <li key={i} className="suggestion-item">
                      <span className="suggestion-icon">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="score-actions">
              <button className="btn btn-primary" onClick={() => navigate(`/builder/${id}`)}>✏️ Improve Resume</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/preview/${id}`)}>👁 View Resume</button>
              <button className="btn btn-ghost" onClick={handleAnalyze} disabled={analyzing}>🔄 Re-analyze</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
