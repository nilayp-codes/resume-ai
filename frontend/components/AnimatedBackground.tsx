'use client';

export default function AnimatedBackground() {
    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
        }}>
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: 600,
                height: 600,
                background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float1 8s ease-in-out infinite',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                width: 500,
                height: 500,
                background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float2 10s ease-in-out infinite',
            }} />
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                width: 400,
                height: 400,
                background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float1 12s ease-in-out infinite reverse',
            }} />
            <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -20px); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-20px, 30px); }
                }
            `}</style>
        </div>
    );
}
