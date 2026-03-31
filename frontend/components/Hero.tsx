'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps { authed: boolean; }

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function AutoScrambleText({ text, color = '#0A0A0A', delay = 0 }: { text: string; color?: string; delay?: number }) {
    const [display, setDisplay] = useState<string[]>(text.split('').map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]));
    const [revealed, setRevealed] = useState(0);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                setRevealed(prev => {
                    if (prev >= text.length) { clearInterval(interval); return prev; }
                    return prev + 1;
                });
            }, 60);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [text, delay]);

    useEffect(() => {
        const scrambleInterval = setInterval(() => {
            setDisplay(text.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (i < revealed) return char;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }));
        }, 40);
        return () => clearInterval(scrambleInterval);
    }, [revealed, text]);

    return (
        <span>
            {display.map((char, i) => (
                <span key={i} style={{
                    color: i < revealed ? color : '#D4D4D4',
                    transition: 'color 0.15s ease',
                }}>{char}</span>
            ))}
        </span>
    );
}

export default function Hero({ authed }: HeroProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
    const y = useTransform(scrollYProgress, [0.5, 1], [0, -100]);

    return (
        <section ref={ref} style={{ minHeight: '150vh', position: 'relative' }}>
            <motion.div style={{
                opacity, y,
                position: 'sticky', top: 0, height: '100vh',
                display: 'flex', flexDirection: 'column' as const, justifyContent: 'center',
                padding: '0 48px', maxWidth: 1400, margin: '0 auto',
            }}>
                {/* Subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 13, fontWeight: 600, letterSpacing: '0.2em',
                            textTransform: 'uppercase' as const, color: '#2563EB', marginBottom: 32,
                        }}
                    >AI-Powered Resume Builder</motion.p>

                    <h1 style={{
                        fontSize: 'clamp(48px, 9vw, 120px)', fontWeight: 900,
                        letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: 48,
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        <AutoScrambleText text="Build resumes" color="#0A0A0A" delay={500} /><br />
                        <AutoScrambleText text="that work." color="#2563EB" delay={1200} />
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.5 }}
                        style={{
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                            flexWrap: 'wrap' as const, gap: 32,
                        }}
                    >
                        <p style={{ fontSize: 17, lineHeight: 1.7, color: '#6B7280', maxWidth: 440 }}>
                            Professional, ATS-friendly resumes crafted in minutes.
                            AI writing. Live preview. One-click PDF.
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
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
