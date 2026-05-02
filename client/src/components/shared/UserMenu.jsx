import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Settings, User as UserIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { isDemoMode } from '@/lib/demo';
import * as api from '@/lib/api';
import { cn } from '@/lib/utils';

const ROLE_TONE = {
  owner: 'bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]/30',
  admin: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  member: 'bg-[var(--color-surface-elevated)] text-[var(--color-muted-strong)] border-[var(--color-border)]',
};

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || '').join('') || '?';
}

/**
 * Avatar + dropdown menu showing the signed-in user.
 *
 * Variants:
 *   - "app" (default) — for in-app TopBar; compact, no name shown next to avatar.
 *   - "landing"       — for marketing header; shows name beside avatar on md+.
 *
 * Closes on outside click and on Escape.
 */
export function UserMenu({ variant = 'app' }) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = async () => {
    setOpen(false);
    try {
      await api.logout();
      toast.success('Signed out');
      navigate('/');
    } catch {
      toast.error('Sign out failed');
    }
  };

  const demo = isDemoMode();
  const role = user.role || 'member';

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open user menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'relative flex items-center gap-2 rounded-full transition-colors',
          variant === 'landing'
            ? 'border border-[var(--color-border)] bg-[var(--color-surface)] py-1 pl-1 pr-2 hover:border-[var(--color-brand-primary)]/40 md:pr-3'
            : 'rounded-full hover:opacity-90'
        )}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            referrerPolicy="no-referrer"
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-8 place-items-center rounded-full bg-gradient-accent text-xs font-semibold text-white">
            {initials(user.name)}
          </span>
        )}
        {variant === 'landing' && (
          <span className="hidden text-[13px] font-medium text-[var(--color-foreground)] md:inline">
            {user.name?.split(' ')[0] || 'You'}
          </span>
        )}
        {/* Tiny live dot — confirms session is real */}
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--color-background)]"
          title={demo ? 'Demo session' : 'Signed in'}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl"
          >
            {/* Identity block */}
            <div className="border-b border-[var(--color-border)] bg-[var(--color-background)] p-4">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-accent text-sm font-semibold text-white">
                    {initials(user.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                    {user.name || 'You'}
                  </div>
                  <div className="truncate text-[12px] text-[var(--color-muted)]">
                    {user.email || '—'}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider',
                    ROLE_TONE[role] || ROLE_TONE.member
                  )}
                >
                  {role}
                </span>
                {demo && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-brand-primary)]/30 bg-[var(--color-brand-primary)]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
                    <Sparkles className="h-2.5 w-2.5" />
                    Demo
                  </span>
                )}
                {!demo && user.isVerified === false && (
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-orange-400">
                    Email unverified
                  </span>
                )}
              </div>
            </div>

            {/* Action items */}
            <nav className="p-1">
              <Link
                to="/app/dashboard"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-elevated)]"
              >
                <UserIcon className="h-4 w-4 text-[var(--color-muted)]" />
                Dashboard
              </Link>
              <Link
                to="/app/settings"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-elevated)]"
              >
                <Settings className="h-4 w-4 text-[var(--color-muted)]" />
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                {demo ? 'Exit demo' : 'Sign out'}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
