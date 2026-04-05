'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import { AuthHeader, AuthInput, AuthButton, AuthDivider, ErrorBanner } from '../../../components/auth/AuthShared';

export default function LoginPage() {
  const { t } = useTranslation();
  // TODO: Map to actual backend state
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // Example text: t('auth.loginError')

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckbox = (e) => setFormData({ ...formData, rememberMe: e.target.checked });

  // TODO: Wire this to POST /api/login
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit Login', formData);
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
        <Link href="/forgot-password" className="text-[#B08B3A] hover:text-white transition-colors">
          {t('auth.forgotPassword')}
        </Link>
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

      <AuthButton>{t('auth.login')}</AuthButton>
      <AuthDivider />
      
      <div className="text-center text-sm text-[#8B95A5]">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="text-[#B08B3A] hover:text-white transition-colors">
          {t('auth.register')}
        </Link>
      </div>
    </form>
  );
}
