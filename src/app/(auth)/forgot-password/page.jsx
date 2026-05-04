'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, SuccessBanner, ErrorBanner } from '@/components/auth/AuthShared';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'تعذر إرسال الرابط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthHeader title={t('auth.forgotPassword')} />

      {error && <ErrorBanner message={error} />}
      {isSuccess && <SuccessBanner message={t('auth.resetLinkSent')} />}

      <AuthInput
        icon={Mail} type="text" name="email"
        placeholder={t('auth.emailUsername')}
        value={email} onChange={(e) => setEmail(e.target.value)}
      />

      <AuthButton loading={loading}>{t('auth.sendResetLink')}</AuthButton>

      <div className="text-center text-sm mt-6">
        <Link href="/login" className="text-[#505A6F] hover:text-white transition-colors">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </form>
  );
}
