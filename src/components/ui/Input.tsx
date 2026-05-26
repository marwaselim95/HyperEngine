import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
  prefix?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, suffix, prefix, wrapperClassName = '', className = '', id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-muted uppercase tracking-widest">
            {label}
          </label>
        )}
        <div
          className={[
            'flex items-center rounded-md border transition-colors duration-150',
            error
              ? 'border-red-500/60 bg-red-500/5'
              : 'border-border bg-surface hover:border-border-hover focus-within:border-accent',
          ].join(' ')}
        >
          {prefix && (
            <span className="pl-3 pr-1 text-muted text-sm select-none">{prefix}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'flex-1 bg-transparent py-2 px-3 text-sm text-primary placeholder-muted',
              'outline-none min-w-0',
              prefix ? 'pl-1' : '',
              suffix ? 'pr-1' : '',
              className,
            ].join(' ')}
            {...rest}
          />
          {suffix && (
            <span className="pr-3 pl-1 text-muted text-sm select-none">{suffix}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
