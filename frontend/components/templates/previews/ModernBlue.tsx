'use client';

/**
 * Modern Blue Header — single-column resume with blue top bar.
 * Filled with realistic dummy data (Amanda Jones, Graphic Designer).
 */
export default function ModernBlue() {
    return (
        <div style={{ width: '100%', aspectRatio: '3/4', background: '#fdfdfd', fontFamily: "'Inter', sans-serif", overflow: 'hidden', fontSize: 6, lineHeight: 1.5, color: '#1f2937' }}>
            {/* Blue top bar */}
            <div style={{ height: 5, background: '#2563eb' }} />
            <div style={{ padding: '14px 16px 12px' }}>
                {/* Name + title */}
                <h1 style={{ fontSize: 14, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Amanda Jones</h1>
                <p style={{ fontSize: 7, color: '#2563eb', fontWeight: 600, margin: '2px 0 0' }}>Graphic Designer</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 5, fontSize: 5, color: '#6b7280' }}>
                    <span>amanda@email.com</span>
                    <span>•</span>
                    <span>(555) 012-3456</span>
                    <span>•</span>
                    <span>Elmhurst, NY</span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />

                {/* Summary */}
                <h2 style={{ fontSize: 7, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 4px' }}>Summary</h2>
                <p style={{ fontSize: 5.5, color: '#4b5563', margin: 0 }}>Creative graphic designer with 6+ years of experience in branding, digital design, and print media. Skilled in Adobe Creative Suite and Figma.</p>

                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />

                {/* Experience */}
                <h2 style={{ fontSize: 7, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 5px' }}>Experience</h2>
                <div style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: 6 }}>Senior Graphic Designer</span>
                        <span style={{ fontSize: 5, color: '#9ca3af' }}>2021 – Present</span>
                    </div>
                    <p style={{ fontSize: 5.5, color: '#6b7280', margin: '1px 0 3px' }}>Pixel Studios — New York, NY</p>
                    <ul style={{ margin: 0, paddingLeft: 10, fontSize: 5, color: '#4b5563' }}>
                        <li>Led rebranding for 12 enterprise clients</li>
                        <li>Increased social media engagement by 45%</li>
                        <li>Mentored 3 junior designers</li>
                    </ul>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: 6 }}>Graphic Designer</span>
                        <span style={{ fontSize: 5, color: '#9ca3af' }}>2018 – 2021</span>
                    </div>
                    <p style={{ fontSize: 5.5, color: '#6b7280', margin: '1px 0 3px' }}>Createscape Agency — Queens, NY</p>
                    <ul style={{ margin: 0, paddingLeft: 10, fontSize: 5, color: '#4b5563' }}>
                        <li>Designed 50+ brand identity packages</li>
                        <li>Collaborated with marketing on campaigns</li>
                    </ul>
                </div>

                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />

                {/* Education */}
                <h2 style={{ fontSize: 7, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 4px' }}>Education</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 6 }}>B.F.A. Graphic Design</span>
                    <span style={{ fontSize: 5, color: '#9ca3af' }}>2014 – 2018</span>
                </div>
                <p style={{ fontSize: 5.5, color: '#6b7280', margin: '1px 0' }}>School of Visual Arts — New York</p>

                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />

                {/* Skills */}
                <h2 style={{ fontSize: 7, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 4px' }}>Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {['Photoshop', 'Illustrator', 'Figma', 'InDesign', 'After Effects', 'Branding', 'Typography'].map(s => (
                        <span key={s} style={{ padding: '1px 5px', background: '#eff6ff', color: '#2563eb', borderRadius: 3, fontSize: 5 }}>{s}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
