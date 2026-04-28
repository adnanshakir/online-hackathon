import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/shared/Avatar';
import { getUserById } from '@/data/users';

export function RespondersCard({ assigneeIds = [], onAdd }) {
  const responders = assigneeIds.map(getUserById).filter(Boolean);
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Responders
        </h3>
        {onAdd && (
          <button
            onClick={onAdd}
            className="grid size-6 place-items-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
            aria-label="Add responder"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <ul className="mt-3 space-y-2">
        {responders.map((u) => (
          <li key={u.id} className="flex items-center gap-2.5">
            <Avatar user={u} size="sm" online={u.online} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{u.name}</div>
              <div className="text-[11px] text-[var(--color-muted)] truncate">{u.role}</div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
