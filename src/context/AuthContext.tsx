import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMe, logoutApi, type AuthUser } from '../api/auth';
import { getTokens, clearTokens, setOnUnauthorized, getActiveProvider, getAvailableProviders, setActiveProvider, type AuthProviderType } from '../api/client';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  activeProvider: AuthProviderType | null;
  availableProviders: AuthProviderType[];
  login: (user: AuthUser, provider?: AuthProviderType) => void;
  logout: (target?: AuthProviderType | 'all') => Promise<void>;
  switchProvider: (provider: AuthProviderType) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeProvider, setActiveProv] = useState<AuthProviderType | null>(() => getActiveProvider());
  const [availableProviders, setAvailableProviders] = useState<AuthProviderType[]>(() => getAvailableProviders());

  const refreshUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      setActiveProv(getActiveProvider());
      setAvailableProviders(getAvailableProviders());
    } catch (e) {}
  };

  const initAuth = async () => {
    const { accessToken, provider } = getTokens();
    setActiveProv(provider);
    setAvailableProviders(getAvailableProviders());
    if (accessToken) {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (e) {
        clearTokens();
        setUser(null);
        setActiveProv(getActiveProvider());
        setAvailableProviders(getAvailableProviders());
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setActiveProv(getActiveProvider());
      setAvailableProviders(getAvailableProviders());
    });

    initAuth();

    const onStorage = (e: StorageEvent) => {
      if (e.key?.includes('accessToken') || e.key?.includes('auth_provider')) {
        initAuth();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (userData: AuthUser, provider?: AuthProviderType) => {
    setUser(userData);
    setActiveProv(provider || getActiveProvider());
    setAvailableProviders(getAvailableProviders());
  };

  const logout = async (target?: AuthProviderType | 'all') => {
    try {
      await logoutApi(target);
    } catch(e) {}
    clearTokens(target);
    const remaining = getActiveProvider();
    if (remaining) {
      await initAuth();
    } else {
      setUser(null);
      setActiveProv(null);
      setAvailableProviders([]);
    }
  };


  const switchProvider = async (provider: AuthProviderType) => {
    setActiveProvider(provider);
    setActiveProv(provider);
    setLoading(true);
    const { accessToken } = getTokens();
    if (accessToken) {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, activeProvider, availableProviders, login, logout, switchProvider, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
