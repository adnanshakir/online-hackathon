import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Globe,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Server,
} from 'lucide-react';
import { motion as _motion, AnimatePresence } from 'motion/react';
const Motion = _motion;
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { useUIStore } from '@/store/uiStore';
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

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const collapsed = sidebarCollapsed;
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await listIncidents({ filter: 'active' });
        setActiveCount(data.length);
      } catch (err) {
        console.error('Sidebar badge fetch failed:', err);
      }
    };
    fetch();
    const interval = setInterval(fetch, 5000); // 5s poll for real-time sync
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--color-border)] ' +
          'bg-[var(--color-surface)]/60 backdrop-blur-xl md:flex',
        'transition-[width] duration-300 ease-in-out overflow-x-hidden',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center px-4">
        <Logo showWordmark={!collapsed} size="md" />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center rounded-lg py-2.5 text-sm font-medium ' +
                  'transition-all duration-200',
                collapsed ? 'justify-center px-0' : 'gap-3 px-3',
                isActive
                  ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <Motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-gradient-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <Motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </Motion.span>
                  )}
                </AnimatePresence>
                {!collapsed &&
                  (item.dynamicBadge ? activeCount > 0 : item.badge) && (
                    <span className="ml-auto rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      {item.dynamicBadge ? activeCount : item.badge}
                    </span>
                  )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium ' +
              'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] ' +
              'hover:text-[var(--color-foreground)] transition-colors'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
