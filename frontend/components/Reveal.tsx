'use client';

import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    yOffset?: number;
}

export const Reveal = ({ children, width = 'fit-content', delay = 0.2, yOffset = 40 }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start('visible');
        }
    }, [isInView, mainControls]);

    return (
        <div ref={ref} style={{ position: 'relative', width, overflow: 'visible' }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: yOffset },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </div>
    );
};
