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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = getTokens();
      if (refreshToken) {
        try {
          const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
          if (res.data.accessToken) {
            setTokens(res.data.accessToken, res.data.refreshToken || refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (e) {
          clearTokens();
          if (onUnauthorizedCallback) onUnauthorizedCallback();
        }
      } else {
        clearTokens();
        if (onUnauthorizedCallback) onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);
