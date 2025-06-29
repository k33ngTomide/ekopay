// src/components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const LargeButton: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`border border-blue-500 text-blue-400 hover:border-blue-700 font-semibold py-6 px-4 rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default LargeButton;
