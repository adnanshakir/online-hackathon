import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AvatarStack } from '@/components/shared/AvatarStack';
import { LiveDuration } from '@/components/shared/LiveDuration';
import { timeAgo } from '@/lib/format';
import { getUserById } from '@/data/users';

export function IncidentRow({ incident }) {
  const responders = incident.assigneeIds.map(getUserById).filter(Boolean);
  const lastUpdate = incident.updates[incident.updates.length - 1];

  return (
    <Motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-elevated)]"
    >
      <td className="px-5 py-4">
        <Link
          to={`/app/incidents/${incident.id}`}
          className="absolute inset-0 z-10"
          aria-label={`View incident ${incident.title}`}
        />
        <div className="relative z-0 text-sm font-medium text-[var(--color-foreground)] line-clamp-1">
          {incident.title}
        </div>
        <div className="relative z-0 mt-0.5 line-clamp-1 text-xs text-[var(--color-muted)]">
          {incident.description}
        </div>
      </td>
      <td className="px-3 py-4">
        <SeverityBadge severity={incident.severity} />
      </td>
      <td className="px-3 py-4">
        <StatusBadge status={incident.status} animated />
      </td>
      <td className="px-3 py-4">
        <AvatarStack users={responders} size="xs" max={3} />
      </td>
      <td className="px-3 py-4 text-xs text-[var(--color-muted)] tabular-nums">
        <LiveDuration from={incident.createdAt} until={incident.resolvedAt} />
      </td>
      <td className="px-3 py-4 text-xs text-[var(--color-muted)]">
        {timeAgo(lastUpdate?.createdAt || incident.createdAt)}
      </td>
      <td className="px-3 py-4 text-right">
        <ArrowRight className="ml-auto h-4 w-4 text-[var(--color-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
      </td>
    </Motion.tr>
  );
}
