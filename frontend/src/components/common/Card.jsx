import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'default',
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'rounded-2xl border transition-all duration-200',
          glass
            ? 'glass-card'
            : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark',
          hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
          paddings[padding],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
