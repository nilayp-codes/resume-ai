'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LINES = [
    { text: 'RESUMES ARE BROKEN.', speed: 18, direction: 'left' },
    { text: 'FIX IT WITH AI.', speed: 22, direction: 'right' },
    { text: 'RESUMES ARE BROKEN.', speed: 20, direction: 'left' },
    { text: 'FIX IT WITH AI.', speed: 25, direction: 'right' },
    { text: 'RESUMES ARE BROKEN.', speed: 17, direction: 'left' },
    { text: 'FIX IT WITH AI.', speed: 23, direction: 'right' },
];

export default function TileReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const unsub = scrollYProgress.on('change', (v) => setProgress(v));
        return unsub;
    }, [scrollYProgress]);

    const bgOpacity = Math.min(1, progress * 3);
    const textOpacity = Math.max(0, Math.min(1, (progress - 0.2) * 2.5));
    const statementOpacity = Math.max(0, Math.min(1, (progress - 0.6) * 3));
    const statementScale = 0.9 + statementOpacity * 0.1;

    return (
        <div ref={ref} style={{ height: '400vh', position: 'relative' }}>
            <div style={{
                position: 'sticky', top: 0, height: '100vh',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {/* Dark background fading in */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: '#0A0A0A',
                    opacity: bgOpacity,
                    transition: 'none',
                }} />

                {/* Marquee text wall */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    opacity: textOpacity,
                    overflow: 'hidden',
                }}>
                    {LINES.map((line, i) => (
                        <div key={i} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <div style={{
                                display: 'inline-flex',
                                animation: `marquee-${line.direction} ${line.speed}s linear infinite`,
                                width: 'max-content',
                            }}>
                                {Array(8).fill(null).map((_, j) => (
                                    <span key={j} style={{
                                        fontSize: 'clamp(36px, 7vw, 90px)',
                                        fontWeight: 900,
                                        letterSpacing: '-0.04em',
                                        color: line.text.includes('FIX') ? '#DC2626' : 'rgba(255,255,255,0.7)',
                                        padding: '0 20px',
                                        lineHeight: 1.15,
                                        fontFamily: "'Inter', sans-serif",
                                    }}>{line.text}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center statement that appears last */}
                <div style={{
                    position: 'relative', zIndex: 20,
                    opacity: statementOpacity,
                    transform: `scale(${statementScale})`,
                    textAlign: 'center' as const,
                    background: 'rgba(10,10,10,0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4, padding: '48px 64px',
                    maxWidth: 600,
                }}>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 48px)',
                        fontWeight: 800,
                        color: '#FAFAF9',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.15,
                        margin: 0, marginBottom: 16,
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        Your resume deserves<br />
                        <span style={{ color: '#DC2626' }}>better than this.</span>
                    </h2>
                    <p style={{
                        fontSize: 16, color: 'rgba(250,250,249,0.5)',
                        lineHeight: 1.6, margin: 0,
                    }}>
                        Let AI help you build one that actually works.
                    </p>
                </div>
            </div>
        </div>
    );
}
