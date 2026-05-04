/**
 * API Client — Centralized fetch wrapper for the Rabzan backend.
 *
 * Features:
 * - Auto-injects Bearer token from auth storage
 * - Normalizes errors to a consistent shape: { message, status, errors? }
 * - Handles JSON and FormData payloads (skips Content-Type for FormData)
 * - Auto-logout + redirect on 401 (browser only)
 * - Returns parsed JSON (or null for 204)
 */

import { authStorage } from './auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function buildHeaders(body, extraHeaders = {}) {
  const headers = { Accept: 'application/json', ...extraHeaders };
  const token = authStorage.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function handleUnauthorized() {
  if (typeof window === 'undefined') return;
  authStorage.clear();
  const isOnAuthPage = ['/login', '/register', '/forgot-password', '/reset-password']
    .some((p) => window.location.pathname.startsWith(p));
  if (!isOnAuthPage) {
    window.location.href = '/login';
  }
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  return response.text();
}

function normalizeError(payload, status) {
  if (typeof payload === 'string') {
    return new ApiError(payload || 'حدث خطأ غير متوقع', status);
  }
  if (payload && typeof payload === 'object') {
    const message = Array.isArray(payload.message)
      ? payload.message[0]
      : payload.message || payload.error || 'حدث خطأ غير متوقع';
    const errors = Array.isArray(payload.message) ? payload.message : null;
    return new ApiError(message, status, errors);
  }
  return new ApiError('حدث خطأ غير متوقع', status);
}

async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const init = {
    method,
    headers: buildHeaders(body, headers),
    signal,
  };

  if (body !== undefined) {
    init.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, init);
  } catch (networkError) {
    throw new ApiError('تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.', 0);
  }

  const payload = await parseResponse(response);

  if (response.status === 401) {
    handleUnauthorized();
    throw normalizeError(payload, 401);
  }

  if (!response.ok) {
    throw normalizeError(payload, response.status);
  }

  return payload;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  upload: (path, formData, options) => request(path, { ...options, method: 'POST', body: formData }),
};
