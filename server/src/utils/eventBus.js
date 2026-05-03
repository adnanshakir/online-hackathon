import { EventEmitter } from 'events';

/**
 * Global Event Bus for internal communication between modules.
 * Used primarily for real-time notifications via SSE.
 */
class EventBus extends EventEmitter {}

export const eventBus = new EventBus();
