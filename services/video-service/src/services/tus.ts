import { Server as TusServer } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { StorageService } from './storage.js';
import { Redis } from 'ioredis';
import { Logger } from 'pino';
import path from 'node:path';
import fs from 'node:fs';

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
      await deps.redis.publish('transcode', JSON.stringify({ videoId: upload.id, key }));
      fs.unlinkSync(filePath);
    }
  });
  return server;
}
