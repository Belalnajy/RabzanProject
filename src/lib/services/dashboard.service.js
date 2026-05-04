import { api } from '@/lib/api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getPipeline: () => api.get('/dashboard/pipeline'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getSparklines: () => api.get('/dashboard/sparklines'),
};
