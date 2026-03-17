'use client';

/**
 * Classic Serif Corporate — timeless black-and-white with serif typography.
 */
export default function ClassicSerif() {
    return (
        <div style={{ width: '100%', aspectRatio: '3/4', background: '#fdfdfd', fontFamily: "Georgia, 'Times New Roman', serif", overflow: 'hidden', fontSize: 6, lineHeight: 1.6, color: '#111827' }}>
            <div style={{ padding: '16px 18px' }}>
                {/* Name centered */}
                <div style={{ textAlign: 'center' as const, marginBottom: 6 }}>
                    <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>Amanda Jones</h1>
                    <p style={{ fontSize: 7, color: '#4b5563', margin: '2px 0 0', fontStyle: 'italic' }}>Graphic Designer</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4, fontSize: 5, color: '#6b7280' }}>
                        <span>amanda@email.com</span>
                        <span>|</span>
                        <span>(555) 012-3456</span>
                        <span>|</span>
                        <span>Elmhurst, NY</span>
                    </div>
                </div>

                {/* Thick divider */}
                <div style={{ height: 2, background: '#111827', margin: '8px 0' }} />

                {/* Summary */}
                <h2 style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Professional Summary</h2>
                <p style={{ fontSize: 5.5, color: '#374151', margin: '0 0 6px' }}>Accomplished graphic designer with a decade of experience in brand strategy, visual communication, and creative leadership. Consistently delivers impactful design solutions.</p>

                <div style={{ height: 1.5, background: '#111827', margin: '6px 0' }} />

                {/* Experience */}
                <h2 style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 5px' }}>Experience</h2>
                <div style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: 6 }}>Senior Graphic Designer</span>
                        <span style={{ fontSize: 5, color: '#6b7280', fontStyle: 'italic' }}>2021 – Present</span>
                    </div>
                    <p style={{ fontSize: 5.5, color: '#4b5563', margin: '1px 0 2px', fontStyle: 'italic' }}>Pixel Studios, New York, NY</p>
                    <ul style={{ margin: 0, paddingLeft: 10, fontSize: 5, color: '#374151' }}>
                        <li>Directed visual identity for 12 enterprise accounts</li>
                        <li>Established and maintained brand style guides</li>
                    </ul>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: 6 }}>Graphic Designer</span>
                        <span style={{ fontSize: 5, color: '#6b7280', fontStyle: 'italic' }}>2018 – 2021</span>
                    </div>
                    <p style={{ fontSize: 5.5, color: '#4b5563', margin: '1px 0 2px', fontStyle: 'italic' }}>Createscape Agency, Queens, NY</p>
                    <ul style={{ margin: 0, paddingLeft: 10, fontSize: 5, color: '#374151' }}>
                        <li>Produced 50+ brand identity deliverables</li>
                        <li>Managed cross-functional design projects</li>
                    </ul>
                </div>

                <div style={{ height: 1.5, background: '#111827', margin: '6px 0' }} />

                {/* Education */}
                <h2 style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Education</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 6 }}>Bachelor of Fine Arts — Graphic Design</span>
                    <span style={{ fontSize: 5, color: '#6b7280', fontStyle: 'italic' }}>2014 – 2018</span>
                </div>
                <p style={{ fontSize: 5.5, color: '#4b5563', margin: '1px 0', fontStyle: 'italic' }}>School of Visual Arts, New York, NY</p>
            </div>
        </div>
    );
}
