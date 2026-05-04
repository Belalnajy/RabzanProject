'use client';

import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/dashboard/Header';
import { Save, User, Mail, Phone, Lock, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/dashboard/DataStates';
import { profileService } from '@/lib/services/profile.service';
import { useAuth } from '@/contexts/AuthContext';

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '');

function buildAvatarUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const cleaned = path.replace(/^\.?\//, '');
  return `${API_ORIGIN}/${cleaned}`;
}

function getInitials(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + '.' + parts[1].slice(0, 1);
}

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const { data: profile, loading, error, refetch } = useApi(() => profileService.get(), []);
  const { mutate: updateProfileMut, loading: savingProfile } = useMutation((data) => profileService.update(data));
  const { mutate: changePasswordMut, loading: savingPassword } = useMutation((data) => profileService.changePassword(data));
  const { mutate: uploadAvatarMut, loading: uploadingAvatar } = useMutation((file) => profileService.uploadAvatar(file));

  const [profileData, setProfileData] = useState({ fullName: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.fullName ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
      });
    }
  }, [profile]);

  const flash = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfileMut({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone || null,
      });
      updateUser({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone || null,
      });
      flash('success', 'تم حفظ الملف الشخصي بنجاح');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر حفظ التغييرات');
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      flash('error', 'كلمتا المرور الجديدة غير متطابقتين');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      flash('error', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    try {
      await changePasswordMut({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      flash('success', 'تم تغيير كلمة المرور بنجاح');
    } catch (err) {
      flash('error', err?.message || 'تعذر تغيير كلمة المرور');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      flash('error', 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
      return;
    }
    try {
      const res = await uploadAvatarMut(file);
      updateUser({ avatar: res?.avatar });
      flash('success', 'تم تحديث الصورة الشخصية بنجاح');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر رفع الصورة');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) return <LoadingState message="جاري تحميل الملف الشخصي..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const avatarUrl = buildAvatarUrl(profile?.avatar);
  const roleName = profile?.role?.name || '—';

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex flex-col mb-8 mt-[-1rem]">
        <h1 className="text-2xl font-black text-[#040814] mb-1">الملف الشخصي</h1>
        <p className="text-sm font-bold text-gray-500">إدارة معلومات حسابك الشخصي وكلمة المرور</p>
      </div>

      {feedback && (
        <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-1 flex flex-col gap-8">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-[#040814] mb-8">المعلومات الشخصية</h2>

            <div className="flex items-center gap-6 mb-8 border-b border-gray-50 pb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-tr from-[#B08B3A] to-[#F1D792] flex items-center justify-center text-[#040814] font-black text-3xl overflow-hidden shadow-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(profileData.fullName)}</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 bg-white border border-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                  title="تغيير الصورة"
                >
                  <Camera size={14} strokeWidth={2.5} />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#040814] mb-1">{profileData.fullName || '—'}</h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                  {roleName}
                </span>
                {uploadingAvatar && (
                  <p className="text-xs text-gray-500 font-bold mt-2">جاري رفع الصورة...</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Field label="الاسم الكامل" icon={User}>
                <input type="text" name="fullName" value={profileData.fullName}
                  onChange={(e) => setProfileData((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  required />
              </Field>

              <Field label="البريد الإلكتروني" icon={Mail} ltr>
                <input type="email" name="email" value={profileData.email}
                  onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                  dir="ltr" required />
              </Field>

              <Field label="رقم الهاتف" icon={Phone} ltr>
                <input type="tel" name="phone" value={profileData.phone}
                  onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+201234567890"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                  dir="ltr" />
              </Field>

              <Field label="الدور" icon={User}>
                <input type="text" value={roleName} disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-sm font-bold text-gray-500 outline-none cursor-not-allowed" />
              </Field>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none disabled:opacity-60"
              >
                <Save size={18} strokeWidth={2.5} />
                {savingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-8">
          <form onSubmit={handleSavePassword} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-[#040814] mb-8">تغيير كلمة المرور</h2>

            <div className="flex flex-col gap-5 mb-8">
              <PasswordField
                label="كلمة المرور الحالية" name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
              />
              <PasswordField
                label="كلمة المرور الجديدة" name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
              />
              <PasswordField
                label="تأكيد كلمة المرور الجديدة" name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full flex items-center justify-center gap-2 bg-[#040814] hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none disabled:opacity-60"
            >
              {savingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function Field({ label, icon: Icon, ltr, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-black text-[#040814]">{label}</label>
      <div className="relative">
        {children}
        {Icon && (
          <Icon className={`absolute ${ltr ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
        )}
      </div>
    </div>
  );
}

function PasswordField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-black text-[#040814]">{label}</label>
      <div className="relative">
        <input
          type="password" name={name} value={value} onChange={onChange}
          placeholder="••••••••" minLength={8} dir="ltr" required
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
        />
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  );
}
