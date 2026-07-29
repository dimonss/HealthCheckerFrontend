import React from 'react';
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
    let redirect = sessionStorage.getItem('redirect_path') || '/dashboard';
    sessionStorage.removeItem('redirect_path');
    const base = import.meta.env.BASE_URL;
    if (base && base !== '/' && redirect.startsWith(base)) {
      redirect = redirect.slice(base.length - 1);
    }
    return <Navigate to={redirect} replace />;
  }
  return <>{children}</>;
};
