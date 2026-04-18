import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { RespuestaAPI } from '@agentes/contracts/api';
import type { EstadoImperio } from '@agentes/contracts/game';
import { ESTADO_IMPERIO_MOCK } from './mock-state.js';

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? '3000');

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: true
});

app.get('/health', async () => ({
  ok: true,
  service: 'agentes-api'
}));

app.get('/api/v1/empire/state', async (): Promise<RespuestaAPI<EstadoImperio>> => ({
  exito: true,
  datos: ESTADO_IMPERIO_MOCK,
  mensaje: 'Estado mock servido desde el backend local'
}));

app.get('/api/v1/meta/stack', async () => ({
  exito: true,
  datos: {
    database: 'postgres',
    cache: 'redis',
    llm: process.env.OLLAMA_BASE_URL ?? 'http://ollama:11434',
    mode: process.env.NODE_ENV ?? 'development'
  }
}));

try {
  await app.listen({ host, port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
