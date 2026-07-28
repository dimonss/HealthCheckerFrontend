import { apiClient } from './client';

export interface Check {
  id: string;
  endpointId: string;
  statusCode: number | null;
  responseTimeMs: number | null;
  status: 'up' | 'down' | 'error';
  errorMessage: string | null;
  checkedAt: string;
}

export interface CheckStats {
  uptime: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalChecks: number;
}

export interface ChecksSummary {
  total: number;
  up: number;
  down: number;
  unknown: number;
}

export const getCheckHistory = async (endpointId: string, limit = 50, offset = 0): Promise<Check[]> => {
  const res = await apiClient.get(`/checks/endpoint/${endpointId}/history`, { params: { limit, offset } });
  return res.data;
};

export const getCheckStats = async (endpointId: string): Promise<CheckStats> => {
  const res = await apiClient.get(`/checks/endpoint/${endpointId}/stats`);
  return res.data;
};

export const getChecksSummary = async (): Promise<ChecksSummary> => {
  const res = await apiClient.get('/checks/summary');
  return res.data;
};
