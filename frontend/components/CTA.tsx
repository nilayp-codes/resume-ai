'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CTAProps {
    authed: boolean;
}

export default function CTA({ authed }: CTAProps) {
    return (
        <section style={{ padding: '80px 24px', background: '#ffffff' }}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, margin: "-100px" }}
                style={{
                    maxWidth: 760, margin: '0 auto', textAlign: 'center' as const,
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                    borderRadius: 24, padding: '80px 48px',
                    boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
                    position: 'relative', overflow: 'hidden',
                }}
            >
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 400, height: 400, background: '#2563eb', filter: 'blur(100px)', opacity: 0.2,
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: -50, right: -50,
                    width: 300, height: 300, background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{
                        fontSize: 40, fontWeight: 800, color: '#ffffff',
                        letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0,
                    }}>
                        Ready to land your next role?
                    </h2>
                    <p style={{
                        fontSize: 18, color: 'rgba(255,255,255,0.7)', marginTop: 16, lineHeight: 1.6,
                        maxWidth: 480, margin: '16px auto 0'
                    }}>
                        Join thousands of professionals who trust ResumeAI
                        to create resumes that get results.
                    </p>
                    <Link href={authed ? '/create-resume' : '/register'} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        marginTop: 40, padding: '18px 40px', background: '#ffffff', color: '#111827',
                        fontSize: 16, fontWeight: 700, borderRadius: 12,
                        textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        }}
                    >
                        Get Started Free <ArrowRight size={18} strokeWidth={2.5} color="#2563eb" />
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
