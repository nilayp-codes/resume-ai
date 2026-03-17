// TypeScript interfaces for the Resume Generator application

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ─── Resume Data Types ────────────────────────────────────────────────────────

export interface BasicInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  job_title: string;
  photo_url?: string;
}

export interface ExperienceEntry {
  id: string; // client-side only for keying
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface SchoolEntry {
  school_name: string;
  board: string;
  year: string;
}

export interface CollegeEntry {
  college_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: string;
}

export interface UnifiedEducation {
  school10: SchoolEntry | null;
  school12: SchoolEntry | null;
  college: CollegeEntry | null;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  tech_stack: string;
  url: string;
  github: string;
  bullets: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface SkillsData {
  technical: string[];
  soft: string[];
  languages: string[];
  tools: string[];
}

export interface ResumeData {
  basic_info: BasicInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: UnifiedEducation;
  projects: ProjectEntry[];
  skills: SkillsData;
  certifications: CertificationEntry[];
}

// ─── Resume API Types ─────────────────────────────────────────────────────────

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template_type: TemplateType;
  color_theme: ColorTheme;
  font_family: FontFamily;
  resume_data: ResumeData;
  created_at: string;
  updated_at: string;
}

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version_number: number;
  resume_data: ResumeData;
  template_type: string;
  color_theme: string;
  saved_at: string;
  note: string | null;
}

// ─── Template & Style Types ───────────────────────────────────────────────────

export type TemplateType = 'modern' | 'executive' | 'classic';
export type ColorTheme = 'blue' | 'gray' | 'black' | 'green' | 'purple';
export type FontFamily = 'inter' | 'georgia' | 'roboto' | 'merriweather' | 'opensans';

export const TEMPLATE_OPTIONS = [
  {
    id: 'modern' as TemplateType,
    name: 'Modern Clean',
    description: 'Bold header with blue accent. Clean single-column layout.',
    preview: 'Single column layout with clear sections',
  },
  {
    id: 'executive' as TemplateType,
    name: 'Executive Dark',
    description: 'Premium dark sidebar with photo support. ATS-compliant grid layout.',
    preview: 'Dark sidebar with main content area and photo',
  },
  {
    id: 'classic' as TemplateType,
    name: 'Classic Corporate',
    description: 'Timeless serif typography with strong dividers.',
    preview: 'Traditional layout with serif fonts',
  },
] as const;

export const COLOR_THEME_OPTIONS = [
  { id: 'blue' as ColorTheme, label: 'Ocean Blue', color: '#1e40af' },
  { id: 'gray' as ColorTheme, label: 'Slate Gray', color: '#374151' },
  { id: 'black' as ColorTheme, label: 'Classic Black', color: '#111827' },
  { id: 'green' as ColorTheme, label: 'Forest Green', color: '#065f46' },
  { id: 'purple' as ColorTheme, label: 'Royal Purple', color: '#4c1d95' },
] as const;

export const FONT_OPTIONS = [
  { id: 'inter' as FontFamily, label: 'Inter (Modern)' },
  { id: 'georgia' as FontFamily, label: 'Georgia (Classic)' },
  { id: 'roboto' as FontFamily, label: 'Roboto (Clean)' },
  { id: 'merriweather' as FontFamily, label: 'Merriweather (Elegant)' },
  { id: 'opensans' as FontFamily, label: 'Open Sans (Readable)' },
] as const;

// ─── Default Empty Resume Data ────────────────────────────────────────────────

export const DEFAULT_RESUME_DATA: ResumeData = {
  basic_info: {
    full_name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    job_title: '',
  },
  summary: '',
  experience: [],
  education: {
    school10: null,
    school12: null,
    college: null,
  },
  projects: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    tools: [],
  },
  certifications: [],
};
