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

export const ordersService = {
  list: (params) => api.get(`/orders${buildQuery(params)}`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStage: (id, data) => api.patch(`/orders/${id}/stage`, data),
  update: (id, data) => api.patch(`/orders/${id}`, data),
  addPayment: (id, data) => api.post(`/orders/${id}/payments`, data),
  uploadProof: (orderId, txId, file) => {
    const formData = new FormData();
    formData.append('proofFile', file);
    return api.post(`/orders/${orderId}/payments/${txId}/proof`, formData);
  },
  uploadAttachment: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/orders/${id}/attachments`, formData);
  },
  removeAttachment: (id, attachId) => api.delete(`/orders/${id}/attachments/${attachId}`),
};
