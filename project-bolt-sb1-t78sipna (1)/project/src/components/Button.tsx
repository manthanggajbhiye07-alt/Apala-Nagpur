import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm',
  secondary: 'bg-sand-100 text-ink-800 hover:bg-sand-200 active:bg-sand-300 border border-sand-200',
  ghost: 'text-ink-600 hover:bg-sand-100 hover:text-ink-900',
  dark: 'bg-ink-800 text-white hover:bg-ink-700 active:bg-ink-900 shadow-sm',
  outline: 'border border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-sand-50',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
