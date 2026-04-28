import { motion } from 'motion/react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { LiveDuration } from '@/components/shared/LiveDuration';
import { timeAgo } from '@/lib/format';

export function PublicIncidentCard({ incident }) {
  // Customer-friendly: hide engineering jargon, just show high-level status updates
  const updates = [...incident.updates].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">{incident.title}</h3>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            Started <LiveDuration from={incident.createdAt} until={incident.resolvedAt} /> ago
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} animated />
        </div>
      </div>

      <ol className="mt-4 space-y-3 border-l-2 border-[var(--color-border)] pl-4">
        {updates.slice(0, 4).map((u) => (
          <li key={u.id} className="relative">
            <span className="absolute -left-[1.5rem] top-1.5 size-2 rounded-full bg-[var(--color-brand-violet)]" />
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                {u.statusChange ? u.statusChange : 'Update'}
              </span>
              <span className="text-[10px] tabular-nums text-[var(--color-muted)]">
                {timeAgo(u.createdAt)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[var(--color-foreground)]">{u.message}</p>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
