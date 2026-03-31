'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

const ROWS = 8;
const COLS = 12;
const MARQUEE_LINES = [
    { text: 'RESUMES ARE BROKEN.', color: 'rgba(255,255,255,0.6)' },
    { text: 'RESUMES ARE BROKEN.', color: 'rgba(255,255,255,0.4)' },
    { text: 'RESUMES ARE BROKEN.', color: 'rgba(255,255,255,0.8)' },
    { text: 'RESUMES ARE BROKEN.', color: 'rgba(255,255,255,0.3)' },
    { text: 'FIX IT WITH AI.', color: '#2563EB' },
    { text: 'FIX IT WITH AI.', color: 'rgba(37,99,235,0.7)' },
    { text: 'FIX IT WITH AI.', color: 'rgba(37,99,235,0.4)' },
    { text: 'FIX IT WITH AI.', color: 'rgba(37,99,235,0.2)' },
];

export default function TileReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const unsub = scrollYProgress.on('change', (v) => setProgress(v));
        return unsub;
    }, [scrollYProgress]);

    const tiles = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const idx = r * COLS + c;
            const centerR = ROWS / 2;
            const centerC = COLS / 2;
            const dist = Math.sqrt((r - centerR) ** 2 + (c - centerC) ** 2);
            const maxDist = Math.sqrt(centerR ** 2 + centerC ** 2);
            const normalizedDist = dist / maxDist;
            const tileProgress = Math.max(0, Math.min(1, (progress - 0.2 - normalizedDist * 0.3) * 4));

            tiles.push(
                <div key={idx} style={{
                    position: 'absolute',
                    left: `${(c / COLS) * 100}%`,
                    top: `${(r / ROWS) * 100}%`,
                    width: `${100 / COLS}%`,
                    height: `${100 / ROWS}%`,
                    background: '#FAFAF9',
                    transform: `perspective(800px) rotateY(${tileProgress * 180}deg)`,
                    transformOrigin: 'center',
                    backfaceVisibility: 'hidden' as const,
                    zIndex: tileProgress < 0.5 ? 10 : 0,
                    transition: 'none',
                }} />
            );
        }
    }

    return (
        <div ref={ref} style={{ height: '300vh', position: 'relative' }}>
            <div style={{
                position: 'sticky', top: 0, height: '100vh',
                background: '#0A0A0A', overflow: 'hidden',
            }}>
                {/* Background marquee text */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    overflow: 'hidden',
                }}>
                    {MARQUEE_LINES.map((line, i) => (
                        <div key={i} style={{
                            overflow: 'hidden', whiteSpace: 'nowrap',
                        }}>
                            <div style={{
                                display: 'inline-flex', gap: 0,
                                animation: `marquee-${i % 2 === 0 ? 'left' : 'right'} ${20 + i * 3}s linear infinite`,
                                width: 'max-content',
                            }}>
                                {Array(6).fill(null).map((_, j) => (
                                    <span key={j} style={{
                                        fontSize: 'clamp(40px, 8vw, 100px)',
                                        fontWeight: 900,
                                        letterSpacing: '-0.04em',
                                        color: line.color,
                                        padding: '0 24px',
                                        lineHeight: 1.1,
                                    }}>{line.text}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tiles overlay */}
                <div style={{ position: 'absolute', inset: 0 }}>
                    {tiles}
                </div>
            </div>
        </div>
    );
}
