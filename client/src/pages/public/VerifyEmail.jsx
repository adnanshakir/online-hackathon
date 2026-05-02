import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { useAuthStore } from '@/store/authStore';
import * as api from '@/lib/api';

/**
 * Landing page for the link inside the verification email
 * (`/verify-email?token=...`).
 *
 * Auto-submits the token to the backend on mount and shows one of three
 * states: verifying / success / error. The 'idle' state is only seen
 * momentarily before the effect fires.
 */
export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [status, setStatus] = useState(token ? 'verifying' : 'missing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        await api.verifyEmail(token);
        if (!cancelled) setStatus('success');
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(
          err.response?.data?.message ||
            err.message ||
            'Verification link is invalid or has expired.'
        );
        setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // After a successful verify, give the user a beat to read the message,
  // then route them to the next sensible place.
  useEffect(() => {
    if (status !== 'success') return;
    const t = setTimeout(() => {
      navigate(isAuthenticated ? '/workspace-decision' : '/login', {
        replace: true,
      });
    }, 1800);
    return () => clearTimeout(t);
  }, [status, isAuthenticated, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8">
          {(status === 'verifying' || status === 'idle') && (
            <>
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Verifying your email
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Hang tight — confirming your token with the server.
              </p>
            </>
          )}

          {status === 'missing' && (
            <>
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                <XCircle className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                No verification token
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                This page needs a token in the URL. Open the link directly from
                the email we sent you.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/login">Back to sign in</Link>
              </Button>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Email verified
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Redirecting you to {isAuthenticated ? 'workspace setup' : 'sign in'}…
              </p>
              <Button asChild variant="gradient" className="mt-6">
                <Link to={isAuthenticated ? '/workspace-decision' : '/login'}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <XCircle className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Verification failed
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{errorMsg}</p>
              <div className="mt-6 flex justify-center gap-2">
                <Button asChild variant="outline">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild variant="gradient">
                  <Link to="/signup">Create new account</Link>
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-[11px] text-[var(--color-muted)]">
          Tip: open the email link on the same device where the dev server is running.
        </p>
      </motion.div>
    </div>
  );
}
