import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg border border-[var(--color-border)] ' +
        'bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] ' +
        'placeholder:text-[var(--color-muted)] ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ' +
        'focus-visible:border-transparent ' +
        'disabled:cursor-not-allowed disabled:opacity-50 ' +
        'transition-all duration-200',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
