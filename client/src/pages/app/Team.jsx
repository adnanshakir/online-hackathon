import { useState, useEffect, useCallback } from 'react';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import { Plus, UserPlus, Shield, User, MoreVertical, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/shared/Avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fadeUp, stagger } from '@/components/motion/variants';
import { cn } from '@/lib/utils';
import * as api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage team and incidents',
  },
  {
    value: 'member',
    label: 'Member',
    description: 'Can view and update incidents',
  },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
];

export default function Team() {
  const currentUser = useAuthStore((s) => s.user);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [sending, setSending] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await api.workspace.listUsers();
      setMembers(data);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setSending(true);
    try {
      await api.workspace.invite({ email: inviteEmail, role: inviteRole });
      toast.success('Invite sent', {
        description: `An invitation was sent to ${inviteEmail}`,
      });
      setInviteEmail('');
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.workspace.updateRole({ userId, role: newRole });
      toast.success('Role updated');
      fetchMembers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  return (
    <Motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl"
    >
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {members.length} members · {members.filter((u) => u.online).length}{' '}
            online
          </p>
        </div>
        {(currentUser?.role === 'admin' || currentUser?.role === 'owner') && (
          <Button variant="gradient" size="sm" onClick={() => setOpen(true)}>
            <UserPlus className="h-4 w-4" /> Invite member
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="h-32 animate-pulse bg-[var(--color-surface)]"
            />
          ))}
        </div>
      ) : (
        <Motion.div
          variants={stagger(0, 0.05)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {members.map((u) => (
            <Motion.div key={u._id} variants={fadeUp}>
              <Card className="group relative overflow-hidden p-5 transition-all hover:border-[var(--color-muted)]">
                <div className="flex items-start gap-4">
                  <Avatar user={u} size="lg" online={u.online} ring />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-base font-semibold truncate">
                        {u.name}
                      </div>
                      {currentUser?.role === 'owner' &&
                        u._id !== currentUser?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>
                                Manage Permissions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(u._id, 'admin')}
                              >
                                <Shield className="mr-2 h-4 w-4" /> Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(u._id, 'member')
                                }
                              >
                                <User className="mr-2 h-4 w-4" /> Make Member
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                Remove from team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                          u.role === 'owner'
                            ? 'border-amber-500/50 bg-amber-500/10 text-amber-500'
                            : u.role === 'admin'
                              ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                              : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-muted)]'
                        )}
                      >
                        {u.role}
                      </span>
                      {u.online && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Motion.div>
          ))}
        </Motion.div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>
              Send an email invitation. They'll join your workspace instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                autoFocus
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Role</Label>
              <div className="grid gap-2">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setInviteRole(role.value)}
                    className={cn(
                      'flex flex-col items-start rounded-lg border p-3 text-left transition-all hover:bg-[var(--color-surface-elevated)]',
                      inviteRole === role.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border)]'
                    )}
                  >
                    <span className="text-sm font-semibold">{role.label}</span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {role.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              disabled={!inviteEmail || sending}
              onClick={handleInvite}
            >
              {sending ? (
                'Sending...'
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Send invite
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Motion.div>
  );
}
