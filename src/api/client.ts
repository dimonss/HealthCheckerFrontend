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

export const getTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  };
};

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
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

      const { refreshToken } = getTokens();
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
          setTokens(newAccessToken, newRefreshToken);
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
