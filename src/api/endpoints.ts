import { apiClient } from './client';

export interface Endpoint {
  id: string;
  userId: string;
  name: string;
  url: string;
  method: string;
  checkIntervalSeconds: number;
  isActive: boolean;
  lastCheckedAt?: string | null;
  lastStatus?: 'up' | 'down' | 'error' | 'unknown' | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEndpointData {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'HEAD';
  checkIntervalSeconds: number;
  isActive?: boolean;
}

export const getEndpoints = async (): Promise<Endpoint[]> => {
  const res = await apiClient.get('/endpoints');
  return res.data;
};

export const createEndpoint = async (data: CreateEndpointData): Promise<Endpoint> => {
  const res = await apiClient.post('/endpoints', data);
  return res.data;
};

export const updateEndpoint = async (id: string, data: Partial<CreateEndpointData>): Promise<Endpoint> => {
  const res = await apiClient.put(`/endpoints/${id}`, data);
  return res.data;
};

export const deleteEndpoint = async (id: string): Promise<void> => {
  await apiClient.delete(`/endpoints/${id}`);
};

export const checkEndpoint = async (id: string): Promise<Endpoint> => {
  const res = await apiClient.post(`/endpoints/${id}/check`);
  return res.data;
};
