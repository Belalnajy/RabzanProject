import { api } from '@/lib/api';

export const workflowService = {
  getStages: () => api.get('/settings/workflow/stages'),
};
