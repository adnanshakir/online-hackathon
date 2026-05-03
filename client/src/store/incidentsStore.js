import { create } from 'zustand';
import { readStorage, writeStorage } from '@/lib/storage';
import { seedIncidents } from '@/data/incidents';

const STORAGE_KEY = 'opswatch.incidents.v1';

function loadInitial() {
  const stored = readStorage(STORAGE_KEY, null);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  const seeded = seedIncidents();
  writeStorage(STORAGE_KEY, seeded);
  return seeded;
}

function persist(incidents) {
  writeStorage(STORAGE_KEY, incidents);
}

const newId = (prefix = 'inc') =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export const useIncidentsStore = create((set) => ({
  incidents: loadInitial(),

  createIncident: ({
    title,
    description,
    severity,
    serviceIds = [],
    assigneeIds = [],
    createdById = 'u_demo',
  }) => {
    const incident = {
      id: newId('inc'),
      title: title.trim(),
      description: (description || '').trim(),
      severity,
      status: 'investigating',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      createdById,
      assigneeIds,
      serviceIds,
      affectedUsers: 0,
      updates: [
        {
          id: newId('upd'),
          authorId: createdById,
          message: `Incident declared: ${title.trim()}`,
          statusChange: 'investigating',
          createdAt: new Date().toISOString(),
        },
      ],
      postmortem: null,
    };
    set((state) => {
      const next = [incident, ...state.incidents];
      persist(next);
      return { incidents: next };
    });
    return incident;
  },

  postUpdate: (
    incidentId,
    { authorId = 'u_demo', message, statusChange = null }
  ) => {
    const update = {
      id: newId('upd'),
      authorId,
      message: message.trim(),
      statusChange,
      createdAt: new Date().toISOString(),
    };
    let updated = null;
    set((state) => {
      const incidents = state.incidents.map((i) => {
        if (i.id !== incidentId) return i;
        const status = statusChange || i.status;
        const resolvedAt =
          statusChange === 'resolved' ? new Date().toISOString() : i.resolvedAt;
        updated = { ...i, status, resolvedAt, updates: [...i.updates, update] };
        return updated;
      });
      persist(incidents);
      return { incidents };
    });
    return updated;
  },

  changeStatus: (incidentId, status) => {
    let updated = null;
    set((state) => {
      const incidents = state.incidents.map((i) => {
        if (i.id !== incidentId) return i;
        const resolvedAt =
          status === 'resolved' ? new Date().toISOString() : i.resolvedAt;
        const update = {
          id: newId('upd'),
          authorId: 'u_demo',
          message: `Status changed to ${status}.`,
          statusChange: status,
          createdAt: new Date().toISOString(),
        };
        updated = { ...i, status, resolvedAt, updates: [...i.updates, update] };
        return updated;
      });
      persist(incidents);
      return { incidents };
    });
    return updated;
  },

  updateIncident: (incidentId, patch) => {
    let updated = null;
    set((state) => {
      const incidents = state.incidents.map((i) => {
        if (i.id !== incidentId) return i;
        updated = { ...i, ...patch };
        return updated;
      });
      persist(incidents);
      return { incidents };
    });
    return updated;
  },

  resetSeed: () => {
    const seeded = seedIncidents();
    persist(seeded);
    set({ incidents: seeded });
  },
}));
