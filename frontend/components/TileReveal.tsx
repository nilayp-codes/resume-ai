'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';

const LINES = [
    { text: 'RESUMES ARE BROKEN.', isAccent: false },
    { text: 'FIX IT WITH AI.', isAccent: true },
    { text: 'RESUMES ARE BROKEN.', isAccent: false },
    { text: 'FIX IT WITH AI.', isAccent: true },
    { text: 'RESUMES ARE BROKEN.', isAccent: false },
    { text: 'FIX IT WITH AI.', isAccent: true },
    { text: 'RESUMES ARE BROKEN.', isAccent: false },
    { text: 'FIX IT WITH AI.', isAccent: true },
];

export default function TileReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const [p, setP] = useState(0);

    useEffect(() => {
        const unsub = scrollYProgress.on('change', (v: number) => setP(v));
        return unsub;
    }, [scrollYProgress]);

    const bgDark = Math.min(1, Math.max(0, p * 4));
    const textShow = Math.max(0, Math.min(1, (p - 0.15) * 3));
    const stmtShow = Math.max(0, Math.min(1, (p - 0.35) * 3));

    return (
        <div ref={ref} style={{ height: '250vh', position: 'relative' }}>
            <div style={{
                position: 'sticky', top: 0, height: '100vh',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {/* Dark bg */}
                <div style={{ position: 'absolute', inset: 0, background: '#0A0A0A', opacity: bgDark }} />

                {/* Marquee text */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    opacity: textShow, overflow: 'hidden',
                }}>
                    {LINES.map((line, i) => (
                        <div key={i} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <div style={{
                                display: 'inline-flex',
                                animation: `marquee-${i % 2 === 0 ? 'left' : 'right'} ${18 + i * 2}s linear infinite`,
                                width: 'max-content',
                            }}>
                                {Array(10).fill(null).map((_, j) => (
                                    <span key={j} style={{
                                        fontSize: 'clamp(32px, 6vw, 80px)',
                                        fontWeight: 900, letterSpacing: '-0.03em',
                                        color: line.isAccent ? '#DC2626' : 'rgba(255,255,255,0.85)',
                                        padding: '0 16px', lineHeight: 1.2,
                                    }}>{line.text}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center statement */}
                <div style={{
                    position: 'relative', zIndex: 20,
                    opacity: stmtShow, transform: `scale(${0.9 + stmtShow * 0.1})`,
                    textAlign: 'center' as const, padding: '48px 64px',
                    background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)',
                    borderRadius: 4, maxWidth: 560,
                }}>
                    <h2 style={{
                        fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 800,
                        color: '#FAFAF9', letterSpacing: '-0.03em', lineHeight: 1.2,
                        margin: 0, marginBottom: 12,
                    }}>
                        Your resume deserves<br />
                        <span style={{ color: '#DC2626' }}>better than this.</span>
                    </h2>
                    <p style={{ fontSize: 15, color: 'rgba(250,250,249,0.5)', lineHeight: 1.6, margin: 0 }}>
                        Let AI help you build one that actually works.
                    </p>
                </div>
            </div>
        </div>
    );
}
