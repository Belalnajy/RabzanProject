/**
 * Auth Storage — Single source of truth for token & user persistence.
 *
 * Token: stored in a cookie so Next.js middleware can read it during SSR.
 * User:  stored in localStorage for fast client-side access (non-sensitive).
 *
 * All functions are SSR-safe (no-op on the server).
 */

const TOKEN_COOKIE_NAME = 'rabzan_token';
const USER_STORAGE_KEY = 'rabzan_user';
const TOKEN_MAX_AGE_DAYS = 7;

const isBrowser = () => typeof window !== 'undefined';

function setCookie(name, value, days) {
  if (!isBrowser()) return;
  const maxAge = days * 24 * 60 * 60;
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureFlag}`;
}

function getCookie(name) {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export const authStorage = {
  getToken() {
    return getCookie(TOKEN_COOKIE_NAME);
  },

  setToken(token) {
    setCookie(TOKEN_COOKIE_NAME, token, TOKEN_MAX_AGE_DAYS);
  },

  getUser() {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (!isBrowser()) return;
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  clear() {
    if (!isBrowser()) return;
    deleteCookie(TOKEN_COOKIE_NAME);
    window.localStorage.removeItem(USER_STORAGE_KEY);
  },

  TOKEN_COOKIE_NAME,
};
