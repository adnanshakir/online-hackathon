import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { formatDate, durationBetween } from '@/lib/format';
import { cn } from '@/lib/utils';

export function PastIncidents({ incidents = [] }) {
  const [open, setOpen] = useState(true);

  if (!incidents.length) return null;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <div>
          <h2 className="text-lg font-semibold">Past incidents</h2>
          <p className="text-xs text-[var(--color-muted)]">
            Last 30 days · {incidents.length} resolved
          </p>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {incidents.map((inc) => (
            <li
              key={inc.id}
              className="flex items-center gap-4 px-5 py-3 text-sm transition-colors hover:bg-[var(--color-surface-elevated)]"
            >
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
              <div className="min-w-0 flex-1 truncate">{inc.title}</div>
              <SeverityBadge severity={inc.severity} />
              <span className="text-[11px] text-[var(--color-muted)] tabular-nums whitespace-nowrap">
                {durationBetween(inc.createdAt, inc.resolvedAt)} · {formatDate(inc.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
