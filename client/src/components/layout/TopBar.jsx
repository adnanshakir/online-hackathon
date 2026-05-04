import { Search, Sun, Moon, Plus, Command as CommandIcon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/shared/UserMenu';
import { useThemeStore } from '@/store/themeStore';
import { useUIStore } from '@/store/uiStore';
import { NotificationsMenu } from './NotificationsMenu';
import { cn } from '@/lib/utils';

export function TopBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { setCommandOpen, setNewIncidentOpen, setMobileMenuOpen } = useUIStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-[var(--color-border)] ' +
          'bg-[var(--color-background)]/80 px-4 backdrop-blur-xl md:gap-4 md:px-6'
      )}
    >
      {/* Mobile Menu Trigger */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search trigger — collapses to icon on mobile */}
      <div className="flex flex-1 items-center md:flex-initial lg:w-full lg:max-w-md md:w-64">
        {/* Desktop Search Button */}
        <button
          onClick={() => setCommandOpen(true)}
          className={cn(
            'hidden md:flex group w-full items-center gap-2 lg:gap-3 rounded-lg border border-[var(--color-border)] ' +
              'bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-muted)] ' +
              'transition-colors hover:border-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left truncate">Search incidents, services…</span>
          <span className="hidden lg:flex items-center gap-1 text-[10px] text-[var(--color-muted)]">
            <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-sans">
              <CommandIcon className="inline h-3 w-3" />
            </kbd>
            <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-sans">
              K
            </kbd>
          </span>
        </button>

        {/* Mobile Search Icon */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setCommandOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          variant="gradient"
          size="sm"
          className="hidden sm:inline-flex items-center gap-2"
          onClick={() => setNewIncidentOpen(true)}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">New incident</span>
        </Button>

        <NotificationsMenu />

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="shrink-0"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <div className="ml-1 sm:ml-2 shrink-0">
          <UserMenu variant="app" />
        </div>
      </div>
    </header>
  );
}

