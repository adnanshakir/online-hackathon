import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed ' +
          'border-[var(--color-border)] bg-[var(--color-surface)]/40 px-6 py-16 text-center',
        className
      )}
    >
      {Icon && (
        <div className="grid size-12 place-items-center rounded-full bg-[var(--color-surface-elevated)]">
          <Icon className="h-5 w-5 text-[var(--color-muted)]" />
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-[var(--color-muted)]">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
