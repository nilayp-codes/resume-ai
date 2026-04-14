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
        borderTop: '1px solid #e5e7eb', padding: '40px 24px',
        textAlign: 'center' as const, background: '#ffffff',
      }}>
        <p style={{ fontSize: 14, color: '#9ca3af', margin: 0, fontWeight: 500 }}>
          © 2026 ResumeAI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
