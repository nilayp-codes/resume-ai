import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
}

export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null) {
        const e = error as Record<string, unknown>;
        if (typeof e.detail === 'string') return e.detail;
        if (Array.isArray(e.detail)) return (e.detail[0] as { msg: string }).msg || 'Validation error';
    }
    return 'An unexpected error occurred';
}

export function extractApiError(error: unknown): string {
    const axiosError = error as { response?: { data?: { detail?: string | Array<{ msg: string }> } } };
    const detail = axiosError?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail[0]?.msg || 'Validation error';
    return getErrorMessage(error);
}
