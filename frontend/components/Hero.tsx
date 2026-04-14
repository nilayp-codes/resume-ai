'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeroProps { authed: boolean; }

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const TAGLINES = [
    { line1: 'Build resumes', line2: 'that work.' },
    { line1: 'Land interviews', line2: 'not rejections.' },
    { line1: 'Write smarter', line2: 'with AI.' },
    { line1: 'Stand out', line2: 'get noticed.' },
];

function useLoopingScramble(lines: { line1: string; line2: string }[], cycleDuration = 7000, scrambleSpeed = 60) {
    const [index, setIndex] = useState(0);
    const [display1, setDisplay1] = useState<string[]>([]);
    const [display2, setDisplay2] = useState<string[]>([]);
    const [revealed1, setRevealed1] = useState(0);
    const [revealed2, setRevealed2] = useState(0);
    const [phase, setPhase] = useState<'in1' | 'in2' | 'hold' | 'out'>('in1');

    const line1 = lines[index].line1;
    const line2 = lines[index].line2;

    // Initialize with random chars
    useEffect(() => {
        setDisplay1(line1.split('').map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]));
        setDisplay2(line2.split('').map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]));
        setRevealed1(0);
        setRevealed2(0);
        setPhase('in1');
    }, [index]);

    // Phase: reveal line1
    useEffect(() => {
        if (phase !== 'in1') return;
        const interval = setInterval(() => {
            setRevealed1(prev => {
                if (prev >= line1.length) { clearInterval(interval); setPhase('in2'); return prev; }
                return prev + 1;
            });
        }, scrambleSpeed);
        return () => clearInterval(interval);
    }, [phase, line1, scrambleSpeed]);

    // Phase: reveal line2
    useEffect(() => {
        if (phase !== 'in2') return;
        const interval = setInterval(() => {
            setRevealed2(prev => {
                if (prev >= line2.length) { clearInterval(interval); setPhase('hold'); return prev; }
                return prev + 1;
            });
        }, scrambleSpeed);
        return () => clearInterval(interval);
    }, [phase, line2, scrambleSpeed]);

    // Phase: hold then advance
    useEffect(() => {
        if (phase !== 'hold') return;
        const timeout = setTimeout(() => setPhase('out'), cycleDuration - 3000);
        return () => clearTimeout(timeout);
    }, [phase, cycleDuration]);

    // Phase: scramble out then next
    useEffect(() => {
        if (phase !== 'out') return;
        let count = 0;
        const total = Math.max(line1.length, line2.length);
        const interval = setInterval(() => {
            count++;
            setRevealed1(() => Math.max(0, line1.length - count));
            setRevealed2(() => Math.max(0, line2.length - count));
            if (count >= total) {
                clearInterval(interval);
                setIndex(prev => (prev + 1) % lines.length);
            }
        }, scrambleSpeed);
        return () => clearInterval(interval);
    }, [phase, line1, line2, index]);

    // Keep scrambling unrevealed characters
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplay1(line1.split('').map((c, i) => {
                if (c === ' ') return ' ';
                if (i < revealed1) return c;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }));
            setDisplay2(line2.split('').map((c, i) => {
                if (c === ' ') return ' ';
                if (i < revealed2) return c;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }));
        }, 50);
        return () => clearInterval(interval);
    }, [revealed1, revealed2, line1, line2]);

    return { display1, display2, revealed1, revealed2, line1, line2 };
}

export default function Hero({ authed }: HeroProps) {
    const { display1, display2, revealed1, revealed2 } = useLoopingScramble(TAGLINES);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 300); }, []);

    return (
        <section style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column' as const,
            justifyContent: 'center', padding: '140px 48px 100px',
            position: 'relative', background: '#FAFAF9',
        }}>
            {/* Subtle grid */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)',
                backgroundSize: '80px 80px',
            }} />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
                <p style={{
                    fontSize: 13, fontWeight: 600, letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, color: '#2563EB', marginBottom: 32,
                    opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
                }}>AI-Powered Resume Builder</p>

                <h1 style={{
                    fontSize: 'clamp(48px, 9vw, 120px)', fontWeight: 900,
                    letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: 48,
                }}>
                    <div>
                        {display1.map((char, i) => (
                            <span key={`a${i}`} style={{
                                color: i < revealed1
                                    ? '#0A0A0A'
                                    : '#DC2626',
                                transition: 'color 0.2s ease',
                            }}>{char}</span>
                        ))}
                    </div>
                    <div>
                        {display2.map((char, i) => (
                            <span key={`b${i}`} style={{
                                color: i < revealed2
                                    ? '#0A0A0A'
                                    : '#DC2626',
                                transition: 'color 0.2s ease',
                            }}>{char}</span>
                        ))}
                    </div>
                </h1>

                <div style={{
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                    flexWrap: 'wrap' as const, gap: 32,
                    opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s',
                }}>
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
                </div>
            </div>
        </section>
    );
}
