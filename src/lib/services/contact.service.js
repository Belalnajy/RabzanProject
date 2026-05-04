import { api } from '@/lib/api';

export const contactService = {
  submit: (data) => api.post('/contact', data),
};
