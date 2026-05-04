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

export const financeService = {
  getStats: () => api.get('/finance/stats'),
  getOverview: (params) => api.get(`/finance/overview${buildQuery(params)}`),
  getRevenueChart: () => api.get('/finance/charts/revenue'),
  getPaidVsDueChart: () => api.get('/finance/charts/paid-vs-due'),
  getStatusDistribution: () => api.get('/finance/charts/status-distribution'),
  getRecentTransactions: () => api.get('/finance/recent-transactions'),
  getCommissionTracking: (params) => api.get(`/finance/commission-tracking${buildQuery(params)}`),
};
