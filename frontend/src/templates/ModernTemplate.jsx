export default function ModernTemplate({ resume }) {
  if (!resume) return null
  const r = resume

  return (
    <div className="modern-template">
      <aside className="mt-sidebar">
        <div className="mt-profile">
          <div className="mt-avatar">{(r.fullName || 'U')[0]}</div>
          <h1 className="mt-name">{r.fullName || 'Your Name'}</h1>
        </div>

        <div className="mt-sidebar-section">
          <h3>Contact</h3>
          {r.email && <div className="mt-contact-item"><span>✉</span>{r.email}</div>}
          {r.phone && <div className="mt-contact-item"><span>📞</span>{r.phone}</div>}
          {r.location && <div className="mt-contact-item"><span>📍</span>{r.location}</div>}
          {r.linkedIn && <div className="mt-contact-item"><span>🔗</span>{r.linkedIn}</div>}
          {r.github && <div className="mt-contact-item"><span>💻</span>{r.github}</div>}
        </div>

        {r.skills && r.skills.length > 0 && (
          <div className="mt-sidebar-section">
            <h3>Skills</h3>
            <div className="mt-skills">
              {r.skills.map((s, i) => <span key={i} className="mt-skill-badge">{s.skillName}</span>)}
            </div>
          </div>
        )}

        {r.certifications && r.certifications.length > 0 && (
          <div className="mt-sidebar-section">
            <h3>Certifications</h3>
            {r.certifications.map((c, i) => (
              <div key={i} className="mt-cert">
                <strong>{c.certName}</strong>
                <span>{c.issuer} • {c.year}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="mt-main">
        {r.summary && (
          <section className="mt-section">
            <h2><span className="mt-section-line" />Professional Summary</h2>
            <p>{r.summary}</p>
          </section>
        )}

        {r.experiences && r.experiences.length > 0 && (
          <section className="mt-section">
            <h2><span className="mt-section-line" />Work Experience</h2>
            {r.experiences.map((exp, i) => (
              <div key={i} className="mt-entry">
                <div className="mt-entry-header">
                  <div>
                    <strong className="mt-role">{exp.role}</strong>
                    <span className="mt-company"> @ {exp.company}</span>
                  </div>
                  <span className="mt-date">{exp.duration}</span>
                </div>
                {exp.description && <p className="mt-desc">{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {r.educations && r.educations.length > 0 && (
          <section className="mt-section">
            <h2><span className="mt-section-line" />Education</h2>
            {r.educations.map((edu, i) => (
              <div key={i} className="mt-entry">
                <div className="mt-entry-header">
                  <div>
                    <strong className="mt-role">{edu.degree}</strong>
                    <span className="mt-company"> — {edu.institution}</span>
                  </div>
                  <span className="mt-date">{edu.year}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {r.projects && r.projects.length > 0 && (
          <section className="mt-section">
            <h2><span className="mt-section-line" />Projects</h2>
            {r.projects.map((proj, i) => (
              <div key={i} className="mt-entry">
                <div className="mt-entry-header">
                  <strong className="mt-role">{proj.projectName}</strong>
                  {proj.link && <a href={proj.link} className="mt-link" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                </div>
                {proj.techStack && <div className="mt-tech">Tech: {proj.techStack}</div>}
                {proj.description && <p className="mt-desc">{proj.description}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
