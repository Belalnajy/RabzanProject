'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, AuthDivider, ErrorBanner } from '@/components/auth/AuthShared';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckbox = (e) => setFormData({ ...formData, rememberMe: e.target.checked });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.replace(redirect);
    } catch (err) {
      setError(err.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthHeader title={t('auth.login')} />

      {error && <ErrorBanner message={error} />}

      <AuthInput icon={Mail} type="text" name="email" placeholder={t('auth.emailUsername')} value={formData.email} onChange={handleChange} />

      <AuthInput
        icon={Lock} type="password" name="password" placeholder={t('auth.password')}
        value={formData.password} onChange={handleChange}
        showPasswordToggle passwordVisible={showPassword} onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <div className="flex justify-between items-center mb-6 text-sm">
        {/* <Link href="/forgot-password" className="text-[#B08B3A] hover:text-white transition-colors">
          {t('auth.forgotPassword')}
        </Link> */}
        <label className="flex items-center gap-2 cursor-pointer text-[#8B95A5] hover:text-white transition-colors">
          <span className="pt-0.5">{t('auth.rememberMe')}</span>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleCheckbox}
            className="w-[18px] h-[18px] rounded border-[#161a25] bg-[#090A11] checked:bg-[#B08B3A] cursor-pointer appearance-none checked:before:content-['✓'] flex items-center justify-center text-white"
          />
        </label>
      </div>

      <AuthButton loading={loading}>{t('auth.login')}</AuthButton>
      {/* <AuthDivider /> */}
{/* 
      <div className="text-center text-sm text-[#8B95A5]">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="text-[#B08B3A] hover:text-white transition-colors">
          {t('auth.register')}
        </Link>
      </div> */}
    </form>
  );
}
