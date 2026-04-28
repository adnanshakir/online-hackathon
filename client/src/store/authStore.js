import { create } from 'zustand';
import { readStorage, writeStorage, removeStorage } from '@/lib/storage';
import { DEMO_USER } from '@/data/users';

const STORAGE_KEY = 'sentinel.auth.v1';

const initial = readStorage(STORAGE_KEY, null);

export const useAuthStore = create((set) => ({
  user: initial,
  isAuthenticated: !!initial,

  login: ({ email, name }) => {
    const user = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      name: name || DEMO_USER.name,
    };
    writeStorage(STORAGE_KEY, user);
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: () => {
    removeStorage(STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));
