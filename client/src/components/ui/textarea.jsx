import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[88px] w-full rounded-lg border border-[var(--color-border)] ' +
        'bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] ' +
        'placeholder:text-[var(--color-muted)] ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ' +
        'focus-visible:border-transparent ' +
        'disabled:cursor-not-allowed disabled:opacity-50 ' +
        'transition-all duration-200 resize-y',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
