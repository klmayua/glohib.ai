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
