'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
    authed: boolean;
}

export default function Hero({ authed }: HeroProps) {
    return (
        <section style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: '#E4E2DD',
            padding: '140px 40px 100px',
        }}>
            {/* Animated Gradient Blobs */}
            <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5], x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', top: '-10%', right: '-5%',
                    width: '60vw', height: '60vw',
                    background: '#DB4A2B', borderRadius: '50%',
                    filter: 'blur(140px)', mixBlendMode: 'multiply' as const,
                    opacity: 0.6, pointerEvents: 'none',
                }}
            />
            <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4], x: [0, -20, 0], y: [0, 30, 0] }}
                transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', bottom: '-20%', left: '-10%',
                    width: '50vw', height: '50vw',
                    background: '#F8A348', borderRadius: '50%',
                    filter: 'blur(140px)', mixBlendMode: 'multiply' as const,
                    opacity: 0.5, pointerEvents: 'none',
                }}
            />
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', top: '30%', left: '40%',
                    width: '40vw', height: '40vw',
                    background: '#FF89A9', borderRadius: '50%',
                    filter: 'blur(160px)', mixBlendMode: 'multiply' as const,
                    opacity: 0.3, pointerEvents: 'none',
                }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
                {/* Overline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase' as const,
                        color: '#DB4A2B',
                        marginBottom: 24,
                    }}
                >
                    AI-Powered Resume Builder
                </motion.p>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 'clamp(60px, 14vw, 180px)',
                        fontWeight: 700,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '-0.05em',
                        lineHeight: 0.85,
                        color: '#1E1E1E',
                        margin: 0,
                    }}
                >
                    Build<br />
                    <span style={{ paddingLeft: 'clamp(40px, 12vw, 200px)', display: 'block' }}>
                        Resumes
                    </span>
                </motion.h1>

                {/* Subtitle + CTA Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginTop: 48,
                        flexWrap: 'wrap' as const,
                        gap: 32,
                    }}
                >
                    <p style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 18,
                        lineHeight: 1.7,
                        color: '#444444',
                        maxWidth: 420,
                        margin: 0,
                    }}>
                        Professional, ATS-friendly resumes crafted in minutes with
                        modern templates and AI-powered writing assistance.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <Link href={authed ? '/create-resume' : '/register'} className="btn-brutalist">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                                Start Building <ArrowUpRight size={16} strokeWidth={2.5} />
                            </span>
                        </Link>
                        <Link href={authed ? '/dashboard' : '/login'} style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#DB4A2B',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            letterSpacing: '0.05em',
                            transition: 'opacity 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            View Dashboard <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
