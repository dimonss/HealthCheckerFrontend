import { ButtonHTMLAttributes } from 'react';
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
