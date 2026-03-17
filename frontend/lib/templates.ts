export const TEMPLATES = [
    {
        id: 'modern',
        name: 'Modern Clean',
        description: 'Bold header with blue accent. Clean single-column layout for maximum readability.',
        color: '#3b82f6',
        bg: '#eff6ff'
    },
    {
        id: 'executive',
        name: 'Executive Dark',
        description: 'Premium dark sidebar with photo support. ATS-compliant grid layout.',
        color: '#8b5cf6',
        bg: '#f5f3ff'
    },
    {
        id: 'classic',
        name: 'Classic Corporate',
        description: 'Timeless serif typography with strong dividers. Ideal for traditional industries.',
        color: '#10b981',
        bg: '#ecfdf5'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'No-nonsense minimalist structure. Focus entirely on content and achievements.',
        color: '#6366f1',
        bg: '#e0e7ff'
    }
];

export const TEMPLATE_LABELS: Record<string, string> = 
    TEMPLATES.reduce((acc, tpl) => ({ ...acc, [tpl.id]: tpl.name }), {});
