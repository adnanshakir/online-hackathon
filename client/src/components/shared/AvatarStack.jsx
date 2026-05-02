import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';

export function AvatarStack({ users = [], max = 3, size = 'sm', className }) {
  const visible = users.slice(0, max);
  const overflow = Math.max(0, users.length - max);

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((u) => (
        <Avatar key={u.id} user={u} size={size} ring />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            'grid h-7 w-7 place-items-center rounded-full bg-[var(--color-surface-elevated)] ' +
              'text-[10px] font-medium text-[var(--color-muted)] ring-2 ring-[var(--color-background)]',
            size === 'xs' && 'h-5 w-5 text-[8px]',
            size === 'md' && 'h-9 w-9 text-xs',
            size === 'lg' && 'h-12 w-12 text-sm'
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
