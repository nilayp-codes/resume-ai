'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
    ChevronLeft, ChevronRight, Save, Plus, Trash2,
    User, Briefcase, GraduationCap, Code, Wrench, Award, FileText,
    Sparkles, Loader2, Check, CircleCheck
} from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { resumeApi, aiApi } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { generateId, extractApiError } from '@/lib/utils';
import type { ResumeData, TemplateType, ColorTheme, FontFamily } from '@/lib/types';
import { DEFAULT_RESUME_DATA } from '@/lib/types';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import { ScaledPreview } from '@/components/resume/ScaledPreview';
import { AIAssistButton } from '@/components/ui/AIAssistButton';
import { AIModal } from '@/components/ui/AIModal';

// ─── Zod Schemas per step ─────────────────────────────────────────────────────
const basicInfoSchema = z.object({
    full_name: z.string().min(2, 'Full Name must be at least 2 characters').regex(/^[a-zA-Z\s]+$/, 'Only letters allowed'),
    email: z.string().email('Enter a valid email address'),
});

const summarySchema = z.object({ summary: z.string().min(10, 'Write at least 10 characters') });
const educationSchema = z.object({
    college_name: z.string().min(1, 'College Name is required'),
    degree: z.string().min(1, 'Degree is required'),
    field_of_study: z.string().min(1, 'Field of Study is required'),
    graduation_year: z.string().min(1, 'Graduation Year is required'),
});
const optionalSchema = z.object({});

const STEPS = [
    { id: 0, label: 'Basic Info', icon: User, schema: basicInfoSchema, required: true },
    { id: 1, label: 'Summary', icon: FileText, schema: summarySchema, required: true },
    { id: 2, label: 'Education', icon: GraduationCap, schema: educationSchema, required: true },
    { id: 3, label: 'Experience', icon: Briefcase, schema: optionalSchema, required: false },
    { id: 4, label: 'Projects', icon: Code, schema: optionalSchema, required: false },
    { id: 5, label: 'Skills', icon: Wrench, schema: optionalSchema, required: false },
    { id: 6, label: 'Certifications', icon: Award, schema: optionalSchema, required: false },
];

// ─── Shared Styles ────────────────────────────────────────────────────────────
const lStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 };
const cStyle: React.CSSProperties = { padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb' };
const aStyle: React.CSSProperties = { width: '100%', padding: '12px 0', borderRadius: 10, border: '2px dashed #d1d5db', background: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
const dSt: React.CSSProperties = { padding: 6, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' };

// ─── AI Modal Types ───────────────────────────────────────────────────────────
type AIModalState = {
    isOpen: boolean;
    isLoading: boolean;
    title: string;
    suggestion: string | string[] | null;
    onAccept: (s: string | string[]) => void;
    onRegenerate: () => void;
};

// ─── Validated Input ──────────────────────────────────────────────────────────
function VI({ label, required, error, valid, children, rightAction }: { label: string; required?: boolean; error?: string; valid?: boolean; children: React.ReactNode; rightAction?: React.ReactNode }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', margin: 0 }}>
                    {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
                </label>
                {rightAction && <div>{rightAction}</div>}
            </div>
            <div style={{ position: 'relative' }}>
                {children}
                {valid && !error && (
                    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', transition: 'opacity 0.2s', opacity: 1 }}>
                        <CircleCheck size={16} color="#22c55e" />
                    </div>
                )}
            </div>
            {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4, lineHeight: 1.3 }}>{error}</p>}
        </div>
    );
}

function SI({ error, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
    return <input {...p} style={{ width: '100%', padding: '10px 14px', paddingRight: 36, background: '#fff', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', ...(error && { boxShadow: '0 0 0 2px rgba(239,68,68,0.15)' }), ...p.style }}
        onFocus={(e) => { if (!error) { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; } p.onFocus?.(e); }}
        onBlur={(e) => { if (!error) { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; } p.onBlur?.(e); }}
    />;
}

function ST({ error, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
    return <textarea {...p} style={{ width: '100%', padding: '10px 14px', background: '#fff', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', resize: 'none' as const, transition: 'border-color 0.2s, box-shadow 0.2s', ...(error && { boxShadow: '0 0 0 2px rgba(239,68,68,0.15)' }), ...p.style }}
        onFocus={(e) => { if (!error) { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; } p.onFocus?.(e); }}
        onBlur={(e) => { if (!error) { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; } p.onBlur?.(e); }}
    />;
}

// ─── Step Icon ────────────────────────────────────────────────────────────────
function StepIcon({ step, currentStep, validSteps, onClick }: { step: typeof STEPS[0]; currentStep: number; validSteps: Set<number>; onClick: () => void; }) {
    const isActive = currentStep === step.id;
    const isValid = validSteps.has(step.id);
    const Icon = isValid && !isActive ? Check : step.icon;
    let bg = '#e5e7eb'; let color = '#9ca3af';
    if (isActive) { bg = '#2563eb'; color = '#ffffff'; } else if (isValid) { bg = '#22c55e'; color = '#ffffff'; }
    return (
        <div style={{ position: 'relative' }}>
            <button onClick={onClick} title={step.label} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: bg, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: isActive ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none' }}>
                <Icon size={16} />
            </button>
        </div>
    );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateStep(stepId: number, data: ResumeData): { valid: boolean; errors: Record<string, string> } {
    const s = STEPS[stepId];

    // Optional steps: validate based on actual content, not schema
    if (!s.required) {
        if (stepId === 3) {
            // Experience: at least one entry with company + position filled
            return { valid: (data.experience?.length ?? 0) > 0 && data.experience.some(e => e.company.trim().length > 0 && e.position.trim().length > 0), errors: {} };
        }
        if (stepId === 4) {
            // Projects: at least one entry with a name
            return { valid: (data.projects?.length ?? 0) > 0 && data.projects.some(p => p.name.trim().length > 0), errors: {} };
        }
        if (stepId === 5) {
            // Skills: at least one non-empty skill in any category
            const sk = data.skills;
            const hasSkills = sk && ([...sk.technical, ...sk.tools, ...sk.languages, ...sk.soft].some(s => s.trim().length > 0));
            return { valid: !!hasSkills, errors: {} };
        }
        if (stepId === 6) {
            // Certifications: at least one entry with a name
            return { valid: (data.certifications?.length ?? 0) > 0 && data.certifications.some(c => c.name.trim().length > 0), errors: {} };
        }
        return { valid: false, errors: {} };
    }

    let toValidate = {};
    if (stepId === 0) toValidate = { full_name: data.basic_info.full_name, email: data.basic_info.email };
    else if (stepId === 1) toValidate = { summary: data.summary };
    else if (stepId === 2) {
        // Education validation: check the college entry
        const edu = data.education?.college;
        toValidate = {
            college_name: edu?.college_name || '',
            degree: edu?.degree || '',
            field_of_study: edu?.field_of_study || '',
            graduation_year: edu?.end_date || '',
        };
    }

    const result = s.schema.safeParse(toValidate);
    if (result.success) return { valid: true, errors: {} };

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = issue.message;
    }
    return { valid: false, errors };
}

// ─── Steps ────────────────────────────────────────────────────────────────────
function BasicInfoStep({ data, onChange, errors, touched, templateType }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void; errors: Record<string, string>; touched: Set<string>; templateType: string }) {
    const b = data.basic_info;
    const u = (f: string, v: string) => onChange({ basic_info: { ...b, [f]: v } });
    const [uploading, setUploading] = useState(false);

    // Strict green tick logic relying entirely on Zod errors
    const isFieldValid = (f: string, val: string) => touched.has(f) && val.trim().length > 0 && !errors[f];

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
        setUploading(true);
        try {
            const { uploadApi } = await import('@/lib/api');
            const result = await uploadApi.uploadPhoto(file);
            onChange({ basic_info: { ...b, photo_url: result.photo_url } });
            toast.success('Photo uploaded!');
        } catch { toast.error('Photo upload failed'); }
        finally { setUploading(false); }
    };

    return (
        <div>
            {/* Photo Upload — only for Executive Dark template */}
            {templateType === 'executive' && (
                <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%', border: '2px dashed #d1d5db',
                        background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', flexShrink: 0,
                    }}>
                        {b.photo_url ? (
                            <img src={b.photo_url.startsWith('/') ? `${window.location.protocol}//${window.location.hostname}:8000${b.photo_url}` : b.photo_url} alt="Profile" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' as const }} />
                        ) : (
                            <User size={24} style={{ color: '#9ca3af' }} />
                        )}
                    </div>
                    <div>
                        <label style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                            background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 8,
                            fontSize: 13, fontWeight: 500, color: '#374151', cursor: uploading ? 'not-allowed' : 'pointer',
                            opacity: uploading ? 0.6 : 1,
                        }}>
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <User size={14} />}
                            {uploading ? 'Uploading...' : b.photo_url ? 'Change Photo' : 'Upload Photo'}
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={uploading} />
                        </label>
                        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Optional · JPG, PNG</p>
                    </div>
                </div>
            )}

            {/* Existing fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <VI label="Full Name" required error={touched.has('full_name') ? errors.full_name : undefined} valid={isFieldValid('full_name', b.full_name)}>
                    <SI value={b.full_name} onChange={e => u('full_name', e.target.value)} onBlur={() => onChange({ basic_info: { ...b } })} placeholder="Jane Doe" error={!!errors.full_name && touched.has('full_name')} />
                </VI>
                <VI label="Job Title" valid={b.job_title.trim().length > 0}>
                    <SI value={b.job_title} onChange={e => u('job_title', e.target.value)} placeholder="Software Engineer" />
                </VI>
                <VI label="Email" required error={touched.has('email') ? errors.email : undefined} valid={isFieldValid('email', b.email)}>
                    <SI value={b.email} onChange={e => u('email', e.target.value)} onBlur={() => onChange({ basic_info: { ...b } })} type="email" placeholder="jane@example.com" error={!!errors.email && touched.has('email')} />
                </VI>
                <VI label="Phone" valid={b.phone.trim().length > 0}><SI value={b.phone} onChange={e => u('phone', e.target.value)} placeholder="+1 (555) 000-0000" /></VI>
                <VI label="Location" valid={b.location.trim().length > 0}><SI value={b.location} onChange={e => u('location', e.target.value)} placeholder="San Francisco, CA" /></VI>
                <VI label="LinkedIn" valid={b.linkedin.trim().length > 0}><SI value={b.linkedin} onChange={e => u('linkedin', e.target.value)} placeholder="linkedin.com/in/..." /></VI>
                <VI label="GitHub" valid={b.github.trim().length > 0}><SI value={b.github} onChange={e => u('github', e.target.value)} placeholder="github.com/..." /></VI>
                <VI label="Website" valid={b.website.trim().length > 0}><SI value={b.website} onChange={e => u('website', e.target.value)} placeholder="yoursite.com" /></VI>
            </div>
        </div>
    );
}

function SummaryStep({ data, onChange, errors, touched, setAiModal }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void; errors: Record<string, string>; touched: Set<string>; setAiModal: React.Dispatch<React.SetStateAction<AIModalState>>; }) {
    const [cc, setCc] = useState(data.summary?.length || 0);
    const valid = data.summary.trim().length >= 10 && !errors.summary;

    const handleGenerate = async () => {
        const fetcher = async () => {
            const sk = data.skills;
            const allSkills = sk ? [...sk.technical, ...sk.tools, ...sk.languages, ...sk.soft].filter(s => s.trim().length > 0).join(', ') : '';
            return aiApi.generateSummary({
                full_name: data.basic_info.full_name || 'Professional',
                job_title: data.basic_info.job_title || 'Candidate',
                skills: allSkills,
                experience_years: `${data.experience?.length || 0} roles`
            });
        };
        executeAiFlow("Auto-Generate Summary", fetcher, (res) => res.summary, (generated) => onChange({ summary: generated as string }));
    };

    const executeAiFlow = (title: string, apiCall: () => Promise<any>, extractFn: (res: any) => string, onAccept: (s: string) => void) => {
        const doCall = async () => {
            setAiModal({ isOpen: true, isLoading: true, title, suggestion: null, onAccept: () => { }, onRegenerate: () => { } });
            try {
                const res = await apiCall();
                const text = extractFn(res);
                if (!text && res.error) throw new Error(res.error);

                setAiModal({
                    isOpen: true, isLoading: false, title, suggestion: text,
                    onRegenerate: doCall,
                    onAccept: (val) => { onAccept(val as string); setAiModal((p: AIModalState) => ({ ...p, isOpen: false })); setCc((val as string).length); toast.success("Applied!"); }
                });
            } catch (e: any) {
                setAiModal(p => ({ ...p, isOpen: false }));
                toast.error("AI service temporarily unavailable");
            }
        };
        doCall();
    };

    return (
        <div>
            <VI label="Professional Summary" required error={touched.has('summary') ? errors.summary : undefined} valid={valid && touched.has('summary')}
                rightAction={
                    <div style={{ display: 'flex', gap: 8 }}>
                        <AIAssistButton label="Auto-Write" onClick={handleGenerate} />
                    </div>
                }
            >
                <ST rows={6} value={data.summary} maxLength={600} placeholder="Results-driven engineer with 5+ years of experience delivering high-impact products..."
                    error={!!errors.summary && touched.has('summary')}
                    onBlur={() => onChange({ summary: data.summary })}
                    onChange={e => { setCc(e.target.value.length); onChange({ summary: e.target.value }); }} />
            </VI>
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right', marginTop: 6 }}>{cc}/600</p>
        </div>
    );
}

function ExperienceStep({ data, onChange, errors, touched, setAiModal }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void; errors: Record<string, string>; touched: Set<string>; setAiModal: React.Dispatch<React.SetStateAction<AIModalState>>; }) {
    const [entries, setEntries] = useState(data.experience || []);
    const add = () => { const n = [...entries, { id: generateId(), company: '', position: '', start_date: '', end_date: '', current: false, description: '', bullets: [''] }]; setEntries(n); onChange({ experience: n }); };
    const rm = (i: number) => { const n = entries.filter((_, j) => j !== i); setEntries(n); onChange({ experience: n }); };
    const upd = (i: number, f: string, v: string | boolean | string[]) => { const n = entries.map((e, j) => j === i ? { ...e, [f]: v } : e); setEntries(n); onChange({ experience: n }); };
    const updB = (i: number, bi: number, v: string) => { const b = [...(entries[i].bullets || [])]; b[bi] = v; upd(i, 'bullets', b); };

    const improveBullet = (idx: number, bi: number) => {
        const text = entries[idx].bullets[bi];
        if (!text.trim()) { toast.error("Write a bullet first"); return; }

        const doCall = async () => {
            setAiModal({ isOpen: true, isLoading: true, title: "Improve Bullet", suggestion: null, onAccept: () => { }, onRegenerate: () => { } });
            try {
                const res = await aiApi.improveField({ bullet_text: text, job_title: entries[idx].position });
                if (!res.suggestion && res.error) throw new Error(res.error);
                setAiModal({
                    isOpen: true, isLoading: false, title: "Improve Bullet", suggestion: res.suggestion || null,
                    onRegenerate: doCall,
                    onAccept: (val) => { updB(idx, bi, val as string); setAiModal(p => ({ ...p, isOpen: false })); toast.success("Applied!"); }
                });
            } catch (e: any) {
                setAiModal(p => ({ ...p, isOpen: false }));
                toast.error("AI service temporarily unavailable");
            }
        };
        doCall();
    };

    const generateBullets = (idx: number) => {
        const comp = entries[idx].company;
        const pos = entries[idx].position;
        if (!comp || !pos) { toast.error("Enter Company and Position first"); return; }

        const skills = data.skills.technical.join(', ');
        const doCall = async () => {
            setAiModal({ isOpen: true, isLoading: true, title: "Generate Responsibilities", suggestion: null, onAccept: () => { }, onRegenerate: () => { } });
            try {
                const res = await aiApi.generateBullets({ company: comp, job_title: pos, skills });
                if (!res.bullets && res.error) throw new Error(res.error);
                setAiModal({
                    isOpen: true, isLoading: false, title: "Generated Responsibilities", suggestion: res.bullets || null,
                    onRegenerate: doCall,
                    onAccept: (val) => {
                        const newBullets = val as string[];
                        upd(idx, 'bullets', newBullets);
                        setAiModal(p => ({ ...p, isOpen: false })); toast.success("Applied!");
                    }
                });
            } catch (e: any) {
                setAiModal(p => ({ ...p, isOpen: false }));
                toast.error("AI service temporarily unavailable");
            }
        };
        doCall();
    };

    const showErr = touched.has('experience');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {entries.length === 0 && showErr && errors.experience && (
                <p style={{ fontSize: 13, color: '#ef4444', padding: '10px 14px', background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>{errors.experience}</p>
            )}
            {entries.map((exp, idx) => {
                const compErr = showErr ? errors[`experience.${idx}.company`] : undefined;
                const posErr = showErr ? errors[`experience.${idx}.position`] : undefined;
                return (
                    <div key={exp.id || idx} style={cStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Experience #{idx + 1}</h4>
                            <button onClick={() => rm(idx)} style={dSt}><Trash2 size={14} /></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <VI label="Company" required error={compErr} valid={exp.company.length > 0 && !compErr}><SI value={exp.company} onChange={e => upd(idx, 'company', e.target.value)} placeholder="Google" error={!!compErr} /></VI>
                            <VI label="Position" required error={posErr} valid={exp.position.length > 0 && !posErr}><SI value={exp.position} onChange={e => upd(idx, 'position', e.target.value)} placeholder="Sr. Engineer" error={!!posErr} /></VI>
                            <VI label="Start" valid={exp.start_date.length > 0}><SI value={exp.start_date} onChange={e => upd(idx, 'start_date', e.target.value)} placeholder="Jan 2022" /></VI>
                            <div>
                                <VI label="End" valid={exp.end_date.length > 0 || exp.current}><SI value={exp.end_date} onChange={e => upd(idx, 'end_date', e.target.value)} placeholder="Dec 2024" disabled={exp.current} /></VI>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 13, color: '#6b7280', cursor: 'pointer' }}><input type="checkbox" checked={exp.current} onChange={e => upd(idx, 'current', e.target.checked)} /> Current</label>
                            </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label style={lStyle}>Bullet Points</label>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {(exp.bullets || ['']).map((b, bi) => (
                                    <div key={bi} style={{ display: 'flex', gap: 8 }}>
                                        <SI value={b} onChange={e => updB(idx, bi, e.target.value)} placeholder="Developed feature..." style={{ flex: 1 }} />
                                        <button onClick={() => improveBullet(idx, bi)} title="Improve Bullet" style={{ padding: 8, background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 8, color: '#2563eb', cursor: 'pointer' }}>
                                            <Sparkles size={14} />
                                        </button>
                                        <button onClick={() => upd(idx, 'bullets', entries[idx].bullets.filter((_, j) => j !== bi))} style={dSt}><Trash2 size={13} /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => upd(idx, 'bullets', [...(entries[idx].bullets || []), ''])} style={{ marginTop: 8, fontSize: 13, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Add bullet</button>
                        </div>
                    </div>
                );
            })}
            <button onClick={add} style={aStyle}><Plus size={16} /> Add Experience</button>
        </div>
    );
}

function EducationStep({ data, onChange, errors, touched }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void; errors: Record<string, string>; touched: Set<string> }) {
    const edu = data.education || { school10: null, school12: null, college: null };

    // Initialize college if it's missing (it's required)
    const college = edu.college || { college_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: '' };

    const updCollege = (f: string, v: string) => onChange({ education: { ...edu, college: { ...college, [f]: v } } });

    const updSchool10 = (f: string, v: string) => {
        if (!edu.school10) return;
        onChange({ education: { ...edu, school10: { ...edu.school10, [f]: v } } });
    };

    const updSchool12 = (f: string, v: string) => {
        if (!edu.school12) return;
        onChange({ education: { ...edu, school12: { ...edu.school12, [f]: v } } });
    };

    const addSchool10 = () => onChange({ education: { ...edu, school10: { school_name: '', board: '', year: '' } } });
    const removeSchool10 = () => onChange({ education: { ...edu, school10: null } });

    const addSchool12 = () => onChange({ education: { ...edu, school12: { school_name: '', board: '', year: '' } } });
    const removeSchool12 = () => onChange({ education: { ...edu, school12: null } });

    const showErr = touched.has('education');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* School Details Section */}
            <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>School Details</h3>
                <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>Optional — Add your 10th and 12th details</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {edu.school10 ? (
                        <div style={cStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>Class 10th</h4>
                                <button onClick={removeSchool10} style={{ padding: 6, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500 }}><Trash2 size={14} /> Remove</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <VI label="School Name"><SI value={edu.school10.school_name} onChange={e => updSchool10('school_name', e.target.value)} placeholder="Delhi Public School" /></VI>
                                <VI label="Board"><SI value={edu.school10.board} onChange={e => updSchool10('board', e.target.value)} placeholder="CBSE" /></VI>
                                <VI label="Year"><SI value={edu.school10.year} onChange={e => updSchool10('year', e.target.value)} placeholder="2018" /></VI>
                            </div>
                        </div>
                    ) : (
                        <button onClick={addSchool10} style={aStyle}><Plus size={16} /> Add Class 10th Details</button>
                    )}

                    {edu.school12 ? (
                        <div style={cStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>Class 12th</h4>
                                <button onClick={removeSchool12} style={{ padding: 6, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500 }}><Trash2 size={14} /> Remove</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <VI label="School Name"><SI value={edu.school12.school_name} onChange={e => updSchool12('school_name', e.target.value)} placeholder="Delhi Public School" /></VI>
                                <VI label="Board"><SI value={edu.school12.board} onChange={e => updSchool12('board', e.target.value)} placeholder="CBSE" /></VI>
                                <VI label="Year"><SI value={edu.school12.year} onChange={e => updSchool12('year', e.target.value)} placeholder="2020" /></VI>
                            </div>
                        </div>
                    ) : (
                        <button onClick={addSchool12} style={aStyle}><Plus size={16} /> Add Class 12th Details</button>
                    )}
                </div>
            </div>

            {/* College Details Section */}
            <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>College Details</h3>
                <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>Required — Add your college/university information</p>
                <div style={cStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <VI label="College Name" required error={showErr ? errors.college_name : undefined} valid={college.college_name.length > 0 && !errors.college_name}>
                            <SI value={college.college_name} onChange={e => updCollege('college_name', e.target.value)} placeholder="Indian Institute of Technology" error={!!errors.college_name && showErr} />
                        </VI>
                        <VI label="Degree" required error={showErr ? errors.degree : undefined} valid={college.degree.length > 0 && !errors.degree}>
                            <SI value={college.degree} onChange={e => updCollege('degree', e.target.value)} placeholder="B.Tech" error={!!errors.degree && showErr} />
                        </VI>
                        <VI label="Field of Study" required error={showErr ? errors.field_of_study : undefined} valid={college.field_of_study.length > 0 && !errors.field_of_study}>
                            <SI value={college.field_of_study} onChange={e => updCollege('field_of_study', e.target.value)} placeholder="Computer Science" error={!!errors.field_of_study && showErr} />
                        </VI>
                        <VI label="Graduation Year" required error={showErr ? errors.graduation_year : undefined} valid={college.end_date.length > 0 && !errors.graduation_year}>
                            <SI value={college.end_date} onChange={e => updCollege('end_date', e.target.value)} placeholder="2024" error={!!errors.graduation_year && showErr} />
                        </VI>
                        <VI label="CGPA" valid={college.gpa.length > 0}>
                            <SI value={college.gpa} onChange={e => updCollege('gpa', e.target.value)} placeholder="8.5" />
                        </VI>
                        <VI label="Start Year" valid={college.start_date.length > 0}>
                            <SI value={college.start_date} onChange={e => updCollege('start_date', e.target.value)} placeholder="2020" />
                        </VI>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProjectsStep({ data, onChange, setAiModal }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void; setAiModal: React.Dispatch<React.SetStateAction<AIModalState>>; }) {
    const [entries, setEntries] = useState(data.projects || []);
    const add = () => { const n = [...entries, { id: generateId(), name: '', description: '', tech_stack: '', url: '', github: '', bullets: [''] }]; setEntries(n); onChange({ projects: n }); };
    const rm = (i: number) => { const n = entries.filter((_, j) => j !== i); setEntries(n); onChange({ projects: n }); };
    const upd = (i: number, f: string, v: string | string[]) => { const n = entries.map((e, j) => j === i ? { ...e, [f]: v } : e); setEntries(n); onChange({ projects: n }); };
    const updB = (i: number, bi: number, v: string) => { const b = [...(entries[i].bullets || [])]; b[bi] = v; upd(i, 'bullets', b); };

    const improveDesc = (idx: number) => {
        const text = entries[idx].description;
        if (!text.trim()) { toast.error("Write a description first"); return; }

        const doCall = async () => {
            setAiModal({ isOpen: true, isLoading: true, title: "Improve Description", suggestion: null, onAccept: () => { }, onRegenerate: () => { } });
            try {
                const res = await aiApi.improveField({ bullet_text: text, job_title: "Project Description" });
                if (!res.suggestion && res.error) throw new Error(res.error);
                setAiModal({
                    isOpen: true, isLoading: false, title: "Improve Description", suggestion: res.suggestion || null,
                    onRegenerate: doCall,
                    onAccept: (val) => { upd(idx, 'description', val as string); setAiModal(p => ({ ...p, isOpen: false })); toast.success("Applied!"); }
                });
            } catch (e: any) {
                setAiModal(p => ({ ...p, isOpen: false }));
                toast.error("AI service temporarily unavailable");
            }
        };
        doCall();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {entries.map((p, idx) => (
                <div key={p.id || idx} style={cStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Project #{idx + 1}</h4>
                        <button onClick={() => rm(idx)} style={dSt}><Trash2 size={14} /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <VI label="Name"><SI value={p.name} onChange={e => upd(idx, 'name', e.target.value)} placeholder="MyApp" /></VI>
                        <VI label="Tech"><SI value={p.tech_stack} onChange={e => upd(idx, 'tech_stack', e.target.value)} placeholder="React, Node" /></VI>
                        <VI label="GitHub"><SI value={p.github} onChange={e => upd(idx, 'github', e.target.value)} placeholder="github.com/..." /></VI>
                        <VI label="URL"><SI value={p.url} onChange={e => upd(idx, 'url', e.target.value)} placeholder="myapp.com" /></VI>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <VI label="Description" rightAction={<AIAssistButton label="Improve" onClick={() => improveDesc(idx)} />}>
                            <ST rows={2} value={p.description} onChange={e => upd(idx, 'description', e.target.value)} placeholder="Brief..." />
                        </VI>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <label style={lStyle}>Bullets</label>
                        {(p.bullets || ['']).map((b, bi) => (
                            <div key={bi} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <SI value={b} onChange={e => updB(idx, bi, e.target.value)} placeholder="Built..." style={{ flex: 1 }} />
                                <button onClick={() => upd(idx, 'bullets', p.bullets.filter((_, j) => j !== bi))} style={dSt}><Trash2 size={13} /></button>
                            </div>
                        ))}
                        <button onClick={() => upd(idx, 'bullets', [...p.bullets, ''])} style={{ fontSize: 13, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Add bullet</button>
                    </div>
                </div>
            ))}
            <button onClick={add} style={aStyle}><Plus size={16} /> Add Project</button>
        </div>
    );
}

function SkillsStep({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const [skills, setSkills] = useState(data.skills || { technical: [], soft: [], languages: [], tools: [] });
    const [inputs, setInputs] = useState({ technical: '', soft: '', languages: '', tools: '' });
    const addS = (k: keyof typeof skills) => { const v = inputs[k].trim(); if (!v) return; const u = { ...skills, [k]: [...skills[k], v] }; setSkills(u); onChange({ skills: u }); setInputs(p => ({ ...p, [k]: '' })); };
    const rmS = (k: keyof typeof skills, i: number) => { const u = { ...skills, [k]: skills[k].filter((_, j) => j !== i) }; setSkills(u); onChange({ skills: u }); };
    const cats: { key: keyof typeof skills; label: string; ph: string }[] = [{ key: 'technical', label: 'Technical', ph: 'React...' }, { key: 'tools', label: 'Tools', ph: 'Docker...' }, { key: 'soft', label: 'Soft', ph: 'Leadership...' }, { key: 'languages', label: 'Language', ph: 'English...' }];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {cats.map(({ key, label, ph }) => (
                <div key={key}>
                    <label style={lStyle}>{label}</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <SI value={inputs[key]} onChange={e => setInputs(p => ({ ...p, [key]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addS(key))} placeholder={ph} style={{ flex: 1 }} />
                        <button onClick={() => addS(key)} style={{ padding: '8px 12px', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 8, color: '#2563eb', cursor: 'pointer' }}><Plus size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {skills[key].map((s, i) => (
                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 999, fontSize: 13, border: '1px solid #dbeafe' }}>
                                {s} <button onClick={() => rmS(key, i)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}><Trash2 size={11} /></button>
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function CertsStep({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const [entries, setEntries] = useState(data.certifications || []);
    const add = () => { const n = [...entries, { id: generateId(), name: '', issuer: '', date: '', url: '' }]; setEntries(n); onChange({ certifications: n }); };
    const rm = (i: number) => { const n = entries.filter((_, j) => j !== i); setEntries(n); onChange({ certifications: n }); };
    const upd = (i: number, f: string, v: string) => { const n = entries.map((e, j) => j === i ? { ...e, [f]: v } : e); setEntries(n); onChange({ certifications: n }); };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {entries.map((c, idx) => (
                <div key={c.id || idx} style={cStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <VI label="Name"><SI value={c.name} onChange={e => upd(idx, 'name', e.target.value)} placeholder="AWS SA" /></VI>
                        <VI label="Issuer"><SI value={c.issuer} onChange={e => upd(idx, 'issuer', e.target.value)} placeholder="Amazon" /></VI>
                    </div>
                </div>
            ))}
            <button onClick={add} style={aStyle}><Plus size={16} /> Add Certification</button>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function FormContent() {
    const router = useRouter();
    const sp = useSearchParams();
    const tpl = sp.get('template') || 'modern';
    const rid = sp.get('id');

    const [step, setStep] = useState(0);
    const [data, setData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
    const [templateType] = useState<TemplateType>(tpl as TemplateType);
    const [colorTheme] = useState<ColorTheme>('blue');
    const [fontFamily] = useState<FontFamily>('inter');
    const [title, setTitle] = useState('My Resume');
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [loading, setLoading] = useState(!!rid);
    const [savedId, setSavedId] = useState<string | null>(rid);
    const [previewScale, setPreviewScale] = useState(0.72);

    // AI Modal State
    const [aiModal, setAiModal] = useState<AIModalState>({
        isOpen: false,
        isLoading: false,
        title: '',
        suggestion: null,
        onAccept: () => { },
        onRegenerate: () => { },
    });

    const [validSteps, setValidSteps] = useState<Set<number>>(new Set());
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => { if (!isAuthenticated()) router.replace('/login'); if (rid) loadResume(rid); }, []);

    useEffect(() => {
        const { valid, errors } = validateStep(step, data);
        setStepErrors(errors);
        setValidSteps(prev => { const next = new Set(prev); if (valid) next.add(step); else next.delete(step); return next; });
    }, [data, step]);

    const loadResume = async (id: string) => {
        try { const r = await resumeApi.get(id); setData(r.resume_data); setTitle(r.title); } catch { toast.error('Could not load'); } finally { setLoading(false); }
    };

    const handleChange = useCallback((partial: Partial<ResumeData>) => {
        setData(prev => ({ ...prev, ...partial }));
        const keys = Object.keys(partial);
        if (keys.includes('basic_info')) {
            const bi = partial.basic_info!;
            const newTouched = new Set(touched);
            if (bi.full_name !== undefined) newTouched.add('full_name');
            if (bi.email !== undefined) newTouched.add('email');
            setTouched(newTouched);
        }
        if (keys.includes('summary')) { setTouched(prev => new Set(prev).add('summary')); }
        if (keys.includes('experience')) { setTouched(prev => new Set(prev).add('experience')); }
        if (keys.includes('education')) { setTouched(prev => new Set(prev).add('education')); }

        if (savedId) {
            setSaveStatus('saving');
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => autoSave({ ...data, ...partial }), 800);
        }
    }, [data, savedId, touched]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autoSave = async (d: ResumeData) => {
        if (!savedId) return;
        try {
            await resumeApi.update(savedId, { resume_data: d as any, template_type: templateType, color_theme: colorTheme, font_family: fontFamily });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
            setSaveStatus('idle');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rd = data as any;
            if (savedId) {
                await resumeApi.update(savedId, { title, resume_data: rd, template_type: templateType, color_theme: colorTheme, font_family: fontFamily, save_version: true, version_note: `Step: ${STEPS[step].label}` });
                toast.success('Saved!');
            } else {
                const c = await resumeApi.create({ title, resume_data: rd, template_type: templateType, color_theme: colorTheme, font_family: fontFamily });
                setSavedId(c.id); router.replace(`/create-resume/form?template=${templateType}&id=${c.id}`); toast.success('Created!');
            }
        } catch (err) { toast.error(extractApiError(err)); } finally { setSaving(false); }
    };

    const handleNext = () => {
        const newTouched = new Set(touched);
        if (step === 0) { newTouched.add('full_name'); newTouched.add('email'); }
        if (step === 1) newTouched.add('summary');
        if (step === 2) newTouched.add('education');
        setTouched(newTouched);

        if (STEPS[step].required) {
            const { valid } = validateStep(step, data);
            if (!valid) { toast.error('Please fix the errors before continuing'); return; }
        }

        const { valid } = validateStep(step, data);
        if (valid) setValidSteps(prev => new Set(prev).add(step));
        setStep(step + 1);
    };

    const handleFinish = async () => {
        const newTouched = new Set(touched);
        if (step === 0) { newTouched.add('full_name'); newTouched.add('email'); }
        setTouched(newTouched);
        const { valid } = validateStep(step, data);
        if (STEPS[step].required && !valid) { toast.error('Please fix the errors before continuing'); return; }

        setSaving(true);
        try {
            const rd = data as any;
            let finalId = savedId;

            if (savedId) {
                await resumeApi.update(savedId, {
                    title, resume_data: rd, template_type: templateType,
                    color_theme: colorTheme, font_family: fontFamily,
                    save_version: true, version_note: 'Final save before review'
                });
            } else {
                const created = await resumeApi.create({
                    title, resume_data: rd, template_type: templateType,
                    color_theme: colorTheme, font_family: fontFamily
                });
                finalId = created.id;
                setSavedId(created.id);
            }

            if (!finalId) {
                toast.error('Failed to save resume. Please try again.');
                return;
            }

            router.push(`/create-resume/review?template=${templateType}&id=${finalId}`);
        } catch (err) {
            toast.error(extractApiError(err));
        } finally {
            setSaving(false);
        }
    };

    const goToStep = (s: number) => {
        if (s <= step || validSteps.has(s) || s === step + 1) {
            if (s > step) {
                const { valid } = validateStep(step, data);
                if (!valid && STEPS[step].required) {
                    const newTouched = new Set(touched);
                    if (step === 0) { newTouched.add('full_name'); newTouched.add('email'); }
                    if (step === 1) newTouched.add('summary');
                    if (step === 2) newTouched.add('education');
                    setTouched(newTouched);
                    toast.error('Complete this step first');
                    return;
                }
                setValidSteps(prev => new Set(prev).add(step));
            }
            setStep(s);
        }
    };

    const currentStepValid = validSteps.has(step);
    const validCount = validSteps.size;
    const progressPct = Math.round((validCount / STEPS.length) * 100);

    const SL = [
        <BasicInfoStep key="b" data={data} onChange={handleChange} errors={stepErrors} touched={touched} templateType={templateType} />,
        <SummaryStep key="s" data={data} onChange={handleChange} errors={stepErrors} touched={touched} setAiModal={setAiModal} />,
        <EducationStep key="ed" data={data} onChange={handleChange} errors={stepErrors} touched={touched} />,
        <ExperienceStep key="e" data={data} onChange={handleChange} errors={stepErrors} touched={touched} setAiModal={setAiModal} />,
        <ProjectsStep key="p" data={data} onChange={handleChange} setAiModal={setAiModal} />,
        <SkillsStep key="sk" data={data} onChange={handleChange} />,
        <CertsStep key="c" data={data} onChange={handleChange} />,
    ];

    if (loading) return <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} /></div>;

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111827' }}>
            <AIModal
                isOpen={aiModal.isOpen}
                isLoading={aiModal.isLoading}
                title={aiModal.title}
                suggestion={aiModal.suggestion}
                onAccept={aiModal.onAccept}
                onRegenerate={aiModal.onRegenerate}
                onClose={() => setAiModal(p => ({ ...p, isOpen: false }))}
            />

            {/* Header */}
            <header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/create-resume" style={{ padding: 6, color: '#6b7280', textDecoration: 'none', display: 'flex', borderRadius: 6 }}><ChevronLeft size={18} /></Link>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Resume title..." style={{ fontSize: 14, fontWeight: 600, background: 'transparent', border: 'none', outline: 'none', color: '#111827', width: '100%', maxWidth: 260 }} />
                        <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>Step 2 of 3 · {progressPct}% complete</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#6b7280' }}>
                        {saveStatus === 'saving' && <><Loader2 size={13} className="animate-spin" /> Saving...</>}
                        {saveStatus === 'saved' && <><Check size={13} style={{ color: '#10b981' }} /> Saved</>}
                        {saveStatus === 'idle' && savedId && <><Check size={13} style={{ color: '#9ca3af' }} /> Saved</>}
                    </div>
                </div>
            </header>

            {/* 3-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 620px', height: 'calc(100vh - 49px)' }}>
                {/* Icon Sidebar */}
                <aside style={{ borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 32, background: '#ffffff' }}>
                    {STEPS.map((s, i) => (
                        <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <StepIcon step={s} currentStep={step} validSteps={validSteps} onClick={() => goToStep(s.id)} />
                            {i < STEPS.length - 1 && <div style={{ width: 2, height: 24, background: validSteps.has(s.id) ? '#3b82f6' : '#e5e7eb', marginTop: 4, borderRadius: 1 }} />}
                        </div>
                    ))}
                </aside>

                {/* Form */}
                <main style={{ overflowY: 'auto', padding: '40px 48px', background: '#f8fafc' }}>
                    <div style={{ maxWidth: 640, margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Step {step + 1} of {STEPS.length}
                            </span>
                            <div style={{ flex: 1, height: 4, background: '#e2e8f0', borderRadius: 2 }}>
                                <div style={{ height: '100%', background: '#3b82f6', borderRadius: 2, width: `${((step + 1) / STEPS.length) * 100}%`, transition: 'width 0.3s' }} />
                            </div>
                        </div>

                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{STEPS[step].label}</h2>
                        <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32 }}>{STEPS[step].required ? 'Fill in the required fields below' : `Add your ${STEPS[step].label.toLowerCase()} (optional)`}</p>
                        
                        <div className="animate-fade-in" style={{
                            background: '#ffffff', borderRadius: 16, padding: 32,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 24px 48px rgba(0,0,0,0.06)',
                            border: '1px solid #f1f5f9',
                            borderLeft: '3px solid #3b82f6',
                        }}>
                            {SL[step]}
                        </div>

                        {/* Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#ffffff', fontSize: 14, fontWeight: 600, color: step === 0 ? '#94a3b8' : '#475569', cursor: step === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}><ChevronLeft size={16} /> Previous</button>
                            {step < STEPS.length - 1 ? (
                                <button onClick={handleNext} disabled={STEPS[step].required && !currentStepValid} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 600, background: (STEPS[step].required && !currentStepValid) ? '#cbd5e1' : '#3b82f6', color: '#ffffff', cursor: (STEPS[step].required && !currentStepValid) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>Next <ChevronRight size={16} /></button>
                            ) : (
                                <button onClick={handleFinish} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: 'none', background: '#111827', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Finish & Review</button>
                            )}
                        </div>
                    </div>
                </main>

                {/* Live Preview */}
                <aside style={{ borderLeft: '1px solid #e5e7eb', background: '#f1f5f9', overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Live Preview</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button onClick={() => setPreviewScale(s => Math.max(0.4, s - 0.05))} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#64748b' }}>-</button>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', width: 36, textAlign: 'center' }}>{Math.round(previewScale * 100)}%</span>
                            <button onClick={() => setPreviewScale(s => Math.min(1, s + 0.05))} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#64748b' }}>+</button>
                        </div>
                    </div>
                    <div style={{ background: '#ffffff', padding: 8, borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', width: '100%', overflow: 'hidden' }}>
                        <ScaledPreview scale={previewScale}>
                            <TemplateRenderer template={templateType} data={data} colorTheme={colorTheme} fontFamily={fontFamily} />
                        </ScaledPreview>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function FormPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} /></div>}>
            <FormContent />
        </Suspense>
    );
}
