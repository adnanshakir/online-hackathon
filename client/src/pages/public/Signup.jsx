import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/Logo';
import { useAuthStore } from '@/store/authStore';
import { fadeUp } from '@/components/motion/variants';

export default function Signup() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      login({ email, name: name || email.split('@')[0] });
      toast.success('Welcome to Sentinel!');
      navigate('/app/dashboard');
    }, 700);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
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
          <h1 className="text-3xl font-semibold tracking-tight">Create your workspace</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Free for the first 5 teammates. No credit card required.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
            </div>
            <div className="space-y-2">
              <Label>Work email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@team.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </div>
            <Button variant="gradient" type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create workspace <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-[var(--color-muted)]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--color-foreground)] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>

      {/* Right side */}
      <div className="relative hidden overflow-hidden bg-[var(--color-surface)] lg:block">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.32) 0%, transparent 50%, rgba(59, 130, 246, 0.32) 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-violet)]/40 blur-[120px]" />
        <div className="relative grid h-full place-items-center p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Built for teams that ship.
            </h2>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Used by engineering teams who treat reliability as a first-class concern.
            </p>
            <ul className="mt-8 space-y-3 text-left text-sm">
              {[
                'Real-time incident timelines',
                'AI-assisted root cause suggestions',
                'Auto-generated postmortems',
                'Beautiful public status pages',
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]/40 px-3 py-2 backdrop-blur"
                >
                  <span className="grid size-5 place-items-center rounded-full bg-gradient-accent">
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6.5L4.5 9L10 3" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
