import { Router } from 'express';
import { Redis } from 'ioredis';
import { NatsConnection } from 'nats';
import { Logger } from 'pino';
import { Pool } from 'pg';
import { StorageService } from '../services/storage.js';
import { TranscoderService } from '../services/transcoder.js';
import { TranscriptionService } from '../services/transcription.js';
import { GradingService } from '../services/grading.js';
import type { Video } from '../models/video.js';

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

  // Subscribe to processing queues
  (async () => {
    const sub = deps.redis.duplicate();
    await sub.subscribe('transcode');
    await sub.subscribe('transcribe');
    await sub.subscribe('grade');
    
    sub.on('message', async (channel: string, msg: string) => {
      if (channel === 'transcode') {
        const { videoId, key } = JSON.parse(msg);
        await transcoder.transcode(videoId, key);
      } else if (channel === 'transcribe') {
        const { videoId, audioKey } = JSON.parse(msg);
        await transcriber.transcribe(videoId, audioKey);
      } else if (channel === 'grade') {
        const { videoId, text } = JSON.parse(msg);
        await grader.grade(videoId, text);
      }
    });
  })();

  // Get video metadata
  router.get('/:id', async (req, res) => {
    try {
      const { rows } = await deps.pool.query('SELECT * FROM videos WHERE id=$1', [req.params.id]);
      if (!rows[0]) return res.status(404).json({ error: 'not found' });
      res.json(rows[0] as Video);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      deps.log.error({ error: errorMessage }, 'Failed to get video');
      res.status(500).json({ error: 'Failed to get video' });
    }
  });

  // Trigger transcoding
  router.post('/:id/transcode', async (req, res) => {
    try {
      const key = await deps.redis.get(`tus:${req.params.id}`);
      if (!key) return res.status(400).json({ error: 'upload not ready' });
      await deps.redis.publish('transcode', JSON.stringify({ videoId: req.params.id, key }));
      res.json({ status: 'transcoding started' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      deps.log.error({ error: errorMessage }, 'Failed to start transcode');
      res.status(500).json({ error: 'Failed to start transcode' });
    }
  });

  // Get signed upload URL
  router.get('/:id/upload-url', async (req, res) => {
    try {
      const url = await storage.signedUrl(
        process.env.MINIO_BUCKET_VIDEOS!,
        `raw/${req.params.id}.mp4`,
        3600
      );
      res.json({ upload_url: url });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      deps.log.error({ error: errorMessage }, 'Failed to get upload URL');
      res.status(500).json({ error: 'Failed to get upload URL' });
    }
  });

  return router;
}
