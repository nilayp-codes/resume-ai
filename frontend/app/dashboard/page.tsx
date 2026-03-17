'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    FileText, Plus, LogOut, Trash2, Edit, Download,
    Clock, User, Sparkles
} from 'lucide-react';
import { resumeApi } from '@/lib/api';
import { clearToken, getStoredUser, isAuthenticated } from '@/lib/auth';
import { formatDate, extractApiError } from '@/lib/utils';
import type { Resume } from '@/lib/types';
import BackgroundGlow from '@/components/BackgroundGlow';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const TEMPLATE_LABELS: Record<string, string> = { modern: 'Modern', sidebar: 'Sidebar', executive: 'Executive' };
const THEME_COLORS: Record<string, string> = { blue: '#2563eb', gray: '#4b5563', black: '#111827', green: '#059669', purple: '#7c3aed' };

// Motion Variants for Staggered Load
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};
function ResumeCard({ 
    resume, 
    onDelete, 
    onDownload, 
    isDeleting, 
    isDownloading 
}: { 
    resume: Resume; 
    onDelete: (id: string, title: string) => void;
    onDownload: (resume: Resume) => void;
    isDeleting: boolean;
    isDownloading: boolean;
}) {
    return (
        <div style={{
            borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', padding: 20,
            background: '#ffffff', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            height: '100%',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: THEME_COLORS[resume.color_theme] || '#2563eb' }} />
                    <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        {TEMPLATE_LABELS[resume.template_type] || resume.template_type || 'Modern'}
                    </span>
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {formatDate(resume.updated_at)}
                </span>
            </div>
            
            {/* Fallback Preview Thumbnail Area */}
            <div style={{ width: '100%', height: 140, background: '#f8fafc', borderRadius: 8, marginBottom: 16, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '140%', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginTop: 12, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                    <div style={{ padding: '8px' }}>
                        <div style={{ width: '40%', height: 6, background: '#e2e8f0', borderRadius: 2, marginBottom: 12 }} />
                        <div style={{ width: '100%', height: 4, background: '#f1f5f9', borderRadius: 2, marginBottom: 6 }} />
                        <div style={{ width: '90%', height: 4, background: '#f1f5f9', borderRadius: 2, marginBottom: 6 }} />
                        <div style={{ width: '95%', height: 4, background: '#f1f5f9', borderRadius: 2, marginBottom: 12 }} />
                        <div style={{ width: '30%', height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 6 }} />
                        <div style={{ width: '100%', height: 4, background: '#f1f5f9', borderRadius: 2, marginBottom: 6 }} />
                    </div>
                </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {resume.title || 'Untitled Resume'}
            </h3>
            <p style={{ fontSize: 14, color: '#374151', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {resume?.resume_data?.basic_info?.full_name || 'No Name Set'}
            </p>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {resume?.resume_data?.basic_info?.job_title || 'No Job Title'}
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href={`/create-resume/form?template=${resume.template_type || 'modern'}&id=${resume.id}`} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 0', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8,
                    fontSize: 13, fontWeight: 500, color: '#374151', textDecoration: 'none',
                    background: '#f8fafc', transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                >
                    <Edit size={14} /> Edit
                </Link>
                <button onClick={() => onDownload(resume)} disabled={isDownloading} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 0', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 500, color: '#ffffff', background: '#3b82f6',
                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                    opacity: isDownloading ? 0.5 : 1, transition: 'background 0.2s',
                }}
                    onMouseEnter={e => { if(!isDownloading) e.currentTarget.style.background = '#2563eb' }}
                    onMouseLeave={e => { if(!isDownloading) e.currentTarget.style.background = '#3b82f6' }}
                >
                    <Download size={14} /> {isDownloading ? '...' : 'PDF'}
                </button>
                <button onClick={() => onDelete(resume.id, resume.title)} disabled={isDeleting} style={{
                    padding: '8px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8,
                    color: '#ef4444', background: '#fff1f2', cursor: 'pointer',
                    opacity: isDeleting ? 0.5 : 1, transition: 'background 0.2s',
                }}
                    onMouseEnter={e => { if(!isDeleting) e.currentTarget.style.background = '#ffe4e6' }}
                    onMouseLeave={e => { if(!isDeleting) e.currentTarget.style.background = '#fff1f2' }}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated()) { router.replace('/login'); return; }
        setUser(getStoredUser());
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        setLoading(true);

        try {
            const data = await resumeApi.list() as any;

            // Handle multiple possible API response shapes
            const resumesData =
                data?.resumes ||
                data?.data?.resumes ||
                data?.data ||
                data ||
                [];

            // Ensure resumes is always an array, and parse resume_data if stored as a JSON string
            const normalizedResumes = Array.isArray(resumesData)
                ? resumesData.map((r: any) => ({
                    ...r,
                    resume_data: typeof r.resume_data === 'string' ? JSON.parse(r.resume_data) : r.resume_data,
                }))
                : [];

            setResumes(normalizedResumes);

            console.log("Loaded resumes:", normalizedResumes);
        } catch (err) {
            toast.error(extractApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try { await resumeApi.delete(id); setResumes(prev => prev.filter(r => r.id !== id)); toast.success('Resume deleted'); }
        catch (err) { toast.error(extractApiError(err)); }
        finally { setDeletingId(null); }
    };

    const handleDownload = (resume: Resume) => {
        setDownloadingId(resume.id);
        router.push(`/create-resume/review?template=${resume.template_type || 'modern'}&id=${resume.id}&download=true`);
    };

    const handleLogout = () => { clearToken(); router.push('/'); toast.success('Signed out'); };

    console.log("Dashboard resumes state:", resumes);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
            <BackgroundGlow />

            {/* Navbar */}
            <nav style={{ 
                borderBottom: '1px solid rgba(0,0,0,0.06)', 
                background: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(10px)',
                position: 'sticky', 
                top: 0, 
                zIndex: 50 
            }}>
                <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 8 }}>
                    <Link href="/" style={{ fontSize: 20, fontWeight: 700, color: '#111827', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                        ResumeAI
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#6b7280' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={14} color="#2563eb" />
                            </div>
                            <span>{user?.full_name || user?.email}</span>
                        </div>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 14, color: '#6b7280', background: 'none', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                            <LogOut size={14} /> Sign out
                        </button>
                    </div>
                </div>
            </nav>

            <main style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 10 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 4 }}>My Resumes</h1>
                        <p style={{ fontSize: 14, color: '#6b7280' }}>
                           {Array.isArray(resumes) ? resumes.length : 0} resume{Array.isArray(resumes) && resumes.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                    <Link href="/create-resume" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', background: '#3b82f6', color: '#ffffff',
                        fontSize: 14, fontWeight: 600, borderRadius: 8, textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <Plus size={16} /> New Resume
                    </Link>
                </div>

                {/* Content */}
                {loading ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="resume-grid">
                        {[1, 2, 3].map(i => (
                            <motion.div variants={itemVariants} key={i} style={{ borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', padding: 20, background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                                <div className="skeleton" style={{ height: 20, width: 140, marginBottom: 8 }} />
                                <div className="skeleton" style={{ height: 14, width: 100, marginBottom: 16 }} />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <div className="skeleton" style={{ height: 32, flex: 1, borderRadius: 8 }} />
                                    <div className="skeleton" style={{ height: 32, flex: 1, borderRadius: 8 }} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : !Array.isArray(resumes) || resumes.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '80px 0', borderRadius: 16, border: '2px dashed #cbd5e1', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <FileText size={28} color="#2563eb" />
                        </div>
                        <h3 style={{ fontSize: 20, fontWeight: 600, color: '#111827', marginBottom: 8 }}>No resumes yet</h3>
                        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Create your first professional resume in minutes.</p>
                        <Link href="/create-resume" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 24px', background: '#3b82f6', color: '#ffffff',
                            fontSize: 14, fontWeight: 600, borderRadius: 12, textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Sparkles size={16} /> Create Your First Resume
                        </Link>
                    </motion.div>
                ) : (
                    <div className="resume-grid">
                        {Array.isArray(resumes) && resumes.map(resume => (
                            <ResumeCard
                                key={resume.id}
                                resume={resume}
                                onDelete={handleDelete}
                                onDownload={handleDownload}
                                isDeleting={deletingId === resume.id}
                                isDownloading={downloadingId === resume.id}
                            />
                        ))}

                        {/* Add new card */}
                        <div>
                            <Link href="/create-resume" style={{
                                borderRadius: 14, border: '2px dashed #cbd5e1', padding: 24,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: 12, color: '#64748b', textDecoration: 'none', minHeight: '100%',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(10px)',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.color = '#3b82f6';
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.background = 'rgba(239, 246, 255, 0.5)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.color = '#64748b';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <Plus size={24} color="currentColor" />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: 15, fontWeight: 600, display: 'block', marginBottom: 4 }}>Create new resume</span>
                                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Takes less than 5 minutes</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
