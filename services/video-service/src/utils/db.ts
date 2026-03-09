import { Pool } from 'pg';

const config = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME || 'glohib_db',
  user: process.env.DATABASE_USER || 'glohib',
  password: process.env.DATABASE_PASSWORD || 'changeme',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export function createDbPool(): Pool {
  return new Pool(config);
}
