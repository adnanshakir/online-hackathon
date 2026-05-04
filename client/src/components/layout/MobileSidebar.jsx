import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Globe,
  Settings,
  Server,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { useUIStore } from '@/store/uiStore';
import { useEffect, useState } from 'react';
import { listIncidents } from '@/lib/api';

const NAV = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    to: '/app/incidents',
    label: 'Incidents',
    icon: AlertTriangle,
    dynamicBadge: true,
  },
  { to: '/app/services', label: 'Services', icon: Server },
  { to: '/app/team', label: 'Team', icon: Users },
  { to: '/app/status', label: 'Status Page', icon: Globe },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export function MobileSidebar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const fetch = async () => {
      try {
        const data = await listIncidents({ filter: 'active' });
        setActiveCount(data.length);
      } catch (err) {
        console.error('MobileSidebar badge fetch failed:', err);
      }
    };
    fetch();
  }, [mobileMenuOpen]);

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 shadow-2xl md:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <Logo size="md" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]'
                        : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                  {item.dynamicBadge && activeCount > 0 && (
                    <span className="ml-auto rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                      {activeCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-[var(--color-border)] pt-6">
              <div className="rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-4 border border-violet-500/20">
                <p className="text-sm font-semibold text-violet-400">Pro Tip</p>
                <p className="mt-1 text-xs text-[var(--color-muted)] leading-relaxed">
                  Use the command palette (Search) for quick actions across the platform.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
