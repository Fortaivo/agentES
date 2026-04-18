import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { RespuestaAPI } from '@agentes/contracts/api';
import type { EstadoImperio } from '@agentes/contracts/game';
import { cargarEstadoImperio } from './db/empire-state.js';
import { pingDatabase } from './db/client.js';

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? '3000');

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: true
});

app.get('/health', async () => {
  const database = await pingDatabase();
  return {
    ok: database,
    service: 'agentes-api',
    database
  };
});

app.get<{ Querystring: { userId?: string } }>('/api/v1/empire/state', async (request, reply): Promise<RespuestaAPI<EstadoImperio>> => {
  const estado = await cargarEstadoImperio(request.query.userId);

  if (!estado) {
    reply.code(404);
    return {
      exito: false,
      datos: {} as EstadoImperio,
      error: 'No se encontro ningun imperio para el criterio solicitado'
    };
  }

  return {
    exito: true,
    datos: estado,
    mensaje: 'Estado servido desde Postgres'
  };
});

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
