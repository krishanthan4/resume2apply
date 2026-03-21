import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    
    let variantStyles = '';
    switch (variant) {
      case 'primary':
        variantStyles = 'bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed';
        break;
      case 'secondary':
        variantStyles = 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed';
        break;
      case 'outline':
        variantStyles = 'bg-transparent text-zinc-900 border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed';
        break;
      case 'ghost':
        variantStyles = 'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed';
        break;
      case 'danger':
        variantStyles = 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed';
        break;
    }

    let sizeStyles = '';
    switch (size) {
      case 'sm':
        sizeStyles = 'px-3 py-1.5 text-xs rounded-md';
        break;
      case 'md':
        sizeStyles = 'px-4 py-2 text-sm rounded-lg';
        break;
      case 'lg':
        sizeStyles = 'px-6 py-3 text-base rounded-xl';
        break;
    }

    const baseStyles = 'inline-flex items-center gap-2 justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2';
    
    // Combine them all
    const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
