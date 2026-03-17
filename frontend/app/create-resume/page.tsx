'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import TemplateCard from '@/components/templates/TemplateCard';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import type { ResumeData } from '@/lib/types';

// ─── Mock data used for all template thumbnails ──────────────────────────────
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
            start_date: '2021', end_date: 'Present', current: true,
            description: '',
            bullets: ['Led rebranding for 12 enterprise clients', 'Increased social media engagement by 45%', 'Mentored 3 junior designers'],
        },
        {
            id: '2', company: 'Createscape Agency', position: 'Graphic Designer',
            start_date: '2018', end_date: '2021', current: false,
            description: '',
            bullets: ['Designed 50+ brand identity packages', 'Collaborated with marketing on campaigns'],
        },
    ],
    education: {
        school10: null,
        school12: null,
        college: {
            college_name: 'School of Visual Arts',
            degree: 'B.F.A.',
            field_of_study: 'Graphic Design',
            start_date: '2014',
            end_date: '2018',
            gpa: '3.9',
        },
    },
    projects: [
        {
            id: '1', name: 'BrandKit Pro', description: 'Open-source branding toolkit',
            tech_stack: 'Figma, React', url: '', github: '',
            bullets: ['Built component library with 50+ tokens'],
        },
    ],
    skills: {
        technical: ['Photoshop', 'Illustrator', 'Figma', 'InDesign'],
        soft: ['Leadership', 'Communication'],
        languages: ['English', 'Spanish'],
        tools: ['After Effects', 'Sketch'],
    },
    certifications: [
        { id: '1', name: 'Adobe Certified Expert', issuer: 'Adobe', date: '2022', url: '' },
        { id: '2', name: 'Google UX Design', issuer: 'Google', date: '2021', url: '' },
    ],
};

import { TEMPLATES } from '@/lib/templates';

export default function TemplateSelectionPage() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) { router.replace('/login'); }
    }, []);

    const handleSelect = (id: string) => {
        router.push(`/create-resume/form?template=${id}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navbar */}
            <nav style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ fontSize: 20, fontWeight: 700, color: '#111827', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                        ResumeAI
                    </Link>
                    <Link href="/dashboard" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
                        ← Back to Dashboard
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 96px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center' as const, marginBottom: 56 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
                        Step 1 of 3
                    </p>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.1 }}>
                        Choose your template
                    </h1>
                    <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                        Start with a professionally designed layout. You can always customize it later.
                    </p>
                </div>

                {/* Template Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    justifyContent: 'center',
                    gap: 24,
                    maxWidth: 1000,
                    margin: '0 auto',
                }}>
                    {TEMPLATES.map(t => (
                        <div
                            key={t.id}
                            style={{
                                width: 220,
                                height: 280,
                                margin: '0 auto',
                                borderRadius: 16,
                                background: '#ffffff',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
                            }}
                            onClick={() => handleSelect(t.id)}
                        >
                            <div style={{ flex: 1, padding: 12, background: tplBg(t.id), overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                                <div style={{ transform: 'scale(0.25)', transformOrigin: 'top center', width: '400%', pointerEvents: 'none' }}>
                                    <TemplateRenderer template={t.id} data={MOCK_DATA} colorTheme="blue" fontFamily="inter" />
                                </div>
                            </div>
                            <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0, textAlign: 'center' }}>
                                    {t.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper for soft background matching the template accent
function tplBg(id: string) {
    if(id === 'executive') return '#f5f3ff';
    if(id === 'classic') return '#ecfdf5';
    if(id === 'minimal') return '#e0e7ff';
    return '#eff6ff';
}
