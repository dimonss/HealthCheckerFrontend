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

export interface ChartDataPoint {
  checkedAt: string;
  responseTimeMs: number | null;
}

export const getCheckHistory = async (
  endpointId: string,
  limit = 50,
  offset = 0,
  period?: string,
  since?: string
): Promise<Check[]> => {
  const res = await apiClient.get(`/checks/endpoint/${endpointId}/history`, {
    params: { limit, offset, period, since }
  });
  return res.data;
};

export const getCheckChartData = async (endpointId: string, period = '24h'): Promise<ChartDataPoint[]> => {
  const res = await apiClient.get(`/checks/endpoint/${endpointId}/chart`, { params: { period } });
  return res.data;
};

export const getCheckStats = async (endpointId: string, period?: string): Promise<CheckStats> => {
  const res = await apiClient.get(`/checks/endpoint/${endpointId}/stats`, { params: { period } });
  return res.data;
};

export const getChecksSummary = async (): Promise<ChecksSummary> => {
  const res = await apiClient.get('/checks/summary');
  return res.data;
};
