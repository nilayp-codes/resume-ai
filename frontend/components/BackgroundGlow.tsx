export default function BackgroundGlow() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
            {/* Soft Yellow/Pink Glow Center */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '60vw', height: '60vh', background: 'rgba(236, 72, 153, 0.05)',
                filter: 'blur(120px)', borderRadius: '50%',
            }} />
            
            {/* Purple Glow Top-Left */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-5%',
                width: '40vw', height: '40vh', background: 'rgba(139, 92, 246, 0.15)',
                filter: 'blur(120px)', borderRadius: '50%',
            }} />
            
            {/* Blue Glow Bottom-Right */}
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-5%',
                width: '50vw', height: '50vh', background: 'rgba(59, 130, 246, 0.15)',
                filter: 'blur(120px)', borderRadius: '50%',
            }} />
        </div>
    );
}
