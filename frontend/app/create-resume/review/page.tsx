'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft, Download, Edit3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { resumeApi } from '@/lib/api';
import { isAuthenticated, getToken } from '@/lib/auth';
import type { ResumeData } from '@/lib/types';
import { DEFAULT_RESUME_DATA } from '@/lib/types';
import TemplateRenderer from '@/components/resume/TemplateRenderer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://resume-ai-xrs5.onrender.com';

function ReviewContent() {
    const router = useRouter();
    const sp = useSearchParams();
    const tpl = sp.get('template') || 'modern';
    const rid = sp.get('id');

    const [data, setData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
    const [title, setTitle] = useState('My Resume');
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!isAuthenticated()) { router.replace('/login'); return; }
        if (rid) loadResume(rid);
        else {
            setLoading(false);
            toast.error('Resume not saved yet. Please try again.');
            router.push('/dashboard');
        }
    }, []);

    const loadResume = async (id: string) => {
        try {
            const r = await resumeApi.get(id);
            setData(r.resume_data); setTitle(r.title);
        } catch { toast.error('Could not load resume'); }
        finally { setLoading(false); }
    };

    // Convert all images inside a container to base64 data URIs
    const convertImagesToBase64 = async (container: HTMLElement) => {
        const images = container.querySelectorAll("img");
        for (const img of Array.from(images)) {
            try {
                const response = await fetch(img.src);
                const blob = await response.blob();
                const base64: string = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
                img.src = base64;
            } catch (e) {
                console.warn("Image conversion failed:", e);
            }
        }
    };


    const handleDownloadPDF = useCallback(async () => {
        setDownloading(true);
        try {
            // Wait for all images to load before cloning
            const images = document.querySelectorAll("#resume-preview img");
            await Promise.all(
                Array.from(images).map(img => {
                    const htmlImg = img as HTMLImageElement;
                    return htmlImg.complete
                        ? Promise.resolve()
                        : new Promise<void>(resolve => {
                            htmlImg.onload = () => resolve();
                            htmlImg.onerror = () => resolve();
                        });
                })
            );

            // Step 1: Clone the rendered DOM
            const resume = document.getElementById("resume-preview");
            if (!resume) { toast.error('Resume preview not found'); return; }
            const clone = resume.cloneNode(true) as HTMLElement;

            // Step 2: Remove UI-only elements
            clone.querySelectorAll(".no-print").forEach(el => el.remove());

            // Step 3: Convert images to base64 (fixes missing profile photo)
            await convertImagesToBase64(clone);

            // Step 4: Build full HTML document
            const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  background: white;
  display: flex;
  justify-content: center;
}
#resume-preview {
  width: 794px;
  min-height: 1123px;
}
</style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;

            // Send to backend for PDF generation via Playwright
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/pdf/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
                body: JSON.stringify({ html }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ detail: 'PDF generation failed' }));
                throw new Error(err.detail || 'PDF generation failed');
            }

            // Download the PDF
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title || 'resume'}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success('PDF downloaded!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate PDF');
        } finally {
            setDownloading(false);
        }
    }, [title]);

    // Auto-download when redirected from dashboard with ?download=true
    useEffect(() => {
        if (!loading && sp.get('download') === 'true') {
            const timer = setTimeout(() => handleDownloadPDF(), 500);
            return () => clearTimeout(timer);
        }
    }, [loading, handleDownloadPDF]);

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#111827', paddingBottom: 64 }}>
            {/* Header */}
            <header className="no-print" style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                            <ChevronLeft size={16} /> Dashboard
                        </Link>
                        <div style={{ height: 24, width: 1, background: '#e2e8f0' }} />
                        <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h1>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
                {/* Toolbar */}
                <div className="no-print" style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    background: '#ffffff', padding: '16px 24px', borderRadius: 16, 
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                    marginBottom: 32, border: '1px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b', width: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link href={`/create-resume/form?template=${tpl}&id=${rid}`} style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10,
                            border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, fontWeight: 600,
                            color: '#334155', textDecoration: 'none', transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                        >
                            <Edit3 size={16} /> Edit Resume
                        </Link>
                        <button onClick={handleDownloadPDF} disabled={downloading} style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10,
                            border: 'none', background: '#3b82f6', color: '#ffffff', fontSize: 14, fontWeight: 600,
                            cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.7 : 1,
                            boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { if(!downloading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => { if(!downloading) e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Centered Preview Container */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ 
                        transform: `scale(${zoom})`, transformOrigin: 'top center',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        background: '#ffffff',
                        width: 'fit-content' // ensures the shadow hugs the scaled element tightly
                    }}>
                        <div id="resume-preview" style={{ width: 794, minHeight: 1123, background: '#ffffff' }}>
                            <TemplateRenderer template={tpl} data={data} colorTheme="blue" fontFamily="inter" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} />
            </div>
        }>
            <ReviewContent />
        </Suspense>
    );
}
