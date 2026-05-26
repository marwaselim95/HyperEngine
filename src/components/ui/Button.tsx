import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-black font-semibold hover:bg-accent-hover shadow-glow hover:shadow-glow-lg active:scale-95',
  secondary:
    'bg-surface border border-border text-primary hover:bg-surface-hover hover:border-accent active:scale-95',
  ghost:
    'bg-transparent text-muted hover:text-primary hover:bg-surface active:scale-95',
  danger:
    'bg-transparent border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400 active:scale-95',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className = '', disabled, ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center rounded-md transition-all duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  ),
);
Button.displayName = 'Button';
