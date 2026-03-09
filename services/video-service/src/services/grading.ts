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
