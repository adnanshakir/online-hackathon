import { cn } from '@/lib/utils';

export function Avatar({ user, size = 'md', className, ring = false, online = false }) {
  if (!user) return null;
  const dim =
    size === 'xs' ? 'h-5 w-5 text-[8px]' :
    size === 'sm' ? 'h-7 w-7 text-[10px]' :
    size === 'lg' ? 'h-12 w-12 text-sm' :
    size === 'xl' ? 'h-16 w-16 text-base' :
    'h-9 w-9 text-xs';

  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span className={cn('relative inline-block shrink-0', className)}>
      <span
        className={cn(
          dim,
          'grid place-items-center rounded-full bg-gradient-accent font-semibold text-white overflow-hidden',
          ring &&
            'ring-2 ring-[var(--color-background)] outline outline-1 outline-[var(--color-border)]'
        )}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          initials
        )}
      </span>
      {online && (
        <span
          className={cn(
            'absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--color-background)]',
            size === 'xs' && 'size-1.5',
            size === 'sm' && 'size-2'
          )}
          aria-label="online"
        />
      )}
    </span>
  );
}
