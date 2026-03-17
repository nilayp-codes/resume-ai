'use client';

import { Layout, Edit3, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: Layout,
        number: '01',
        title: 'Choose a Template',
        description: 'Pick from professionally designed, ATS-friendly templates crafted to impress recruiters.',
    },
    {
        icon: Edit3,
        number: '02',
        title: 'Fill in Your Details',
        description: 'Enter your experience, skills, and education. Our AI helps you write stronger bullet points.',
    },
    {
        icon: Download,
        number: '03',
        title: 'Download Your Resume',
        description: 'Export a pixel-perfect PDF ready for any job application — all in under 5 minutes.',
    },
];

export default function Workflow() {
    return (
        <section style={{ background: '#f8fafc', padding: '100px 24px' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: false, margin: "-100px" }}
                    style={{ textAlign: 'center' as const, marginBottom: 56 }}
                >
                    <h2 style={{
                        fontSize: 36, fontWeight: 800, color: '#111827',
                        letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0,
                    }}>
                        Create Your Resume in 3 Simple Steps
                    </h2>
                    <p style={{ fontSize: 17, color: '#6b7280', marginTop: 12 }}>
                        From blank page to polished resume — fast and effortless.
                    </p>
                </motion.div>

                {/* Step Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                            viewport={{ once: false, margin: "-100px" }}
                            style={{
                                display: 'flex', flexDirection: 'column' as const, gap: 12,
                                padding: 32, borderRadius: 16, background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                                e.currentTarget.style.borderColor = '#d1d5db';
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            {/* Step number + icon */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: '#eff6ff', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <step.icon size={22} color="#2563eb" strokeWidth={1.8} />
                                </div>
                                <span style={{
                                    fontSize: 13, fontWeight: 700, color: '#2563eb',
                                    letterSpacing: '0.05em',
                                }}>
                                    STEP {step.number}
                                </span>
                            </div>

                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>
                                {step.title}
                            </h3>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
