/// <reference types="vite/client" />
import axios from 'axios';

const defaultBaseUrl = `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/api`;
const baseURL = import.meta.env.VITE_API_URL || defaultBaseUrl;

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type AuthProviderType = 'google' | 'telegram';
export const APP_ID = 'health_checker';
const APP_PROVIDER_KEY = `${APP_ID}_auth_provider`;

export function hasTokensFor(provider: AuthProviderType): boolean {
  return !!localStorage.getItem(`${provider}_accessToken`) && !!localStorage.getItem(`${provider}_refreshToken`);
}

export function getAvailableProviders(): AuthProviderType[] {
  const list: AuthProviderType[] = [];
  if (hasTokensFor('google')) list.push('google');
  if (hasTokensFor('telegram')) list.push('telegram');
  return list;
}

export function getActiveProvider(): AuthProviderType | null {
  const hasGoogle = hasTokensFor('google');
  const hasTelegram = hasTokensFor('telegram');

  if (!hasGoogle && !hasTelegram) {
    return null;
  }
  if (hasGoogle && !hasTelegram) {
    return 'google';
  }
  if (hasTelegram && !hasGoogle) {
    return 'telegram';
  }

  const stored = localStorage.getItem(APP_PROVIDER_KEY) as AuthProviderType | null;
  if (stored === 'google' || stored === 'telegram') {
    return stored;
  }

  return 'google';
}

export function setActiveProvider(provider: AuthProviderType) {
  localStorage.setItem(APP_PROVIDER_KEY, provider);
}

export const getTokens = () => {
  const provider = getActiveProvider();
  if (!provider) {
    return { accessToken: null, refreshToken: null, provider: null };
  }
  return {
    accessToken: localStorage.getItem(`${provider}_accessToken`),
    refreshToken: localStorage.getItem(`${provider}_refreshToken`),
    provider,
  };
};

export const setTokens = (access: string, refresh: string, provider?: AuthProviderType) => {
  const targetProvider = provider || getActiveProvider() || 'google';
  localStorage.setItem(`${targetProvider}_accessToken`, access);
  localStorage.setItem(`${targetProvider}_refreshToken`, refresh);
  localStorage.setItem(APP_PROVIDER_KEY, targetProvider);
};

export const clearTokens = (onlyCurrent: boolean = true) => {
  const current = getActiveProvider();
  if (current && onlyCurrent) {
    localStorage.removeItem(`${current}_accessToken`);
    localStorage.removeItem(`${current}_refreshToken`);
    localStorage.removeItem(`${current}_user`);
    const remaining = getActiveProvider();
    if (remaining) {
      localStorage.setItem(APP_PROVIDER_KEY, remaining);
    } else {
      localStorage.removeItem(APP_PROVIDER_KEY);
    }
  } else {
    localStorage.removeItem('google_accessToken');
    localStorage.removeItem('google_refreshToken');
    localStorage.removeItem('google_user');
    localStorage.removeItem('telegram_accessToken');
    localStorage.removeItem('telegram_refreshToken');
    localStorage.removeItem('telegram_user');
    localStorage.removeItem(APP_PROVIDER_KEY);
  }
};

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

apiClient.interceptors.request.use(config => {
  const { accessToken } = getTokens();
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401) {
      if (originalRequest._retry) {
        clearTokens();
        if (onUnauthorizedCallback) onUnauthorizedCallback();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      const { refreshToken, provider } = getTokens();
      if (!refreshToken) {
        clearTokens();
        if (onUnauthorizedCallback) onUnauthorizedCallback();
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken || refreshToken;

        if (newAccessToken) {
          setTokens(newAccessToken, newRefreshToken, provider || undefined);
          processQueue(null, newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          clearTokens();
          if (onUnauthorizedCallback) onUnauthorizedCallback();
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError: any) {
        const status = refreshError.response?.status;
        if (status === 401 || status === 403) {
          clearTokens();
          if (onUnauthorizedCallback) onUnauthorizedCallback();
        }
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
