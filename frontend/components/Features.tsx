'use client';

import { Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Sparkles,
        title: 'AI Resume Writing',
        description: 'Our AI suggests impactful bullet points and improves your wording to make every line count.',
        color: '#8b5cf6', // Purple
        bg: '#f3e8ff',
    },
    {
        icon: Shield,
        title: 'ATS Optimization',
        description: 'Resumes are tuned to pass applicant tracking systems so your application reaches human reviewers.',
        color: '#22c55e', // Green
        bg: '#dcfce7',
    },
    {
        icon: Zap,
        title: 'Instant Professional Templates',
        description: 'Choose from polished, recruiter-approved templates and generate a job-ready resume in minutes.',
        color: '#3b82f6', // Blue
        bg: '#dbeafe',
    },
];

export default function Features() {
    return (
        <section style={{ background: '#ffffff', padding: '100px 24px' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: false, margin: "-100px" }}
                    style={{ textAlign: 'center' as const, marginBottom: 56 }}
                >
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Why ResumeAI</p>
                    <h2 style={{
                        fontSize: 40, fontWeight: 800, color: '#111827',
                        letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0,
                    }}>
                        How ResumeAI Helps You Get Interviews
                    </h2>
                    <p style={{ fontSize: 17, color: '#6b7280', marginTop: 12, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
                        Every feature is designed to maximize your chances of landing the job.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
                            viewport={{ once: false, margin: "-100px" }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: 16, padding: 32,
                                textAlign: 'center' as const,
                                border: '1px solid rgba(0,0,0,0.04)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                                e.currentTarget.style.boxShadow = `0 20px 40px -10px ${f.color}20`;
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = `${f.color}40`;
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)';
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: 56, height: 56, borderRadius: 16,
                                background: f.bg, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 24px',
                                transition: 'transform 0.3s ease',
                            }}>
                                <f.icon size={28} color={f.color} strokeWidth={2} />
                            </div>

                            {/* Title */}
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                                {f.title}
                            </h3>

                            {/* Description */}
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
