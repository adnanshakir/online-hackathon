import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, UserPlus } from 'lucide-react';
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
import { USERS } from '@/data/users';
import { fadeUp, stagger } from '@/components/motion/variants';
import { cn } from '@/lib/utils';

const ROLES = ['All', 'SRE', 'Platform', 'Product', 'Leadership'];

export default function Team() {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const filtered = filter === 'All'
    ? USERS
    : USERS.filter((u) => u.department === filter);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {USERS.length} members · {USERS.filter((u) => u.online).length} online
          </p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setOpen(true)}>
          <UserPlus className="h-4 w-4" /> Invite member
        </Button>
      </div>

      <div className="mb-4 inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              filter === r
                ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] shadow-sm'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <motion.div
        variants={stagger(0, 0.05)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((u) => (
          <motion.div key={u.id} variants={fadeUp}>
            <Card className="p-5 transition-all hover:border-[var(--color-muted)]">
              <div className="flex items-start gap-3">
                <Avatar user={u} size="lg" online={u.online} />
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold truncate">{u.name}</div>
                  <div className="text-xs text-[var(--color-muted)] truncate">{u.email}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 text-[10px] font-medium">
                      {u.role}
                    </span>
                    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 text-[10px] text-[var(--color-muted)]">
                      {u.department}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>
              Send an invite by email. They'll join your workspace as a Responder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              autoFocus
              type="email"
              placeholder="teammate@team.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="gradient"
              onClick={() => {
                toast.success('Invite sent', { description: inviteEmail });
                setInviteEmail('');
                setOpen(false);
              }}
            >
              <Plus className="h-4 w-4" /> Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
