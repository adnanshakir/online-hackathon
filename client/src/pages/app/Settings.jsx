import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import { toast } from 'sonner';
import { CheckCircle2, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/shared/Avatar';
import { useAuthStore } from '@/store/authStore';
import { useIncidentsStore } from '@/store/incidentsStore';
import { fadeUp } from '@/components/motion/variants';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/api';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'team', label: 'Team' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'status', label: 'Status Page' },
];

const INTEGRATIONS = [
  {
    name: 'Slack',
    description: 'Post incident updates to a Slack channel',
    color: '#4A154B',
    initial: 'S',
  },
  {
    name: 'PagerDuty',
    description: 'Sync on-call schedules and trigger pages',
    color: '#06AC38',
    initial: 'P',
  },
  {
    name: 'Discord',
    description: 'Mirror updates to a Discord channel',
    color: '#5865F2',
    initial: 'D',
  },
  {
    name: 'GitHub',
    description: 'Link incidents to PRs and deploys',
    color: '#181717',
    initial: 'G',
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const user = useAuthStore((s) => s.user);
  const reset = useIncidentsStore((s) => s.resetSeed);

  const handleLogout = async () => {
    try {
      await auth.logout();
      toast.success('Signed out successfully');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Manage your account, team, and integrations.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                tab === t.id
                  ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]'
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 space-y-4">
          {tab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Profile</h2>
              <div className="mt-5 flex items-center gap-4">
                <Avatar user={user || { name: 'Demo User' }} size="xl" />
                <div>
                  <div className="text-base font-semibold">
                    {user?.name || 'Demo User'}
                  </div>
                  <div className="text-xs text-[var(--color-muted)]">
                    {user?.email || 'demo@opswatch.dev'}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={user?.name || 'Demo User'} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email || 'demo@opswatch.dev'} />
                </div>
              </div>
              <Button
                variant="gradient"
                size="sm"
                className="mt-6"
                onClick={() => toast.success('Profile saved')}
              >
                Save changes
              </Button>
            </Card>
          )}

          {tab === 'team' && (
            <div className="space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold">Workspace Settings</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Manage members and roles. Visit the{' '}
                  <a href="/app/team" className="underline">
                    Team page
                  </a>{' '}
                  for the full member list.
                </p>
                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <Label>Workspace name</Label>
                    <Input
                      defaultValue={
                        user?.originalWorkspace?.name || 'OpsWatch Demo'
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Workspace slug</Label>
                    <Input
                      defaultValue={
                        user?.originalWorkspace?.slug || 'opswatch-demo'
                      }
                    />
                    <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-wider">
                      Status page: /status/
                      {user?.originalWorkspace?.slug || '...'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Invite Code Section */}
              <Card className="border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/5 p-6 shadow-[0_0_20px_-10px_rgba(var(--color-brand-primary-rgb),0.2)]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-primary)]">
                      Invite Code
                    </h3>
                    <p className="mt-1 text-[13px] text-[var(--color-muted-strong)]">
                      Share this code with your teammates so they can join this
                      workspace.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-[var(--color-brand-primary)]/30 bg-[var(--color-background)] px-4 py-3 font-mono text-xl font-bold tracking-[0.2em] text-[var(--color-foreground)] shadow-inner">
                    {user?.originalWorkspace?.inviteCode || '------'}
                  </div>
                  <Button
                    variant="gradient"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        user?.originalWorkspace?.inviteCode
                      );
                      toast.success('Code copied to clipboard');
                    }}
                  >
                    Copy Code
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {tab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <ul className="mt-5 space-y-3">
                {[
                  { label: 'Email me when an incident is opened', on: true },
                  { label: 'Email me when status changes', on: true },
                  { label: 'Play sound when a new update arrives', on: false },
                  {
                    label: 'Send weekly digest of resolved incidents',
                    on: true,
                  },
                ].map((opt) => (
                  <li
                    key={opt.label}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
                  >
                    <span className="text-sm">{opt.label}</span>
                    <ToggleSwitch initial={opt.on} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {tab === 'integrations' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {INTEGRATIONS.map((it) => (
                <Card key={it.name} className="p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-10 place-items-center rounded-lg text-base font-bold text-white"
                      style={{ background: it.color }}
                    >
                      {it.initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{it.name}</div>
                      <div className="text-[11px] text-[var(--color-muted)]">
                        {it.description}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => toast.success(`${it.name} connected (demo)`)}
                  >
                    Connect
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {tab === 'status' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Public status page</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Customize how your status page looks to customers.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Brand color</Label>
                  <div className="flex gap-2">
                    {[
                      '#8b5cf6',
                      '#3b82f6',
                      '#10b981',
                      '#f97316',
                      '#ef4444',
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="size-8 rounded-full ring-2 ring-offset-2 ring-offset-[var(--color-background)] transition-all hover:scale-110"
                        style={{ background: c, '--tw-ring-color': c }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Custom domain</Label>
                  <Input placeholder="status.yourcompany.com" />
                </div>
              </div>
              <Button
                variant="gradient"
                size="sm"
                className="mt-6"
                onClick={() => toast.success('Status page updated')}
              >
                <CheckCircle2 className="h-4 w-4" /> Save changes
              </Button>
            </Card>
          )}

          {/* Danger zone — useful for the demo: lets judges reset state */}
          <Card className="border-red-500/20 p-6">
            <h2 className="text-base font-semibold">Demo controls</h2>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Reset all incidents back to the seeded examples.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={() => {
                reset();
                toast.success('Reset to seed data');
              }}
            >
              Reset incidents
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function ToggleSwitch({ initial = false }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={cn(
        'relative h-5 w-9 rounded-full transition-colors',
        on ? 'bg-gradient-accent' : 'bg-[var(--color-border)]'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-4 rounded-full bg-white transition-transform',
          on ? 'translate-x-4' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}
