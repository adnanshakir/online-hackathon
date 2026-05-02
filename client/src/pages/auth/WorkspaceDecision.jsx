import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react'; // eslint-disable-line no-unused-vars
import {
  Plus,
  Users,
  ArrowRight,
  Loader2,
  LayoutGrid,
  Sparkles,
  ChevronLeft,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/Logo';
import { fadeUp, stagger, scaleIn } from '@/components/motion/variants';
import { toast } from 'sonner';
import { workspace, logout } from '@/lib/api';
import { AmbientGlow } from '@/components/shared/AmbientGlow';

export default function WorkspaceDecision() {
  const navigate = useNavigate();
  const [view, setView] = useState('choose'); // 'choose' | 'create' | 'join'
  const [loading, setLoading] = useState(false);

  // Create form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  // Join form state
  const [inviteCode, setInviteCode] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error('Workspace name and slug are required');
      return;
    }
    setLoading(true);
    try {
      await workspace.create({ name, slug });
      toast.success('Workspace created successfully');
      navigate('/service-setup');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error('Invite code is required');
      return;
    }
    setLoading(true);
    try {
      await workspace.join({ inviteCode });
      toast.success('Joined workspace successfully');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid invite code');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const autoSlug = (val) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-6 py-12">
      <AmbientGlow variant="landing" />

      {/* Top Header */}
      <div className="absolute top-8 left-8 flex items-center justify-between w-[calc(100%-4rem)]">
        <Logo />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        >
          Logout
        </Button>
      </div>

      <div className="z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {view === 'choose' && (
            <motion.div
              key="choose"
              variants={stagger(0.1, 0.1)}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                variants={fadeUp}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]"
              >
                <Sparkles className="h-3 w-3" />
                First Step
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl"
              >
                Ready to Ops?
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-4 text-base text-[var(--color-muted-strong)]"
              >
                Create a new workspace for your team or join an existing one.
              </motion.p>

              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {/* Option A: Create */}
                <motion.button
                  variants={scaleIn}
                  onClick={() => setView('create')}
                  className="group relative flex flex-col items-start rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 text-left transition-all hover:border-[var(--color-brand-primary)]/50 hover:shadow-[0_0_40px_-12px_rgba(var(--color-brand-primary-rgb),0.2)]"
                >
                  <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
                    Create Workspace
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                    Set up a fresh command center for your engineering team and
                    start tracking incidents.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[var(--color-brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Get started <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.button>

                {/* Option B: Join */}
                <motion.button
                  variants={scaleIn}
                  onClick={() => setView('join')}
                  className="group relative flex flex-col items-start rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 text-left transition-all hover:border-[var(--color-brand-primary)]/50 hover:shadow-[0_0_40px_-12px_rgba(var(--color-brand-primary-rgb),0.2)]"
                >
                  <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
                    Join Workspace
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                    Already have a team? Enter your workspace invite code to
                    step into the action.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[var(--color-brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Enter code <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto w-full max-w-md"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('choose')}
                className="mb-8 -ml-3 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>

              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                Build your command center
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted-strong)]">
                Give your workspace a name. You can invite your team later.
              </p>

              <form onSubmit={handleCreate} className="mt-10 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ws-name">Workspace Name</Label>
                  <Input
                    id="ws-name"
                    placeholder="Acme Corp"
                    value={name}
                    onChange={(e) => autoSlug(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ws-slug">Workspace Slug</Label>
                  <div className="relative">
                    <Input
                      id="ws-slug"
                      placeholder="acme-corp"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="pl-8"
                    />
                    <LayoutGrid className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--color-muted)]" />
                  </div>
                  <p className="text-[10px] text-[var(--color-muted)]">
                    This will be your workspace's unique identifier.
                  </p>
                </div>

                <Button
                  variant="gradient"
                  type="submit"
                  className="w-full h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Create Workspace'
                  )}
                </Button>
              </form>
            </motion.div>
          )}

          {view === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto w-full max-w-md"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('choose')}
                className="mb-8 -ml-3 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>

              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                Join your team
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted-strong)]">
                Enter the 6-character invite code shared by your admin.
              </p>

              <form onSubmit={handleJoin} className="mt-10 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <div className="relative">
                    <Input
                      id="invite-code"
                      placeholder="X7Y2Z9"
                      value={inviteCode}
                      onChange={(e) =>
                        setInviteCode(e.target.value.toUpperCase())
                      }
                      className="pl-8 font-mono tracking-widest text-lg uppercase"
                      maxLength={6}
                      autoFocus
                    />
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-[var(--color-muted)]" />
                  </div>
                </div>

                <Button
                  variant="gradient"
                  type="submit"
                  className="w-full h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Join Workspace'
                  )}
                </Button>

                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[11px] leading-relaxed text-[var(--color-muted)]">
                  <p>
                    <strong>Don't have a code?</strong> Ask your workspace owner
                    or admin to generate one from the <strong>Team</strong>{' '}
                    settings page.
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
    </div>
  );
}
