import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Globe,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { useUIStore } from '@/store/uiStore';

const NAV = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/incidents', label: 'Incidents', icon: AlertTriangle, badge: 2 },
  { to: '/app/team', label: 'Team', icon: Users },
  { to: '/app/status', label: 'Status Page', icon: Globe },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const collapsed = sidebarCollapsed;

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--color-border)] ' +
          'bg-[var(--color-surface)]/60 backdrop-blur-xl md:flex',
        'transition-[width] duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-60'
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
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ' +
                  'transition-all duration-200',
                isActive
                  ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-gradient-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge && (
                  <span className="ml-auto rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                    {item.badge}
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
