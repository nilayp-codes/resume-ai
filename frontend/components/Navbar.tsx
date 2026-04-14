'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface NavbarProps {
    authed: boolean;
}

export default function Navbar({ authed }: NavbarProps) {
    return (
        <nav style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px' }}>
                {/* Logo */}
                <Link href="/" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#111827', textDecoration: 'none' }}>
                    ResumeAI
                </Link>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {authed ? (
                        <>
                            <Link href="/dashboard" style={{ fontSize: 15, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
                                Dashboard
                            </Link>
                            <Link href="/create-resume" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '10px 20px', background: '#111827', color: '#ffffff',
                                fontSize: 15, fontWeight: 600, borderRadius: 8,
                                textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                            }}>
                                Create Resume <ArrowRight size={15} strokeWidth={2} />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" style={{ fontSize: 15, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
                                Login
                            </Link>
                            <Link href="/register" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '10px 20px', background: '#111827', color: '#ffffff',
                                fontSize: 15, fontWeight: 600, borderRadius: 8,
                                textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                            }}>
                                Get Started <ArrowRight size={15} strokeWidth={2} />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
