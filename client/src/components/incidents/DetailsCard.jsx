import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { Avatar } from '@/components/shared/Avatar';
import { getUserById } from '@/data/users';
import { formatDateTime, timeAgo } from '@/lib/format';

export function DetailsCard({ incident }) {
  const author = getUserById(incident.createdById);
  return (
    <Card className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Details
      </h3>
      <dl className="mt-3 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[var(--color-muted)] text-xs">Severity</dt>
          <dd>
            <SeverityBadge severity={incident.severity} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[var(--color-muted)] text-xs">Created by</dt>
          <dd className="flex items-center gap-1.5">
            {author && <Avatar user={author} size="xs" />}
            <span className="text-xs">{author?.name || 'Unknown'}</span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[var(--color-muted)] text-xs">Opened</dt>
          <dd className="text-xs tabular-nums" title={formatDateTime(incident.createdAt)}>
            {timeAgo(incident.createdAt)}
          </dd>
        </div>
        {incident.resolvedAt && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[var(--color-muted)] text-xs">Resolved</dt>
            <dd className="text-xs tabular-nums" title={formatDateTime(incident.resolvedAt)}>
              {timeAgo(incident.resolvedAt)}
            </dd>
          </div>
        )}
        {incident.affectedUsers > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[var(--color-muted)] text-xs">Affected users</dt>
            <dd className="text-xs tabular-nums">
              {incident.affectedUsers.toLocaleString()}
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
}
