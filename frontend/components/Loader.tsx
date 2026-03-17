'use client';

import { motion } from 'framer-motion';

export default function Loader() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            zIndex: 9999,
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: '4px solid #eff6ff',
                    borderTopColor: '#2563eb',
                    borderRightColor: '#6366f1',
                }}
            />
        </div>
    );
}
