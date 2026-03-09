# GLOHIB.AI - STEP 10: VIDEO SERVICE (NODE.JS)
**Generated:** 2026-02-28 13:42:56

---

```yaml
# ================================================================================
# GLOHIB.AI - STEP 10: VIDEO SERVICE (Node.js) – ATOMIC YAML SPECIFICATION
# ================================================================================

step_metadata:
  id: glohib-step-10-video-service
  name: "Video Service – Node.js Microservice"
  phase: 10
  priority: 1
  estimate: "6 h"

context: |
  Stand-alone Node.js 20 microservice exposing REST/WS APIs for
  resumable video upload (TUS), FFmpeg transcoding, WebRTC signaling,
  Whisper transcription, AI grading, MinIO/S3 storage and progress tracking.
  Integrates with existing Glohib.ai backend via NATS and PostgreSQL.

tasks:

# -----------------------------------------------------------------------------
# 0. Project scaffold
# -----------------------------------------------------------------------------
- id: create-project-dir
  action: shell_command
  cmd: mkdir -p video-service/{src/{routes,services,models,middleware,utils},tests,scripts,.github}

# -----------------------------------------------------------------------------
# 1. package.json
# -----------------------------------------------------------------------------
- id: create-package-json
  action: create_file
  path: video-service/package.json
  content: |
    {
      "name": "@glohib/video-service",
      "version": "1.0.0",
      "description": "Glohib.ai Video Processing & WebRTC Signaling Service",
      "type": "module",
      "engines": { "node": ">=20" },
      "scripts": {
        "build": "tsc",
        "dev": "tsx watch src/index.ts",
        "start": "node dist/index.js",
        "test": "NODE_OPTIONS='--loader=tsx/esm' vitest",
        "lint": "eslint src --ext .ts",
        "typecheck": "tsc --noEmit"
      },
      "dependencies": {
        "@minio/minio": "^7.1.3",
        "@tus/server": "^1.4.0",
        "@tus/file-store": "^1.0.0",
        "express": "^4.19.2",
        "socket.io": "^4.7.5",
        "fluent-ffmpeg": "^2.1.2",
        "openai": "^4.47.1",
        "pg": "^8.11.5",
        "drizzle-orm": "^0.30.10",
        "dotenv": "^16.4.5",
        "zod": "^3.23.8",
        "pino": "^9.1.0",
        "pino-pretty": "^11.1.0",
        "nats": "^2.26.0",
        "ioredis": "^5.4.1"
      },
      "devDependencies": {
        "@types/express": "^4.17.21",
        "@types/fluent-ffmpeg": "^2.1.24",
        "@types/node": "^20.12.12",
        "@types/pg": "^8.11.6",
        "typescript": "^5.4.5",
        "tsx": "^4.10.2",
        "vitest": "^1.6.0",
        "eslint": "^8.57.0"
      }
    }

# -----------------------------------------------------------------------------
# 2. TypeScript config
# -----------------------------------------------------------------------------
- id: create-ts-config
  action: create_file
  path: video-service/tsconfig.json
  content: |
    {
      "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "dist",
        "rootDir": "src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist", "tests"]
    }

# -----------------------------------------------------------------------------
# 3. Environment template
# -----------------------------------------------------------------------------
- id: create-env-template
  action: create_file
  path: video-service/.env.example
  content: |
    NODE_ENV=development
    PORT=4000
    LOG_LEVEL=info

    DATABASE_URL=postgres://user:pass@postgres:5432/glohib
    REDIS_URL=redis://redis:6379
    NATS_URL=nats://nats:4222

    MINIO_ENDPOINT=minio:9000
    MINIO_ACCESS_KEY=minioadmin
    MINIO_SECRET_KEY=minioadmin
    MINIO_BUCKET_VIDEOS=videos
    MINIO_BUCKET_TRANSCRIPTS=transcripts
    MINIO_USE_SSL=false

    OPENAI_API_KEY=
    TUS_UPLOAD_DIR=/tmp/tus

    WEBRTC_STUN=stun:stun.l.google.com:19302
    WEBRTC_TURN=

# -----------------------------------------------------------------------------
# 4. Entry point
# -----------------------------------------------------------------------------
- id: create-index
  action: create_file
  path: video-service/src/index.ts
  content: |
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

      // infra clients
      const pool = createDbPool();
      const minio = createMinioClient();
      const redis = createRedisClient();
      const nc = await connectNats();

      // middleware
      app.use(express.json({ limit: '10mb' }));

      // TUS
      const tusServer = await initTus({ minio, redis, log });
      app.all('/uploads/*', tusServer.handle.bind(tusServer));

      // routes
      app.use('/api/v1/video', videoRoutes({ pool, minio, redis, nc, log }));
      app.use('/api/v1/webrtc', webrtcRoutes({ pool, io, log }));

      // websocket
      registerWebrtcHandlers(io, { pool, log });

      // health
      app.get('/health', (_, res) => res.json({ status: 'ok' }));

      const port = Number(process.env.PORT || 4000);
      server.listen(port, () => log.info(`Video service listening on :${port}`));
    }

    bootstrap().catch((e) => {
      console.error(e);
      process.exit(1);
    });

# -----------------------------------------------------------------------------
# 5. Models
# -----------------------------------------------------------------------------
- id: create-video-model
  action: create_file
  path: video-service/src/models/video.ts
  content: |
    import { z } from 'zod';

    export const VideoStatus = z.enum([
      'uploading',
      'uploaded',
      'transcoding',
      'transcoded',
      'transcribing',
      'transcribed',
      'grading',
      'graded',
      'failed'
    ]);
    export type VideoStatus = z.infer<typeof VideoStatus>;

    export const Video = z.object({
      id: z.string().uuid(),
      applicantId: z.string().uuid(),
      jobId: z.string().uuid(),
      originalName: z.string(),
      mimeType: z.string(),
      size: z.number().int().positive(),
      status: VideoStatus,
      metadata: z.record(z.unknown()).optional(),
      transcriptText: z.string().optional(),
      transcriptVtt: z.string().optional(),
      gradeClarity: z.number().min(0).max(100).optional(),
      gradeContent: z.number().min(0).max(100).optional(),
      gradePresence: z.number().min(0).max(100).optional(),
      createdAt: z.date(),
      updatedAt: z.date()
    });
    export type Video = z.infer<typeof Video>;

    export const Progress = z.object({
      videoId: z.string().uuid(),
      stage: z.string(),
      percent: z.number().min(0).max(100),
      message: z.string().optional()
    });
    export type Progress = z.infer<typeof Progress>;

# -----------------------------------------------------------------------------
# 6. Utils
# -----------------------------------------------------------------------------
- id: create-db-util
  action: create_file
  path: video-service/src/utils/db.ts
  content: |
    import pg from 'pg';
    const { Pool } = pg;
    export const createDbPool = () =>
      new Pool({ connectionString: process.env.DATABASE_URL });

- id: create-redis-util
  action: create_file
  path: video-service/src/utils/redis.ts
  content: |
    import Redis from 'ioredis';
    export const createRedisClient = () => new Redis(process.env.REDIS_URL!);

- id: create-nats-util
  action: create_file
  path: video-service/src/utils/nats.ts
  content: |
    import { connect, NatsConnection } from 'nats';
    export const connectNats = (): Promise<NatsConnection> =>
      connect({ servers: process.env.NATS_URL });

- id: create-logger-util
  action: create_file
  path: video-service/src/utils/logger.ts
  content: |
    import pino from 'pino';
    export const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

# -----------------------------------------------------------------------------
# 7. Storage service (MinIO/S3)
# -----------------------------------------------------------------------------
- id: create-storage-service
  action: create_file
  path: video-service/src/services/storage.ts
  content: |
    import * as minio from '@minio/minio';
    import { Readable } from 'node:stream';
    import { logger } from '../utils/logger.js';

    export const createMinioClient = () =>
      new minio.Client({
        endPoint: process.env.MINIO_ENDPOINT!.split(':')[0],
        port: Number(process.env.MINIO_ENDPOINT!.split(':')[1]),
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY!,
        secretKey: process.env.MINIO_SECRET_KEY!
      });

    export class StorageService {
      constructor(private minio: minio.Client) {}

      async ensureBucket(name: string) {
        const exists = await this.minio.bucketExists(name);
        if (!exists) await this.minio.makeBucket(name);
      }

      async put(bucket: string, key: string, stream: Readable, size: number, meta?: any) {
        await this.minio.putObject(bucket, key, stream, size, meta);
        logger.info({ bucket, key }, 'stored object');
      }

      async get(bucket: string, key: string) {
        return await this.minio.getObject(bucket, key);
      }

      async signedUrl(bucket: string, key: string, expiry = 3600) {
        return await this.minio.presignedGetObject(bucket, key, expiry);
      }

      async delete(bucket: string, key: string) {
        await this.minio.removeObject(bucket, key);
      }
    }

# -----------------------------------------------------------------------------
# 8. TUS service
# -----------------------------------------------------------------------------
- id: create-tus-service
  action: create_file
  path: video-service/src/services/tus.ts
  content: |
    import { Server as TusServer } from '@tus/server';
    import { FileStore } from '@tus/file-store';
    import { StorageService } from './storage.js';
    import { Redis } from 'ioredis';
    import { Logger } from 'pino';
    import path from 'node:path';
    import fs from 'node:fs';
    import { pipeline } from 'node:stream/promises';

    export async function initTus(deps: {
      minio: any;
      redis: Redis;
      log: Logger;
    }): Promise<TusServer> {
      const store = new FileStore({ directory: process.env.TUS_UPLOAD_DIR! });
      const storage = new StorageService(deps.minio);
      await storage.ensureBucket(process.env.MINIO_BUCKET_VIDEOS!);

      const server = new TusServer({
        store,
        path: '/uploads',
        async onUploadFinish(req, upload, uploadMetadata) {
          const filePath = path.join(store.directory, upload.id);
          const stream = fs.createReadStream(filePath);
          const key = `raw/${upload.id}.${uploadMetadata.filename?.split('.').pop()}`;
          await storage.put(
            process.env.MINIO_BUCKET_VIDEOS!,
            key,
            stream,
            upload.size as number,
            { applicantId: uploadMetadata.applicantId, jobId: uploadMetadata.jobId }
          );
          await deps.redis.setex(`tus:${upload.id}`, 3600, key);
          deps.log.info({ uploadId: upload.id, key }, 'TUS upload finished');
          // trigger transcoding
          await deps.redis.publish('transcode', JSON.stringify({ videoId: upload.id, key }));
          fs.unlinkSync(filePath); // cleanup
        }
      });
      return server;
    }

# -----------------------------------------------------------------------------
# 9. Transcoder service (FFmpeg)
# -----------------------------------------------------------------------------
- id: create-transcoder-service
  action: create_file
  path: video-service/src/services/transcoder.ts
  content: |
    import ffmpeg from 'fluent-ffmpeg';
    import { StorageService } from './storage.js';
    import { Redis } from 'ioredis';
    import { Logger } from 'pino';
    import { PassThrough } from 'node:stream';

    export class TranscoderService {
      constructor(
        private storage: StorageService,
        private redis: Redis,
        private log: Logger
      ) {}

      async transcode(videoId: string, inputKey: string) {
        const progressKey = `progress:${videoId}`;
        await this.redis.set(progressKey, JSON.stringify({ stage: 'transcoding', percent: 0 }));

        const inputStream = await this.storage.get(process.env.MINIO_BUCKET_VIDEOS!, inputKey);
        const output720 = new PassThrough();
        const outputAudio = new PassThrough();

        const outKey720 = `transcoded/${videoId}/720p.mp4`;
        const outKeyAudio = `transcoded/${videoId}/audio.wav`;

        ffmpeg(inputStream)
          .output(output720)
          .videoCodec('libx264')
          .size('?x720')
          .audioCodec('aac')
          .format('mp4')
          .output(outputAudio)
          .audioCodec('pcm_s16le')
          .audioFrequency(16000)
          .format('wav')
          .noVideo()
          .on('progress', (p) =>
            this.redis.set(progressKey, JSON.stringify({ stage: 'transcoding', percent: p.percent }))
          )
          .on('error', (e) => {
            this.log.error({ videoId, error: e.message }, 'transcode failed');
            this.redis.set(progressKey, JSON.stringify({ stage: 'failed', percent: 0 }));
          })
          .on('end', async () => {
            await this.storage.put(process.env.MINIO_BUCKET_VIDEOS!, outKey720, output720, 0);
            await this.storage.put(process.env.MINIO_BUCKET_VIDEOS!, outKeyAudio, outputAudio, 0);
            await this.redis.publish('transcribe', JSON.stringify({ videoId, audioKey: outKeyAudio }));
            await this.redis.set(progressKey, JSON.stringify({ stage: 'transcoded', percent: 100 }));
            this.log.info({ videoId }, 'transcoding complete');
          })
          .run();
      }
    }

# -----------------------------------------------------------------------------
# 10. Transcription service (Whisper via OpenAI)
# -----------------------------------------------------------------------------
- id: create-transcription-service
  action: create_file
  path: video-service/src/services/transcription.ts
  content: |
    import OpenAI from 'openai';
    import { StorageService } from './storage.js';
    import { Redis } from 'ioredis';
    import { Logger } from 'pino';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    export class TranscriptionService {
      constructor(
        private storage: StorageService,
        private redis: Redis,
        private log: Logger
      ) {}

      async transcribe(videoId: string, audioKey: string) {
        const progressKey = `progress:${videoId}`;
        await this.redis.set(progressKey, JSON.stringify({ stage: 'transcribing', percent: 0 }));

        const stream = await this.storage.get(process.env.MINIO_BUCKET_VIDEOS!, audioKey);
        const resp = await openai.audio.transcriptions.create({
          file: stream,
          model: 'whisper-1',
          response_format: 'verbose_json'
        });

        const text = resp.text;
        const vtt = this.toVtt(resp.segments);
        await this.storage.put(
          process.env.MINIO_BUCKET_TRANSCRIPTS!,
          `${videoId}/transcript.txt`,
          Buffer.from(text),
          text.length
        );
        await this.storage.put(
          process.env.MINIO_BUCKET_TRANSCRIPTS!,
          `${videoId}/subtitles.vtt`,
          Buffer.from(vtt),
          vtt.length
        );

        await this.redis.publish('grade', JSON.stringify({ videoId, text }));
        await this.redis.set(progressKey, JSON.stringify({ stage: 'transcribed', percent: 100 }));
        this.log.info({ videoId }, 'transcription complete');
      }

      private toVtt(segments: any[]) {
        let vtt = 'WEBVTT\n\n';
        for (const s of segments) {
          vtt += `${this.fmtTime(s.start)} --> ${this.fmtTime(s.end)}\n${s.text}\n\n`;
        }
        return vtt;
      }
      private fmtTime(t: number) {
        const date = new Date(0);
        date.setSeconds(t);
        return date.toISOString().substr(11, 12);
      }
    }

# -----------------------------------------------------------------------------
# 11. AI Grading service (OpenAI completion)
# -----------------------------------------------------------------------------
- id: create-grading-service
  action: create_file
  path: video-service/src/services/grading.ts
  content: |
    import OpenAI from 'openai';
    import { Redis } from 'ioredis';
    import { Logger } from 'pino';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    export class GradingService {
      constructor(private redis: Redis, private log: Logger) {}

      async grade(videoId: string, transcript: string) {
        const prompt = `
    You are an AI interviewer. Rate the following applicant answer on three dimensions (0-100):
    1. Speech Clarity – pronunciation, pace, filler words.
    2. Content Quality – relevance, depth, structure.
    3. Presence – confidence, enthusiasm, engagement.

    Provide ONLY a JSON object like {"clarity":number,"content":number,"presence":number}

    Transcript:
    ${transcript}
    `;
        const resp = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: prompt }],
          temperature: 0
        });
        const raw = resp.choices[0].message.content!;
        const scores = JSON.parse(raw);
        await this.redis.publish('graded', JSON.stringify({ videoId, ...scores }));
        await this.redis.set(`progress:${videoId}`, JSON.stringify({ stage: 'graded', percent: 100 }));
        this.log.info({ videoId, scores }, 'grading complete');
      }
    }

# -----------------------------------------------------------------------------
# 12. WebRTC signaling service
# -----------------------------------------------------------------------------
- id: create-webrtc-service
  action: create_file
  path: video-service/src/services/webrtc.ts
  content: |
    import { Server as SocketServer } from 'socket.io';
    import { Logger } from 'pino';

    export function registerWebrtcHandlers(
      io: SocketServer,
      deps: { pool: any; log: Logger }
    ) {
      io.on('connection', (socket) => {
        deps.log.info({ sid: socket.id }, 'socket connected');

        socket.on('join-room', (room: string) => {
          socket.join(room);
          socket.to(room).emit('user-joined', socket.id);
        });

        socket.on('offer', (data: { to: string; offer: any }) => {
          socket.to(data.to).emit('offer', { from: socket.id, offer: data.offer });
        });

        socket.on('answer', (data: { to: string; answer: any }) => {
          socket.to(data.to).emit('answer', { from: socket.id, answer: data.answer });
        });

        socket.on('ice-candidate', (data: { to: string; candidate: any }) => {
          socket.to(data.to).emit('ice-candidate', { from: socket.id, candidate: data.candidate });
        });

        socket.on('disconnect', () => {
          deps.log.info({ sid: socket.id }, 'socket disconnected');
        });
      });
    }

# -----------------------------------------------------------------------------
# 13. Routes – video
# -----------------------------------------------------------------------------
- id: create-video-routes
  action: create_file
  path: video-service/src/routes/video.ts
  content: |
    import { Router } from 'express';
    import { Redis } from 'ioredis';
    import { NatsConnection } from 'nats';
    import { Logger } from 'pino';
    import { Pool } from 'pg';
    import { StorageService } from '../services/storage.js';
    import { TranscoderService } from '../services/transcoder.js';
    import { TranscriptionService } from '../services/transcription.js';
    import { GradingService } from '../services/grading.js';
    import { Video } from '../models/video.js';
    import { z } from 'zod';

    export default function create(deps: {
      pool: Pool;
      minio: any;
      redis: Redis;
      nc: NatsConnection;
      log: Logger;
    }) {
      const router = Router();
      const storage = new StorageService(deps.minio);
      const transcoder = new TranscoderService(storage, deps.redis, deps.log);
      const transcriber = new TranscriptionService(storage, deps.redis, deps.log);
      const grader = new GradingService(deps.redis, deps.log);

      // consume redis pub/sub
      (async () => {
        const sub = deps.redis.duplicate();
        await sub.subscribe('transcode', async (msg) => {
          const { videoId, key } = JSON.parse(msg);
          await transcoder.transcode(videoId, key);
        });
        await sub.subscribe('transcribe', async (msg) => {
          const { videoId, audioKey } = JSON.parse(msg);
          await transcriber.transcribe(videoId, audioKey);
        });
        await sub.subscribe('grade', async (msg) => {
          const { videoId, text } = JSON.parse(msg);
          await grader.grade(videoId, text);
        });
      })();

      router.get('/:id', async (req, res) => {
        const { rows } = await deps.pool.query('SELECT * FROM videos WHERE id=$1', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ error: 'not found' });
        res.json(Video.parse(rows[0]));
      });

      router.post('/:id/transcode', async (req, res) => {
        const key = await deps.redis.get(`tus:${req.params.id}`);
        if (!key) return res.status(400).json({ error: 'upload not ready' });
        await deps.redis.publish('transcode', JSON.stringify({ videoId: req.params.id, key }));
        res.json({ status: 'transcoding triggered' });
      });

      router.post('/:id/transcribe', async (req, res) => {
        await deps.redis.publish('transcribe', JSON.stringify({ videoId: req.params.id, audioKey: `transcoded/${req.params.id}/audio.wav` }));
        res.json({ status: 'transcription triggered' });
      });

      router.post('/:id/grade', async (req, res) => {
        const row = await deps.pool.query('SELECT transcript_text FROM videos WHERE id=$1', [req.params.id]);
        if (!row.rows[0]?.transcript_text) return res.status(400).json({ error: 'no transcript' });
        await deps.redis.publish('grade', JSON.stringify({ videoId: req.params.id, text: row.rows[0].transcript_text }));
        res.json({ status: 'grading triggered' });
      });

      router.get('/:id/progress', async (req, res) => {
        const raw = await deps.redis.get(`progress:${req.params.id}`);
        res.json(raw ? JSON.parse(raw) : { stage: 'unknown', percent: 0 });
      });

      router.delete('/:id', async (req, res) => {
        await deps.pool.query('DELETE FROM videos WHERE id=$1', [req.params.id]);
        // TODO: delete from minio
        res.status(204).send();
      });

      return router;
    }

# -----------------------------------------------------------------------------
# 14. Routes – webrtc
# -----------------------------------------------------------------------------
- id: create-webrtc-routes
  action: create_file
  path: video-service/src/routes/webrtc.ts
  content: |
    import { Router } from 'express';
    import { Server as SocketServer } from 'socket.io';
    import { Logger } from 'pino';

    export default function create(deps: { pool: any; io: SocketServer; log: Logger }) {
      const router = Router();

      router.post('/signal', (req, res) => {
        // Placeholder for any HTTP-driven signaling if needed
        res.json({ status: 'ok' });
      });

      return router;
    }

# -----------------------------------------------------------------------------
# 15. Database migration (SQL)
# -----------------------------------------------------------------------------
- id: create-sql-migration
  action: create_file
  path: video-service/scripts/01-videos.sql
  content: |
    CREATE TABLE IF NOT EXISTS videos (
      id UUID PRIMARY KEY,
      applicant_id UUID NOT NULL,
      job_id UUID NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size BIGINT NOT NULL,
      status TEXT NOT NULL,
      metadata JSONB,
      transcript_text TEXT,
      transcript_vtt TEXT,
      grade_clarity SMALLINT,
      grade_content SMALLINT,
      grade_presence SMALLINT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX idx_videos_applicant ON videos(applicant_id);
    CREATE INDEX idx_videos_job ON videos(job_id);

# -----------------------------------------------------------------------------
# 16. Docker support
# -----------------------------------------------------------------------------
- id: create-dockerfile
  action: create_file
  path: video-service/Dockerfile
  content: |
    FROM node:20-alpine
    RUN apk add --no-cache ffmpeg python3 make g++
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm ci --omit=dev
    COPY dist ./dist
    CMD ["node", "dist/index.js"]

# -----------------------------------------------------------------------------
# 17. README
# -----------------------------------------------------------------------------
- id: create-readme
  action: create_file
  path: video-service/README.md
  content: |
    # Glohib.ai Video Service
    - TUS resumable uploads
    - FFmpeg transcoding (720p + audio)
    - Whisper transcription
    - AI grading (clarity, content, presence)
    - WebRTC signaling via Socket.IO
    - MinIO/S3 storage
    - Progress tracking via Redis

    ## Quick start
    ```bash
    npm install
    npm run build
    npm start
    ```

deliverables_checklist:
  - video-service/package.json
  - video-service/tsconfig.json
  - video-service/src/index.ts
  - video-service/src/routes/video.ts
  - video-service/src/routes/webrtc.ts
  - video-service/src/services/storage.ts
  - video-service/src/services/tus.ts
  - video-service/src/services/transcoder.ts
  - video-service/src/services/transcription.ts
  - video-service/src/services/grading.ts
  - video-service/src/services/webrtc.ts
  - video-service/src/models/video.ts
  - video-service/src/utils/db.ts
  - video-service/src/utils/redis.ts
  - video-service/src/utils/nats.ts
  - video-service/src/utils/logger.ts
  - video-service/scripts/01-videos.sql
  - video-service/Dockerfile
  - video-service/.env.example
  - video-service/README.md

verification_checklist:
  - "npm install succeeds"
  - "npm run build succeeds"
  - "docker build -t glohib/video-service . succeeds"
  - "service boots and answers GET /health"
  - "TUS upload endpoint accepts PATCH chunks"
  - "FFmpeg transcodes to 720p and extracts audio"
  - "Whisper transcription stored in MinIO"
  - "AI grading returns three numeric scores"
  - "WebRTC signaling routes offer/answer/ice"

execution_commands:
  - cd video-service && npm install
  - npm run build
  - docker build -t glohib/video-service .
  - # (run via docker-compose or local node with env vars)

next_step: glohib-step-11-analytics-service
```

---

**Token Usage:** {'prompt_tokens': 689, 'completion_tokens': 6417, 'total_tokens': 7106}
