import React from 'react';
import './Card.css';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`card glass ${className}`}>
      {children}
    </div>
  );
};
