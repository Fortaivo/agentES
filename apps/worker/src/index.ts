const intervalMs = Number(process.env.WORKER_TICK_MS ?? '30000');

console.log('[worker] started', {
  postgresUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@postgres:5432/agentes',
  redisUrl: process.env.REDIS_URL ?? 'redis://redis:6379',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? 'http://ollama:11434',
  intervalMs
});

setInterval(() => {
  console.log('[worker] heartbeat', new Date().toISOString());
}, intervalMs);
