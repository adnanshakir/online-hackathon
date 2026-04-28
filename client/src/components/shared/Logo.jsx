import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

export function Logo({ className, showWordmark = true, size = 'md' }) {
  const dim = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-9 w-9' : 'h-7 w-7';
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          dim,
          'relative grid place-items-center rounded-lg bg-gradient-accent shadow-[0_0_20px_rgba(139,92,246,0.4)]'
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      {showWordmark && (
        <span className="font-semibold tracking-tight text-[var(--color-foreground)]">
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
