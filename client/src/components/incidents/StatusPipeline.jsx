import { Check } from 'lucide-react';
import { STATUS, STATUS_PIPELINE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function StatusPipeline({ current, onChange }) {
  const currentIdx = STATUS_PIPELINE.indexOf(current);

  return (
    <div className="flex items-center gap-2">
      {STATUS_PIPELINE.map((s, i) => {
        const meta = STATUS[s];
        const done = i < currentIdx;
        const active = i === currentIdx;
        const Icon = meta.icon;
        return (
          <div key={s} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange?.(s)}
              className={cn(
                'group flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
                done && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
                active && 'border-current text-[var(--color-foreground)]',
                !done && !active &&
                  'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)]'
              )}
              style={active ? { borderColor: meta.color, color: meta.color, background: `${meta.color}10` } : {}}
              title={meta.label}
            >
              {done ? (
                <Check className="h-3 w-3" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
              {meta.label}
            </button>
            {i < STATUS_PIPELINE.length - 1 && (
              <span
                className={cn(
                  'h-px w-6 shrink-0',
                  i < currentIdx ? 'bg-emerald-500/50' : 'bg-[var(--color-border)]'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
