import { api } from '@/lib/api';

export const categoriesService = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload(`/categories/${id}/image`, formData);
  },
};
