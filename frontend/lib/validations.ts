import { z } from 'zod';

// ─── Auth Validations ─────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
});

// ─── Resume Form Validations ───────────────────────────────────────────────────

export const basicInfoSchema = z.object({
    full_name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Valid email required'),
    phone: z.string().optional().default(''),
    location: z.string().optional().default(''),
    linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
    github: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
    website: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
    job_title: z.string().optional().default(''),
});

export const summarySchema = z.object({
    summary: z.string().max(600, 'Summary should be under 600 characters').optional().default(''),
});

export const experienceEntrySchema = z.object({
    id: z.string().optional().default(''),
    company: z.string().min(1, 'Company name required'),
    position: z.string().min(1, 'Position/title required'),
    start_date: z.string().min(1, 'Start date required'),
    end_date: z.string().optional().default(''),
    current: z.boolean().default(false),
    description: z.string().optional().default(''),
    bullets: z.array(z.string()).default([]),
});

export const educationEntrySchema = z.object({
    id: z.string().optional().default(''),
    institution: z.string().min(1, 'Institution name required'),
    degree: z.string().min(1, 'Degree is required'),
    field_of_study: z.string().optional().default(''),
    start_date: z.string().optional().default(''),
    end_date: z.string().optional().default(''),
    gpa: z.string().optional().default(''),
    achievements: z.string().optional().default(''),
});

export const projectEntrySchema = z.object({
    id: z.string().optional().default(''),
    name: z.string().min(1, 'Project name required'),
    description: z.string().optional().default(''),
    tech_stack: z.string().optional().default(''),
    url: z.string().url('Must be valid URL').optional().or(z.literal('')).default(''),
    github: z.string().url('Must be valid URL').optional().or(z.literal('')).default(''),
    bullets: z.array(z.string()).default([]),
});

export const certificationEntrySchema = z.object({
    id: z.string().optional().default(''),
    name: z.string().min(1, 'Certification name required'),
    issuer: z.string().optional().default(''),
    date: z.string().optional().default(''),
    url: z.string().url('Must be valid URL').optional().or(z.literal('')).default(''),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type SummaryFormData = z.infer<typeof summarySchema>;
export type ExperienceEntryFormData = z.infer<typeof experienceEntrySchema>;
export type EducationEntryFormData = z.infer<typeof educationEntrySchema>;
export type ProjectEntryFormData = z.infer<typeof projectEntrySchema>;
export type CertificationEntryFormData = z.infer<typeof certificationEntrySchema>;
