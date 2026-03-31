'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CTAProps { authed: boolean; }

export default function CTA({ authed }: CTAProps) {
    return (
        <section style={{ background: '#1E1E1E', padding: '120px 40px', position: 'relative', overflow: 'hidden' }}>
            {/* Background year text */}
            <div style={{
                position: 'absolute', bottom: -40, right: 40,
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 'clamp(100px, 20vw, 300px)',
                fontWeight: 700, color: 'rgba(255,255,255,0.03)',
                lineHeight: 1, pointerEvents: 'none',
            }}>
                2026
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                >
                    <p style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 14, fontWeight: 500,
                        letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                        color: '#DB4A2B', marginBottom: 24,
                    }}>
                        Ready?
                    </p>
                    <h2 style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 'clamp(40px, 8vw, 96px)',
                        fontWeight: 700, textTransform: 'uppercase' as const,
                        letterSpacing: '-0.04em', lineHeight: 0.9,
                        color: '#E4E2DD', margin: 0, marginBottom: 48,
                    }}>
                        Land Your<br />Next Role
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 32 }}>
                        <p style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 17, lineHeight: 1.7,
                            color: 'rgba(228,226,221,0.6)',
                            maxWidth: 400, margin: 0,
                        }}>
                            Join thousands of professionals who trust ResumeAI to create resumes that get results.
                        </p>
                        <Link href={authed ? '/create-resume' : '/register'} className="btn-brutalist" style={{ background: '#E4E2DD', color: '#1E1E1E' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                                Get Started Free <ArrowUpRight size={16} strokeWidth={2.5} />
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
