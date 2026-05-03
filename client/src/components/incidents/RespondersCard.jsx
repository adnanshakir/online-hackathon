import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, UserPlus, Users, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/shared/Avatar';
import { InviteMemberDialog } from '@/components/shared/InviteMemberDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function RespondersCard({ users = [], allMembers = [], onAssign }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  // Map to store assigned IDs for quick lookup
  const assignedIds = new Set(users.map((u) => u.id || u._id));

  // Separate actual members from pending invites
  const pendingInvites = allMembers.filter((m) => m.isPending);

  const handleToggleMember = (userId) => {
    // Cannot assign pending members yet (they don't have a real User ID)
    if (userId.startsWith('pending-')) {
      toast.info('Wait for them to accept the invite first!');
      return;
    }
    const newIds = new Set(assignedIds);
    if (newIds.has(userId)) {
      newIds.delete(userId);
    } else {
      newIds.add(userId);
    }
    onAssign(Array.from(newIds));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Responders
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setManageOpen(true)}
            className="grid size-6 place-items-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
            title="Manage Responders"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {users.length === 0 && pendingInvites.length === 0 ? (
          <li className="text-[11px] text-[var(--color-muted)] italic py-2">
            No responders assigned
          </li>
        ) : (
          <>
            {/* Assigned Responders */}
            {users.map((u) => (
              <li key={u.id || u._id} className="flex items-center gap-2.5">
                <Avatar user={u} size="sm" online={u.online} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{u.name}</div>
                  <div className="text-[11px] text-[var(--color-muted)] truncate capitalize">
                    {u.role} •{' '}
                    <span className="text-emerald-500 font-medium">Joined</span>
                  </div>
                </div>
              </li>
            ))}

            {/* Pending Invites (Visible but not assignable) */}
            {pendingInvites.map((u) => (
              <li key={u._id} className="flex items-center gap-2.5 opacity-60">
                <Avatar user={u} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{u.name}</div>
                  <div className="text-[11px] text-[var(--color-muted)] truncate capitalize">
                    {u.role} •{' '}
                    <span className="text-amber-500 font-medium">Invited</span>
                  </div>
                </div>
              </li>
            ))}
          </>
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

      {/* Manage Responders Dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Manage Responders</DialogTitle>
            <DialogDescription>
              Assign team members to this incident. Invited members must accept
              first.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-1">
              {allMembers.map((member) => {
                const isAssigned = assignedIds.has(member.id || member._id);
                const isPending = member.isPending;
                return (
                  <button
                    key={member.id || member._id}
                    disabled={isPending}
                    onClick={() => handleToggleMember(member.id || member._id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-all',
                      !isPending && 'hover:bg-[var(--color-surface-elevated)]',
                      isAssigned && 'bg-[var(--color-surface-elevated)]',
                      isPending && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Avatar user={member} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-[10px] text-[var(--color-muted)] capitalize">
                        {member.role} {isPending && '• Invited'}
                      </div>
                    </div>
                    {isAssigned && (
                      <div className="size-5 rounded-full bg-[var(--color-primary)] grid place-items-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setManageOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </Card>
  );
}
