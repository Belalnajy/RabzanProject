'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, SuccessBanner } from '../../../components/auth/AuthShared';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  // TODO: Map to actual backend state
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // TODO: Wire this to POST /api/forgot-password
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Request Password Reset for:', email);
    // Simulate API success
    setIsSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthHeader title={t('auth.forgotPassword')} />
      
      {isSuccess && <SuccessBanner message={t('auth.resetLinkSent')} />}

      <AuthInput 
        icon={Mail} type="text" name="email" 
        placeholder={t('auth.emailUsername')} 
        value={email} onChange={(e) => setEmail(e.target.value)} 
      />

      <AuthButton>{t('auth.sendResetLink')}</AuthButton>
      
      <div className="text-center text-sm mt-6">
        <Link href="/login" className="text-[#505A6F] hover:text-white transition-colors">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </form>
  );
}
