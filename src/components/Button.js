import React from 'react';
import '../styles/main.css';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  ...props
}) => {
  const className = `button button-${variant}`;
  return (
    <button
      className={className}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button; 