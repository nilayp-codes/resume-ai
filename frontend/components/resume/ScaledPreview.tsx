'use client';

import React from 'react';

/**
 * ScaledPreview
 * 
 * Safely wraps an exact A4 page (794x1123) and scales it down visually 
 * without breaking the document's internal layout or causing overflow.
 * 
 * The outer container reserves the precise scaled dimensions, while the
 * inner container applies the CSS transform.
 * 
 * During print, the transform is ignored so the page prints at full A4 size.
 */
export function ScaledPreview({
    children,
    scale = 0.75
}: {
    children: React.ReactNode;
    scale?: number;
}) {
    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;

    return (
        <div
            className="scaled-preview-container"
            style={{
                width: A4_WIDTH * scale,
                height: A4_HEIGHT * scale,
                position: 'relative',
                margin: '0 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <div
                className="scaled-preview-inner"
                style={{
                    width: A4_WIDTH,
                    height: A4_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                {children}
            </div>
        </div>
    );
}
