'use client';

import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Workflow from '@/components/Workflow';
import AiDemo from '@/components/AiDemo';
import CTA from '@/components/CTA';
import Loader from '@/components/Loader';
import BackgroundGlow from '@/components/BackgroundGlow';
import TemplatesShowcase from '@/components/TemplatesShowcase';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function HomePage() {
  const [authed, setAuthed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
      setAuthed(isAuthenticated());
      setIsMounted(true);
  }, []);

  if (!isMounted) return <Loader />;

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', overflowX: 'hidden' }}>
      <Navbar authed={authed} />
      <BackgroundGlow />

      {/* Hero Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}>
        <Hero authed={authed} />
      </motion.div>

      {/* Feature Highlights */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}>
        <Features />
      </motion.div>

      {/* Templates Showcase */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}>
        <TemplatesShowcase />
      </motion.div>

      {/* AI Demo (New Section) */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}>
        <AiDemo />
      </motion.div>

      {/* AI Workflow Steps */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}>
        <Workflow />
      </motion.div>

      {/* Final Call To Action */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}>
        <CTA authed={authed} />
      </motion.div>

      {/* Footer */}
      <footer style={{
          background: '#1E1E1E',
          padding: '80px 40px 40px',
          position: 'relative',
          overflow: 'hidden',
      }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 48, marginBottom: 80 }}>
                  <div>
                      <p style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: 24, fontWeight: 700,
                          textTransform: 'uppercase' as const,
                          color: '#E4E2DD', letterSpacing: '0.05em',
                          marginBottom: 16,
                      }}>
                          ResumeAI
                      </p>
                      <p style={{
                          fontFamily: "'Satoshi', sans-serif",
                          fontSize: 14, color: 'rgba(228,226,221,0.5)',
                          maxWidth: 280, lineHeight: 1.6,
                      }}>
                          AI-powered resume builder with professional templates and ATS-friendly PDF export.
                      </p>
                  </div>
                  <div style={{ display: 'flex', gap: 64 }}>
                      <div>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(228,226,221,0.4)', marginBottom: 16 }}>Product</p>
                          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                              {['Templates', 'AI Writer', 'PDF Export', 'Dashboard'].map(item => (
                                  <span key={item} style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: 'rgba(228,226,221,0.6)' }}>{item}</span>
                              ))}
                          </div>
                      </div>
                      <div>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(228,226,221,0.4)', marginBottom: 16 }}>Company</p>
                          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                              {['About', 'GitHub', 'Contact', 'Privacy'].map(item => (
                                  <span key={item} style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: 'rgba(228,226,221,0.6)' }}>{item}</span>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(228,226,221,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: 'rgba(228,226,221,0.3)', margin: 0 }}>
                      © 2026 ResumeAI. All rights reserved.
                  </p>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: 'rgba(228,226,221,0.3)', margin: 0 }}>
                      Built by Nilay Pandey
                  </p>
              </div>
          </div>
      </footer>
    </div>
  );
}
