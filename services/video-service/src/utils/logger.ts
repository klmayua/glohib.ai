import { Logger } from 'pino';

export const logger = {
  info: (msg: string | object, meta?: any) => {
    if (typeof msg === 'string') {
      console.log(`[INFO] ${msg}`, meta || '');
    } else {
      console.log('[INFO]', msg);
    }
  },
  error: (msg: string | object, meta?: any) => {
    if (typeof msg === 'string') {
      console.error(`[ERROR] ${msg}`, meta || '');
    } else {
      console.error('[ERROR]', msg);
    }
  },
  warn: (msg: string | object, meta?: any) => {
    if (typeof msg === 'string') {
      console.warn(`[WARN] ${msg}`, meta || '');
    } else {
      console.warn('[WARN]', msg);
    }
  },
  debug: (msg: string | object, meta?: any) => {
    if (typeof msg === 'string') {
      console.debug(`[DEBUG] ${msg}`, meta || '');
    } else {
      console.debug('[DEBUG]', msg);
    }
  },
};
