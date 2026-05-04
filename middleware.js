import { NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'rabzan_token';

const PROTECTED_PREFIXES = ['/dashboard', '/orders', '/customers'];
const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

function isProtected(pathname) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isAuthPage(pathname) {
  return AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (isProtected(pathname) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
