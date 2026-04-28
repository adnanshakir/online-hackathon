import { STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, animated = false, className }) {
  const meta = STATUS[status];
  if (!meta) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        meta.className,
        className
      )}
    >
      <span className="relative inline-flex">
        <span
          className={cn(
            'inline-block size-1.5 rounded-full',
            meta.dot,
            animated && status !== 'resolved' && 'pulse-dot'
          )}
          style={{ color: meta.color }}
        />
      </span>
      {meta.label}
    </span>
  );
}
