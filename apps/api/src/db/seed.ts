import { eq } from 'drizzle-orm';
import { db, pool } from './client.js';
import {
  actionLogs,
  cities,
  cityBuildings,
  cityTroops,
  empires,
  heroes,
  resourceBalances,
  users
} from './schema.js';
import { ESTADO_IMPERIO_SEED } from '../seed-data.js';

const EMPIRE_ID = 'empire-demo';
const USERNAME = 'demo-player';

async function seed() {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, ESTADO_IMPERIO_SEED.userId)
  });

  if (!existingUser) {
    await db.insert(users).values({
      id: ESTADO_IMPERIO_SEED.userId,
      email: 'demo@agentes.local',
      nombreUsuario: USERNAME,
      passwordHash: null
    });
  }

  const existingEmpire = await db.query.empires.findFirst({
    where: eq(empires.id, EMPIRE_ID)
  });

  if (!existingEmpire) {
    await db.insert(empires).values({
      id: EMPIRE_ID,
      userId: ESTADO_IMPERIO_SEED.userId,
      nombreImperio: ESTADO_IMPERIO_SEED.nombreImperio,
      raza: ESTADO_IMPERIO_SEED.raza,
      nivel: ESTADO_IMPERIO_SEED.nivel,
      turnos: ESTADO_IMPERIO_SEED.turnos,
      turnosGastadosHoy: ESTADO_IMPERIO_SEED.turnosGastadosHoy,
      diaTemporada: ESTADO_IMPERIO_SEED.diaTemporada,
      ranking: ESTADO_IMPERIO_SEED.ranking,
      puntos: ESTADO_IMPERIO_SEED.puntos,
      pais: ESTADO_IMPERIO_SEED.pais
    });
  }

  const existingResources = await db.query.resourceBalances.findFirst({
    where: eq(resourceBalances.empireId, EMPIRE_ID)
  });

  if (!existingResources) {
    await db.insert(resourceBalances).values({
      empireId: EMPIRE_ID,
      ...ESTADO_IMPERIO_SEED.recursos
    });
  }

  for (const city of ESTADO_IMPERIO_SEED.ciudades) {
    const existingCity = await db.query.cities.findFirst({
      where: eq(cities.id, city.id)
    });

    if (!existingCity) {
      await db.insert(cities).values({
        id: city.id,
        empireId: EMPIRE_ID,
        nombre: city.nombre,
        tipoTerreno: city.tipoTerreno,
        poblacion: city.poblacion,
        felicidad: city.felicidad,
        moral: city.moral,
        corrupcion: city.corrupcion,
        higiene: city.higiene,
        religion: city.religion,
        cultura: city.cultura,
        coordX: city.coordX,
        coordY: city.coordY,
        limiteTropas: city.limiteTropas,
        impuestos: city.impuestos,
        produccionDiaria: city.produccionDiaria,
        consumoDiario: city.consumoDiario
      });
    }

    for (const building of city.edificios) {
      const existingBuilding = await db.query.cityBuildings.findFirst({
        where: eq(cityBuildings.id, building.id)
      });

      if (!existingBuilding) {
        await db.insert(cityBuildings).values({
          id: building.id,
          cityId: city.id,
          tipo: building.tipo,
          nivel: building.nivel,
          nivelMaximo: building.nivelMaximo,
          enConstruccion: building.enConstruccion,
          construccionTerminaEn: building.construccionTerminaEn ? new Date(building.construccionTerminaEn) : null
        });
      }
    }

    for (const [troopType, quantity] of Object.entries(city.tropas)) {
      const troopId = `${city.id}:${troopType}`;
      const existingTroop = await db.query.cityTroops.findFirst({
        where: eq(cityTroops.id, troopId)
      });

      if (!existingTroop) {
        await db.insert(cityTroops).values({
          id: troopId,
          cityId: city.id,
          tipo: troopType,
          cantidad: quantity
        });
      }
    }
  }

  for (const hero of ESTADO_IMPERIO_SEED.heroes) {
    const existingHero = await db.query.heroes.findFirst({
      where: eq(heroes.id, hero.id)
    });

    if (!existingHero) {
      await db.insert(heroes).values({
        id: hero.id,
        empireId: EMPIRE_ID,
        nombre: hero.nombre,
        clase: hero.clase,
        raza: hero.raza,
        nivel: hero.nivel,
        experiencia: hero.experiencia,
        experienciaSiguienteNivel: hero.experienciaSiguienteNivel,
        ubicacionTipo: hero.ubicacionTipo,
        ubicacionId: hero.ubicacionId,
        ubicacionNombre: hero.ubicacionNombre,
        protegido: hero.protegido,
        tieneMontura: hero.tieneMontura,
        capturado: hero.capturado,
        ataque: hero.stats.ataque,
        defensa: hero.stats.defensa,
        dano: hero.stats.dano,
        vida: hero.stats.vida,
        velocidad: hero.stats.velocidad,
        moral: hero.stats.moral,
        puntosDesarrollo: hero.puntosDesarrollo,
        habilidades: hero.habilidades
      });
    }
  }

  const existingLog = await db.query.actionLogs.findFirst({
    where: eq(actionLogs.id, 'log-seed-1')
  });

  if (!existingLog) {
    await db.insert(actionLogs).values({
      id: 'log-seed-1',
      empireId: EMPIRE_ID,
      actionType: 'seed',
      description: 'Estado demo inicializado',
      turnsSpent: 0,
      payload: {},
      result: { status: 'ok' }
    });
  }

  console.log('[db:seed] complete');
}

seed()
  .catch((error) => {
    console.error('[db:seed] failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
