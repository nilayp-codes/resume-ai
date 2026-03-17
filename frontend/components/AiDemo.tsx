'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AiDemo() {
    const originalText = "Managed a team";
    const improvedText = "Led a cross-functional team of 6 engineers delivering scalable web applications.";

    const [isImproved, setIsImproved] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsImproved(prev => !prev);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section style={{ padding: '100px 24px', background: '#f8fafc' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>
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
                        AI Helps You Write Better Resumes
                    </h2>
                    <p style={{ fontSize: 17, color: '#6b7280', marginTop: 12 }}>
                        Transform ordinary bullet points into achievement-driven statements.
                    </p>
                </motion.div>

                <div style={{
                    display: 'flex', flexDirection: 'column' as const,
                    gap: 24, alignItems: 'center', justifyContent: 'center'
                }}>
                    {/* Before/After Box */}
                    <div style={{
                        background: '#ffffff', borderRadius: 24, padding: 40,
                        width: '100%', maxWidth: 700, boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        border: '1px solid #e5e7eb',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        {/* Decorative Gradient Blob */}
                        <div style={{
                            position: 'absolute', top: -50, right: -50,
                            width: 150, height: 150, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            filter: 'blur(60px)', opacity: 0.2, borderRadius: '50%'
                        }} />

                        <div style={{ position: 'relative', minHeight: 120 }}>
                            {/* Original Text (typing effect simplified via framer motion) */}
                            <motion.div
                                animate={{ opacity: isImproved ? 0.3 : 1, y: isImproved ? -10 : 0 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    fontSize: 18, color: '#4b5563', fontFamily: 'monospace',
                                    display: 'flex', alignItems: 'center', gap: 12
                                }}
                            >
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9ca3af' }} />
                                {originalText.split('').map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: isImproved ? 1 : 1 }}
                                        transition={{ duration: 0.05, delay: isImproved ? 0 : index * 0.05 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.div>

                            {/* Magic Wand Icon */}
                            <motion.div
                                animate={{ scale: isImproved ? 1 : 0.8, opacity: isImproved ? 1 : 0.5 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    margin: '20px 0',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    color: '#8b5cf6'
                                }}
                            >
                                <Sparkles size={20} />
                                <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, #e5e7eb, #8b5cf6, #e5e7eb)' }} />
                            </motion.div>

                            {/* Improved Text */}
                            <motion.div
                                animate={{ opacity: isImproved ? 1 : 0, y: isImproved ? 0 : 10 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    fontSize: 20, color: '#111827', fontWeight: 500,
                                    lineHeight: 1.6, borderLeft: '4px solid #2563eb', paddingLeft: 16
                                }}
                            >
                                {improvedText}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
