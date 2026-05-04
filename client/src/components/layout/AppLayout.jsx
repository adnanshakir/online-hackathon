import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileSidebar } from './MobileSidebar';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { ShortcutsDialog } from '@/components/shared/ShortcutsDialog';
import { NewIncidentDialog } from '@/components/incidents/NewIncidentDialog';
import { AmbientGlow } from '@/components/shared/AmbientGlow';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { isDemoMode } from '@/lib/demo';
import { useNotificationToast } from '@/hooks/useNotificationToast';

export function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const { newIncidentOpen, setNewIncidentOpen } = useUIStore();

  // Hooks must be called before any early returns
  useKeyboardShortcuts({ onCreateIncident: () => setNewIncidentOpen(true) });
  useNotificationToast();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Real users without a workspace cannot use the app — bounce them to the
  // workspace decision screen. Demo sessions skip this gate by design (the
  // demo seed is workspace-less and reads from local mocks).
  if (!isDemoMode() && !user?.workspace) {
    return <Navigate to="/workspace-decision" replace />;
  }

  return (
    <div className="relative flex h-screen overflow-hidden text-[var(--color-foreground)]">
      <AmbientGlow variant="app" />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <TopBar />
        <main className="relative flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <Outlet />
        </main>
      </div>

      {/* Global overlays */}
      <MobileSidebar />
      <CommandPalette onCreateIncident={() => setNewIncidentOpen(true)} />
      <ShortcutsDialog />
      <NewIncidentDialog
        open={newIncidentOpen}
        onOpenChange={setNewIncidentOpen}
      />
    </div>
  );
}
