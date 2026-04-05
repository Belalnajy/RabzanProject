'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, AuthDivider } from '../../../components/auth/AuthShared';

export default function RegisterPage() {
  const { t } = useTranslation();
  // TODO: Map to actual backend state
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // TODO: Wire this to POST /api/register
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit Register', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthHeader title={t('auth.register')} />
      
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

      <AuthButton>{t('auth.register')}</AuthButton>
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
