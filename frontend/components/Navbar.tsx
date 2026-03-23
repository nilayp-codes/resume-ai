'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface NavbarProps {
    authed: boolean;
}

export default function Navbar({ authed }: NavbarProps) {
    return (
        <nav style={{
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px' }}>
                <Link href="/" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#111827', textDecoration: 'none' }}>
                    ResumeAI
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {authed ? (
                        <>
                            <Link href="/dashboard" style={{
                                fontSize: 15, color: '#6b7280', textDecoration: 'none', fontWeight: 500,
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                            >
                                Dashboard
                            </Link>
                            <Link href="/create-resume" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                color: '#ffffff',
                                fontSize: 15, fontWeight: 600, borderRadius: 10,
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'; }}
                            >
                                Create Resume <ArrowRight size={15} strokeWidth={2.5} />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" style={{
                                fontSize: 15, color: '#6b7280', textDecoration: 'none', fontWeight: 500,
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                            >
                                Login
                            </Link>
                            <Link href="/register" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                color: '#ffffff',
                                fontSize: 15, fontWeight: 600, borderRadius: 10,
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'; }}
                            >
                                Get Started <ArrowRight size={15} strokeWidth={2.5} />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
