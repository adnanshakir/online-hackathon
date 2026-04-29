import { create } from 'zustand';
import { readStorage, writeStorage } from '@/lib/storage';

const SIDEBAR_KEY = 'opswatch.sidebar.collapsed';

export const useUIStore = create((set, get) => ({
  sidebarCollapsed: readStorage(SIDEBAR_KEY, false),
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    writeStorage(SIDEBAR_KEY, next);
    set({ sidebarCollapsed: next });
  },

  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),

  shortcutsOpen: false,
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),

  newIncidentOpen: false,
  setNewIncidentOpen: (newIncidentOpen) => set({ newIncidentOpen }),
}));
