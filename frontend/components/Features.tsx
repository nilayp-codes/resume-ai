'use client';

import { Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Sparkles,
        title: 'AI Resume Writing',
        description: 'Our AI suggests impactful bullet points and improves your wording to make every line count.',
        accent: '#DB4A2B',
    },
    {
        icon: Shield,
        title: 'ATS Optimization',
        description: 'Resumes are tuned to pass applicant tracking systems so your application reaches human reviewers.',
        accent: '#F8A348',
    },
    {
        icon: Zap,
        title: 'Instant Templates',
        description: 'Choose from polished, recruiter-approved templates and generate a job-ready resume in minutes.',
        accent: '#FF89A9',
    },
];

export default function Features() {
    return (
        <section style={{ background: '#E4E2DD', padding: '120px 40px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    style={{ marginBottom: 80 }}
                >
                    <p style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 14, fontWeight: 500,
                        letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                        color: '#DB4A2B', marginBottom: 16,
                    }}>
                        Why ResumeAI
                    </p>
                    <h2 style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 'clamp(36px, 6vw, 72px)',
                        fontWeight: 700, textTransform: 'uppercase' as const,
                        letterSpacing: '-0.04em', lineHeight: 0.9,
                        color: '#1E1E1E', margin: 0,
                    }}>
                        How We Help<br />You Get Interviews
                    </h2>
                </motion.div>

                {/* Feature Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            style={{
                                background: '#D9D6D0',
                                padding: '48px 36px',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'default',
                                transition: 'background 0.3s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1E1E1E'}
                            onMouseLeave={e => e.currentTarget.style.background = '#D9D6D0'}
                        >
                            {/* Number */}
                            <span style={{
                                fontFamily: "'Clash Display', sans-serif",
                                fontSize: 96, fontWeight: 700,
                                position: 'absolute', top: -10, right: 16,
                                opacity: 0.06, lineHeight: 1,
                                color: '#1E1E1E',
                            }}>
                                0{i + 1}
                            </span>

                            {/* Icon */}
                            <div style={{
                                width: 48, height: 48, marginBottom: 32,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <f.icon size={28} color={f.accent} strokeWidth={1.5} />
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontFamily: "'Clash Display', sans-serif",
                                fontSize: 22, fontWeight: 600,
                                textTransform: 'uppercase' as const,
                                letterSpacing: '-0.02em',
                                color: '#1E1E1E',
                                marginBottom: 16,
                                transition: 'color 0.3s ease',
                            }}>
                                {f.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                fontFamily: "'Satoshi', sans-serif",
                                fontSize: 15, lineHeight: 1.7,
                                color: '#444444',
                                margin: 0,
                                transition: 'color 0.3s ease',
                            }}>
                                {f.description}
                            </p>

                            {/* Bottom accent line */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0,
                                width: '100%', height: 3,
                                background: f.accent,
                            }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
