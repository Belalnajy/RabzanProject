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

export const productsService = {
  list: (params) => api.get(`/products${buildQuery(params)}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload(`/products/${id}/image`, formData);
  },
  uploadGallery: (id, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.upload(`/products/${id}/gallery`, formData);
  },
};
