'use client';

import { useState } from 'react';

interface TemplateCardProps {
    name: string;
    description: string;
    preview: React.ReactNode;
    onClick: () => void;
}

export default function TemplateCard({ name, description, preview, onClick }: TemplateCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative', cursor: 'pointer', borderRadius: 16,
                overflow: 'hidden', border: '1px solid #e5e7eb',
                boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
                transform: hovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.25s ease',
                background: '#ffffff',
            }}
        >
            {/* Resume Preview */}
            <div style={{ borderBottom: '1px solid #f3f4f6' }}>
                {preview}
            </div>

            {/* Card Info (below preview) */}
            <div style={{ padding: '14px 16px 16px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>{name}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>{description}</p>
            </div>

            {/* Hover Overlay with CTA */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(3px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 12,
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.25s ease',
                pointerEvents: hovered ? 'auto' as const : 'none' as const,
            }}>
                <button style={{
                    padding: '12px 28px', background: '#2563eb', color: '#ffffff',
                    border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                    transition: 'background 0.2s',
                }}>
                    Use This Template
                </button>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Click to start building</span>
            </div>
        </div>
    );
}
