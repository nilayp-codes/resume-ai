'use client';

import { motion } from 'framer-motion';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import type { ResumeData } from '@/lib/types';

const MOCK_DATA: ResumeData = {
    basic_info: {
        full_name: 'Amanda Jones',
        email: 'amanda@email.com',
        phone: '(555) 012-3456',
        location: 'Elmhurst, NY',
        linkedin: 'linkedin.com/in/amandajones',
        github: 'github.com/amandajones',
        website: '',
        job_title: 'Graphic Designer',
    },
    summary: 'Creative graphic designer with 6+ years of experience in branding, digital design, and print media. Skilled in Adobe Creative Suite, Figma, and modern design systems.',
    experience: [
        {
            id: '1', company: 'Pixel Studios', position: 'Senior Graphic Designer',
            start_date: '2021', end_date: 'Present', current: true, description: '',
            bullets: ['Led rebranding for 12 enterprise clients', 'Increased social media engagement by 45%', 'Mentored 3 junior designers'],
        },
        {
            id: '2', company: 'Createscape Agency', position: 'Graphic Designer',
            start_date: '2018', end_date: '2021', current: false, description: '',
            bullets: ['Designed 50+ brand identity packages', 'Collaborated with marketing on campaigns'],
        },
    ],
    education: {
        school10: null, school12: null,
        college: { college_name: 'School of Visual Arts', degree: 'B.F.A.', field_of_study: 'Graphic Design', start_date: '2014', end_date: '2018', gpa: '3.9' },
    },
    projects: [
        { id: '1', name: 'BrandKit Pro', description: 'Open-source branding toolkit', tech_stack: 'Figma, React', url: '', github: '', bullets: ['Built component library with 50+ tokens'] },
    ],
    skills: { technical: ['Photoshop', 'Illustrator', 'Figma', 'InDesign'], soft: ['Leadership', 'Communication'], languages: ['English', 'Spanish'], tools: ['After Effects', 'Sketch'] },
    certifications: [
        { id: '1', name: 'Adobe Certified Expert', issuer: 'Adobe', date: '2022', url: '' },
    ],
};

const TEMPLATES = [
    { id: 'modern', name: 'Modern Clean', description: 'Bold header with blue accent. Clean single-column layout.', bg: '#eff6ff' },
    { id: 'executive', name: 'Executive Dark', description: 'Premium dark sidebar with photo support.', bg: '#f5f3ff' },
    { id: 'classic', name: 'Classic Corporate', description: 'Timeless serif typography with strong dividers.', bg: '#ecfdf5' },
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple with maximum readability.', bg: '#e0e7ff' },
];

export default function TemplatesShowcase() {
    return (
        <section style={{ padding: '100px 24px', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: false, margin: "-100px" }}
                    style={{ textAlign: 'center', marginBottom: 56 }}
                >
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        Professional Templates
                    </p>
                    <h2 style={{ fontSize: 40, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
                        A template for every career
                    </h2>
                    <p style={{ fontSize: 17, color: '#6b7280', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
                        Beautifully crafted designs that pass ATS systems and impress humans.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                    {TEMPLATES.map((tpl, i) => (
                        <motion.div
                            key={tpl.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                            viewport={{ once: false, margin: "-100px" }}
                            style={{
                                borderRadius: 16, background: '#ffffff', overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
                            }}
                        >
                            <div style={{
                                padding: 16, background: tpl.bg, overflow: 'hidden',
                                display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
                                height: 280,
                            }}>
                                <div style={{ transform: 'scale(0.28)', transformOrigin: 'top center', width: '360%', pointerEvents: 'none' }}>
                                    <TemplateRenderer template={tpl.id} data={MOCK_DATA} colorTheme="blue" fontFamily="inter" />
                                </div>
                            </div>
                            <div style={{ padding: '20px 20px 24px', borderTop: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, textAlign: 'center' }}>{tpl.name}</h3>
                                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>{tpl.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
