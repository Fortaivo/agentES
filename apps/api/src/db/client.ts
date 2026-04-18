import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/agentes';

export const pool = new Pool({
  connectionString
});

export const db = drizzle(pool, { schema });

export async function pingDatabase(): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('select 1');
    return true;
  } finally {
    client.release();
  }
}
