import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import pino from 'pino';
import { createDbPool } from './utils/db.js';
import { createMinioClient } from './services/storage.js';
import { createRedisClient } from './utils/redis.js';
import { connectNats } from './utils/nats.js';
import { initTus } from './services/tus.js';
import videoRoutes from './routes/video.js';
import webrtcRoutes from './routes/webrtc.js';
import { registerWebrtcHandlers } from './services/webrtc.js';

const log = pino({ level: process.env.LOG_LEVEL || 'info' });

async function bootstrap() {
  const app = express();
  const server = createServer(app);
  const io = new SocketServer(server, { cors: { origin: '*' } });

  const pool = createDbPool();
  const minio = createMinioClient();
  const redis = createRedisClient();
  const nc = await connectNats();

  app.use(express.json({ limit: '10mb' }));

  const tusServer = await initTus({ minio, redis, log });
  app.all('/uploads/*', tusServer.handle.bind(tusServer));

  app.use('/api/v1/video', videoRoutes({ pool, minio, redis, nc, log }));
  app.use('/api/v1/webrtc', webrtcRoutes({ pool, io, log }));

  registerWebrtcHandlers(io, { pool, log });

  app.get('/health', (_, res) => res.json({ status: 'ok' }));

  const port = Number(process.env.PORT || 4000);
  server.listen(port, () => log.info(`Video service listening on :${port}`));
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
