import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LiveDuration } from '@/components/shared/LiveDuration';
import { AvatarStack } from '@/components/shared/AvatarStack';
import { EmptyState } from '@/components/shared/EmptyState';
import { ShieldCheck } from 'lucide-react';
import { stagger, fadeUp } from '@/components/motion/variants';
import { getUserById } from '@/data/users';

export function ActiveIncidentsList({ incidents }) {
  if (!incidents.length) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="All systems operational"
        description="No active incidents. Enjoy the calm."
      />
    );
  }
  return (
    <motion.ul
      variants={stagger(0, 0.05)}
      initial="hidden"
      animate="visible"
      className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      {incidents.map((inc) => {
        const responders = inc.assigneeIds.map(getUserById).filter(Boolean);
        return (
          <motion.li key={inc.id} variants={fadeUp}>
            <Link
              to={`/app/incidents/${inc.id}`}
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-surface-elevated)]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} animated />
                </div>
                <p className="mt-2 truncate text-sm font-medium text-[var(--color-foreground)]">
                  {inc.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  Open for <LiveDuration from={inc.createdAt} /> · {inc.updates.length} updates
                </p>
              </div>
              <AvatarStack users={responders} size="sm" max={3} />
              <ArrowRight className="h-4 w-4 text-[var(--color-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
