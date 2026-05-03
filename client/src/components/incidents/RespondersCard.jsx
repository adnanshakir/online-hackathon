import { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/shared/Avatar';
import { InviteMemberDialog } from '@/components/shared/InviteMemberDialog';
import { getUserById } from '@/data/users';

export function RespondersCard({ users = [], assigneeIds = [] }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const responders =
    users.length > 0 ? users : assigneeIds.map(getUserById).filter(Boolean);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Responders
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setInviteOpen(true)}
            className="grid size-6 place-items-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
            aria-label="Add responder"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {responders.length === 0 ? (
          <li className="text-[11px] text-[var(--color-muted)] italic py-2">
            No responders assigned
          </li>
        ) : (
          responders.map((u) => (
            <li key={u.id} className="flex items-center gap-2.5">
              <Avatar user={u} size="sm" online={u.online} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{u.name}</div>
                <div className="text-[11px] text-[var(--color-muted)] truncate">
                  {u.role}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-full justify-start px-2 text-[11px] font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="mr-2 h-3.5 w-3.5" />
          Invite team member
        </Button>
      </div>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </Card>
  );
}
