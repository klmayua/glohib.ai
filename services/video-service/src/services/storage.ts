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
