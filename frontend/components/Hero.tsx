'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps { authed: boolean; }

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function ScrambleText({ text, progress }: { text: string; progress: number }) {
    const [display, setDisplay] = useState(text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]));

    useEffect(() => {
        const revealed = Math.floor(progress * text.length);
        setDisplay(text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealed) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
        }));
    }, [progress, text]);

    return (
        <span style={{ fontFamily: 'monospace' }}>
            {display.map((char, i) => (
                <span key={i} style={{
                    color: i < Math.floor(progress * text.length) ? '#0A0A0A' : '#D4D4D4',
                    transition: 'color 0.1s',
                }}>{char}</span>
            ))}
        </span>
    );
}

export default function Hero({ authed }: HeroProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const scrambleProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const unsubscribe = scrambleProgress.on('change', (v) => setProgress(v));
        return unsubscribe;
    }, [scrambleProgress]);

    return (
        <motion.section ref={ref} style={{ opacity, minHeight: '200vh', position: 'relative' }}>
            <div style={{
                position: 'sticky', top: 0, height: '100vh',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0 48px', maxWidth: 1400, margin: '0 auto',
            }}>
                {/* Subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <p style={{
                        fontSize: 13, fontWeight: 600, letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const, color: '#2563EB', marginBottom: 32,
                    }}>AI-Powered Resume Builder</p>

                    <h1 style={{
                        fontSize: 'clamp(48px, 9vw, 120px)', fontWeight: 900,
                        letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: 48,
                    }}>
                        <ScrambleText text="Build resumes" progress={progress} /><br />
                        <span style={{ color: '#2563EB' }}>
                            <ScrambleText text="that work." progress={Math.max(0, (progress - 0.5) * 2)} />
                        </span>
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 32 }}>
                        <p style={{ fontSize: 17, lineHeight: 1.7, color: '#6B7280', maxWidth: 440 }}>
                            Professional, ATS-friendly resumes crafted in minutes. AI writing. Live preview. One-click PDF.
                        </p>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <Link href={authed ? '/create-resume' : '/register'} style={{
                                padding: '16px 36px', background: '#0A0A0A', color: '#FAFAF9',
                                fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
                                textTransform: 'uppercase' as const, textDecoration: 'none', borderRadius: 2,
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                            }}>Start Building →</Link>
                            <Link href={authed ? '/dashboard' : '/login'} style={{
                                fontSize: 14, fontWeight: 500, color: '#2563EB', textDecoration: 'none',
                            }}>View Templates</Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
