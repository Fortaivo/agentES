import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      create table if not exists schema_migrations (
        filename text primary key,
        applied_at timestamptz not null default now()
      );
    `);

    const files = (await readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort((left, right) => left.localeCompare(right));

    for (const file of files) {
      const alreadyApplied = await client.query(
        'select 1 from schema_migrations where filename = $1',
        [file]
      );

      if (alreadyApplied.rowCount) {
        continue;
      }

      const sql = await readFile(path.join(migrationsDir, file), 'utf8');
      await client.query('begin');
      try {
        await client.query(sql);
        await client.query(
          'insert into schema_migrations (filename) values ($1)',
          [file]
        );
        await client.query('commit');
        console.log(`[db:migrate] applied ${file}`);
      } catch (error) {
        await client.query('rollback');
        throw error;
      }
    }
  } finally {
    client.release();
  }
  console.log('[db:migrate] complete');
}

main()
  .catch((error) => {
    console.error('[db:migrate] failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
