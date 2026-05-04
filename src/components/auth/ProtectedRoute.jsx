'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ permissionKey, children }) {
  const { hasPermission, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hasPermission(permissionKey)) {
      router.replace('/dashboard');
    }
  }, [hasPermission, isLoading, permissionKey, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!hasPermission(permissionKey)) {
    return null;
  }

  return children;
}
