'use client';

import type { ResumeData, ColorTheme, FontFamily } from '@/lib/types';
import { resolvePhotoUrl } from '@/lib/photo';

/**
 * Executive Dark Sidebar — Premium two-column resume layout.
 *
 * Uses flex layout with fixed pixel widths for stable Playwright rendering.
 * Sidebar appears AFTER main content in DOM for ATS parsing.
 * Avoid absolute positioning.
 * Ensure exported PDF text remains selectable.
 */

// ─── Local styling tokens (NOT shared) ──────────────────
const SIDEBAR_BG = '#18181b';       // zinc-900
const SIDEBAR_TEXT = '#e4e4e7';     // zinc-200
const SIDEBAR_MUTED = '#a1a1aa';    // zinc-400
const SIDEBAR_HEADING = '#fafafa';  // zinc-50
const MAIN_BG = '#ffffff';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#4b5563';
const TEXT_MUTED = '#6b7280';
const DIVIDER = '#e5e7eb';
const FONT = "'Inter', system-ui, sans-serif";

interface TemplateProps {
    data: ResumeData;
    colorTheme?: ColorTheme;
    fontFamily?: FontFamily;
}

export function ExecutiveTemplate({ data }: TemplateProps) {
    const bi = data.basic_info;

    const rawPhotoUrl = (bi as any).photo_url;
    const photoUrl = resolvePhotoUrl(rawPhotoUrl);

    const sectionTitle = (text: string) => (
        <h2 style={{
            fontSize: 12, fontWeight: 700, textTransform: 'uppercase' as const,
            letterSpacing: 0.5, color: TEXT_PRIMARY, borderBottom: `1.5px solid ${DIVIDER}`,
            paddingBottom: 4, marginBottom: 10, marginTop: 0,
        }}>{text}</h2>
    );

    const sidebarTitle = (text: string) => (
        <h2 style={{
            fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase' as const,
            letterSpacing: 1, color: SIDEBAR_HEADING, borderBottom: '1px solid rgba(255,255,255,0.15)',
            paddingBottom: 4, marginBottom: 10, marginTop: 16,
        }}>{text}</h2>
    );

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'stretch',
            gap: '34px',
            fontFamily: FONT,
        }}>

            {/* ── MAIN CONTENT FIRST (ATS) ──────────────── */}
            <main style={{ width: '520px', background: MAIN_BG }}>
                {/* Header with Name + Photo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <h1 style={{
                            fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY,
                            letterSpacing: -0.5, margin: 0, lineHeight: 1.2,
                        }}>
                            {bi.full_name || 'Your Name'}
                        </h1>
                        {bi.job_title && (
                            <p style={{
                                fontSize: 11, color: TEXT_MUTED, fontWeight: 500,
                                marginTop: 4, margin: 0,
                            }}>{bi.job_title}</p>
                        )}
                    </div>
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt="Profile"
                            style={{
                                width: 120, height: 120, borderRadius: '50%',
                                objectFit: 'cover' as const, border: '3px solid #e5e7eb',
                                flexShrink: 0,
                            }}
                            onError={(e) => {
                                console.warn('Photo failed to load:', (e.currentTarget as HTMLImageElement).src);
                            }}
                        />
                    ) : (
                        <div style={{
                            width: 120, height: 120, borderRadius: '50%',
                            border: '3px solid #e5e7eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 36, fontWeight: 600, color: '#6b7280',
                            flexShrink: 0,
                        }}>
                            {bi.full_name?.charAt(0) || '?'}
                        </div>
                    )}
                </div>

                {/* Divider under header */}
                <div style={{ borderBottom: '1.5px solid #e5e7eb', marginBottom: 16 }} />

                {/* Summary */}
                {data.summary && (
                    <div className="resume-section" style={{ marginBottom: 18, breakInside: 'avoid' as const, pageBreakInside: 'avoid' as const }}>
                        {sectionTitle('Summary')}
                        <p style={{ color: TEXT_SECONDARY, fontSize: 10.5, lineHeight: 1.55, textAlign: 'justify' as const, margin: 0, whiteSpace: 'pre-line' }}>
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Work Experience */}
                {data.experience?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 18, breakInside: 'avoid' as const, pageBreakInside: 'avoid' as const }}>
                        {sectionTitle('Work Experience')}
                        {data.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5, color: TEXT_PRIMARY }}>{exp.position}</span>
                                        {exp.company && (
                                            <div style={{ fontSize: 9, color: TEXT_MUTED, fontStyle: 'italic' }}>{exp.company}</div>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
                                        {exp.start_date}{exp.end_date ? ` – ${exp.current ? 'Present' : exp.end_date}` : ''}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p style={{ marginTop: 3, fontSize: 10.5, lineHeight: 1.55, color: '#333', margin: '3px 0 0' }}>{exp.description}</p>
                                )}
                                {exp.bullets?.filter(Boolean).length > 0 && (
                                    <ul style={{ marginTop: 4, paddingLeft: 16, margin: '4px 0 0' }}>
                                        {exp.bullets.filter(Boolean).map((b, j) => (
                                            <li key={j} style={{ fontSize: 10.5, lineHeight: 1.55, color: '#333', marginBottom: 2 }}>{b}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {data.education && (data.education.college || data.education.school12 || data.education.school10) && (
                    <div className="resume-section" style={{ marginBottom: 18, breakInside: 'avoid' as const, pageBreakInside: 'avoid' as const }}>
                        {sectionTitle('Education')}

                        {data.education.college && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5, color: TEXT_PRIMARY }}>
                                            {data.education.college.degree}{data.education.college.field_of_study ? ` in ${data.education.college.field_of_study}` : ''}
                                        </span>
                                        {data.education.college.college_name && (
                                            <div style={{ fontSize: 9, color: TEXT_MUTED, fontStyle: 'italic' }}>{data.education.college.college_name}</div>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
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
                                        <span style={{ fontWeight: 600, fontSize: 10.5, color: TEXT_PRIMARY }}>Class 12th</span>
                                        {data.education.school12.school_name && (
                                            <div style={{ fontSize: 9, color: TEXT_MUTED, fontStyle: 'italic' }}>{data.education.school12.school_name}</div>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
                                        {data.education.school12.board}{data.education.school12.year ? ` | ${data.education.school12.year}` : ''}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data.education.school10 && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: 10.5, color: TEXT_PRIMARY }}>Class 10th</span>
                                        {data.education.school10.school_name && (
                                            <div style={{ fontSize: 9, color: TEXT_MUTED, fontStyle: 'italic' }}>{data.education.school10.school_name}</div>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 8.5, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>
                                        {data.education.school10.board}{data.education.school10.year ? ` | ${data.education.school10.year}` : ''}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Projects */}
                {data.projects?.length > 0 && (
                    <div className="resume-section" style={{ marginBottom: 18, breakInside: 'avoid' as const, pageBreakInside: 'avoid' as const }}>
                        {sectionTitle('Projects')}
                        {data.projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <span style={{ fontWeight: 600, fontSize: 11, color: TEXT_PRIMARY }}>{proj.name}</span>
                                {proj.tech_stack && (
                                    <span style={{ fontSize: 9, color: TEXT_MUTED }}> · {proj.tech_stack}</span>
                                )}
                                {proj.description && (
                                    <p style={{ fontSize: 10.5, lineHeight: 1.55, color: '#333', marginTop: 3, margin: '3px 0 0' }}>{proj.description}</p>
                                )}
                                {proj.bullets?.filter(Boolean).length > 0 && (
                                    <ul style={{ marginTop: 4, paddingLeft: 16, margin: '4px 0 0' }}>
                                        {proj.bullets.filter(Boolean).map((b, j) => (
                                            <li key={j} style={{ fontSize: 10.5, lineHeight: 1.55, color: '#333', marginBottom: 2 }}>{b}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ── SIDEBAR AFTER MAIN (ATS) ──────────────── */}
            <aside style={{
                width: '240px',
                flexShrink: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: '18px',
                background: SIDEBAR_BG, color: SIDEBAR_TEXT,
                padding: '40px 24px'
            }}>
                {/* Contact */}
                {sidebarTitle('Contact')}
                <div style={{ fontSize: 8.5, color: SIDEBAR_MUTED, lineHeight: 2 }}>
                    {bi.email && <p style={{ margin: 0 }}>{bi.email}</p>}
                    {bi.phone && <p style={{ margin: 0 }}>{bi.phone}</p>}
                    {bi.location && <p style={{ margin: 0 }}>{bi.location}</p>}
                </div>

                {/* Skills */}
                {data.skills && Object.values(data.skills).some(a => a.length > 0) && (
                    <>
                        {sidebarTitle('Skills')}
                        {data.skills.technical?.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{
                                    fontSize: 7, fontWeight: 700, textTransform: 'uppercase' as const,
                                    letterSpacing: 1, color: SIDEBAR_MUTED, marginBottom: 5,
                                }}>Technical</div>
                                <ul style={{ paddingLeft: 14, margin: 0 }}>
                                    {data.skills.technical.map((s, i) => (
                                        <li key={i} style={{ fontSize: 8.5, color: SIDEBAR_TEXT, marginBottom: 2 }}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {data.skills.tools?.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{
                                    fontSize: 7, fontWeight: 700, textTransform: 'uppercase' as const,
                                    letterSpacing: 1, color: SIDEBAR_MUTED, marginBottom: 5,
                                }}>Tools</div>
                                <ul style={{ paddingLeft: 14, margin: 0 }}>
                                    {data.skills.tools.map((s, i) => (
                                        <li key={i} style={{ fontSize: 8.5, color: SIDEBAR_TEXT, marginBottom: 2 }}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {data.skills.languages?.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{
                                    fontSize: 7, fontWeight: 700, textTransform: 'uppercase' as const,
                                    letterSpacing: 1, color: SIDEBAR_MUTED, marginBottom: 5,
                                }}>Languages</div>
                                <ul style={{ paddingLeft: 14, margin: 0 }}>
                                    {data.skills.languages.map((s, i) => (
                                        <li key={i} style={{ fontSize: 8.5, color: SIDEBAR_TEXT, marginBottom: 2 }}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {data.skills.soft?.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                                <div style={{
                                    fontSize: 7, fontWeight: 700, textTransform: 'uppercase' as const,
                                    letterSpacing: 1, color: SIDEBAR_MUTED, marginBottom: 5,
                                }}>Soft Skills</div>
                                <ul style={{ paddingLeft: 14, margin: 0 }}>
                                    {data.skills.soft.map((s, i) => (
                                        <li key={i} style={{ fontSize: 8.5, color: SIDEBAR_TEXT, marginBottom: 2 }}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {/* Links */}
                {(bi.linkedin || bi.github || bi.website) && (
                    <>
                        {sidebarTitle('Links')}
                        <div style={{ fontSize: 8.5, color: SIDEBAR_MUTED, lineHeight: 2 }}>
                            {bi.linkedin && <p style={{ margin: 0 }}>LinkedIn</p>}
                            {bi.github && <p style={{ margin: 0 }}>GitHub</p>}
                            {bi.website && <p style={{ margin: 0 }}>Portfolio</p>}
                        </div>
                    </>
                )}

                {/* Certifications */}
                {data.certifications?.length > 0 && (
                    <>
                        {sidebarTitle('Certifications')}
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{ marginBottom: 7 }}>
                                <div style={{ fontWeight: 600, fontSize: 8.5, color: SIDEBAR_HEADING }}>{cert.name}</div>
                                <div style={{ fontSize: 8, color: SIDEBAR_MUTED }}>
                                    {cert.issuer}{cert.date ? ` · ${cert.date}` : ''}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </aside>
        </div>
    );
}
