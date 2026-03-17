'use client';

import React from 'react';

/**
 * A4Wrapper — Single source of truth for A4 page dimensions.
 * Uses fixed height + overflow:hidden to guarantee exactly one page.
 * Padding is built in via box-sizing: border-box.
 */
export const A4Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            id="resume-preview"
            className="a4-page"
            style={{
                width: "794px",
                height: "1123px",
                background: "#ffffff",
                padding: "32px",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {children}
        </div>
    );
};
