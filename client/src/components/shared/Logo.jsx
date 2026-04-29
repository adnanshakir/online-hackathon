import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

/**
 * OpsWatch wordmark.
 *
 * Mark: a thick ring with a filled center dot — reads as a watch face,
 * a radar/scope, and a target. Sits cleanly without a tile background.
 */
export function Logo({ className, showWordmark = true, size = 'md' }) {
  const dim = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-7 w-7' : 'h-6 w-6';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn(dim, 'text-[var(--color-brand-primary)]')}
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
      {showWordmark && (
        <span className="font-semibold tracking-[-0.03em] text-[var(--color-foreground)]">
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
