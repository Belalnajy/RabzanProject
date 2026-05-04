import { api } from '@/lib/api';

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const commissionsService = {
  list: (params) => api.get(`/commissions${buildQuery(params)}`),
  getStats: () => api.get('/commissions/stats'),
  getByOrder: (orderId) => api.get(`/commissions/${orderId}`),
};
