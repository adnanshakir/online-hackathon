import { Link } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import { Avatar } from '@/components/shared/Avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { stagger, fadeUp } from '@/components/motion/variants';
import { getUserById } from '@/data/users';
import { timeAgo } from '@/lib/format';

export function ActivityFeed({ incidents = [], updates = [], limit = 8 }) {
  // Use provided updates direct, or flatten from incidents if provided
  const items = (
    updates.length > 0
      ? updates
      : incidents.flatMap((inc) =>
          (inc.updates || []).map((upd) => ({
            ...upd,
            incidentId: inc.id,
            incidentTitle: inc.title,
          }))
        )
  )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  return (
    <Motion.ol
      variants={stagger(0, 0.04)}
      initial="hidden"
      animate="visible"
      className="relative space-y-4"
    >
      {/* Vertical connecting line */}
      <span
        className="absolute left-[15px] top-2 bottom-2 w-px bg-[var(--color-border)]"
        aria-hidden
      />
      {items.map((it) => {
        const author = it.createdBy ||
          getUserById(it.authorId) || { name: it.authorName };
        return (
          <Motion.li
            key={it.id}
            variants={fadeUp}
            className="relative flex gap-3"
          >
            <span className="relative z-10 mt-0.5">
              <Avatar user={author} size="sm" ring />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">
                  {author?.name || 'Unknown'}
                </span>
                <span className="text-[10px] text-[var(--color-muted)]">
                  {timeAgo(it.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-sm text-[var(--color-muted)]">
                {it.message}
              </p>
              <div className="mt-1 flex items-center gap-2">
                {it.statusChange && <StatusBadge status={it.statusChange} />}
                <Link
                  to={`/app/incidents/${it.incidentId}`}
                  className="truncate text-[11px] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:underline"
                >
                  → {it.incidentTitle}
                </Link>
              </div>
            </div>
          </Motion.li>
        );
      })}
    </Motion.ol>
  );
}
