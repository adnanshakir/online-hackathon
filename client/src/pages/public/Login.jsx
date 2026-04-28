import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/Logo';
import { useAuthStore } from '@/store/authStore';
import { fadeUp } from '@/components/motion/variants';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('demo@sentinel.dev');
  const [password, setPassword] = useState('demo');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      login({ email, name: email.split('@')[0].replace(/\b\w/g, (l) => l.toUpperCase()) });
      toast.success('Signed in');
      navigate('/app/dashboard');
    }, 600);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col px-6 py-10 md:px-12"
      >
        <Link to="/" className="inline-flex">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Sign in to your team workspace.
          </p>

          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => {
              login({ email: 'demo@sentinel.dev', name: 'Demo User' });
              toast.success('Signed in with Google (demo)');
              navigate('/app/dashboard');
            }}
          >
            <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden>
              <path
                fill="#fff"
                d="M17.64 9.2a10.5 10.5 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9a8.74 8.74 0 0 0 2.69-6.6Z"
              />
              <path
                fill="#fff"
                d="M9 18a8.6 8.6 0 0 0 5.95-2.18l-2.9-2.26a5.4 5.4 0 0 1-3.04.86 5.36 5.36 0 0 1-5.04-3.71H.92v2.33A9 9 0 0 0 9 18Z"
                opacity=".55"
              />
              <path
                fill="#fff"
                d="M3.96 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.92a9 9 0 0 0 0 8.08l3.04-2.33Z"
                opacity=".4"
              />
              <path
                fill="#fff"
                d="M9 3.58a4.85 4.85 0 0 1 3.43 1.34l2.57-2.57A8.66 8.66 0 0 0 9 0a9 9 0 0 0-8.08 4.96L3.96 7.3A5.36 5.36 0 0 1 9 3.58Z"
                opacity=".7"
              />
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
                <Link to="#" className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
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
            <Button variant="gradient" type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-[var(--color-muted)]">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-[var(--color-foreground)] hover:underline">
                Create one
              </Link>
            </p>
            <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50 px-3 py-2 text-center text-[11px] text-[var(--color-muted)]">
              Demo creds pre-filled · any email/password works
            </p>
          </form>
        </div>
      </motion.div>

      {/* Right: gradient + product preview */}
      <div className="relative hidden overflow-hidden bg-[var(--color-surface)] lg:block">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.32) 0%, transparent 50%, rgba(59, 130, 246, 0.32) 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-violet)]/30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-blue)]/30 blur-[120px]" />

        <div className="relative grid h-full place-items-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-md text-center"
          >
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Resolve incidents <span className="text-gradient">10x faster</span>.
            </h2>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Real-time updates, AI postmortems, and beautiful public status pages — all in
              one workspace.
            </p>

            <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium">All systems operational</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {['API', 'Web', 'Auth'].map((s) => (
                  <div
                    key={s}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-left text-[10px] text-[var(--color-muted)]"
                  >
                    <div className="font-medium text-[var(--color-foreground)]">{s}</div>
                    <div>99.99% · 47ms</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
