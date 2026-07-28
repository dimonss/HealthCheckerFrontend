import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe, logoutApi, AuthUser } from '../api/auth';
import { getTokens, clearTokens, setOnUnauthorized } from '../api/client';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
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

  const login = (userData: AuthUser) => {
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
