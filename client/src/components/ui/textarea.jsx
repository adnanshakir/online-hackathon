import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[88px] w-full rounded-lg border border-[var(--color-border)] ' +
        'bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)] ' +
        'placeholder:text-[var(--color-muted)] ' +
        'focus-visible:outline-none focus-visible:border-[var(--color-brand-primary)] ' +
        'focus-visible:ring-1 focus-visible:ring-[var(--color-brand-primary)]/30 ' +
        'disabled:cursor-not-allowed disabled:opacity-50 ' +
        'transition-colors duration-150 resize-y',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
