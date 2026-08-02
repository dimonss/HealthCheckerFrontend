import { apiClient } from './client';

export interface CreateInviteData {
  endpointId?: string | null;
  role: 'viewer' | 'editor';
  expiresInHours?: number | null;
  maxUses?: number | null;
}

export interface InviteLink {
  id: string;
  inviterId: string;
  token: string;
  role: 'viewer' | 'editor';
  endpointId?: string | null;
  endpointName?: string;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  createdAt: string;
}

export interface InviteInfoResponse {
  invite: {
    id: string;
    inviterId: string;
    token: string;
    role: 'viewer' | 'editor';
    endpointId?: string | null;
    expiresAt?: string | null;
    createdAt: string;
  };
  inviter?: {
    id: string;
    name: string;
    email?: string | null;
    photoUrl?: string | null;
  } | null;
  endpoint?: {
    id: string;
    name: string;
    url: string;
  } | null;
  isExpired: boolean;
  isDepleted: boolean;
  isValid: boolean;
}

export interface AccessGrantItem {
  id: string;
  user?: { name: string; email?: string | null };
  inviter?: { name: string; email?: string | null };
  role: 'viewer' | 'editor';
  endpointName: string;
  expiresAt?: string | null;
  createdAt: string;
}

export interface AccessGrantsResponse {
  grantedToOthers: AccessGrantItem[];
  receivedFromOthers: AccessGrantItem[];
}

export const createInvite = async (data: CreateInviteData): Promise<InviteLink> => {
  const res = await apiClient.post('/invites', data);
  return res.data;
};

export const getInviteInfo = async (token: string): Promise<InviteInfoResponse> => {
  const res = await apiClient.get(`/invites/info/${token}`);
  return res.data;
};

export const acceptInvite = async (token: string): Promise<{ success: boolean; inviterName?: string }> => {
  const res = await apiClient.post(`/invites/accept/${token}`);
  return res.data;
};

export const getInvites = async (): Promise<InviteLink[]> => {
  const res = await apiClient.get('/invites');
  return res.data;
};

export const revokeInvite = async (id: string): Promise<void> => {
  await apiClient.delete(`/invites/${id}`);
};

export const getAccessGrants = async (): Promise<AccessGrantsResponse> => {
  const res = await apiClient.get('/invites/access');
  return res.data;
};

export const revokeAccess = async (accessId: string): Promise<void> => {
  await apiClient.delete(`/invites/access/${accessId}`);
};
