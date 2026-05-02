import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg border border-[var(--color-border)] ' +
        'bg-[var(--color-surface)] px-3.5 py-2 text-sm text-[var(--color-foreground)] ' +
        'placeholder:text-[var(--color-muted)] ' +
        'focus-visible:outline-none focus-visible:border-[var(--color-brand-primary)] ' +
        'focus-visible:ring-1 focus-visible:ring-[var(--color-brand-primary)]/30 ' +
        'disabled:cursor-not-allowed disabled:opacity-50 ' +
        'transition-colors duration-150',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
