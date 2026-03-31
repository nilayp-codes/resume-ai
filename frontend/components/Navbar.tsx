'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavbarProps { authed: boolean; }

export default function Navbar({ authed }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '16px 48px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: scrolled ? 'rgba(250,250,249,0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(10,10,10,0.06)' : 'none',
            transition: 'all 0.3s ease',
        }}>
            <Link href="/" style={{
                fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em',
                color: '#0A0A0A', textDecoration: 'none',
            }}>ResumeAI</Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                {authed ? (
                    <>
                        <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Dashboard</Link>
                        <Link href="/create-resume" style={{
                            fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                            color: '#FAFAF9', background: '#0A0A0A', padding: '10px 24px',
                            textDecoration: 'none', borderRadius: 2,
                        }}>Create Resume →</Link>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Login</Link>
                        <Link href="/register" style={{
                            fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                            color: '#FAFAF9', background: '#0A0A0A', padding: '10px 24px',
                            textDecoration: 'none', borderRadius: 2,
                        }}>Get Started →</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
