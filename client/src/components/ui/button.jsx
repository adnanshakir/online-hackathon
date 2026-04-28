import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ' +
    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-[var(--color-background)] ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-foreground)] text-[var(--color-background)] hover:brightness-90 active:scale-[0.98]',
        gradient:
          'bg-gradient-accent text-white shadow-[0_0_0_0_rgba(139,92,246,0)] ' +
          'hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:brightness-110 active:scale-[0.98]',
        outline:
          'border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] ' +
          'hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-muted)]',
        ghost:
          'bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)]',
        secondary:
          'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] ' +
          'border border-[var(--color-border)] hover:brightness-110',
        destructive:
          'bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.98]',
        link:
          'text-[var(--color-brand-violet)] underline-offset-4 hover:underline bg-transparent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
