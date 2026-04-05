'use client';

import React from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthHeader = ({ title }) => (
  <div className="flex flex-col items-center mb-8">
    <h2 className="text-[22px] font-bold text-white mb-4">{title}</h2>
    <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#B08B3A] to-transparent" />
  </div>
);

export const AuthInput = ({ icon: Icon, type, placeholder, name, value, onChange, showPasswordToggle, onTogglePassword, passwordVisible }) => {
  return (
    <div className="relative mb-4">
      {Icon && (
        <div className="absolute top-1/2 -translate-y-1/2 start-4 text-[#505A6F] pointer-events-none">
          <Icon size={20} />
        </div>
      )}
      <input
        type={showPasswordToggle && passwordVisible ? 'text' : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#090A11] border border-[#161a25] rounded-xl py-[14px] ps-12 pe-12 text-white text-sm focus:outline-none focus:border-[#B08B3A] focus:ring-1 focus:ring-[#B08B3A] transition-all placeholder:text-[#505A6F]"
      />
      {showPasswordToggle && (
        <button 
          type="button" 
          onClick={onTogglePassword}
          className="absolute top-1/2 -translate-y-1/2 end-4 text-[#505A6F] hover:text-white transition-colors"
        >
          {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export const AuthButton = ({ children, onClick, type = "submit" }) => (
  <button 
    type={type}
    onClick={onClick}
    className="w-full bg-[#B08B3A] hover:bg-[#c29c45] text-white font-medium py-[14px] rounded-xl transition-colors mt-2"
  >
    {children}
  </button>
);

export const AuthDivider = () => (
  <div className="flex items-center my-6">
    <div className="flex-1 h-[1px] bg-[#161a25]"></div>
    <span className="px-4 text-[#505A6F] text-sm">أو</span>
    <div className="flex-1 h-[1px] bg-[#161a25]"></div>
  </div>
);

export const SuccessBanner = ({ message }) => (
  <div className="flex items-center gap-3 bg-[#0A2016] border border-[#123624] text-[#1EB862] px-4 py-3 rounded-xl mb-6 text-sm">
    <CheckCircle2 size={18} className="flex-shrink-0" />
    <p>{message}</p>
  </div>
);

export const ErrorBanner = ({ message }) => (
  <div className="flex items-center gap-3 bg-[#2D1115] border border-[#4B1921] text-[#E03A4B] px-4 py-3 rounded-xl mb-6 text-sm">
    <AlertCircle size={18} className="flex-shrink-0" />
    <p>{message}</p>
  </div>
);
