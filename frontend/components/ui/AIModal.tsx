import React from 'react';
import { Sparkles, X, Check, RefreshCw } from 'lucide-react';

interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (text: string | string[]) => void;
    onRegenerate: () => void;
    isLoading: boolean;
    suggestion: string | string[] | null;
    title?: string;
}

export function AIModal({ isOpen, onClose, onAccept, onRegenerate, isLoading, suggestion, title = "AI Suggestion" }: AIModalProps) {
    if (!isOpen) return null;

    const isList = Array.isArray(suggestion);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(4px)',
            padding: '24px'
        }}>
            <div style={{
                background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#f8fafc'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: '#dbeafe', color: '#2563eb', padding: '6px', borderRadius: '8px' }}>
                            <Sparkles size={16} />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 20px', minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#334155' }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '32px 0' }}>
                            <div className="animate-spin" style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%' }} />
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Generating professional content...</p>
                        </div>
                    ) : suggestion ? (
                        <div style={{
                            background: '#f1f5f9', padding: '16px', borderRadius: '8px',
                            fontSize: '14px', lineHeight: 1.6, color: '#0f172a',
                            border: '1px solid #e2e8f0'
                        }}>
                            {isList ? (
                                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(suggestion as string[]).map((bullet, i) => (
                                        <li key={i}>{bullet}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ margin: 0 }}>{suggestion}</p>
                            )}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Something went wrong. Please try again.</p>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 20px', borderTop: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#f8fafc'
                }}>
                    <button
                        onClick={onRegenerate}
                        disabled={isLoading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px',
                            background: '#fff', border: '1px solid #cbd5e1', color: '#475569', fontSize: '14px', fontWeight: 500,
                            cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1
                        }}
                    >
                        <RefreshCw size={14} /> Regenerate
                    </button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', background: 'transparent',
                                border: '1px solid transparent', color: '#64748b', fontSize: '14px', fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => suggestion && onAccept(suggestion)}
                            disabled={isLoading || !suggestion}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px',
                                background: '#2563eb', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 500,
                                cursor: (isLoading || !suggestion) ? 'not-allowed' : 'pointer', opacity: (isLoading || !suggestion) ? 0.6 : 1
                            }}
                        >
                            <Check size={16} /> Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
