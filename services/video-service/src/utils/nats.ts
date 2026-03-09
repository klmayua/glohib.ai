import { connect, NatsConnection, Options } from 'nats';
import { logger } from '../utils/logger.js';

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';

let nc: NatsConnection | null = null;

export async function connectNats(): Promise<NatsConnection> {
  if (nc) return nc;

  try {
    const opts: Partial<Options> = {
      servers: NATS_URL,
      reconnect: true,
      maxReconnectAttempts: 5,
    };

    nc = await connect(opts);
    logger.info({ url: NATS_URL }, 'Connected to NATS');

    nc.closed().then((err) => {
      if (err) {
        logger.error({ error: err }, 'NATS connection closed with error');
      }
      nc = null;
    });

    return nc;
  } catch (error) {
    logger.warn({ error }, 'NATS not available, continuing without event bus');
    // Return a mock connection for development
    return {
      close: async () => {},
      publish: () => {},
      subscribe: () => ({
        unsubscribe: () => {},
        drain: async () => {},
      }),
    } as any;
  }
}

export function getNatsConnection(): NatsConnection | null {
  return nc;
}
