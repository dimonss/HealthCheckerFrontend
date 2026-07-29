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

export interface TelegramLinkCodeResponse {
  code: string;
  expiresAt: number;
  botUsername: string;
  botUrl: string;
}

export interface TelegramChat {
  id: string;
  chatId: string;
  title?: string | null;
  type: string;
  createdAt: string;
}

export const getTelegramLinkCode = async (): Promise<TelegramLinkCodeResponse> => {
  const res = await apiClient.post('/auth/telegram-link-code');
  return res.data;
};

export const unlinkTelegram = async (): Promise<AuthUser> => {
  const res = await apiClient.post('/auth/telegram-unlink');
  return res.data.userProfile;
};

export const getTelegramChats = async (): Promise<TelegramChat[]> => {
  const res = await apiClient.get('/auth/telegram-chats');
  return res.data;
};

export const deleteTelegramChat = async (chatId: string): Promise<void> => {
  await apiClient.delete(`/auth/telegram-chats/${chatId}`);
};


