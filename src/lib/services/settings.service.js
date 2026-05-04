import { api } from '@/lib/api';

export const settingsService = {
  getAll: () => api.get('/settings'),
  updateGeneral: (data) => api.put('/settings/general', data),
  getWorkflowStages: () => api.get('/settings/workflow/stages'),
  updateWorkflow: (data) => api.put('/settings/workflow', data),
  createWorkflowStage: (data) => api.post('/settings/workflow/stages', data),
  updateFinancial: (data) => api.put('/settings/financial', data),
  updateDefaultCurrency: (data) => api.put('/settings/currency', data),
  createCurrency: (data) => api.post('/settings/currency', data),
  updateExchangeRate: (id, data) => api.patch(`/settings/currency/${id}/rate`, data),
  updatePreferences: (data) => api.put('/settings/preferences', data),
};
