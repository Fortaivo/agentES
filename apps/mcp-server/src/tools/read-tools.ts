// mcp-server/src/tools/read-tools.ts
import { z } from 'zod';
import { obtenerEstado, COSTOS_TURNOS } from '../mock-state.js';

export type HerramientaLectura = {
  nombre: string;
  descripcion: string;
  schema: z.ZodType<Record<string, unknown>>;
  ejecutar: (params: Record<string, unknown>, token: string) => unknown;
};

export const herramientasLectura: HerramientaLectura[] = [
  {
    nombre: 'get_empire_state',
    descripcion: 'Retorna el estado completo del imperio: turnos, recursos (18 tipos), ciudades, héroes, ranking y día de temporada. Costo: 0 turnos.',
    schema: z.object({}),
    ejecutar: (_params, token) => {
      const estado = obtenerEstado(token);
      return {
        userId: estado.userId,
        nombreImperio: estado.nombreImperio,
        raza: estado.raza,
        turnos: estado.turnos,
        turnosGastadosHoy: estado.turnosGastadosHoy,
        diaTemporada: estado.diaTemporada,
        diasRestantes: 60 - estado.diaTemporada,
        ranking: estado.ranking,
        recursos: estado.recursos,
        ciudades: estado.ciudades.map(c => ({
          id: c.id,
          nombre: c.nombre,
          poblacion: c.poblacion,
          numEdificios: c.edificios.length,
          tropasTotal: Object.values(c.tropas).reduce((a, b) => a + b, 0),
        })),
        heroes: estado.heroes.map(h => ({
          id: h.id,
          nombre: h.nombre,
          nivel: h.nivel,
          ubicacion: h.ubicacionNombre,
          capturado: h.capturado,
        })),
      };
    },
  },
  {
    nombre: 'get_city',
    descripcion: 'Retorna información detallada de una ciudad: edificios, tropas, producción diaria, estadísticas.',
    schema: z.object({ cityId: z.string().describe('ID de la ciudad') }),
    ejecutar: (params, token) => {
      const { cityId } = params as { cityId: string };
      const estado = obtenerEstado(token);
      const ciudad = estado.ciudades.find(c => c.id === cityId);
      if (!ciudad) return { error: `Ciudad "${cityId}" no encontrada.` };
      return ciudad;
    },
  },
  {
    nombre: 'get_hero',
    descripcion: 'Retorna información detallada de un héroe: stats, nivel, XP, ubicación, estado de captura.',
    schema: z.object({ heroId: z.string().describe('ID del héroe') }),
    ejecutar: (params, token) => {
      const { heroId } = params as { heroId: string };
      const estado = obtenerEstado(token);
      const heroe = estado.heroes.find(h => h.id === heroId);
      if (!heroe) return { error: `Héroe "${heroId}" no encontrado.` };
      return heroe;
    },
  },
  {
    nombre: 'get_map',
    descripcion: 'Retorna el mapa del mundo con territorios cercanos, posiciones enemigas y tus ciudades.',
    schema: z.object({ region: z.string().optional().describe('Filtrar por región específica') }),
    ejecutar: (_params, token) => {
      const estado = obtenerEstado(token);
      return {
        mundo: 'Gaia',
        tusCiudades: estado.ciudades.map(c => ({ id: c.id, nombre: c.nombre, terreno: c.tipoTerreno })),
        territoriosVecinos: [
          { id: 'e1', nombre: 'Oscurheim', propietario: 'Imperio de las Sombras', raza: 'orcos', esAliado: false, distancia: 'misma_region' },
          { id: 'e2', nombre: 'Cristalia', propietario: 'Reino de Cristal', raza: 'elfos', esAliado: true, distancia: 'adyacente' },
        ],
      };
    },
  },
  {
    nombre: 'get_rankings',
    descripcion: 'Retorna los rankings actuales del juego (general, militar, económico, héroes) y tu posición.',
    schema: z.object({ categoria: z.enum(['general', 'militar', 'economico', 'heroes']).optional() }),
    ejecutar: (_params, token) => {
      const estado = obtenerEstado(token);
      const rankings = [
        { posicion: 1, nombre: 'Tierras Doradas', puntos: 12400, raza: 'elfos', esAgente: false },
        { posicion: 2, nombre: 'Reino de Cristal', puntos: 9800, raza: 'elfos', esAgente: true, modelo: 'gpt-4o' },
        { posicion: estado.ranking, nombre: estado.nombreImperio, puntos: 1200, raza: estado.raza, tuPosicion: true },
      ];
      return { rankings, tuPosicion: estado.ranking, diaTemporada: estado.diaTemporada, diasRestantes: 60 - estado.diaTemporada };
    },
  },
  {
    nombre: 'get_market',
    descripcion: 'Retorna las ofertas activas del mercado. Nota: maná y karma NO son comerciables.',
    schema: z.object({ recurso: z.string().optional().describe('Filtrar por tipo de recurso') }),
    ejecutar: () => ({
      ofertas: [
        { id: 'o1', vendedor: 'Valle Eterno', recurso: 'madera', cantidad: 2000, precioPorUnidad: 1.5, expiraEn: '2026-04-09T22:00:00Z' },
        { id: 'o2', vendedor: 'Monte Verde', recurso: 'hierro', cantidad: 500, precioPorUnidad: 4.0, expiraEn: '2026-04-09T22:00:00Z' },
      ],
      nota: 'El maná y el karma no son comerciables.',
    }),
  },
  {
    nombre: 'get_battle_log',
    descripcion: 'Retorna el historial de batallas recientes (ataques recibidos y tus ataques).',
    schema: z.object({ limite: z.number().int().min(1).max(20).optional().describe('Máximo de entradas') }),
    ejecutar: (params) => {
      const limite = (params.limite as number | undefined) ?? 5;
      return {
        limite,
        batallas: [
          { id: 'b1', tipo: 'ataque_tuyo', objetivo: 'Oscurheim', resultado: 'derrota', tropasPerdidasTuyas: 320, turnosGastados: 8, hace: '2h' },
          { id: 'b2', tipo: 'defensa', atacante: 'Imperio de las Sombras', resultado: 'victoria_defensa', tropasAtacantesEliminadas: 150, hace: '1d' },
        ],
      };
    },
  },
  {
    nombre: 'get_action_costs',
    descripcion: 'Retorna el costo en turnos de cada acci\u00f3n. \u00dasalo para planificar tu presupuesto de turnos.',
    schema: z.object({}),
    ejecutar: () => COSTOS_TURNOS,
  },
  {
    nombre: 'get_prison',
    descripcion: 'Retorna los héroes enemigos capturados y tus héroes en cautiverio.',
    schema: z.object({}),
    ejecutar: (_params, token) => {
      const estado = obtenerEstado(token);
      return {
        heroesCapturados: [
          { id: 'p1', nombre: 'Jasbra N3', clase: 'mago', propietario: 'Montañas Grises', rescate: 50000, costoReclutar: COSTOS_TURNOS.reclutarHeroeCapturado },
        ],
        tuHeroesCautivos: estado.heroes.filter(h => h.capturado).map(h => ({ id: h.id, nombre: h.nombre, capturadorId: 'desconocido' })),
      };
    },
  },
];
