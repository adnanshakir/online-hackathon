import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react'; // eslint-disable-line no-unused-vars
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { UserMenu } from '@/components/shared/UserMenu';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <>
      {/* ─── ISLAND PILL NAV ──────────────────────────────────── */}
      <header className="sticky top-4 z-30 mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:relative md:top-0 md:py-6">
        <Logo />
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-2 py-1.5 backdrop-blur-xl shadow-sm md:flex">
          <a
            href="#why"
            className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
          >
            Why
          </a>
          <a
            href="#features"
            className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
          >
            Features
          </a>
          <a
            href="#ai"
            className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
          >
            AI Brief
          </a>
          <a
            href="#how"
            className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
          >
            How
          </a>
          <Link
            to="/status/opswatch-demo"
            className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
          >
            Status
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-strong)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          {isAuthenticated ? (
            <>
              <Button
                asChild
                variant="gradient"
                size="sm"
                className="rounded-full px-4 hidden xs:inline-flex"
              >
                <Link to="/app/dashboard">
                  Open app <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <UserMenu variant="landing" />
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden text-[var(--color-muted-strong)] sm:inline-flex"
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="gradient"
                size="sm"
                className="rounded-full px-4 hidden xs:inline-flex"
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-strong)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ─── MOBILE SIDEBAR ──────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm md:hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[280px] h-full bg-[var(--color-background)] border-l border-[var(--color-border)] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted-strong)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-12 flex flex-col gap-6 text-lg font-medium text-[var(--color-foreground)]">
                <a
                  href="#why"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[var(--color-brand-primary)]"
                >
                  Why
                </a>
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[var(--color-brand-primary)]"
                >
                  Features
                </a>
                <a
                  href="#ai"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[var(--color-brand-primary)]"
                >
                  AI Brief
                </a>
                <a
                  href="#how"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[var(--color-brand-primary)]"
                >
                  How
                </a>
                <Link
                  to="/status/opswatch-demo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[var(--color-brand-primary)]"
                >
                  Status
                </Link>
              </nav>
              <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex flex-col gap-3">
                {isAuthenticated ? (
                  <Button
                    asChild
                    variant="gradient"
                    className="justify-center w-full rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to="/app/dashboard">Open app</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-center w-full"
                    >
                      <Link to="/login">Sign in</Link>
                    </Button>
                    <Button
                      asChild
                      variant="gradient"
                      className="justify-center w-full rounded-full"
                    >
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
