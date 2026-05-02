import pino from 'pino';
import { config } from '../config/config.js';

const isDev = config.NODE_ENV !== 'production';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: { colorize: true },
      }
    : undefined,
});