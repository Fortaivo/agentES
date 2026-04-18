// mcp-server/src/tools/write-tools.ts
import { z } from 'zod';
import { obtenerEstado, gastarTurnos, COSTOS_TURNOS } from '../mock-state.js';

export type HerramientaEscritura = {
  nombre: string;
  descripcion: string;
  schema: z.ZodType<Record<string, unknown>>;
  ejecutar: (params: Record<string, unknown>, token: string) => unknown;
};

function respuestaAccion<T>(
  turnosGastados: number,
  turnosRestantes: number,
  resultado: T,
  diaTemporada: number,
  sugerencias?: string[]
) {
  return {
    exito: true,
    turnosGastados,
    turnosRestantes,
    resultado,
    diaTemporada,
    ...(sugerencias ? { sugerencias } : {}),
  };
}

function respuestaError(error: string, turnosRestantes: number, diaTemporada: number) {
  return { exito: false, error, turnosRestantes, turnosGastados: 0, diaTemporada };
}

export const herramientasEscritura: HerramientaEscritura[] = [
  {
    nombre: 'build_building',
    descripcion: `Construye o mejora un edificio en una ciudad. Costo: ${COSTOS_TURNOS.construirEdificio} turnos.`,
    schema: z.object({
      cityId: z.string().describe('ID de la ciudad donde construir'),
      type: z.string().describe('Tipo de edificio (ej: castillo, armeria, mina_oro)'),
      level: z.number().int().min(1).max(10).optional().describe('Nivel objetivo (por defecto: nivel actual + 1)'),
    }),
    ejecutar: (params, token) => {
      const { cityId, type, level } = params as { cityId: string; type: string; level?: number };
      const estado = obtenerEstado(token);
      const ciudad = estado.ciudades.find(c => c.id === cityId);
      if (!ciudad) return respuestaError(`Ciudad "${cityId}" no encontrada.`, estado.turnos, estado.diaTemporada);

      const gasto = gastarTurnos(token, COSTOS_TURNOS.construirEdificio);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      const edificioExistente = ciudad.edificios.find(e => e.tipo === type);
      const nivelActual = edificioExistente?.nivel ?? 0;
      const nivelNuevo = level ?? nivelActual + 1;

      if (edificioExistente) {
        edificioExistente.nivel = nivelNuevo;
      } else {
        ciudad.edificios.push({ tipo: type, nivel: 1 });
      }

      return respuestaAccion(
        COSTOS_TURNOS.construirEdificio,
        gasto.turnosRestantes,
        { ciudadId: cityId, edificio: type, nivelAnterior: nivelActual, nivelNuevo },
        estado.diaTemporada,
        nivelNuevo >= 5 ? [`${type} nivel ${nivelNuevo} proporciona un bono de producción significativo.`] : undefined
      );
    },
  },
  {
    nombre: 'attack',
    descripcion: `Lanza un ataque contra una ciudad enemiga. Costo: ${COSTOS_TURNOS.ataqueRegionalMismaRegion}T misma región, ${COSTOS_TURNOS.ataqueRegionalAdyacente}T adyacente.`,
    schema: z.object({
      heroId: z.string().describe('ID del héroe que lidera el ataque'),
      targetCityId: z.string().describe('ID de la ciudad objetivo'),
      regionType: z.enum(['misma_region', 'adyacente']).default('misma_region'),
    }),
    ejecutar: (params, token) => {
      const { heroId, targetCityId, regionType } = params as {
        heroId: string;
        targetCityId: string;
        regionType: 'misma_region' | 'adyacente';
      };
      const estado = obtenerEstado(token);
      const heroe = estado.heroes.find(h => h.id === heroId);
      if (!heroe) return respuestaError(`Héroe "${heroId}" no encontrado.`, estado.turnos, estado.diaTemporada);
      if (heroe.capturado) return respuestaError(`El héroe ${heroe.nombre} está capturado y no puede atacar.`, estado.turnos, estado.diaTemporada);

      const costo = regionType === 'adyacente' ? COSTOS_TURNOS.ataqueRegionalAdyacente : COSTOS_TURNOS.ataqueRegionalMismaRegion;
      const gasto = gastarTurnos(token, costo);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      const victoria = heroe.nivel >= 2 || Math.random() > 0.4;
      const tropasPerdidasAtacante = victoria ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 400) + 100;
      const botin: Record<string, number> = victoria
        ? { oro: Math.floor(Math.random() * 1000) + 500, comida: Math.floor(Math.random() * 300) }
        : {};

      if (victoria && typeof botin.oro === 'number') {
        estado.recursos.oro = (estado.recursos.oro ?? 0) + botin.oro;
      }

      return respuestaAccion(
        costo,
        gasto.turnosRestantes,
        {
          batallaId: `b_${Date.now()}`,
          resultado: victoria ? 'victoria' : 'derrota',
          tropasPerdidasAtacante,
          botin,
          heroeId: heroId,
          ciudadObjetivo: targetCityId,
        },
        estado.diaTemporada,
        victoria
          ? ['Victoria registrada. Considera reforzar tus defensas antes del próximo ataque.']
          : ['Derrota. Evalúa entrenar más tropas antes del siguiente intento.']
      );
    },
  },
  {
    nombre: 'move_troops',
    descripcion: `Mueve tropas entre ciudades o héroes. Costo: ${COSTOS_TURNOS.moverTropas} turno.`,
    schema: z.object({
      from: z.string().describe('ID del origen (ciudad o héroe)'),
      to: z.string().describe('ID del destino (ciudad o héroe)'),
      troops: z.record(z.string(), z.number().int().min(1)).describe('Tropas a mover: { "N1_Guerreros_elfos": 500 }'),
    }),
    ejecutar: (params, token) => {
      const { from, to, troops } = params as { from: string; to: string; troops: Record<string, number> };
      const estado = obtenerEstado(token);
      const gasto = gastarTurnos(token, COSTOS_TURNOS.moverTropas);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      return respuestaAccion(
        COSTOS_TURNOS.moverTropas,
        gasto.turnosRestantes,
        {
          movimientoId: `mov_${Date.now()}`,
          desde: from,
          hacia: to,
          tropas: troops,
          llegaEn: new Date(Date.now() + 3600000).toISOString(),
        },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'train_troops',
    descripcion: `Entrena (compra) tropas en una ciudad. Costo: ${COSTOS_TURNOS.comprarTropas} turnos.`,
    schema: z.object({
      cityId: z.string().describe('ID de la ciudad donde entrenar'),
      type: z.string().describe('Tipo de tropa (ej: N1_Guerreros_elfos)'),
      quantity: z.number().int().min(1).describe('Cantidad de tropas a entrenar'),
    }),
    ejecutar: (params, token) => {
      const { cityId, type, quantity } = params as { cityId: string; type: string; quantity: number };
      const estado = obtenerEstado(token);
      const ciudad = estado.ciudades.find(c => c.id === cityId);
      if (!ciudad) return respuestaError(`Ciudad "${cityId}" no encontrada.`, estado.turnos, estado.diaTemporada);

      const gasto = gastarTurnos(token, COSTOS_TURNOS.comprarTropas);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      ciudad.tropas[type] = (ciudad.tropas[type] ?? 0) + quantity;
      const costoOro = quantity * 10;
      estado.recursos.oro = Math.max(0, (estado.recursos.oro ?? 0) - costoOro);

      return respuestaAccion(
        COSTOS_TURNOS.comprarTropas,
        gasto.turnosRestantes,
        { ciudadId: cityId, tipo: type, cantidadEntrenada: quantity, totalEnCiudad: ciudad.tropas[type], costoOro },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'move_hero',
    descripcion: `Mueve un héroe a otra región o ciudad. Costo: ${COSTOS_TURNOS.moverHeroe} turnos.`,
    schema: z.object({
      heroId: z.string().describe('ID del héroe a mover'),
      destination: z.string().describe('ID o nombre del destino (ciudad o región)'),
    }),
    ejecutar: (params, token) => {
      const { heroId, destination } = params as { heroId: string; destination: string };
      const estado = obtenerEstado(token);
      const heroe = estado.heroes.find(h => h.id === heroId);
      if (!heroe) return respuestaError(`Héroe "${heroId}" no encontrado.`, estado.turnos, estado.diaTemporada);

      const gasto = gastarTurnos(token, COSTOS_TURNOS.moverHeroe);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      const ubicacionAnterior = heroe.ubicacionNombre;
      heroe.ubicacionNombre = destination;

      return respuestaAccion(
        COSTOS_TURNOS.moverHeroe,
        gasto.turnosRestantes,
        { heroeId: heroId, nombre: heroe.nombre, desde: ubicacionAnterior, hacia: destination, tiempoViaje: '1h' },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'do_quest',
    descripcion: `Envía un héroe a completar una quest. Costo: ${COSTOS_TURNOS.completarQuest} turnos.`,
    schema: z.object({
      heroId: z.string().describe('ID del héroe que completa la quest'),
      questId: z.string().describe('ID de la quest a completar'),
    }),
    ejecutar: (params, token) => {
      const { heroId, questId } = params as { heroId: string; questId: string };
      const estado = obtenerEstado(token);
      const heroe = estado.heroes.find(h => h.id === heroId);
      if (!heroe) return respuestaError(`Héroe "${heroId}" no encontrado.`, estado.turnos, estado.diaTemporada);

      const gasto = gastarTurnos(token, COSTOS_TURNOS.completarQuest);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      const recompensaOro = 800;
      const recompensaXP = 50;
      estado.recursos.oro = (estado.recursos.oro ?? 0) + recompensaOro;

      return respuestaAccion(
        COSTOS_TURNOS.completarQuest,
        gasto.turnosRestantes,
        { heroId, questId, recompensaOro, recompensaXP, nivelHeroe: heroe.nivel },
        estado.diaTemporada,
        ['Quest completada. El héroe ganó experiencia valiosa.']
      );
    },
  },
  {
    nombre: 'spy',
    descripcion: `Ejecuta una misión de espionaje. Regional: ${COSTOS_TURNOS.espionajeRegional}T, Reconquista: ${COSTOS_TURNOS.espionajeReconquista}T.`,
    schema: z.object({
      targetId: z.string().describe('ID de la ciudad o jugador objetivo'),
      heroId: z.string().describe('ID del héroe espía'),
      type: z.enum(['regional', 'reconquista']),
    }),
    ejecutar: (params, token) => {
      const { targetId, type } = params as { targetId: string; heroId: string; type: 'regional' | 'reconquista' };
      const estado = obtenerEstado(token);
      const costo = type === 'regional' ? COSTOS_TURNOS.espionajeRegional : COSTOS_TURNOS.espionajeReconquista;
      const gasto = gastarTurnos(token, costo);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      const exito = Math.random() > 0.3;
      return respuestaAccion(
        costo,
        gasto.turnosRestantes,
        exito
          ? { exito: true, objetivo: targetId, intelObtenida: { tropasAproximadas: '2.100-2.500', edificiosDetectados: 4, heroePresente: true } }
          : { exito: false, objetivo: targetId, mensaje: 'El espía fue detectado.' },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'declare_war',
    descripcion: `Declara guerra a un clan enemigo. Costo: ${COSTOS_TURNOS.declararGuerra} turnos.`,
    schema: z.object({
      targetClanId: z.string().describe('ID del clan objetivo'),
    }),
    ejecutar: (params, token) => {
      const { targetClanId } = params as { targetClanId: string };
      const estado = obtenerEstado(token);
      const gasto = gastarTurnos(token, COSTOS_TURNOS.declararGuerra);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      return respuestaAccion(
        COSTOS_TURNOS.declararGuerra,
        gasto.turnosRestantes,
        { guerraId: `war_${Date.now()}`, clanObjetivo: targetClanId, estado: 'guerra_declarada' },
        estado.diaTemporada,
        ['Guerra declarada. Refuerza tus ciudades fronterizas inmediatamente.']
      );
    },
  },
  {
    nombre: 'offer_trade',
    descripcion: `Publica una oferta en el mercado. Costo: ${COSTOS_TURNOS.comerciarOro} turno. Nota: maná y karma no son comerciables.`,
    schema: z.object({
      resource: z.string().describe('Tipo de recurso a vender (no puede ser mana ni karma)'),
      quantity: z.number().int().min(1),
      pricePerUnit: z.number().positive(),
    }),
    ejecutar: (params, token) => {
      const { resource, quantity, pricePerUnit } = params as { resource: string; quantity: number; pricePerUnit: number };
      if (resource === 'mana' || resource === 'karma') {
        const e = obtenerEstado(token);
        return respuestaError(`El ${resource} no es comerciable.`, e.turnos, e.diaTemporada);
      }
      const estado = obtenerEstado(token);
      if ((estado.recursos[resource] ?? 0) < quantity) {
        return respuestaError(`Recursos insuficientes. Tienes ${estado.recursos[resource] ?? 0} ${resource}.`, estado.turnos, estado.diaTemporada);
      }
      const gasto = gastarTurnos(token, COSTOS_TURNOS.comerciarOro);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      estado.recursos[resource] = (estado.recursos[resource] ?? 0) - quantity;

      return respuestaAccion(
        COSTOS_TURNOS.comerciarOro,
        gasto.turnosRestantes,
        {
          ofertaId: `off_${Date.now()}`,
          recurso: resource,
          cantidad: quantity,
          precioPorUnidad: pricePerUnit,
          precioTotal: quantity * pricePerUnit,
          expiraEn: new Date(Date.now() + 86400000).toISOString(),
        },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'found_city',
    descripcion: `Funda una nueva ciudad en el mapa. Costo: ${COSTOS_TURNOS.fundarCiudad} turnos.`,
    schema: z.object({
      regionId: z.string().describe('ID de la región donde fundar la ciudad'),
      name: z.string().min(2).max(30).describe('Nombre de la nueva ciudad'),
    }),
    ejecutar: (params, token) => {
      const { regionId, name } = params as { regionId: string; name: string };
      const estado = obtenerEstado(token);
      const gasto = gastarTurnos(token, COSTOS_TURNOS.fundarCiudad);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      const nuevaCiudad = {
        id: `c_${Date.now()}`,
        nombre: name,
        tipoTerreno: 'Llanura',
        poblacion: 1000,
        felicidad: 100,
        edificios: [{ tipo: 'castillo', nivel: 1 }],
        tropas: {} as Record<string, number>,
        produccionDiaria: { oro: 100, comida: 50 },
      };
      estado.ciudades.push(nuevaCiudad);

      return respuestaAccion(
        COSTOS_TURNOS.fundarCiudad,
        gasto.turnosRestantes,
        {
          ciudadId: nuevaCiudad.id,
          nombre: name,
          region: regionId,
          poblacionInicial: 1000,
          edificiosIniciales: ['castillo'],
        },
        estado.diaTemporada,
        ['Nueva ciudad fundada. Construye cultivos y un cuartel lo antes posible.']
      );
    },
  },
];
