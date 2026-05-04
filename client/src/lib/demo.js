/**
 * Demo mode — frontend-only sandbox so reviewers can explore OpsWatch
 * without needing a real backend account.
 *
 * When the flag is set, lib/api.js short-circuits HTTP calls and routes
 * reads/writes through the in-memory useIncidentsStore (which seeds itself
 * from client/src/data/incidents.js on first load and persists to
 * localStorage). Auth calls return DEMO_USER without hitting the server.
 *
 * Logging out clears the flag.
 */

import { useAuthStore } from '@/store/authStore';

const FLAG_KEY = 'opswatch.demo.v1';

export const DEMO_USER = {
  id: 'u_demo_reviewer',
  name: 'Demo Reviewer',
  email: 'reviewer@opswatch.demo',
  role: 'admin',
  avatar: null,
  authProviders: ['demo'],
  workspace: 'demo_workspace',
};

export function isDemoMode() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

export function enableDemoMode() {
  try {
    window.localStorage.setItem(FLAG_KEY, '1');
  } catch {
    // localStorage unavailable — proceed anyway; user stays in demo until refresh.
  }
  useAuthStore.getState().setUser(DEMO_USER);
}

export function disableDemoMode() {
  try {
    window.localStorage.removeItem(FLAG_KEY);
  } catch {
    // ignore
  }
}
