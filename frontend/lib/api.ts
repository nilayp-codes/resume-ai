import axios from 'axios';
import { getToken, clearToken } from './auth';
import type { AuthResponse, Resume, ResumeVersion } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8000` : 'http://localhost:8000');

// ─── Axios Instance ────────────────────────────────────────────────────────────

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ─── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
    register: async (data: { email: string; password: string; full_name?: string }): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>('/auth/register', data);
        return res.data;
    },

    login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>('/auth/login', data);
        return res.data;
    },
};

// ─── Resume API ────────────────────────────────────────────────────────────────

export const resumeApi = {
    list: async (): Promise<Resume[]> => {
        const res = await api.get<Resume[]>('/resumes/');
        return res.data;
    },

    get: async (id: string): Promise<Resume> => {
        const res = await api.get<Resume>(`/resumes/${id}`);
        return res.data;
    },

    create: async (data: Partial<Resume>): Promise<Resume> => {
        const res = await api.post<Resume>('/resumes/', data);
        return res.data;
    },

    update: async (id: string, data: Partial<Resume> & { save_version?: boolean; version_note?: string }): Promise<Resume> => {
        const res = await api.put<Resume>(`/resumes/${id}`, data);
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/resumes/${id}`);
    },

    versions: async (id: string): Promise<ResumeVersion[]> => {
        const res = await api.get<ResumeVersion[]>(`/resumes/${id}/versions`);
        return res.data;
    },
};

// ─── PDF API ───────────────────────────────────────────────────────────────────

export const pdfApi = {
    generate: async (resumeId: string, filename: string = 'resume.pdf'): Promise<void> => {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/pdf/generate/${resumeId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: 'PDF generation failed' }));
            throw new Error(err.detail || 'PDF generation failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
};

// ─── AI API ────────────────────────────────────────────────────────────────────

export const aiApi = {
    improveField: async (data: {
        bullet_text: string;
        job_title?: string;
        industry?: string;
    }): Promise<{ success: boolean; suggestion?: string; error?: string }> => {
        const res = await api.post('/ai/improve-field', data);
        return res.data;
    },

    generateBullets: async (data: {
        company: string;
        job_title: string;
        skills?: string;
    }): Promise<{ success: boolean; bullets?: string[]; error?: string }> => {
        const res = await api.post('/ai/generate-bullets', data);
        return res.data;
    },

    generateSummary: async (data: {
        full_name: string;
        job_title: string;
        skills?: string;
        experience_years?: string;
    }): Promise<{ success: boolean; summary?: string; error?: string }> => {
        const res = await api.post('/ai/generate-summary', data);
        return res.data;
    }
};

// ─── Upload API ────────────────────────────────────────────────────────────────

export const uploadApi = {
    uploadPhoto: async (file: File): Promise<{ photo_url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post<{ photo_url: string }>('/upload-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },
};

export default api;
