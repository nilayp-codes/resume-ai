'use client';

/**
 * Balanced Two Column — two-column resume with skills sidebar.
 */
export default function BalancedTwoColumn() {
    return (
        <div style={{ width: '100%', aspectRatio: '3/4', background: '#fdfdfd', fontFamily: "'Inter', sans-serif", overflow: 'hidden', fontSize: 6, lineHeight: 1.5, color: '#1f2937', display: 'flex' }}>
            {/* Left main content */}
            <div style={{ flex: 2, padding: '14px 12px', borderRight: '2px solid #2563eb' }}>
                <h1 style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: 0 }}>Amanda Jones</h1>
                <p style={{ fontSize: 7, color: '#2563eb', fontWeight: 600, margin: '2px 0 6px' }}>Graphic Designer</p>

                {/* Summary */}
                <h2 style={{ fontSize: 6.5, fontWeight: 700, color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: 2, margin: '0 0 4px' }}>PROFESSIONAL SUMMARY</h2>
                <p style={{ fontSize: 5, color: '#4b5563', margin: '0 0 8px' }}>Creative designer with 6+ years of experience crafting compelling visual identities for leading brands.</p>

                {/* Experience */}
                <h2 style={{ fontSize: 6.5, fontWeight: 700, color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: 2, margin: '0 0 4px' }}>EXPERIENCE</h2>
                <div style={{ marginBottom: 5 }}>
                    <div style={{ fontWeight: 700, fontSize: 5.5 }}>Senior Graphic Designer</div>
                    <div style={{ fontSize: 5, color: '#6b7280' }}>Pixel Studios • 2021 – Present</div>
                    <ul style={{ margin: '2px 0 0', paddingLeft: 8, fontSize: 4.5, color: '#4b5563' }}>
                        <li>Managed branding for 12 enterprise clients</li>
                        <li>Built design systems from scratch</li>
                    </ul>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={{ fontWeight: 700, fontSize: 5.5 }}>Graphic Designer</div>
                    <div style={{ fontSize: 5, color: '#6b7280' }}>Createscape • 2018 – 2021</div>
                    <ul style={{ margin: '2px 0 0', paddingLeft: 8, fontSize: 4.5, color: '#4b5563' }}>
                        <li>Delivered 50+ brand identity projects</li>
                        <li>Increased client satisfaction to 95%</li>
                    </ul>
                </div>

                {/* Education */}
                <h2 style={{ fontSize: 6.5, fontWeight: 700, color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: 2, margin: '0 0 4px' }}>EDUCATION</h2>
                <div style={{ fontWeight: 700, fontSize: 5.5 }}>B.F.A. Graphic Design</div>
                <div style={{ fontSize: 5, color: '#6b7280' }}>School of Visual Arts • 2014 – 2018</div>
            </div>

            {/* Right sidebar */}
            <div style={{ flex: 1, padding: '14px 10px', background: '#f8fafc' }}>
                {/* Photo placeholder */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 14, color: '#94a3b8' }}>A</span>
                </div>

                {/* Contact */}
                <h3 style={{ fontSize: 6, fontWeight: 700, color: '#2563eb', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Contact</h3>
                <div style={{ fontSize: 4.5, color: '#4b5563', marginBottom: 8 }}>
                    <p style={{ margin: '0 0 2px' }}>amanda@email.com</p>
                    <p style={{ margin: '0 0 2px' }}>(555) 012-3456</p>
                    <p style={{ margin: 0 }}>Elmhurst, NY</p>
                </div>

                {/* Skills */}
                <h3 style={{ fontSize: 6, fontWeight: 700, color: '#2563eb', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Skills</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
                    {[['Photoshop', 90], ['Figma', 85], ['Illustrator', 80], ['InDesign', 75], ['After Effects', 70]].map(([name, level]) => (
                        <div key={name as string}>
                            <div style={{ fontSize: 4.5, color: '#374151', marginBottom: 1 }}>{name as string}</div>
                            <div style={{ height: 3, borderRadius: 2, background: '#e5e7eb' }}>
                                <div style={{ height: 3, borderRadius: 2, background: '#2563eb', width: `${level}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certifications */}
                <h3 style={{ fontSize: 6, fontWeight: 700, color: '#2563eb', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Certifications</h3>
                <div style={{ fontSize: 4.5, color: '#4b5563' }}>
                    <p style={{ margin: '0 0 2px' }}>Adobe Certified Expert</p>
                    <p style={{ margin: 0 }}>Google UX Design</p>
                </div>
            </div>
        </div>
    );
}
