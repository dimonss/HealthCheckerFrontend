import os

base_dir = "/Users/chalyshdmitrii/Documents/m/HealthChecker/HealthCheckerFrontend"
os.makedirs(base_dir, exist_ok=True)

files = {}

files["package.json"] = """{
  "name": "health-checker-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "lucide-react": "^0.471.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.1",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.7"
  }
}"""

files["tsconfig.json"] = """{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}"""

files["tsconfig.app.json"] = """{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}"""

files["tsconfig.node.json"] = """{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}"""

files["vite.config.ts"] = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3002'
    }
  }
})"""

files["index.html"] = """<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>Мониторинг HealthChecker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>"""

files["src/vite-env.d.ts"] = """/// <reference types="vite/client" />"""

files["src/styles/variables.css"] = """:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-tertiary: #1a1a2e;
  
  --glass-bg: rgba(18, 18, 26, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-hover: rgba(255, 255, 255, 0.15);
  
  --color-up: #00d68f;
  --color-down: #ff4757;
  --color-neutral: #4a90d9;
  --color-accent: #7c3aed;
  
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --text-muted: #666677;
  
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-glow: 0 0 20px rgba(124, 58, 237, 0.3);
  
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}"""

files["src/styles/global.css"] = """@import './variables.css';
@import './animations.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, select, textarea {
  font-family: inherit;
}

/* Glassmorphism utilities */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
}

.glass:hover {
  border-color: var(--glass-border-hover);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
"""

files["src/styles/animations.css"] = """
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 214, 143, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 214, 143, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 214, 143, 0); }
}

@keyframes pulse-red {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 71, 87, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes gradientBg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}
"""

files["src/api/client.ts"] = """import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

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
    const originalRequest = error.config;
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
"""

files["src/api/auth.ts"] = """import { apiClient } from './client';

export const loginTelegram = async (data: any) => {
  const res = await apiClient.post('/auth/telegram', data);
  return res.data;
};

export const loginGoogle = async (token: string) => {
  const res = await apiClient.post('/auth/google', { token });
  return res.data;
};

export const getMe = async () => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const logoutApi = async () => {
  await apiClient.post('/auth/logout');
};
"""

files["src/api/endpoints.ts"] = """import { apiClient } from './client';

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  check_interval: number;
  is_active: boolean;
  status?: 'up' | 'down' | 'unknown';
  last_check?: string;
  user_id: string;
}

export const getEndpoints = async (): Promise<Endpoint[]> => {
  const res = await apiClient.get('/endpoints');
  return res.data;
};

export const createEndpoint = async (data: Partial<Endpoint>) => {
  const res = await apiClient.post('/endpoints', data);
  return res.data;
};

export const updateEndpoint = async (id: string, data: Partial<Endpoint>) => {
  const res = await apiClient.put(`/endpoints/${id}`, data);
  return res.data;
};

export const deleteEndpoint = async (id: string) => {
  await apiClient.delete(`/endpoints/${id}`);
};

export const checkEndpoint = async (id: string) => {
  const res = await apiClient.post(`/endpoints/${id}/check`);
  return res.data;
};
"""

files["src/api/checks.ts"] = """import { apiClient } from './client';

export interface Check {
  id: string;
  endpoint_id: string;
  status: string;
  response_time: number;
  status_code: number;
  timestamp: string;
}

export const getCheckHistory = async (endpointId: string, limit = 50): Promise<Check[]> => {
  const res = await apiClient.get(`/endpoints/${endpointId}/checks`, { params: { limit } });
  return res.data;
};

export const getCheckStats = async (endpointId: string) => {
  const res = await apiClient.get(`/endpoints/${endpointId}/stats`);
  return res.data;
};

export const getChecksSummary = async () => {
  const res = await apiClient.get('/checks/summary');
  return res.data;
};
"""

files["src/context/AuthContext.tsx"] = """import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe, logoutApi } from '../api/auth';
import { getTokens, clearTokens, setOnUnauthorized } from '../api/client';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
    });

    const initAuth = async () => {
      const { accessToken } = getTokens();
      if (accessToken) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (e) {
          clearTokens();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch(e) {}
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
"""

files["src/hooks/useGoogleAuth.ts"] = """import { useEffect } from 'react';

export const useGoogleAuth = (clientId: string, callback: (response: any) => void) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-btn'),
          { theme: 'filled_black', size: 'large', shape: 'pill' }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, callback]);
};
"""

files["src/hooks/useTelegramAuth.ts"] = """import { useEffect } from 'react';

export const useTelegramAuth = (botName: string, containerId: string, callback: (user: any) => void) => {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '20');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    
    (window as any).onTelegramAuth = callback;
    
    container.appendChild(script);
    
    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [botName, containerId, callback]);
};
"""

files["src/components/ProtectedRoute.tsx"] = """import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from './ui/Loader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!user) {
    sessionStorage.setItem('redirect_path', location.pathname);
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (user) {
    const redirect = sessionStorage.getItem('redirect_path') || '/dashboard';
    sessionStorage.removeItem('redirect_path');
    return <Navigate to={redirect} replace />;
  }
  return <>{children}</>;
};
"""

files["src/components/Layout.tsx"] = """import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard } from 'lucide-react';
import './Layout.css';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <aside className="sidebar glass">
        <div className="brand">
          <Activity className="brand-icon" />
          <span>HealthChecker</span>
        </div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Дашборд</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.name?.[0] || user?.email?.[0] || 'U'}</div>
            <span className="user-name">{user?.name || user?.email}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header glass">
          <h2>Мониторинг</h2>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
"""

files["src/components/Layout.css"] = """
.layout {
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at top left, var(--bg-secondary), var(--bg-primary));
}

.sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 0;
  border-left: none;
  border-top: none;
  border-bottom: none;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.brand-icon {
  color: var(--color-accent);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.nav-item:hover, .nav-item.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--glass-border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-transform: uppercase;
}

.user-name {
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.logout-btn:hover {
  background: rgba(255, 71, 87, 0.1);
  color: var(--color-down);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 20px 32px;
  border-radius: 0;
  border-top: none;
  border-right: none;
  border-left: none;
  display: flex;
  align-items: center;
}

.header h2 {
  font-weight: 600;
  font-size: 1.25rem;
}

.page-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}
"""

files["src/components/ui/Button.tsx"] = """import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ variant = 'primary', size = 'md', isLoading, children, className = '', ...props }: ButtonProps) => {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className="spinner"></span> : children}
    </button>
  );
};
"""

files["src/components/ui/Button.css"] = """
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: #6d28d9;
  box-shadow: var(--shadow-glow);
}

.btn-secondary {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}
.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.btn-danger {
  background: rgba(255, 71, 87, 0.1);
  color: var(--color-down);
  border: 1px solid rgba(255, 71, 87, 0.2);
}
.btn-danger:hover:not(:disabled) {
  background: rgba(255, 71, 87, 0.2);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.btn-sm { padding: 6px 12px; font-size: 0.85rem; }
.btn-md { padding: 10px 18px; font-size: 0.95rem; }
.btn-lg { padding: 14px 24px; font-size: 1.05rem; }

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}
"""

files["src/components/ui/Modal.tsx"] = """import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
"""

files["src/components/ui/Modal.css"] = """
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.modal-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--glass-border);
}

.modal-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
}
"""

files["src/components/ui/Input.tsx"] = """import React, { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input ref={ref} className={`input-field glass ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';
"""

files["src/components/ui/Input.css"] = """
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.input-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.input-field {
  padding: 10px 14px;
  font-size: 1rem;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.input-field:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.input-error {
  border-color: var(--color-down);
}

.input-error-msg {
  font-size: 0.8rem;
  color: var(--color-down);
}
"""

files["src/components/ui/Select.tsx"] = """import React, { SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, options, className = '', ...props }, ref) => {
  return (
    <div className={`select-wrapper ${className}`}>
      {label && <label className="select-label">{label}</label>}
      <select ref={ref} className="select-field glass" {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
});
Select.displayName = 'Select';
"""

files["src/components/ui/Select.css"] = """
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.select-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.select-field {
  padding: 10px 14px;
  font-size: 1rem;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  outline: none;
  appearance: none;
  cursor: pointer;
}

.select-field option {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.select-field:focus {
  border-color: var(--color-accent);
}
"""

files["src/components/ui/Loader.tsx"] = """import React from 'react';
import './Loader.css';

export const Loader = ({ fullScreen }: { fullScreen?: boolean }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loader"></div>
    </div>
  );
};
"""

files["src/components/ui/Loader.css"] = """
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.loader-container.full-screen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--bg-primary);
  z-index: 9999;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(124, 58, 237, 0.2);
  border-radius: 50%;
  border-top-color: var(--color-accent);
  animation: spin 1s ease-in-out infinite;
}
"""

files["src/components/ui/Badge.tsx"] = """import React from 'react';
import './Badge.css';

export const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'up' | 'down' | 'neutral' }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
};
"""

files["src/components/ui/Badge.css"] = """
.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
}

.badge-up {
  background: rgba(0, 214, 143, 0.15);
  color: var(--color-up);
}

.badge-down {
  background: rgba(255, 71, 87, 0.15);
  color: var(--color-down);
}

.badge-neutral {
  background: rgba(74, 144, 217, 0.15);
  color: var(--color-neutral);
}
"""

files["src/components/ui/Card.tsx"] = """import React from 'react';
import './Card.css';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`card glass ${className}`}>
      {children}
    </div>
  );
};
"""

files["src/components/ui/Card.css"] = """
.card {
  padding: 24px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
}
"""

files["src/components/endpoints/StatusBadge.tsx"] = """import React from 'react';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: 'up' | 'down' | 'unknown';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label = status === 'up' ? 'Работает' : status === 'down' ? 'Ошибка' : 'Неизвестно';
  return (
    <div className={`status-badge status-${status}`}>
      <span className="status-dot"></span>
      {label}
    </div>
  );
};
"""

files["src/components/endpoints/StatusBadge.css"] = """
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-up .status-dot {
  background: var(--color-up);
  animation: pulse 2s infinite;
}
.status-up { color: var(--color-up); }

.status-down .status-dot {
  background: var(--color-down);
  animation: pulse-red 2s infinite;
}
.status-down { color: var(--color-down); }

.status-unknown .status-dot {
  background: var(--text-muted);
}
.status-unknown { color: var(--text-secondary); }
"""

files["src/components/endpoints/EndpointCard.tsx"] = """import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Activity, Clock, Trash2 } from 'lucide-react';
import { Endpoint } from '../../api/endpoints';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import './EndpointCard.css';

interface Props {
  endpoint: Endpoint;
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EndpointCard = ({ endpoint, onCheck, onDelete }: Props) => {
  return (
    <div className="endpoint-card glass">
      <div className="ec-header">
        <Link to={`/endpoint/${endpoint.id}`} className="ec-title">
          <h3>{endpoint.name}</h3>
          <span className="ec-url">{endpoint.url}</span>
        </Link>
        <StatusBadge status={endpoint.status || 'unknown'} />
      </div>
      
      <div className="ec-body">
        <div className="ec-info">
          <span className="ec-method">{endpoint.method}</span>
          <div className="ec-meta">
            <Clock size={14} />
            <span>Каждые {endpoint.check_interval} мин</span>
          </div>
          {endpoint.last_check && (
            <div className="ec-meta">
              <Activity size={14} />
              <span>{new Date(endpoint.last_check).toLocaleString('ru')}</span>
            </div>
          )}
        </div>
        
        <div className="ec-actions">
          <Button variant="secondary" size="sm" onClick={() => onCheck(endpoint.id)}>
            <Play size={14} /> Проверить
          </Button>
          <Button variant="ghost" size="sm" className="btn-icon-danger" onClick={() => onDelete(endpoint.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
"""

files["src/components/endpoints/EndpointCard.css"] = """
.endpoint-card {
  padding: 20px;
  transition: transform var(--transition-fast), border-color var(--transition-fast);
}

.endpoint-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.ec-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ec-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ec-title h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.ec-url {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.ec-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.ec-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ec-method {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent);
  background: rgba(124, 58, 237, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}

.ec-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.ec-actions {
  display: flex;
  gap: 8px;
}

.btn-icon-danger:hover {
  color: var(--color-down) !important;
  background: rgba(255, 71, 87, 0.1) !important;
}
"""

files["src/components/endpoints/EndpointForm.tsx"] = """import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import './EndpointForm.css';

interface Props {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EndpointForm = ({ onSubmit, onCancel }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    url: 'https://',
    method: 'GET',
    check_interval: 5,
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="endpoint-form">
      <Input 
        label="Название" 
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
        required 
      />
      <Input 
        label="URL" 
        type="url"
        value={formData.url}
        onChange={e => setFormData({...formData, url: e.target.value})}
        required 
      />
      <div className="form-row">
        <Select 
          label="Метод"
          value={formData.method}
          onChange={e => setFormData({...formData, method: e.target.value})}
          options={[
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'HEAD', label: 'HEAD' }
          ]}
        />
        <Select 
          label="Интервал (мин)"
          value={formData.check_interval}
          onChange={e => setFormData({...formData, check_interval: Number(e.target.value)})}
          options={[
            { value: 1, label: '1 мин' },
            { value: 5, label: '5 мин' },
            { value: 15, label: '15 мин' },
            { value: 30, label: '30 мин' },
            { value: 60, label: '1 час' },
            { value: 360, label: '6 часов' },
            { value: 720, label: '12 часов' },
            { value: 1440, label: '24 часа' }
          ]}
        />
      </div>
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>Отмена</Button>
        <Button type="submit" isLoading={loading}>Сохранить</Button>
      </div>
    </form>
  );
};
"""

files["src/components/endpoints/EndpointForm.css"] = """
.endpoint-form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
"""

files["src/components/endpoints/EndpointList.tsx"] = """import React from 'react';
import { Endpoint } from '../../api/endpoints';
import { EndpointCard } from './EndpointCard';
import './EndpointList.css';

interface Props {
  endpoints: Endpoint[];
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EndpointList = ({ endpoints, onCheck, onDelete }: Props) => {
  if (endpoints.length === 0) {
    return <div className="empty-state glass">Нет добавленных эндпоинтов</div>;
  }

  return (
    <div className="endpoint-list">
      {endpoints.map(ep => (
        <EndpointCard key={ep.id} endpoint={ep} onCheck={onCheck} onDelete={onDelete} />
      ))}
    </div>
  );
};
"""

files["src/components/endpoints/EndpointList.css"] = """
.endpoint-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
}
"""

files["src/components/charts/ResponseTimeChart.tsx"] = """import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Charts.css';

interface DataPoint {
  time: string;
  value: number;
}

export const ResponseTimeChart = ({ data }: { data: DataPoint[] }) => {
  return (
    <div className="chart-container glass">
      <h3>Время ответа (мс)</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-up)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-up)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--color-up)' }}
            />
            <Area type="monotone" dataKey="value" stroke="var(--color-up)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
"""

files["src/components/charts/UptimeChart.tsx"] = """import React from 'react';
import './Charts.css';

export const UptimeChart = ({ percentage }: { percentage: number }) => {
  const color = percentage > 99 ? 'var(--color-up)' : percentage > 95 ? '#f59e0b' : 'var(--color-down)';
  
  return (
    <div className="chart-container glass uptime-container">
      <h3>Общий Uptime</h3>
      <div className="uptime-value" style={{ color }}>
        {percentage.toFixed(2)}%
      </div>
      <div className="uptime-bar-bg">
        <div className="uptime-bar-fill" style={{ width: `${percentage}%`, background: color }}></div>
      </div>
    </div>
  );
};
"""

files["src/components/charts/Charts.css"] = """
.chart-container {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container h3 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.chart-wrapper {
  flex: 1;
  min-height: 250px;
}

.uptime-container {
  justify-content: center;
  align-items: center;
}

.uptime-value {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 0 20px currentColor;
}

.uptime-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.uptime-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-in-out;
}
"""

files["src/pages/LoginPage/LoginPage.tsx"] = """import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useTelegramAuth } from '../../hooks/useTelegramAuth';
import { loginGoogle, loginTelegram } from '../../api/auth';
import { Activity } from 'lucide-react';
import './LoginPage.css';

export const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (response: any) => {
    try {
      const data = await loginGoogle(response.credential);
      login(data.user);
    } catch (e) {
      setError('Ошибка входа через Google');
    }
  };

  const handleTelegramSuccess = async (user: any) => {
    try {
      const data = await loginTelegram(user);
      login(data.user);
    } catch (e) {
      setError('Ошибка входа через Telegram');
    }
  };

  useGoogleAuth(import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy', handleGoogleSuccess);
  useTelegramAuth(import.meta.env.VITE_TELEGRAM_BOT_NAME || 'dummy_bot', 'telegram-login-container', handleTelegramSuccess);

  return (
    <div className="login-page">
      <div className="login-card glass animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <Activity size={40} className="logo-icon" />
          </div>
          <h1>HealthChecker</h1>
          <p>Войдите для доступа к панели мониторинга</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="auth-buttons">
          <div id="google-btn" className="auth-btn-wrapper"></div>
          <div className="divider"><span>или</span></div>
          <div id="telegram-login-container" className="auth-btn-wrapper"></div>
        </div>
      </div>
    </div>
  );
};
"""

files["src/pages/LoginPage/LoginPage.css"] = """
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%);
  background-size: 400% 400%;
  animation: gradientBg 15s ease infinite;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: rgba(18, 18, 26, 0.7);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.login-header {
  text-align: center;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, var(--color-accent), #4f46e5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
}

.logo-icon {
  color: white;
}

.login-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.login-error {
  padding: 12px;
  background: rgba(255, 71, 87, 0.1);
  color: var(--color-down);
  border-radius: var(--radius-sm);
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 71, 87, 0.2);
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.auth-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 40px;
}

.divider {
  width: 100%;
  text-align: center;
  position: relative;
  margin: 10px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--glass-border);
}

.divider span {
  background: var(--bg-secondary);
  padding: 0 16px;
  position: relative;
  color: var(--text-muted);
  font-size: 0.85rem;
}
"""

files["src/pages/DashboardPage/DashboardPage.tsx"] = """import React, { useEffect, useState } from 'react';
import { getEndpoints, createEndpoint, deleteEndpoint, checkEndpoint, Endpoint } from '../../api/endpoints';
import { getChecksSummary } from '../../api/checks';
import { EndpointList } from '../../components/endpoints/EndpointList';
import { EndpointForm } from '../../components/endpoints/EndpointForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Plus, Server, Activity, AlertTriangle } from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState({ total: 0, up: 0, down: 0 });

  const fetchData = async () => {
    try {
      const [eps, sum] = await Promise.all([getEndpoints(), getChecksSummary()]);
      setEndpoints(eps);
      setSummary(sum || { total: eps.length, up: eps.filter(e => e.status==='up').length, down: eps.filter(e => e.status==='down').length });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (data: any) => {
    await createEndpoint(data);
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Удалить эндпоинт?')) {
      await deleteEndpoint(id);
      fetchData();
    }
  };

  const handleCheck = async (id: string) => {
    await checkEndpoint(id);
    fetchData();
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon bg-neutral"><Server size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">Всего эндпоинтов</span>
            <span className="stat-value">{summary.total}</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon bg-up"><Activity size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">В сети</span>
            <span className="stat-value text-up">{summary.up}</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon bg-down"><AlertTriangle size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">С ошибкой</span>
            <span className="stat-value text-down">{summary.down}</span>
          </div>
        </Card>
      </div>

      <div className="section-header">
        <h2>Ваши эндпоинты</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Добавить
        </Button>
      </div>

      <EndpointList endpoints={endpoints} onCheck={handleCheck} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Новый эндпоинт">
        <EndpointForm onSubmit={handleAdd} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
"""

files["src/pages/DashboardPage/DashboardPage.css"] = """
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-neutral { background: rgba(74, 144, 217, 0.1); color: var(--color-neutral); }
.bg-up { background: rgba(0, 214, 143, 0.1); color: var(--color-up); }
.bg-down { background: rgba(255, 71, 87, 0.1); color: var(--color-down); }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
}

.text-up { color: var(--color-up); }
.text-down { color: var(--color-down); }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  font-size: 1.4rem;
  font-weight: 600;
}
"""

files["src/pages/EndpointDetailPage/EndpointDetailPage.tsx"] = """import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCheckHistory, getCheckStats, Check } from '../../api/checks';
import { getEndpoints, Endpoint } from '../../api/endpoints';
import { ResponseTimeChart } from '../../components/charts/ResponseTimeChart';
import { UptimeChart } from '../../components/charts/UptimeChart';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { ArrowLeft } from 'lucide-react';
import './EndpointDetailPage.css';

export const EndpointDetailPage = () => {
  const { id } = useParams();
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
  const [history, setHistory] = useState<Check[]>([]);
  const [stats, setStats] = useState({ uptime: 100, avgResponseTime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if(!id) return;
      try {
        const eps = await getEndpoints();
        const ep = eps.find(e => e.id === id);
        if(ep) setEndpoint(ep);
        
        const [hist, st] = await Promise.all([
          getCheckHistory(id),
          getCheckStats(id).catch(() => ({ uptime: 100, avgResponseTime: 0 }))
        ]);
        setHistory(hist.reverse());
        setStats(st);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Loader />;
  if (!endpoint) return <div>Эндпоинт не найден</div>;

  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString('ru', { hour: '2-digit', minute:'2-digit' }),
    value: h.response_time
  }));

  return (
    <div className="endpoint-detail animate-fade-in">
      <div className="ed-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={20} /> Назад
        </Link>
        <div className="ed-title-row">
          <h1>{endpoint.name}</h1>
          <Badge variant={endpoint.status === 'up' ? 'up' : 'down'}>{endpoint.status || 'unknown'}</Badge>
        </div>
        <a href={endpoint.url} target="_blank" rel="noreferrer" className="ed-url">{endpoint.url}</a>
      </div>

      <div className="charts-grid">
        <div className="chart-main">
          <ResponseTimeChart data={chartData} />
        </div>
        <div className="chart-side">
          <UptimeChart percentage={stats.uptime} />
        </div>
      </div>

      <div className="history-section glass">
        <h3>История проверок</h3>
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Статус</th>
                <th>Время ответа</th>
                <th>Код ответа</th>
                <th>Дата и время</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.id}>
                  <td>
                    <Badge variant={h.status === 'up' ? 'up' : 'down'}>{h.status}</Badge>
                  </td>
                  <td>{h.response_time} мс</td>
                  <td>{h.status_code || '-'}</td>
                  <td>{new Date(h.timestamp).toLocaleString('ru')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
"""

files["src/pages/EndpointDetailPage/EndpointDetailPage.css"] = """
.endpoint-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ed-header {
  margin-bottom: 8px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--text-primary);
}

.ed-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.ed-title-row h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.ed-url {
  color: var(--color-neutral);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  height: 350px;
}

.history-section {
  padding: 24px;
  border-radius: var(--radius-lg);
}

.history-section h3 {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.table-responsive {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.history-table th {
  padding: 12px 16px;
  color: var(--text-secondary);
  font-weight: 500;
  border-bottom: 1px solid var(--glass-border);
}

.history-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.history-table tr:last-child td {
  border-bottom: none;
}
"""

files["src/App.tsx"] = """import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { EndpointDetailPage } from './pages/EndpointDetailPage/EndpointDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/endpoint/:id" element={<EndpointDetailPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
"""

files["src/main.tsx"] = """import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
"""

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("All files created successfully.")
