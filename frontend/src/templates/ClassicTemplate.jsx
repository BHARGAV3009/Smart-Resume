export default function ClassicTemplate({ resume }) {
  if (!resume) return null
  const r = resume

  return (
    <div className="classic-template">
      <header className="ct-header">
        <h1 className="ct-name">{r.fullName || 'Your Name'}</h1>
        <div className="ct-contact">
          {r.email && <span>{r.email}</span>}
          {r.phone && <span>•</span>}
          {r.phone && <span>{r.phone}</span>}
          {r.location && <span>•</span>}
          {r.location && <span>{r.location}</span>}
        </div>
        {(r.linkedIn || r.github) && (
          <div className="ct-links">
            {r.linkedIn && <span>{r.linkedIn}</span>}
            {r.linkedIn && r.github && <span> • </span>}
            {r.github && <span>{r.github}</span>}
          </div>
        )}
      </header>

      {r.summary && (
        <section className="ct-section">
          <h2 className="ct-section-title">Professional Summary</h2>
          <div className="ct-divider" />
          <p className="ct-text">{r.summary}</p>
        </section>
      )}

      {r.experiences && r.experiences.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-section-title">Work Experience</h2>
          <div className="ct-divider" />
          {r.experiences.map((exp, i) => (
            <div key={i} className="ct-entry">
              <div className="ct-entry-header">
                <strong>{exp.role}</strong>
                <span className="ct-meta">{exp.duration}</span>
              </div>
              <div className="ct-company">{exp.company}</div>
              {exp.description && <p className="ct-text ct-indent">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {r.educations && r.educations.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-section-title">Education</h2>
          <div className="ct-divider" />
          {r.educations.map((edu, i) => (
            <div key={i} className="ct-entry">
              <div className="ct-entry-header">
                <strong>{edu.degree}</strong>
                <span className="ct-meta">{edu.year}</span>
              </div>
              <div className="ct-company">{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</div>
            </div>
          ))}
        </section>
      )}

      {r.skills && r.skills.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-section-title">Skills</h2>
          <div className="ct-divider" />
          <p className="ct-text">{r.skills.map(s => s.skillName).join('  •  ')}</p>
        </section>
      )}

      {r.projects && r.projects.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-section-title">Projects</h2>
          <div className="ct-divider" />
          {r.projects.map((proj, i) => (
            <div key={i} className="ct-entry">
              <div className="ct-entry-header">
                <strong>{proj.projectName}</strong>
                {proj.link && <span className="ct-meta ct-link">{proj.link}</span>}
              </div>
              {proj.techStack && <div className="ct-company">Tech: {proj.techStack}</div>}
              {proj.description && <p className="ct-text ct-indent">{proj.description}</p>}
            </div>
          ))}
        </section>
      )}

      {r.certifications && r.certifications.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-section-title">Certifications</h2>
          <div className="ct-divider" />
          {r.certifications.map((cert, i) => (
            <div key={i} className="ct-entry">
              <div className="ct-entry-header">
                <strong>{cert.certName}</strong>
                <span className="ct-meta">{cert.year}</span>
              </div>
              <div className="ct-company">{cert.issuer}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
