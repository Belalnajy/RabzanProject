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

export const reportsService = {
  getOverview: (params) => api.get(`/reports/overview${buildQuery(params)}`),
  getSales: (params) => api.get(`/reports/sales${buildQuery(params)}`),
  getFinancial: (params) => api.get(`/reports/financial${buildQuery(params)}`),
  getCommissions: (params) => api.get(`/reports/commissions${buildQuery(params)}`),
  exportPdf: (params) => api.get(`/reports/export/pdf${buildQuery(params)}`),
  exportExcel: (params) => api.get(`/reports/export/excel${buildQuery(params)}`),
};
