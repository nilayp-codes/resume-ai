import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface AIAssistButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    label?: string;
    className?: string;
}

export function AIAssistButton({ onClick, isLoading, label = "Improve", className = "" }: AIAssistButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #dbeafe',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
            }}
            className={className}
        >
            {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <Sparkles size={14} />
            )}
            {isLoading ? "Generating..." : label}
        </button>
    );
}
