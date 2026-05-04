import { create } from 'zustand';
import { readStorage, writeStorage, removeStorage } from '@/lib/storage';

const STORAGE_KEY = 'opswatch.auth.v1';

const initial = readStorage(STORAGE_KEY, null);

/**
 * Auth state.
 *
 * The actual login / register / logout HTTP calls live in `lib/api.js`
 * (`auth.login`, `auth.register`, `auth.logout`). Those functions write the
 * resulting user into this store via `setUser`, so the rest of the app can
 * read it synchronously.
 *
 * On hard-refresh we hydrate from localStorage so the app stays "logged in"
 * until `auth.me()` confirms (or denies) the session.
 */
export const useAuthStore = create((set, get) => ({
  user: initial,
  isAuthenticated: !!initial,
  isInitialCheckDone: !initial,

  setInitialCheckDone: (done) => set({ isInitialCheckDone: done }),

  /** Set the current user (call after login/register/me) */
  setUser: (user) => {
    const prev = get().user;
    if (user) {
      // Avoid unnecessary writes that cause re-renders when nothing changed
      try {
        if (JSON.stringify(prev) === JSON.stringify(user)) return;
      } catch {
        // fall back to naive equality on id
        if (prev && prev.id && user.id && prev.id === user.id) return;
      }
      writeStorage(STORAGE_KEY, user);
      set({ user, isAuthenticated: true, isInitialCheckDone: true });
    } else {
      removeStorage(STORAGE_KEY);
      set({ user: null, isAuthenticated: false, isInitialCheckDone: true });
    }
  },

  /** Clear local auth (call after logout) */
  clear: () => {
    removeStorage(STORAGE_KEY);
    set({ user: null, isAuthenticated: false, isInitialCheckDone: true });
  },
}));
