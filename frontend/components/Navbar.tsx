'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
    authed: boolean;
}

export default function Navbar({ authed }: NavbarProps) {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
            mixBlendMode: 'difference' as const,
        }}>
            {/* Logo */}
            <Link href="/" style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                color: '#ffffff',
                textDecoration: 'none',
            }}>
                ResumeAI
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                {authed ? (
                    <>
                        <Link href="/dashboard" style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
                            color: '#ffffff',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            Dashboard
                        </Link>
                        <Link href="/create-resume" className="btn-brutalist" style={{
                            padding: '12px 24px',
                            fontSize: 13,
                            mixBlendMode: 'normal' as const,
                            background: '#E4E2DD',
                            color: '#1E1E1E',
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
                                Create Resume <ArrowUpRight size={14} strokeWidth={2.5} />
                            </span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
                            color: '#ffffff',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            Login
                        </Link>
                        <Link href="/register" className="btn-brutalist" style={{
                            padding: '12px 24px',
                            fontSize: 13,
                            mixBlendMode: 'normal' as const,
                            background: '#E4E2DD',
                            color: '#1E1E1E',
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
                                Get Started <ArrowUpRight size={14} strokeWidth={2.5} />
                            </span>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
