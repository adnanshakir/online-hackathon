import { create } from 'zustand';
import { readStorage, writeStorage } from '@/lib/storage';

const STORAGE_KEY = 'sentinel.theme';

function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

const initial = readStorage(STORAGE_KEY, 'dark');
applyTheme(initial);

export const useThemeStore = create((set, get) => ({
  theme: initial,
  setTheme: (theme) => {
    applyTheme(theme);
    writeStorage(STORAGE_KEY, theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    writeStorage(STORAGE_KEY, next);
    set({ theme: next });
  },
}));
