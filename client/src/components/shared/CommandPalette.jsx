import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Globe,
  Settings,
  Plus,
  Sun,
  Moon,
  Search,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useThemeStore } from '@/store/themeStore';
import { useIncidentsStore } from '@/store/incidentsStore';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function CommandPalette({ onCreateIncident }) {
  const { commandOpen, setCommandOpen } = useUIStore();
  const { theme, toggleTheme } = useThemeStore();
  const incidents = useIncidentsStore((s) => s.incidents);
  const navigate = useNavigate();

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [commandOpen, setCommandOpen]);

  const go = (path) => {
    setCommandOpen(false);
    navigate(path);
  };

  if (!commandOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setCommandOpen(false)}
    >
      <Command
        loop
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl animate-in fade-in-0 zoom-in-95"
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
          <Search className="h-4 w-4 text-[var(--color-muted)]" />
          <Command.Input
            autoFocus
            placeholder="Search incidents, navigate, or run a command…"
            className="h-12 w-full bg-transparent text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none"
          />
          <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted)]">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Navigation"
            className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--color-muted)]"
          >
            <CmdItem icon={LayoutDashboard} label="Dashboard" onSelect={() => go('/app/dashboard')} />
            <CmdItem icon={AlertTriangle} label="Incidents" onSelect={() => go('/app/incidents')} />
            <CmdItem icon={Users} label="Team" onSelect={() => go('/app/team')} />
            <CmdItem icon={Globe} label="Public status" onSelect={() => go('/status/sentinel-demo')} />
            <CmdItem icon={Settings} label="Settings" onSelect={() => go('/app/settings')} />
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="mt-2 px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--color-muted)]"
          >
            <CmdItem
              icon={Plus}
              label="Declare new incident"
              shortcut="C"
              onSelect={() => {
                setCommandOpen(false);
                onCreateIncident?.();
              }}
            />
            <CmdItem
              icon={theme === 'dark' ? Sun : Moon}
              label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onSelect={() => {
                toggleTheme();
                setCommandOpen(false);
              }}
            />
          </Command.Group>

          {incidents.length > 0 && (
            <Command.Group
              heading="Incidents"
              className="mt-2 px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--color-muted)]"
            >
              {incidents.slice(0, 8).map((inc) => (
                <Command.Item
                  key={inc.id}
                  value={`${inc.title} ${inc.id} ${inc.severity} ${inc.status}`}
                  onSelect={() => go(`/app/incidents/${inc.id}`)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-[var(--color-surface-elevated)]"
                >
                  <SeverityBadge severity={inc.severity} showIcon={false} />
                  <span className="flex-1 truncate">{inc.title}</span>
                  <StatusBadge status={inc.status} />
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}

function CmdItem({ icon: Icon, label, onSelect, shortcut }) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-[var(--color-surface-elevated)]"
    >
      <Icon className="h-4 w-4 text-[var(--color-muted)]" />
      <span className="flex-1">{label}</span>
      {shortcut && (
        <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted)]">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
