import { motion as Motion } from 'motion/react';
import { Avatar } from '@/components/shared/Avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getUserById } from '@/data/users';
import { timeAgo, formatDateTime } from '@/lib/format';

export function Timeline({ updates = [] }) {
  return (
    <ol className="relative space-y-5 pl-7">
      {/* connector line */}
      <span
        className="absolute left-[14px] top-2 bottom-2 w-px bg-[var(--color-border)]"
        aria-hidden
      />
      {updates.map((u, idx) => {
        const author = u.createdBy || getUserById(u.authorId);
        const isLast = idx === updates.length - 1;
        return (
          <Motion.li
            key={u.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
            className="relative"
          >
            <span className="absolute -left-7 top-1">
              <Avatar user={author} size="sm" ring />
              {isLast && (
                <span className="absolute inset-0 -m-0.5 animate-ping rounded-full bg-[var(--color-brand-violet)]/30" />
              )}
            </span>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {author?.name || 'Unknown'}
                  </span>
                  {u.statusChange && <StatusBadge status={u.statusChange} />}
                </div>
                <span
                  className="text-[11px] text-[var(--color-muted)] tabular-nums shrink-0"
                  title={formatDateTime(u.createdAt)}
                >
                  {timeAgo(u.createdAt)}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-[var(--color-foreground)] whitespace-pre-wrap">
                {u.message}
              </p>
            </div>
          </Motion.li>
        );
      })}
    </ol>
  );
}
