'use client';

import Link from 'next/link';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps { authed: boolean; }

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

const TAGLINES = [
    { line1: 'Build resumes', line2: 'that work.' },
    { line1: 'Land interviews', line2: 'not rejections.' },
    { line1: 'Write smarter', line2: 'with AI.' },
    { line1: 'Stand out', line2: 'get hired.' },
];

function useLoopingScramble(texts: string[], cycleDuration: number = 6000, scrambleDuration: number = 2000) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [display, setDisplay] = useState<string[]>([]);
    const [phase, setPhase] = useState<'showing' | 'scrambling-out' | 'scrambling-in'>('scrambling-in');

    const currentText = texts[currentIndex];

    useEffect(() => {
        setDisplay(currentText.split('').map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]));
        setPhase('scrambling-in');
    }, [currentIndex]);

    // Scramble in: reveal characters one by one
    useEffect(() => {
        if (phase !== 'scrambling-in') return;
        let revealed = 0;
        const totalChars = currentText.length;
        const charInterval = scrambleDuration / totalChars;

        const revealInterval = setInterval(() => {
            revealed++;
            setDisplay(currentText.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (i < revealed) return char;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }));
            if (revealed >= totalChars) {
                clearInterval(revealInterval);
                setPhase('showing');
            }
        }, charInterval);

        // Keep scrambling unrevealed chars
        const scrambleInterval = setInterval(() => {
            setDisplay(prev => prev.map((char, i) => {
                if (currentText[i] === ' ') return ' ';
                if (i < revealed) return currentText[i];
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }));
        }, 50);

        return () => { clearInterval(revealInterval); clearInterval(scrambleInterval); };
    }, [phase, currentText, scrambleDuration]);

    // Show phase: wait then start scrambling out
    useEffect(() => {
        if (phase !== 'showing') return;
        const timeout = setTimeout(() => setPhase('scrambling-out'), cycleDuration - scrambleDuration * 2);
        return () => clearTimeout(timeout);
    }, [phase, cycleDuration, scrambleDuration]);

    // Scramble out: replace characters with random ones
    useEffect(() => {
        if (phase !== 'scrambling-out') return;
        let scrambled = 0;
        const totalChars = currentText.length;
        const charInterval = scrambleDuration / totalChars;

        const outInterval = setInterval(() => {
            scrambled++;
            setDisplay(currentText.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (i < scrambled) return CHARS[Math.floor(Math.random() * CHARS.length)];
                return char;
            }));
            if (scrambled >= totalChars) {
                clearInterval(outInterval);
                setCurrentIndex(prev => (prev + 1) % texts.length);
            }
        }, charInterval);

        const scrambleInterval = setInterval(() => {
            setDisplay(prev => prev.map((char, i) => {
                if (currentText[i] === ' ') return ' ';
                if (i < scrambled) return CHARS[Math.floor(Math.random() * CHARS.length)];
                return char;
            }));
        }, 50);

        return () => { clearInterval(outInterval); clearInterval(scrambleInterval); };
    }, [phase, currentText, scrambleDuration, currentIndex]);

    return { display, phase, currentIndex };
}

function ScrambleDisplay({ texts1, texts2 }: { texts1: string[]; texts2: string[] }) {
    const { display: display1, phase, currentIndex } = useLoopingScramble(texts1, 7000, 1800);
    const { display: display2 } = useLoopingScramble(texts2, 7000, 1800);

    return (
        <>
            <div>
                {display1.map((char, i) => (
                    <span key={`l1-${i}`} style={{
                        color: char === texts1[currentIndex]?.[i] ? '#DC2626' : 'rgba(220,38,38,0.3)',
                        transition: 'color 0.15s ease',
                    }}>{char}</span>
                ))}
            </div>
            <div>
                {display2.map((char, i) => (
                    <span key={`l2-${i}`} style={{
                        color: char === texts2[currentIndex]?.[i] ? '#0A0A0A' : 'rgba(10,10,10,0.2)',
                        transition: 'color 0.15s ease',
                    }}>{char}</span>
                ))}
            </div>
        </>
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
                        <ScrambleDisplay
                            texts1={TAGLINES.map(t => t.line1)}
                            texts2={TAGLINES.map(t => t.line2)}
                        />
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
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
                                fontSize: 14, fontWeight: 500, color: '#DC2626', textDecoration: 'none',
                            }}>View Templates</Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
