import { Search, Bell, Sun, Moon, Plus, Command as CommandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/shared/UserMenu';
import { useThemeStore } from '@/store/themeStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export function TopBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { setCommandOpen, setNewIncidentOpen } = useUIStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--color-border)] ' +
          'bg-[var(--color-background)]/70 px-4 backdrop-blur-xl md:px-6'
      )}
    >
      {/* Search trigger — opens command palette */}
      <button
        onClick={() => setCommandOpen(true)}
        className={cn(
          'group flex w-full max-w-md items-center gap-3 rounded-lg border border-[var(--color-border)] ' +
            'bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-muted)] ' +
            'transition-colors hover:border-[var(--color-muted)] hover:text-[var(--color-foreground)]'
        )}
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search incidents, services…</span>
        <span className="flex items-center gap-1 text-[10px] text-[var(--color-muted)]">
          <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-sans">
            <CommandIcon className="inline h-3 w-3" />
          </kbd>
          <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-sans">
            K
          </kbd>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="gradient"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => setNewIncidentOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New incident
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500 ring-2 ring-[var(--color-background)]" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="ml-2">
          <UserMenu variant="app" />
        </div>
      </div>
    </header>
  );
}
