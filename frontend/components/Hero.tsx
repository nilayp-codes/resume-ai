'use client';

import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

interface HeroProps {
    authed: boolean;
}

export default function Hero({ authed }: HeroProps) {
    const { scrollY } = useScroll();
    const mockupY = useTransform(scrollY, [0, 500], [0, 100]); // Parallax scroll slower than main scroll

    return (
        <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 100px', background: '#ffffff' }}>
            <AnimatedBackground />

            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, position: 'relative', zIndex: 10, flexWrap: 'wrap' as const }}>
                {/* Left side text */}
                <div style={{ flex: 1 }}>
                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        style={{
                            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.03em',
                            lineHeight: 1.1, color: '#111827', margin: 0,
                        }}
                    >
                        Build a resume that gets you{' '}
                        <span style={{
                            background: 'linear-gradient(90deg, #6366f1, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>hired.</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        style={{
                            marginTop: 24, fontSize: 18, lineHeight: 1.7,
                            color: '#6b7280', maxWidth: 540,
                        }}
                    >
                        Professional, ATS-friendly resumes built in minutes with modern
                        templates and advanced AI-powered writing assistance.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}
                    >
                        <Link href={authed ? '/create-resume' : '/register'} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '16px 32px', background: '#2563eb', color: '#ffffff',
                            fontSize: 15, fontWeight: 600, borderRadius: 12,
                            textDecoration: 'none', boxShadow: '0 10px 30px rgba(37,99,235,0.2)',
                            transition: 'all 0.2s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(37,99,235,0.3)';
                                e.currentTarget.style.background = '#1d4ed8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(37,99,235,0.2)';
                                e.currentTarget.style.background = '#2563eb';
                            }}
                        >
                            Create Your Resume <ArrowRight size={16} strokeWidth={2.5} />
                        </Link>
                        <Link href={authed ? '/dashboard' : '/login'} style={{
                            display: 'inline-flex', alignItems: 'center',
                            padding: '16px 32px', border: '1px solid #e5e7eb',
                            color: '#374151', fontSize: 15, fontWeight: 600,
                            borderRadius: 12, textDecoration: 'none', background: '#ffffff',
                            transition: 'all 0.2s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            View Dashboard
                        </Link>
                    </motion.div>
                </div>

                {/* Right side floating mockup */}
                <motion.div
                    style={{ flex: '1 1 400px', minWidth: 300, y: mockupY }}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            padding: '32px',
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '16px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                        }}>
                        <div style={{ paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Amanda Jones</div>
                            <div style={{ fontSize: 15, color: '#3b82f6', fontWeight: 500 }}>Product Designer</div>
                        </div>
                        <div style={{ paddingTop: 24 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Experience</div>
                            <div style={{ marginBottom: 6, fontWeight: 600, color: '#111827', fontSize: 14 }}>Senior Product Designer — Stripe</div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 24 }}>
                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#8b5cf6', marginTop: 8 }} />
                                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>Increased conversion by 23% through streamlined onboarding flows.</div>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Skills</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {['Figma', 'Product Strategy', 'User Research', 'Prototyping'].map(skill => (
                                    <div key={skill} style={{ padding: '4px 10px', background: '#f3f4f6', borderRadius: 20, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <motion.div
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                                transform: 'skewX(-20deg)', pointerEvents: 'none',
                            }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
