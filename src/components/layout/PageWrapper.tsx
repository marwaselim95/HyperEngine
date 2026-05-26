import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main
      className={[
        'flex-1 overflow-y-auto pb-20 md:pb-0 animate-fade-in',
        className,
      ].join(' ')}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    </main>
  );
}
