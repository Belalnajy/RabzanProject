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

export const transactionsService = {
  list: (params) => api.get(`/transactions${buildQuery(params)}`),
  getById: (id) => api.get(`/transactions/${id}`),
  getReceipt: (id) => api.get(`/transactions/${id}/receipt`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  void: (id, reason) => api.patch(`/transactions/${id}/void`, { reason }),
  getActivityLog: (params) => api.get(`/transactions/activity-log${buildQuery(params)}`),
};
