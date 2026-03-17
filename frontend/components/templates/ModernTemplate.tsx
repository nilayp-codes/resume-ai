'use client';

import type { ResumeData, ColorTheme, FontFamily } from '@/lib/types';

/**
 * Modern Clean — Single-column, blue accent, Inter font, generous spacing.
 * Clean SaaS feel with thin section dividers and blue skill pills.
 */

// ─── Local styling tokens (NOT shared) ──────────────────
const ACCENT = '#2563eb';
const ACCENT_LIGHT = '#eff6ff';
const ACCENT_BORDER = '#bfdbfe';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#555';
const TEXT_MUTED = '#777';
const FONT = "'Inter', system-ui, sans-serif";
const DIVIDER = `1.5px solid ${ACCENT}`;

interface TemplateProps { data: ResumeData; colorTheme?: ColorTheme; fontFamily?: FontFamily; }

export function ModernTemplate({ data }: TemplateProps) {
    const bi = data.basic_info;

    const sectionTitle = (text: string) => (
        <div style={{ borderBottom: DIVIDER, paddingBottom: 3, marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, color: ACCENT }}>
                {text}
            </span>
        </div>
    );

    return (
        <>
            <div style={{ fontFamily: FONT, fontSize: 10.5, color: TEXT_PRIMARY, lineHeight: 1.55, background: '#fff' }}>
                {/* Blue top bar */}
                <div style={{ height: 4, background: ACCENT, marginBottom: 0, borderRadius: 2 }} />

                {/* Header */}
                <div style={{ textAlign: 'center', paddingTop: 18, paddingBottom: 14, marginBottom: 18 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: ACCENT, letterSpacing: -0.5 }}>{bi.full_name || 'Your Name'}</div>
                    {bi.job_title && <div style={{ fontSize: 11, color: ACCENT, fontWeight: 500, marginTop: 3 }}>{bi.job_title}</div>}
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: 12, marginTop: 8, fontSize: 9, color: TEXT_SECONDARY }}>
                        {bi.email && <span>{bi.email}</span>}
                        {bi.phone && <span>• {bi.phone}</span>}
                        {bi.location && <span>• {bi.location}</span>}
                        {bi.linkedin && <span>• LinkedIn</span>}
                        {bi.github && <span>• GitHub</span>}
                        {bi.website && <span>• Portfolio</span>}
                    </div>
                </div>

                <div style={{ height: 1, background: '#e5e7eb', marginBottom: 16 }} />

                {/* Summary */}
                {data.summary && (
                    <div className="resume-section" style={{ marginBottom: 16 }}>
                        {sectionTitle('Professional Summary')}
                        <p style={{ color: '#333', textAlign: 'justify' as const, fontSize: 10.5, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{data.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {data.experience?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 16 }}>
                        {sectionTitle('Work Experience')}
                        {data.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5 }}>{exp.position}</span>
                                        {exp.company && <span style={{ color: TEXT_SECONDARY, fontStyle: 'italic', fontSize: 9.5 }}> — {exp.company}</span>}
                                    </div>
                                    <span style={{ fontSize: 9, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
                                        {exp.start_date}{exp.end_date ? ` – ${exp.current ? 'Present' : exp.end_date}` : ''}
                                    </span>
                                </div>
                                {exp.description && <div style={{ marginTop: 3, color: '#333', fontSize: 10.5, lineHeight: 1.5 }}>{exp.description}</div>}
                                {exp.bullets?.filter(Boolean).length > 0 && (
                                    <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                                        {exp.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 3, color: '#333', fontSize: 10.5, lineHeight: 1.5 }}>{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {data.education && (data.education.college || data.education.school12 || data.education.school10) && (
                    <div className="resume-section" style={{ marginBottom: 16 }}>
                        {sectionTitle('Education')}

                        {data.education.college && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5 }}>
                                            {data.education.college.degree}{data.education.college.field_of_study ? ` in ${data.education.college.field_of_study}` : ''}
                                        </span>
                                        {data.education.college.college_name && <div style={{ color: TEXT_SECONDARY, fontSize: 9.5, fontStyle: 'italic' }}>{data.education.college.college_name}</div>}
                                    </div>
                                    <span style={{ fontSize: 9, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
                                        {data.education.college.start_date}{data.education.college.end_date ? ` – ${data.education.college.end_date}` : ''}
                                        {data.education.college.gpa ? ` | CGPA: ${data.education.college.gpa}` : ''}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data.education.school12 && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5 }}>Class 12th</span>
                                        {data.education.school12.school_name && <div style={{ color: TEXT_SECONDARY, fontSize: 9.5, fontStyle: 'italic' }}>{data.education.school12.school_name}</div>}
                                    </div>
                                    <span style={{ fontSize: 9, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
                                        {data.education.school12.board}{data.education.school12.year ? ` | ${data.education.school12.year}` : ''}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data.education.school10 && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5 }}>Class 10th</span>
                                        {data.education.school10.school_name && <div style={{ color: TEXT_SECONDARY, fontSize: 9.5, fontStyle: 'italic' }}>{data.education.school10.school_name}</div>}
                                    </div>
                                    <span style={{ fontSize: 9, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
                                        {data.education.school10.board}{data.education.school10.year ? ` | ${data.education.school10.year}` : ''}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Projects */}
                {data.projects?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 16 }}>
                        {sectionTitle('Projects')}
                        {data.projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <span style={{ fontWeight: 600, fontSize: 10.5 }}>{proj.name}{proj.tech_stack && <span style={{ fontWeight: 400, color: '#666', fontSize: 9.5 }}> · {proj.tech_stack}</span>}</span>
                                {proj.description && <div style={{ marginTop: 3, color: '#333', fontSize: 10.5, lineHeight: 1.5 }}>{proj.description}</div>}
                                {proj.bullets?.filter(Boolean).length > 0 && (
                                    <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                                        {proj.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 2, color: '#333', fontSize: 10.5, lineHeight: 1.5 }}>{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                {data.skills && (Object.values(data.skills).some(a => a.length > 0)) && (
                    <div className="resume-section" style={{ marginBottom: 16 }}>
                        {sectionTitle('Skills')}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
                            {data.skills.technical?.length > 0 && (
                                <div>
                                    <strong style={{ color: ACCENT, fontSize: 9.5 }}>Technical</strong>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 3 }}>
                                        {data.skills.technical.map((s, i) => <span key={i} style={{ background: ACCENT_LIGHT, color: ACCENT, padding: '1px 8px', borderRadius: 10, fontSize: 8.5, border: `1px solid ${ACCENT_BORDER}` }}>{s}</span>)}
                                    </div>
                                </div>
                            )}
                            {data.skills.tools?.length > 0 && (
                                <div>
                                    <strong style={{ color: ACCENT, fontSize: 9.5 }}>Tools</strong>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 3 }}>
                                        {data.skills.tools.map((s, i) => <span key={i} style={{ background: ACCENT_LIGHT, color: ACCENT, padding: '1px 8px', borderRadius: 10, fontSize: 8.5, border: `1px solid ${ACCENT_BORDER}` }}>{s}</span>)}
                                    </div>
                                </div>
                            )}
                            {data.skills.soft?.length > 0 && (
                                <div>
                                    <strong style={{ color: ACCENT, fontSize: 9.5 }}>Soft Skills</strong>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 3 }}>
                                        {data.skills.soft.map((s, i) => <span key={i} style={{ background: ACCENT_LIGHT, color: ACCENT, padding: '1px 8px', borderRadius: 10, fontSize: 8.5, border: `1px solid ${ACCENT_BORDER}` }}>{s}</span>)}
                                    </div>
                                </div>
                            )}
                            {data.skills.languages?.length > 0 && (
                                <div>
                                    <strong style={{ color: ACCENT, fontSize: 9.5 }}>Languages</strong>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 3 }}>
                                        {data.skills.languages.map((s, i) => <span key={i} style={{ background: ACCENT_LIGHT, color: ACCENT, padding: '1px 8px', borderRadius: 10, fontSize: 8.5, border: `1px solid ${ACCENT_BORDER}` }}>{s}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {data.certifications?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 16 }}>
                        {sectionTitle('Certifications')}
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <div>
                                    <div style={{ fontWeight: 500, fontSize: 10 }}>{cert.name}</div>
                                    {cert.issuer && <div style={{ fontSize: 9, color: '#666' }}>{cert.issuer}</div>}
                                </div>
                                <span style={{ fontSize: 9, color: TEXT_MUTED }}>{cert.date}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
