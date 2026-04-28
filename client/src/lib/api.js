/**
 * API abstraction layer.
 *
 * Today: backed by Zustand + localStorage (no real backend yet).
 * Tomorrow: when the backend team has endpoints ready, swap each function's
 * body to use `fetch()` — every component already calls through this module,
 * so the rest of the codebase doesn't change.
 *
 * Naming convention: <verb><Resource>(<args>) → returns a Promise.
 * All functions return Promises (even if synchronous today) so the swap is seamless.
 */

import { useIncidentsStore } from '@/store/incidentsStore';
import { USERS, getUserById } from '@/data/users';
import { SERVICES, getServiceById } from '@/data/services';
import { getPostmortem } from '@/data/postmortems';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ────────── Incidents ────────── */

export async function listIncidents({ filter = 'all' } = {}) {
  const all = useIncidentsStore.getState().incidents;
  if (filter === 'active') return all.filter((i) => i.status !== 'resolved');
  if (filter === 'resolved') return all.filter((i) => i.status === 'resolved');
  return all;
}

export async function getIncident(id) {
  return useIncidentsStore.getState().incidents.find((i) => i.id === id) || null;
}

export async function createIncident(payload) {
  await delay(280);
  return useIncidentsStore.getState().createIncident(payload);
}

export async function postUpdate(incidentId, update) {
  await delay(220);
  return useIncidentsStore.getState().postUpdate(incidentId, update);
}

export async function changeStatus(incidentId, status) {
  await delay(160);
  return useIncidentsStore.getState().changeStatus(incidentId, status);
}

export async function updateIncident(incidentId, patch) {
  await delay(160);
  return useIncidentsStore.getState().updateIncident(incidentId, patch);
}

/* ────────── Users / Team ────────── */

export async function listUsers() {
  return USERS;
}

export async function getUser(id) {
  return getUserById(id) || null;
}

/* ────────── Services ────────── */

export async function listServices() {
  return SERVICES;
}

export async function getService(id) {
  return getServiceById(id) || null;
}

/* ────────── Postmortems ────────── */

export async function getIncidentPostmortem(incidentId) {
  const incident = await getIncident(incidentId);
  if (!incident?.postmortem) return null;
  return getPostmortem(incident.postmortem);
}
