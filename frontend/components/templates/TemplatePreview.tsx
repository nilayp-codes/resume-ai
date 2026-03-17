'use client';

/**
 * Mocked resume previews for 3 template styles.
 * These are structural representations rendered with inline styles.
 */

// ── Modern Clean ──────────────────────────────────────────────────────────────
export function ModernPreview() {
    return (
        <div style={{ width: '100%', aspectRatio: '8.5/11', background: '#fff', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
            {/* Blue top line */}
            <div style={{ height: 4, background: '#2563eb', width: '100%' }} />
            <div style={{ padding: '16px 14px' }}>
                <div style={{ height: 10, width: '55%', background: '#111827', borderRadius: 2, marginBottom: 4 }} />
                <div style={{ height: 5, width: '35%', background: '#6b7280', borderRadius: 2, marginBottom: 3 }} />
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    <div style={{ height: 4, width: '20%', background: '#d1d5db', borderRadius: 1 }} />
                    <div style={{ height: 4, width: '22%', background: '#d1d5db', borderRadius: 1 }} />
                    <div style={{ height: 4, width: '18%', background: '#d1d5db', borderRadius: 1 }} />
                </div>
                <div style={{ height: 1, background: '#e5e7eb', marginBottom: 8 }} />
                {/* Summary */}
                <div style={{ height: 6, width: '18%', background: '#2563eb', borderRadius: 1, marginBottom: 5 }} />
                {[90, 85, 70].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#e5e7eb', borderRadius: 1, marginBottom: 3 }} />)}
                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
                {/* Experience */}
                <div style={{ height: 6, width: '22%', background: '#2563eb', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ height: 5, width: '40%', background: '#374151', borderRadius: 1, marginBottom: 3 }} />
                <div style={{ height: 4, width: '30%', background: '#9ca3af', borderRadius: 1, marginBottom: 4 }} />
                {[80, 75, 65, 55].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#f3f4f6', borderRadius: 1, marginBottom: 2 }} />)}
                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
                {/* Education */}
                <div style={{ height: 6, width: '18%', background: '#2563eb', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ height: 5, width: '45%', background: '#374151', borderRadius: 1, marginBottom: 3 }} />
                <div style={{ height: 4, width: '35%', background: '#9ca3af', borderRadius: 1, marginBottom: 2 }} />
            </div>
        </div>
    );
}

// ── Executive Dark Sidebar ────────────────────────────────────────────────────
export function ExecutivePreview() {
    return (
        <div style={{ width: '100%', aspectRatio: '8.5/11', background: '#fff', fontFamily: 'sans-serif', display: 'grid', gridTemplateColumns: '2fr 1fr', overflow: 'hidden' }}>
            {/* Main content area (left, first in DOM for ATS) */}
            <div style={{ padding: '16px 12px' }}>
                {/* Header with name + photo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                        <div style={{ height: 10, width: '80%', background: '#111827', borderRadius: 2, marginBottom: 4 }} />
                        <div style={{ height: 5, width: '50%', background: '#9ca3af', borderRadius: 1 }} />
                    </div>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e5e7eb', flexShrink: 0 }} />
                </div>
                <div style={{ height: 1, background: '#e5e7eb', marginBottom: 8 }} />
                {/* Summary */}
                <div style={{ height: 5, width: '20%', background: '#111827', borderRadius: 1, marginBottom: 5 }} />
                {[90, 85, 72].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#f3f4f6', borderRadius: 1, marginBottom: 2 }} />)}
                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
                {/* Experience */}
                <div style={{ height: 5, width: '28%', background: '#111827', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ height: 5, width: '45%', background: '#374151', borderRadius: 1, marginBottom: 3 }} />
                <div style={{ height: 4, width: '30%', background: '#9ca3af', borderRadius: 1, marginBottom: 4 }} />
                {[75, 68, 55, 50].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#f3f4f6', borderRadius: 1, marginBottom: 2 }} />)}
                <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
                {/* Education */}
                <div style={{ height: 5, width: '22%', background: '#111827', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ height: 5, width: '50%', background: '#374151', borderRadius: 1, marginBottom: 2 }} />
                <div style={{ height: 4, width: '38%', background: '#9ca3af', borderRadius: 1 }} />
            </div>
            {/* Dark sidebar (right, after main in DOM) */}
            <div style={{ background: '#18181b', padding: '16px 10px' }}>
                <div style={{ height: 4, width: '60%', background: '#fafafa', borderRadius: 1, marginBottom: 5 }} />
                {[70, 80, 60].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#3f3f46', borderRadius: 1, marginBottom: 2 }} />)}
                <div style={{ height: 4, width: '50%', background: '#fafafa', borderRadius: 1, marginTop: 10, marginBottom: 5 }} />
                {['70%', '55%', '80%', '60%'].map((w, i) => (
                    <div key={i} style={{ height: 3, width: w, background: '#3f3f46', borderRadius: 1, marginBottom: 2 }} />
                ))}
                <div style={{ height: 4, width: '45%', background: '#fafafa', borderRadius: 1, marginTop: 10, marginBottom: 5 }} />
                {[65, 75].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#3f3f46', borderRadius: 1, marginBottom: 2 }} />)}
            </div>
        </div>
    );
}

// ── Classic Minimal ───────────────────────────────────────────────────────────
export function ClassicPreview() {
    return (
        <div style={{ width: '100%', aspectRatio: '8.5/11', background: '#fff', fontFamily: 'serif', overflow: 'hidden' }}>
            <div style={{ padding: '16px 14px', textAlign: 'center' as const }}>
                <div style={{ height: 10, width: '50%', background: '#111827', borderRadius: 1, margin: '0 auto 4px' }} />
                <div style={{ height: 4, width: '30%', background: '#6b7280', borderRadius: 1, margin: '0 auto 3px' }} />
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
                    <div style={{ height: 3, width: '15%', background: '#d1d5db', borderRadius: 1 }} />
                    <div style={{ height: 3, width: '18%', background: '#d1d5db', borderRadius: 1 }} />
                    <div style={{ height: 3, width: '15%', background: '#d1d5db', borderRadius: 1 }} />
                </div>
                <div style={{ height: 2, background: '#111827', marginBottom: 8 }} />
            </div>
            <div style={{ padding: '0 14px' }}>
                <div style={{ height: 6, width: '25%', background: '#111827', borderRadius: 1, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 2 }} />
                {[88, 82, 72].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#e5e7eb', borderRadius: 1, marginBottom: 2 }} />)}
                <div style={{ height: 2, background: '#111827', margin: '8px 0' }} />
                <div style={{ height: 6, width: '28%', background: '#111827', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ height: 5, width: '45%', background: '#374151', borderRadius: 1, marginBottom: 3 }} />
                <div style={{ height: 4, width: '30%', background: '#9ca3af', borderRadius: 1, marginBottom: 4 }} />
                {[78, 70, 62, 50].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#f3f4f6', borderRadius: 1, marginBottom: 2 }} />)}
                <div style={{ height: 2, background: '#111827', margin: '8px 0' }} />
                <div style={{ height: 6, width: '22%', background: '#111827', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ height: 5, width: '50%', background: '#374151', borderRadius: 1, marginBottom: 2 }} />
                <div style={{ height: 4, width: '40%', background: '#9ca3af', borderRadius: 1 }} />
            </div>
        </div>
    );
}
