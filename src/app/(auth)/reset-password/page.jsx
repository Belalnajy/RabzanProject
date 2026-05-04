'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, SuccessBanner, ErrorBanner } from '@/components/auth/AuthShared';
import { useAuth } from '@/contexts/AuthContext';

function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({ newPassword: '', confirmNewPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!token) {
      setError('رابط غير صالح. الرجاء طلب رابط جديد.');
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });
      setIsSuccess(true);
      setTimeout(() => router.replace('/login'), 1500);
    } catch (err) {
      setError(err.message || 'تعذر تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthHeader title={t('auth.resetPassword')} />

      {error && <ErrorBanner message={error} />}
      {isSuccess && <SuccessBanner message={t('auth.passwordChanged')} />}

      <AuthInput
        icon={Lock} type="password" name="newPassword" placeholder={t('auth.newPassword')}
        value={formData.newPassword} onChange={handleChange}
        showPasswordToggle passwordVisible={showPassword} onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <AuthInput
        icon={Lock} type="password" name="confirmNewPassword" placeholder={t('auth.confirmNewPassword')}
        value={formData.confirmNewPassword} onChange={handleChange}
        showPasswordToggle passwordVisible={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <AuthButton loading={loading}>{t('auth.changePassword')}</AuthButton>

      <div className="text-center text-sm mt-6">
        <Link href="/login" className="text-[#505A6F] hover:text-white transition-colors">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
