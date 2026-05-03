/**
 * API abstraction layer.
 *
 * Wired to the real backend for endpoints that exist:
 *   - Auth: login / register / logout / refresh-token / google redirect
 *   - Incidents: list / get / create / changeStatus / assignUsers
 *   - Timeline: getTimeline / postUpdate
 *
 * Still mock-backed (backend hasn't built these yet):
 *   - listUsers / getUser           → from `client/src/data/users.js`
 *   - listServices / getService     → from `client/src/data/services.js`
 *   - getIncidentPostmortem         → from `client/src/data/postmortems.js`
 *   - updateIncident (general PATCH) → in-memory store
 *   - me() / getCurrentUser          → falls back to authStore (no /me endpoint yet)
 *
 * Vite proxy forwards `/api/*` to `http://localhost:3000` (see vite.config.js)
 * so the browser sees cookies as same-origin and they flow automatically.
 */

import axios from 'axios';
import { useIncidentsStore } from '@/store/incidentsStore';
import { useAuthStore } from '@/store/authStore';
import { USERS, getUserById } from '@/data/users';
import { SERVICES, getServiceById } from '@/data/services';
import { getPostmortem } from '@/data/postmortems';
import { isDemoMode, disableDemoMode, DEMO_USER } from '@/lib/demo';

/* ────────── Axios client ────────── */

const RAW_API_URL = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = RAW_API_URL
  ? `${RAW_API_URL.replace(/\/$/, '')}${RAW_API_URL.includes('/api') ? '' : '/api'}`
  : '/api';

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Global 401 interceptor for session management
http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // 1. Try refreshing token if it's a 401 and not an auth route itself
    if (
      err.response?.status === 401 &&
      original &&
      !original._retried &&
      !original.url.includes('/auth/login') &&
      !original.url.includes('/auth/register') &&
      !original.url.includes('/auth/refresh-token')
    ) {
      original._retried = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh-token`, null, {
          withCredentials: true,
        });
        return http(original);
      } catch (refreshErr) {
        // Refresh failed -> logout
        useAuthStore.getState().setUser(null);
        return Promise.reject(refreshErr);
      }
    }

    // 2. If it's a 401 and we can't refresh, clear state
    if (err.response?.status === 401) {
      useAuthStore.getState().setUser(null);
    }

    return Promise.reject(err);
  }
);

/* ────────── Transformers ────────── */

/** Backend incident → frontend shape (preserves what existing components expect). */
function toIncident(raw) {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    title: raw.title,
    description: raw.description,
    severity: raw.severity,
    status: raw.status,
    serviceIds: raw.service ? [raw.service] : [],
    createdById: raw.createdBy?._id || raw.createdBy?.id || raw.createdBy,
    createdByName: raw.createdBy?.name,
    createdByEmail: raw.createdBy?.email,
    assigneeIds: (raw.assignedTo || []).map((u) => u?._id || u?.id || u),
    assigneeUsers: (raw.assignedTo || [])
      .filter((u) => typeof u === 'object')
      .map((u) => ({
        id: u._id || u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
      })),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    resolvedAt: raw.status === 'resolved' ? raw.updatedAt : null,
    affectedUsers: 0, // not tracked by backend yet
    updates: [], // fetched separately via getTimeline
    postmortem: null,
  };
}

/** Backend update → frontend shape. */
function toUpdate(raw) {
  if (!raw) return null;
  // For status_change rows the backend writes "Status changed to <status>"
  // Pull the new status out so the timeline UI can render a status badge.
  let statusChange = null;
  if (raw.type === 'status_change') {
    const m = /Status changed to (\w+)/i.exec(raw.message || '');
    if (m) statusChange = m[1].toLowerCase();
  }
  return {
    id: raw._id || raw.id,
    authorId: raw.createdBy?._id || raw.createdBy?.id || raw.createdBy,
    authorName: raw.createdBy?.name,
    authorEmail: raw.createdBy?.email,
    message: raw.message,
    type: raw.type,
    statusChange,
    createdAt: raw.createdAt,
  };
}

function toUser(raw) {
  if (!raw) return null;
  // workspace can come back as an ObjectId string, a populated object, or null.
  // We surface the id at `user.workspace` (the canonical gate field used
  // across the app) and the populated object at `user.originalWorkspace`
  // when the backend bothered to populate it.
  return {
    id: raw._id || raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatar: raw.avatar,
    authProviders: raw.authProviders,
    isVerified: raw.isVerified,
    workspace: raw.workspace?._id || raw.workspace || null,
    originalWorkspace:
      raw.workspace && typeof raw.workspace === 'object' ? raw.workspace : null,
  };
}

/* ────────── Incidents ────────── */

export async function listIncidents({ filter = 'all' } = {}) {
  if (isDemoMode()) {
    const incidents = useIncidentsStore.getState().incidents;
    if (filter === 'active')
      return incidents.filter((i) => i.status !== 'resolved');
    if (filter === 'resolved')
      return incidents.filter((i) => i.status === 'resolved');
    return incidents;
  }
  const { data: body } = await http.get('/incidents');
  // Backend returns { data: [...] }
  const rawList = body.data || [];
  const incidents = rawList.map(toIncident);
  if (filter === 'active')
    return incidents.filter((i) => i.status !== 'resolved');
  if (filter === 'resolved')
    return incidents.filter((i) => i.status === 'resolved');
  return incidents;
}

export async function getIncident(id) {
  if (isDemoMode()) {
    return (
      useIncidentsStore.getState().incidents.find((i) => i.id === id) || null
    );
  }
  const { data } = await http.get(`/incidents/${id}`);
  return toIncident(data);
}

export async function createIncident(payload) {
  if (isDemoMode()) {
    return useIncidentsStore.getState().createIncident({
      title: payload.title,
      description: payload.description,
      severity: payload.severity || 'low',
      serviceIds: payload.serviceIds || [],
      assigneeIds: payload.assigneeIds || [],
      createdById: useAuthStore.getState().user?.id || DEMO_USER.id,
    });
  }
  // Backend wants { title, description, service: <single string>, severity }.
  // Frontend's NewIncidentDialog sends serviceIds (array) + assigneeIds.
  // We send only the first service today; if assignees were provided we follow
  // up with PATCH /assign so the backend can validate + create its log entry.
  const body = {
    title: payload.title,
    description: payload.description,
    severity: payload.severity || 'low',
    service: payload.service,
  };
  const { data } = await http.post('/incidents', body);
  let incident = toIncident(data);

  if (payload.assigneeIds?.length) {
    const { data: assigned } = await http.patch(
      `/incidents/${incident.id}/assign`,
      { assignedTo: payload.assigneeIds }
    );
    incident = toIncident(assigned);
  }

  return incident;
}

export async function changeStatus(incidentId, status) {
  if (isDemoMode()) {
    return useIncidentsStore.getState().changeStatus(incidentId, status);
  }
  const { data } = await http.patch(`/incidents/${incidentId}/status`, {
    status,
  });
  return toIncident(data);
}

/**
 * Mock-only general PATCH for incident fields (title, description). Backend
 * exposes only /status and /assign — anything else lives in the local
 * incidentsStore until the API gets a real PATCH /:id endpoint. Restored
 * here because IncidentDetail's inline title-edit calls api.updateIncident.
 */
export async function updateIncident(incidentId, patch) {
  return useIncidentsStore.getState().updateIncident(incidentId, patch);
}

export async function assignResponders(incidentId, assignedTo) {
  if (isDemoMode()) {
    return useIncidentsStore.getState().updateIncident(incidentId, {
      assigneeIds: assignedTo,
    });
  }
  const { data } = await http.patch(`/incidents/${incidentId}/assign`, {
    assignedTo,
  });
  return toIncident(data);
}

/* ────────── Services ────────── */

export async function listServices() {
  if (isDemoMode()) {
    return SERVICES;
  }
  const { data: body } = await http.get('/services');
  return body.data || [];
}

export async function getService(id) {
  if (isDemoMode()) {
    return getServiceById(id);
  }
  const { data } = await http.get(`/services/${id}`);
  return data;
}

/**
 * @backend  PATCH /api/services/:id/status  { status }
 * Toggles service health: operational | degraded | down | maintenance.
 */
export async function updateServiceStatus(serviceId, status) {
  const { data } = await http.patch(`/services/${serviceId}/status`, {
    status,
  });
  return data;
}

export async function createService(payload) {
  const { data } = await http.post('/services', payload);
  return data;
}

/* ────────── Timeline ────────── */

export async function getTimeline(incidentId) {
  if (isDemoMode()) {
    const incident = useIncidentsStore
      .getState()
      .incidents.find((i) => i.id === incidentId);
    return incident?.updates ? [...incident.updates] : [];
  }
  const { data } = await http.get(`/incidents/${incidentId}/updates`);
  return data.map(toUpdate);
}

export async function postUpdate(incidentId, update) {
  if (isDemoMode()) {
    return useIncidentsStore.getState().postUpdate(incidentId, {
      authorId:
        update.authorId || useAuthStore.getState().user?.id || DEMO_USER.id,
      message: update.message,
      statusChange: update.statusChange || null,
    });
  }
  const body = {
    message: update.message,
    // Frontend uses statusChange for the "post + change status" combo flow.
    // If statusChange is set, do TWO calls: change status (which auto-logs),
    // then post the user's note as a comment. Otherwise post a plain log/comment.
    type: update.type || 'log',
  };
  if (update.statusChange) {
    await http.patch(`/incidents/${incidentId}/status`, {
      status: update.statusChange,
    });
    if (update.message?.trim()) {
      await http.post(`/incidents/${incidentId}/updates`, {
        message: update.message,
        type: 'comment',
      });
    }
    // Return the latest incident so the caller can refresh local state.
    return getIncident(incidentId);
  }
  const { data } = await http.post(`/incidents/${incidentId}/updates`, body);
  return toUpdate(data);
}

/* ────────── Users / Team ────────── */

export async function listUsers() {
  if (isDemoMode()) return USERS;
  try {
    const { data } = await http.get('/workspace/members');
    // Backend returns array of { _id, name, email, role, avatar }
    return (data || []).map((u) => ({
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar || null,
    }));
  } catch {
    return [];
  }
}

export async function getUser(id) {
  return getUserById(id) || null;
}

/* ────────── Workspace ────────── */

/**
 * @backend  POST /api/workspace/create  { name, slug }
 * Requires verified email. Backend mutates the current user (sets workspace +
 * role: 'owner') but does NOT return the updated user, so we re-fetch /me to
 * keep authStore in sync.
 */
export async function createWorkspace({ name, slug }) {
  if (isDemoMode()) {
    const fakeWorkspace = {
      _id: 'ws_demo',
      name: name || 'Demo Workspace',
      slug: slug || 'demo',
      inviteCode: 'DEMO01',
    };
    useAuthStore.getState().setUser({
      ...useAuthStore.getState().user,
      workspace: fakeWorkspace._id,
      originalWorkspace: fakeWorkspace,
      role: 'owner',
    });
    return fakeWorkspace;
  }
  const { data } = await http.post('/workspace/create', { name, slug });
  await me();
  return data;
}

/**
 * @backend  POST /api/workspace/join  { inviteCode }
 * Requires verified email. Backend joins user as 'member' but does not return
 * the updated user — we re-fetch /me afterwards.
 */
export async function joinWorkspace({ inviteCode }) {
  if (isDemoMode()) {
    useAuthStore.getState().setUser({
      ...useAuthStore.getState().user,
      workspace: 'ws_demo',
      role: 'member',
    });
    return { message: 'Joined demo workspace' };
  }
  const { data } = await http.post('/workspace/join', { inviteCode });
  await me();
  return data;
}

// Namespace re-exports — Adnan's pages import { workspace, services } from
// '@/lib/api', so we expose the matching named groups here.
export const workspace = {
  create: createWorkspace,
  join: joinWorkspace,
  invite: (payload) => http.post('/workspace/invite', payload),
  listUsers: () =>
    http
      .get('/workspace/members')
      .then((res) => res.data?.data || res.data || []),
  updateRole: (payload) => http.patch('/workspace/role', payload),
  getMe: () => http.get('/workspace/me').then((res) => res.data),
  regenerateInviteCode: () =>
    http.patch('/workspace/invite-code').then((res) => res.data),
  delete: () => http.delete('/workspace').then((res) => res.data),
};
export const services = {
  list: listServices,
  get: getService,
  create: createService,
};

export async function deleteService(id) {
  const { data } = await http.delete(`/services/${id}`);
  return data;
}

/* ────────── AI ──────────
 * Backend has Mistral → Gemini failover. The summary endpoint returns a
 * plain-text string; the root-cause endpoint returns a JSON array of 1–3
 * ranked technical causes (each with title + reasoning + confidence).
 */

/** @backend GET /api/ai/incidents/:id/summary  → { summary: string } */
export async function getAISummary(incidentId) {
  const { data } = await http.get(`/ai/incidents/${incidentId}/summary`);
  return data;
}

/** @backend GET /api/ai/incidents/:id/root-cause  → { causes: [...] } */
export async function getAIRootCause(incidentId) {
  const { data } = await http.get(`/ai/incidents/${incidentId}/root-cause`);
  return data;
}

/* ────────── Public Status ──────────
 * Unauthenticated endpoint serving the public-facing status page (services
 * health + active incidents + uptime history).
 */

/** @backend GET /api/status  → { services, activeIncidents, ... } */
export async function getPublicStatus() {
  const { data } = await http.get('/status');
  return data;
}

/** @backend GET /api/status/history  → uptime history rows */
export async function getStatusHistory() {
  const { data } = await http.get('/status/history');
  return data;
}

/* ────────── Postmortems (still mock — no Postmortem model yet) ────────── */

export async function getIncidentPostmortem(incidentId) {
  const local = useIncidentsStore
    .getState()
    .incidents.find((i) => i.id === incidentId);
  if (!local?.postmortem) return null;
  return getPostmortem(local.postmortem);
}

/* ────────── Auth ────────── */

/**
 * @backend  POST /api/auth/login   { email, password }
 * Sets httpOnly cookies (accessToken + refreshToken). Returns the user.
 * Side-effect: writes user into authStore so the rest of the app can read it.
 */
export async function login({ email, password }) {
  if (isDemoMode()) {
    useAuthStore.getState().setUser(DEMO_USER);
    return DEMO_USER;
  }
  const { data } = await http.post('/auth/login', { email, password });
  const user = toUser(data.user);
  useAuthStore.getState().setUser(user);
  return user;
}

/**
 * @backend  POST /api/auth/register   { name, email, password }
 * 201 → cookies set + user returned. 409 if email taken.
 */
export async function register({ name, email, password }) {
  if (isDemoMode()) {
    const user = {
      ...DEMO_USER,
      name: name || DEMO_USER.name,
      email: email || DEMO_USER.email,
    };
    useAuthStore.getState().setUser(user);
    return user;
  }
  const { data } = await http.post('/auth/register', { name, email, password });
  const user = toUser(data.user);
  useAuthStore.getState().setUser(user);
  return user;
}

/**
 * @backend  POST /api/auth/logout
 * Clears cookies + DB refresh token. Frontend also clears the local store.
 */
export async function logout() {
  if (isDemoMode()) {
    disableDemoMode();
    useAuthStore.getState().clear();
    return;
  }
  try {
    await http.post('/auth/logout');
  } catch {
    // Even if the network call fails, clear local state so the user isn't stuck.
  }
  useAuthStore.getState().clear();
}

/**
 * @backend  POST /api/auth/refresh-token  (refresh cookie required)
 * Used by the response interceptor; rarely called directly.
 */
export async function refreshToken() {
  if (isDemoMode()) return { ok: true };
  await http.post('/auth/refresh-token');
  return { ok: true };
}

/**
 * @backend  GET /api/auth/me   (NOT BUILT YET — pending backend ticket)
 *
 * For now we attempt /me anyway; if the route 404s we fall back to whatever's
 * in localStorage. Once backend ships the endpoint this becomes the source of
 * truth on every page load.
 */
export async function me() {
  if (isDemoMode()) {
    useAuthStore.getState().setUser(DEMO_USER);
    return DEMO_USER;
  }
  try {
    const { data } = await http.get('/auth/me');
    const user = toUser(data.user || data);
    useAuthStore.getState().setUser(user);
    return user;
  } catch {
    // If session is invalid or endpoint fails, clear local state
    useAuthStore.getState().setUser(null);
    return null;
  }
}

/**
 * URL the "Continue with Google" button should redirect to. Backend handles
 * the OAuth dance and bounces back to FRONTEND_URL with cookies set.
 */
export function googleAuthUrl() {
  return `${API_BASE_URL}/auth/google`;
}

/**
 * @backend  POST /api/auth/resend-verification  { email }
 * Sends a fresh verification email. Has a 60s server-side cooldown.
 */
export async function resendVerification(email) {
  if (isDemoMode()) {
    return { message: 'Demo session — no email sent.' };
  }
  const { data } = await http.post('/auth/resend-verification', { email });
  return data;
}

/**
 * @backend  POST /api/auth/verify-email  { token }
 * Marks the user's email verified. Returns 400 on expired/invalid tokens.
 * Used by the /verify-email page that the email link points to.
 */
export async function verifyEmail(token) {
  if (isDemoMode()) {
    return { message: 'Demo session — already verified.' };
  }
  const { data } = await http.post('/auth/verify-email', { token });
  // If the user is currently signed in, refresh their record so isVerified
  // flips in authStore without needing a manual reload.
  try {
    await me();
  } catch {
    // Anonymous click (most common case — user clicks email on a different
    // device or while logged out). That's fine; the next login picks up the
    // verified state from the backend.
  }
  return data;
}

export const auth = {
  login,
  register,
  logout,
  refreshToken,
  me,
  googleAuthUrl,
};

/* ────────── Status Page Settings ────────── */

export async function getStatusPageSettings() {
  const { data } = await http.get('/workspace/status-page');
  return data;
}

export async function updateStatusPageSettings(settings) {
  const { data } = await http.patch('/workspace/status-page', settings);
  return data;
}

/* ────────── AI ────────── */

export async function suggestCauses(incidentData) {
  const { data } = await http.post('/ai/suggest-causes', incidentData);
  return data;
}

/* ────────── Notifications ────────── */

export async function getNotifications(page = 1, limit = 20) {
  const { data } = await http.get('/notifications', {
    params: { page, limit },
  });
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await http.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await http.patch('/notifications/read-all');
  return data;
}

/** Returns the full SSE URL (not an axios call — used with EventSource). */
export function getNotificationStreamUrl() {
  return '/api/notifications/stream';
}
