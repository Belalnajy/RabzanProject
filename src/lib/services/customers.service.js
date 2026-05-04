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

export const customersService = {
  list: (params) => api.get(`/customers${buildQuery(params)}`),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  updateStatus: (id, status) => api.patch(`/customers/${id}/status`, { status }),
  addNote: (id, note) => api.post(`/customers/${id}/notes`, { note }),
};
