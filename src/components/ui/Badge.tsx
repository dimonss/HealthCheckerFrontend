import React from 'react';
import './Badge.css';

export const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'up' | 'down' | 'neutral' }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
};
