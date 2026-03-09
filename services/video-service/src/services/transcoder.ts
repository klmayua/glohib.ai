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
