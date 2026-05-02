import { SEVERITY } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function SeverityBadge({ severity, showIcon = true, className }) {
  const meta = SEVERITY[severity];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        meta.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {meta.label}
    </span>
  );
}
