'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, SuccessBanner } from '../../../components/auth/AuthShared';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  // TODO: Map to actual backend state
  const [formData, setFormData] = useState({ newPassword: '', confirmNewPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // TODO: Wire this to POST /api/reset-password
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit New Password', formData);
    // Simulate API success
    setIsSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthHeader title={t('auth.resetPassword')} />
      
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

      <AuthButton>{t('auth.changePassword')}</AuthButton>
      
      <div className="text-center text-sm mt-6">
        <Link href="/login" className="text-[#505A6F] hover:text-white transition-colors">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </form>
  );
}
