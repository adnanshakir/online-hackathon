import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/Logo';
import { fadeUp } from '@/components/motion/variants';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { enableDemoMode } from '@/lib/demo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDemoLogin = () => {
    enableDemoMode();
    toast.success('Demo session started — explore freely.');
    navigate('/app/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    setSubmitting(true);
    try {
      const user = await api.login({ email, password });
      // Persist auth in the store (API layer no longer mutates store)
      useAuthStore.getState().setUser(user);
      toast.success('Signed in');
      navigate(user?.workspace ? '/app/dashboard' : '/workspace-decision');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col px-6 py-10 md:px-12"
      >
        <Logo />

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Sign in to your team workspace.
          </p>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="mt-6 group flex w-full items-center justify-between gap-3 rounded-lg border border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/10 px-4 py-3 text-left transition-colors hover:border-[var(--color-brand-primary)]/70 hover:bg-[var(--color-brand-primary)]/15"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-md bg-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--color-foreground)]">
                  Try the demo account
                </span>
                <span className="mt-0.5 block text-[11px] text-[var(--color-muted-strong)]">
                  No signup — explore the full product instantly.
                </span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--color-brand-primary)] transition-transform group-hover:translate-x-0.5" />
          </button>

          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full bg-white text-[#1f1f1f] hover:bg-[#f8f9fa] border-[#747775]/30"
            onClick={() => {
              window.location.href = api.googleAuthUrl();
            }}
          >
            <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            or
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@team.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link
                  to="#"
                  className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button
              variant="gradient"
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-[var(--color-muted)]">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-[var(--color-foreground)] hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </Motion.div>

      {/* Right: clean panel + mini incident preview */}
      <div className="relative hidden overflow-hidden border-l border-[var(--color-border)] lg:block">
        {/* subtle dot grid only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(oklch(96% 0 0) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative grid h-full place-items-center p-10 xl:p-16">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              Live preview
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] xl:text-4xl">
              Step into the workspace your on-call team{' '}
              <span className="text-[var(--color-brand-primary)]">
                actually opens.
              </span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
              Real-time timelines, AI briefs, and one-click postmortems —
              already in flight.
            </p>

            <AuthIncidentPreview className="mt-8" />
          </Motion.div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Compact incident preview shown on the right side of auth pages.
 * A trimmed-down version of the landing page WorkspacePreview —
 * gives signing-up users an immediate read of the product.
 * ──────────────────────────────────────────────────────────── */

import PropTypes from 'prop-types';

function AuthIncidentPreview({ className = '' }) {
  const items = [
    {
      time: '14:02',
      label: 'investigating',
      dot: 'bg-red-500',
      text: 'Elevated 5xx on /api/checkout',
    },
    {
      time: '14:08',
      label: 'identified',
      dot: 'bg-orange-500',
      text: 'Stripe webhook timeout under load',
    },
    {
      time: '14:21',
      label: 'resolved',
      dot: 'bg-[var(--color-brand-primary)]',
      text: '19 min · 0 customer reports',
    },
  ];

  const tone = {
    investigating: 'border-red-500/30 bg-red-500/10 text-red-400',
    identified: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    resolved:
      'border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]',
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            INC-8421
          </span>
          <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-red-400">
            Critical
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-[var(--color-muted)]">
          19m
        </span>
      </div>

      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <div className="text-[14px] font-semibold tracking-[-0.02em]">
          Elevated 5xx errors on checkout API
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Timeline
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            live
          </span>
        </div>

        <div className="relative space-y-3">
          <div
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px bg-[var(--color-border)]"
          />
          {items.map((u) => (
            <div key={u.time} className="relative flex items-start gap-3 pl-7">
              <span
                className={`absolute left-0 top-1.5 size-3 rounded-full ring-4 ring-[var(--color-surface)] ${u.dot}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-[10px] tabular-nums text-[var(--color-muted)]">
                    {u.time}
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${tone[u.label]}`}
                  >
                    {u.label}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-[12px] text-[var(--color-foreground)]/95">
                  {u.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-[var(--color-brand-primary)]/30 bg-[var(--color-brand-primary)]/[0.06] p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              AI Brief
            </span>
            <span className="font-mono text-[10px] tabular-nums text-[var(--color-brand-primary)]">
              87% conf
            </span>
          </div>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-[var(--color-muted-strong)]">
            Webhook queue saturated after deploy v2.4.1. Mitigation succeeded.
          </p>
        </div>
      </div>
    </div>
  );
}

AuthIncidentPreview.propTypes = {
  className: PropTypes.string,
};
