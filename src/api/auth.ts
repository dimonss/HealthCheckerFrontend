import { apiClient, getTokens, setTokens } from './client';

export interface AuthUser {
  id: string;
  authUserId: string;
  telegramId?: string | null;
  googleId?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  photoUrl?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const loginTelegram = async (data: any): Promise<AuthResponse> => {
  const res = await apiClient.post('/auth/telegram', data);
  const { accessToken, refreshToken } = res.data;
  setTokens(accessToken, refreshToken);
  return res.data;
};

export const loginGoogle = async (credential: string): Promise<AuthResponse> => {
  const res = await apiClient.post('/auth/google', { credential });
  const { accessToken, refreshToken } = res.data;
  setTokens(accessToken, refreshToken);
  return res.data;
};

export const getMe = async (): Promise<AuthUser> => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const logoutApi = async (): Promise<void> => {
  const { refreshToken } = getTokens();
  if (refreshToken) {
    await apiClient.post('/auth/logout', { refreshToken });
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  const res = await apiClient.post('/auth/refresh', { refreshToken });
  return res.data;
};
