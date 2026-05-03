import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import { toast } from 'sonner';
import {
  CheckCircle2,
  LogOut,
  RefreshCw,
  Copy,
  Trash2,
  Loader2,
  AlertTriangle,
  Bell,
  BellRing,
  Volume2,
  Mail,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/shared/Avatar';
import { useAuthStore } from '@/store/authStore';
import { useIncidentsStore } from '@/store/incidentsStore';
import { fadeUp } from '@/components/motion/variants';
import { cn } from '@/lib/utils';
import { auth, workspace as workspaceApi } from '@/lib/api';

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

  // Fresh workspace state (not stale authStore)
  const [workspaceData, setWorkspaceData] = useState(null);
  const [wsLoading, setWsLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin';
  const canManage = isOwner || isAdmin;

  const fetchWorkspace = useCallback(async () => {
    setWsLoading(true);
    try {
      const data = await workspaceApi.getMe();
      setWorkspaceData(data);
    } catch {
      toast.error('Could not load workspace data');
    } finally {
      setWsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'team' && user?.workspace) {
      fetchWorkspace();
    }
  }, [tab, user?.workspace, fetchWorkspace]);

  const handleRegenerateCode = async () => {
    setRegenerating(true);
    try {
      const data = await workspaceApi.regenerateInviteCode();
      setWorkspaceData((prev) => ({ ...prev, inviteCode: data.inviteCode }));
      toast.success('New invite code generated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to regenerate code');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await workspaceApi.delete();
      toast.success('Workspace deleted');
      useAuthStore.getState().clear();
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete workspace');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      toast.success('Signed out successfully');
      navigate('/', { replace: true });
    } catch {
      toast.error('Logout failed');
    }
  };

  const inviteCode =
    workspaceData?.inviteCode || user?.originalWorkspace?.inviteCode;

  return (
    <Motion.div
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
          {/* ── Profile ── */}
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

          {/* ── Team / Workspace ── */}
          {tab === 'team' && (
            <div className="space-y-4">
              {/* Workspace info */}
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
                        workspaceData?.name ||
                        user?.originalWorkspace?.name ||
                        'OpsWatch Demo'
                      }
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Workspace slug</Label>
                    <Input
                      defaultValue={
                        workspaceData?.slug ||
                        user?.originalWorkspace?.slug ||
                        'opswatch-demo'
                      }
                      disabled
                    />
                    <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-wider">
                      Status page: /status/
                      {workspaceData?.slug ||
                        user?.originalWorkspace?.slug ||
                        '...'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Invite Code — only for owner/admin */}
              {canManage && (
                <Card className="border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/5 p-6 shadow-[0_0_20px_-10px_rgba(var(--color-brand-primary-rgb),0.2)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-primary)]">
                        Invite Code
                      </h3>
                      <p className="mt-1 text-[13px] text-[var(--color-muted-strong)]">
                        Share this code with your teammates so they can join
                        this workspace.
                      </p>
                    </div>
                    {isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateCode}
                        disabled={regenerating || wsLoading}
                        className="shrink-0"
                      >
                        {regenerating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        Regenerate
                      </Button>
                    )}
                  </div>

                  {wsLoading ? (
                    <div className="mt-6 flex h-14 items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-[var(--color-muted)]" />
                    </div>
                  ) : (
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex-1 rounded-xl border border-[var(--color-brand-primary)]/30 bg-[var(--color-background)] px-4 py-3 font-mono text-xl font-bold tracking-[0.2em] text-[var(--color-foreground)] shadow-inner">
                        {inviteCode || '------'}
                      </div>
                      <Button
                        variant="gradient"
                        onClick={() => {
                          if (!inviteCode) return;
                          navigator.clipboard.writeText(inviteCode);
                          toast.success('Code copied to clipboard');
                        }}
                        disabled={!inviteCode}
                      >
                        <Copy className="mr-1.5 h-4 w-4" /> Copy
                      </Button>
                    </div>
                  )}
                </Card>
              )}

              {/* Delete Workspace — owner only */}
              {isOwner && (
                <Card className="border-red-500/20 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        Delete Workspace
                      </h3>
                      <p className="mt-1 text-[13px] text-[var(--color-muted)]">
                        Permanently deletes all services, incidents, updates,
                        and removes all members. This cannot be undone.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={handleDeleteWorkspace}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      {confirmDelete ? 'Confirm — Delete' : 'Delete workspace'}
                    </Button>
                  </div>
                  {confirmDelete && !deleting && (
                    <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-[12px] text-red-400">
                      ⚠️ Click "Confirm — Delete" again to permanently delete
                      this workspace and all its data.
                    </p>
                  )}
                </Card>
              )}
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Choose how OpsWatch alerts you when things happen.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  {
                    label: 'Incident opened',
                    description: 'Email when a new incident is declared',
                    icon: BellRing,
                    on: true,
                  },
                  {
                    label: 'Status changes',
                    description: 'Email when an incident status is updated',
                    icon: Bell,
                    on: true,
                  },
                  {
                    label: 'Sound alerts',
                    description: 'Play a sound when a new update arrives',
                    icon: Volume2,
                    on: false,
                  },
                  {
                    label: 'Weekly digest',
                    description:
                      'Summary email of resolved incidents each week',
                    icon: Mail,
                    on: true,
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <li
                      key={opt.label}
                      className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-colors hover:border-[var(--color-muted)]/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--color-surface-elevated)]">
                          <Icon className="h-3.5 w-3.5 text-[var(--color-muted-strong)]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{opt.label}</div>
                          <div className="text-[11px] text-[var(--color-muted)]">
                            {opt.description}
                          </div>
                        </div>
                      </div>
                      <ToggleSwitch initial={opt.on} />
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {/* ── Integrations ── */}
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

          {/* ── Status Page ── */}
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

          {/* Demo controls */}
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
    </Motion.div>
  );
}

function ToggleSwitch({ initial = false }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]',
        on
          ? 'bg-gradient-to-r from-violet-500 to-blue-500'
          : 'bg-[var(--color-border)]'
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200',
          on ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}
