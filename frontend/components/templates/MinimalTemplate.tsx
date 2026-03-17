import type { ResumeData, ColorTheme, FontFamily } from '@/lib/types';

const FONT = "'Inter', system-ui, sans-serif";

export function MinimalTemplate({ data, fontFamily }: { data: ResumeData; colorTheme: ColorTheme; fontFamily: FontFamily }) {
    const b = data.basic_info;

    return (
        <div style={{ fontFamily: FONT, padding: '48px', color: '#111827', background: '#ffffff', lineHeight: 1.6 }}>
            {/* Header */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: '#000000' }}>{b.full_name || 'Your Name'}</h1>
                {b.job_title && <div style={{ fontSize: '18px', color: '#4b5563', marginBottom: '12px' }}>{b.job_title}</div>}

                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                    {b.email && <span>{b.email}</span>}
                    {b.phone && <span>{b.phone}</span>}
                    {b.location && <span>{b.location}</span>}
                    {b.linkedin && <span>{b.linkedin}</span>}
                    {b.github && <span>{b.github}</span>}
                    {b.website && <span>{b.website}</span>}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Summary */}
                {data.summary && (
                    <section>
                        <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '12px' }}>Summary</h2>
                        <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '16px' }}>Experience</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>{exp.position}</h3>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {exp.start_date} – {exp.current ? 'Present' : exp.end_date}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>{exp.company}</div>
                                    {exp.description && <p style={{ fontSize: '13px', color: '#4b5563', marginTop: 0, marginBottom: '8px' }}>{exp.description}</p>}
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#4b5563' }}>
                                            {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                <li key={i} style={{ marginBottom: '4px', paddingLeft: '4px' }}>{bullet}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '16px' }}>Projects</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {data.projects.map(proj => (
                                <div key={proj.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                                            {proj.name} {proj.url && <span style={{ fontWeight: 400, color: '#6b7280' }}>— {proj.url}</span>}
                                        </h3>
                                    </div>
                                    {proj.tech_stack && <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{proj.tech_stack}</div>}
                                    {proj.description && <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 8px 0' }}>{proj.description}</p>}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#4b5563' }}>
                                            {proj.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                <li key={i} style={{ marginBottom: '4px', paddingLeft: '4px' }}>{bullet}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {/* Education */}
                    {data.education && data.education.college && (
                        <section>
                            <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '16px' }}>Education</h2>
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>{data.education.college.college_name}</h3>
                                <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '2px' }}>{data.education.college.degree} in {data.education.college.field_of_study}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {data.education.college.start_date && `${data.education.college.start_date} – `}
                                    {data.education.college.end_date}
                                    {data.education.college.gpa && ` • GPA: ${data.education.college.gpa}`}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && Object.values(data.skills).some(arr => arr && arr.length > 0) && (
                        <section>
                            <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '16px' }}>Technical Skills</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                                {data.skills.technical && data.skills.technical.length > 0 && (
                                    <div><strong style={{ color: '#374151' }}>Languages:</strong> <span style={{ color: '#4b5563' }}>{data.skills.technical.join(', ')}</span></div>
                                )}
                                {data.skills.tools && data.skills.tools.length > 0 && (
                                    <div><strong style={{ color: '#374151' }}>Tools:</strong> <span style={{ color: '#4b5563' }}>{data.skills.tools.join(', ')}</span></div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

            </div>
        </div>
    );
}
