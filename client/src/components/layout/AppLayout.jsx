import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { ShortcutsDialog } from '@/components/shared/ShortcutsDialog';
import { NewIncidentDialog } from '@/components/incidents/NewIncidentDialog';
import { AmbientGlow } from '@/components/shared/AmbientGlow';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUIStore } from '@/store/uiStore';

export function AppLayout() {
  const { newIncidentOpen, setNewIncidentOpen } = useUIStore();
  useKeyboardShortcuts({ onCreateIncident: () => setNewIncidentOpen(true) });

  return (
    <div className="relative flex min-h-screen text-[var(--color-foreground)]">
      <AmbientGlow variant="app" />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="relative flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <Outlet />
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette onCreateIncident={() => setNewIncidentOpen(true)} />
      <ShortcutsDialog />
      <NewIncidentDialog open={newIncidentOpen} onOpenChange={setNewIncidentOpen} />
    </div>
  );
}
