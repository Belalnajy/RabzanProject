'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const routePermissions = [
  { prefix: '/dashboard/users', permission: 'manage_users' },
  { prefix: '/dashboard/roles', permission: 'manage_roles' },
  { prefix: '/dashboard/settings', permission: 'manage_settings' },
  { prefix: '/dashboard/reports', permission: 'view_reports' },
  { prefix: '/dashboard/categories', permission: 'view_categories' },
  { prefix: '/dashboard/products', permission: 'view_products' },
  { prefix: '/dashboard/customers', permission: 'view_customers' },
  { prefix: '/dashboard/finance', permission: 'view_dashboard' },
  { prefix: '/dashboard/transactions', permission: 'view_dashboard' },
  { prefix: '/dashboard/notifications', permission: 'view_dashboard' },
  { prefix: '/orders', permission: 'view_orders' },
  // the base /dashboard route:
  { prefix: '/dashboard', permission: 'view_dashboard', exact: true },
];

export default function RouteGuard({ children }) {
  const { hasPermission, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const routeMatch = routePermissions.find((route) => {
      if (route.exact) return pathname === route.prefix;
      return pathname === route.prefix || pathname.startsWith(route.prefix + '/');
    });

    if (routeMatch && !hasPermission(routeMatch.permission)) {
      // User does not have permission for this route
      if (pathname !== '/dashboard') {
        router.replace('/dashboard');
      } else {
        // If they don't even have access to the main dashboard, maybe redirect to their profile or somewhere safe, or show unauthorized
        router.replace('/dashboard/profile');
      }
    } else {
      setAuthorized(true);
    }
  }, [isLoading, isAuthenticated, hasPermission, pathname, router]);

  if (isLoading || !authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F9] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#B08B3A]" />
        <p className="text-[#040814] font-bold">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  return children;
}
