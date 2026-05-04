'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, AuthDivider, ErrorBanner, SuccessBanner } from '@/components/auth/AuthShared';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('تم إنشاء الحساب بنجاح. جاري التحويل لتسجيل الدخول...');
      setTimeout(() => router.replace('/login'), 1500);
    } catch (err) {
      setError(err.message || 'تعذر إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthHeader title={t('auth.register')} />

      {error && <ErrorBanner message={error} />}
      {success && <SuccessBanner message={success} />}

      <AuthInput icon={User} type="text" name="fullName" placeholder={t('auth.fullName')} value={formData.fullName} onChange={handleChange} />
      <AuthInput icon={Mail} type="text" name="email" placeholder={t('auth.emailUsername')} value={formData.email} onChange={handleChange} />

      <AuthInput
        icon={Lock} type="password" name="password" placeholder={t('auth.password')}
        value={formData.password} onChange={handleChange}
        showPasswordToggle passwordVisible={showPassword} onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <AuthInput
        icon={Lock} type="password" name="confirmPassword" placeholder={t('auth.confirmPassword')}
        value={formData.confirmPassword} onChange={handleChange}
        showPasswordToggle passwordVisible={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <AuthButton loading={loading}>{t('auth.register')}</AuthButton>
      <AuthDivider />

      <div className="text-center text-sm text-[#8B95A5]">
        {t('auth.haveAccount')}{' '}
        <Link href="/login" className="text-[#B08B3A] hover:text-white transition-colors">
          {t('auth.login')}
        </Link>
      </div>
    </form>
  );
}
