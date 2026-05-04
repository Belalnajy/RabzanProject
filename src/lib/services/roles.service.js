import { api } from '@/lib/api';

export const rolesService = {
  list: () => api.get('/roles'),
  listPermissions: () => api.get('/roles/permissions'),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  remove: (id) => api.delete(`/roles/${id}`),
};
