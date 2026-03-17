'use client';

import type { ResumeData, ColorTheme, FontFamily } from '@/lib/types';

/**
 * Classic Corporate — Timeless serif font, BLACK & GRAY only.
 * Thick black dividers, uppercase section headers, formal executive feel.
 * Traditional boardroom resume. NO color accents.
 */

// ─── Local styling tokens (NOT shared) ──────────────────
const ACCENT = '#111827';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#374151';
const TEXT_MUTED = '#6b7280';
const DIVIDER_THICK = '2.5px solid #111827';
const DIVIDER_THIN = '1.5px solid #374151';
const FONT = "Georgia, 'Times New Roman', serif";

interface TemplateProps { data: ResumeData; colorTheme?: ColorTheme; fontFamily?: FontFamily; }

export function ClassicTemplate({ data }: TemplateProps) {
    const bi = data.basic_info;

    const sectionTitle = (text: string) => (
        <div style={{ borderBottom: DIVIDER_THIN, paddingBottom: 4, marginBottom: 10 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, color: ACCENT }}>{text}</span>
        </div>
    );

    return (
        <>
            <div style={{ fontFamily: FONT, fontSize: 10, color: TEXT_PRIMARY, lineHeight: 1.65, background: '#fff' }}>
                {/* Centered Header */}
                <div style={{ textAlign: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: ACCENT }}>{bi.full_name || 'Your Name'}</div>
                    {bi.job_title && <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4, fontStyle: 'italic' }}>{bi.job_title}</div>}
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: 14, marginTop: 10, fontSize: 9, color: TEXT_SECONDARY, fontFamily: "'Inter', sans-serif" }}>
                        {bi.email && <span>{bi.email}</span>}
                        {bi.phone && <span>|  {bi.phone}</span>}
                        {bi.location && <span>|  {bi.location}</span>}
                        {bi.linkedin && <span>|  LinkedIn</span>}
                        {bi.github && <span>|  GitHub</span>}
                    </div>
                </div>

                {/* Thick double divider */}
                <div style={{ borderTop: DIVIDER_THICK, borderBottom: '1px solid #9ca3af', paddingTop: 2, marginTop: 10, marginBottom: 20 }} />

                {/* Summary */}
                {data.summary && (
                    <div className="resume-section" style={{ marginBottom: 20 }}>
                        {sectionTitle('Professional Summary')}
                        <p style={{ color: TEXT_SECONDARY, textAlign: 'justify' as const, fontSize: 10.5, fontStyle: 'italic', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{data.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {data.experience?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 20 }}>
                        {sectionTitle('Professional Experience')}
                        {data.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 700, fontSize: 10.5 }}>{exp.position}</span>
                                        {exp.company && <span style={{ fontSize: 9.5, color: TEXT_SECONDARY, fontStyle: 'italic' }}> — {exp.company}</span>}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, whiteSpace: 'nowrap' as const, fontFamily: "'Inter', sans-serif" }}>
                                        {exp.start_date}{exp.end_date ? ` – ${exp.current ? 'Present' : exp.end_date}` : ''}
                                    </span>
                                </div>
                                {exp.description && <div style={{ marginTop: 4, fontSize: 10.5, lineHeight: 1.5, color: TEXT_SECONDARY }}>{exp.description}</div>}
                                {exp.bullets?.filter(Boolean).length > 0 && (
                                    <ul style={{ marginTop: 5, paddingLeft: 18 }}>
                                        {exp.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ fontSize: 10.5, lineHeight: 1.5, color: TEXT_SECONDARY, marginBottom: 3 }}>{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {data.education && (data.education.college || data.education.school12 || data.education.school10) && (
                    <div className="resume-section" style={{ marginBottom: 20 }}>
                        {sectionTitle('Education')}

                        {data.education.college && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5 }}>
                                            {data.education.college.degree}{data.education.college.field_of_study ? ` in ${data.education.college.field_of_study}` : ''}
                                        </span>
                                        {data.education.college.college_name && <div style={{ fontSize: 9.5, color: TEXT_MUTED, fontStyle: 'italic' }}>{data.education.college.college_name}</div>}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, fontFamily: "'Inter', sans-serif" }}>
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
                                        {data.education.school12.school_name && <div style={{ fontSize: 9.5, color: TEXT_MUTED, fontStyle: 'italic' }}>{data.education.school12.school_name}</div>}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, fontFamily: "'Inter', sans-serif" }}>
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
                                        {data.education.school10.school_name && <div style={{ fontSize: 9.5, color: TEXT_MUTED, fontStyle: 'italic' }}>{data.education.school10.school_name}</div>}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, fontFamily: "'Inter', sans-serif" }}>
                                        {data.education.school10.board}{data.education.school10.year ? ` | ${data.education.school10.year}` : ''}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Projects */}
                {data.projects?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 20 }}>
                        {sectionTitle('Projects')}
                        {data.projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <span style={{ fontWeight: 600, fontSize: 10.5 }}>{proj.name}</span>
                                {proj.tech_stack && <span style={{ fontSize: 9.5, color: TEXT_MUTED, fontStyle: 'italic' }}> · {proj.tech_stack}</span>}
                                {proj.description && <div style={{ marginTop: 3, fontSize: 10.5, lineHeight: 1.5, color: TEXT_SECONDARY }}>{proj.description}</div>}
                                {proj.bullets?.filter(Boolean).length > 0 && (
                                    <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                                        {proj.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ fontSize: 10.5, lineHeight: 1.5, color: TEXT_SECONDARY, marginBottom: 2 }}>{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills — inline comma-separated, no colored badges */}
                {data.skills && (Object.values(data.skills).some(a => a.length > 0)) && (
                    <div className="resume-section" style={{ marginBottom: 20 }}>
                        {sectionTitle('Skills')}
                        {data.skills.technical?.length > 0 && (
                            <div style={{ fontSize: 9.5, marginBottom: 5 }}><strong style={{ textTransform: 'uppercase' as const, letterSpacing: 0.8, fontSize: 8.5 }}>Technical: </strong>{data.skills.technical.join(', ')}</div>
                        )}
                        {data.skills.tools?.length > 0 && (
                            <div style={{ fontSize: 9.5, marginBottom: 5 }}><strong style={{ textTransform: 'uppercase' as const, letterSpacing: 0.8, fontSize: 8.5 }}>Tools: </strong>{data.skills.tools.join(', ')}</div>
                        )}
                        {data.skills.soft?.length > 0 && (
                            <div style={{ fontSize: 9.5, marginBottom: 5 }}><strong style={{ textTransform: 'uppercase' as const, letterSpacing: 0.8, fontSize: 8.5 }}>Soft Skills: </strong>{data.skills.soft.join(', ')}</div>
                        )}
                        {data.skills.languages?.length > 0 && (
                            <div style={{ fontSize: 9.5 }}><strong style={{ textTransform: 'uppercase' as const, letterSpacing: 0.8, fontSize: 8.5 }}>Languages: </strong>{data.skills.languages.join(', ')}</div>
                        )}
                    </div>
                )}

                {/* Certifications */}
                {data.certifications?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 20 }}>
                        {sectionTitle('Certifications')}
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{ marginBottom: 6, fontSize: 9.5 }}>
                                <strong>{cert.name}</strong>
                                <span style={{ color: TEXT_MUTED }}> — {cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
