'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { authApi } from '@/lib/api';
import { setToken, setStoredUser } from '@/lib/auth';
import { extractApiError } from '@/lib/utils';
import BackgroundGlow from '@/components/BackgroundGlow';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register: reg,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            const response = await authApi.register({
                email: data.email, password: data.password, full_name: data.full_name,
            });
            setToken(response.access_token);
            setStoredUser(response.user);
            toast.success('Account created! Welcome to ResumeAI 🎉');
            router.push('/dashboard');
        } catch (err) {
            toast.error(extractApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const inputBase: React.CSSProperties = {
        width: '100%', background: '#ffffff',
        border: '1px solid #d1d5db', borderRadius: 12, fontSize: 15,
        color: '#111827', outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
            <BackgroundGlow />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ fontSize: 22, fontWeight: 700, color: '#111827', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                        ResumeAI
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginTop: 24, marginBottom: 4, letterSpacing: '-0.02em' }}>Create your account</h1>
                    <p style={{ fontSize: 15, color: '#6b7280' }}>Free forever. No credit card needed.</p>
                </div>

                {/* Form Card */}
                <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.5)', padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Full Name */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Full name (optional)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                    <User size={18} />
                                </span>
                                <input
                                    {...reg('full_name')}
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Jane Doe"
                                    style={{ ...inputBase, padding: '12px 14px 12px 42px' }}
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            {errors.full_name && <p style={{ marginTop: 6, fontSize: 12, color: '#ef4444' }}>{errors.full_name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Email address</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                    <Mail size={18} />
                                </span>
                                <input
                                    {...reg('email')}
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    style={{ ...inputBase, padding: '12px 14px 12px 42px' }}
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            {errors.email && <p style={{ marginTop: 6, fontSize: 12, color: '#ef4444' }}>{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                    <Lock size={18} />
                                </span>
                                <input
                                    {...reg('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Min. 6 characters"
                                    style={{ ...inputBase, padding: '12px 42px 12px 42px' }}
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ marginTop: 6, fontSize: 12, color: '#ef4444' }}>{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Confirm password</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                    <Lock size={18} />
                                </span>
                                <input
                                    {...reg('confirm_password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    style={{ ...inputBase, padding: '12px 14px 12px 42px' }}
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            {errors.confirm_password && <p style={{ marginTop: 6, fontSize: 12, color: '#ef4444' }}>{errors.confirm_password.message}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px 0', marginTop: 8,
                                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                color: '#ffffff', border: 'none', borderRadius: 12,
                                fontSize: 15, fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
                            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Free Account'}
                        </button>
                    </form>

                    <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#6b7280' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
