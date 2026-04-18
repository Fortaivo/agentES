import { eq } from 'drizzle-orm';
import type {
  Ciudad,
  ClaseHeroe,
  EstadoImperio,
  Heroe,
  Raza,
  Recursos,
  TipoEdificio
} from '@agentes/contracts/game';
import { db } from './client.js';
import {
  cities,
  cityBuildings,
  cityTroops,
  empires,
  heroes,
  resourceBalances
} from './schema.js';

function mapRecursos(row: typeof resourceBalances.$inferSelect): Recursos {
  return {
    oro: row.oro,
    comida: row.comida,
    madera: row.madera,
    piedra: row.piedra,
    hierro: row.hierro,
    mana: row.mana,
    plata: row.plata,
    herramientas: row.herramientas,
    armas: row.armas,
    bloques: row.bloques,
    tablas: row.tablas,
    cristal: row.cristal,
    reliquias: row.reliquias,
    joyeria: row.joyeria,
    karma: row.karma,
    mithril: row.mithril,
    gemas: row.gemas,
    agua: row.agua
  };
}

export async function cargarEstadoImperio(userId?: string): Promise<EstadoImperio | null> {
  const empireRow = userId
    ? await db.query.empires.findFirst({ where: eq(empires.userId, userId) })
    : await db.query.empires.findFirst();

  if (!empireRow) {
    return null;
  }

  const [resourceRow, cityRows, heroRows] = await Promise.all([
    db.query.resourceBalances.findFirst({
      where: eq(resourceBalances.empireId, empireRow.id)
    }),
    db.query.cities.findMany({
      where: eq(cities.empireId, empireRow.id)
    }),
    db.query.heroes.findMany({
      where: eq(heroes.empireId, empireRow.id)
    })
  ]);

  if (!resourceRow) {
    throw new Error(`Empire ${empireRow.id} has no resource balance row`);
  }

  const citiesResult = await Promise.all(cityRows.map(async (cityRow): Promise<Ciudad> => {
    const [buildingRows, troopRows] = await Promise.all([
      db.query.cityBuildings.findMany({
        where: eq(cityBuildings.cityId, cityRow.id)
      }),
      db.query.cityTroops.findMany({
        where: eq(cityTroops.cityId, cityRow.id)
      })
    ]);

    return {
      id: cityRow.id,
      nombre: cityRow.nombre,
      tipoTerreno: cityRow.tipoTerreno,
      poblacion: cityRow.poblacion,
      felicidad: cityRow.felicidad,
      moral: cityRow.moral,
      corrupcion: cityRow.corrupcion,
      higiene: cityRow.higiene,
      religion: cityRow.religion,
      cultura: cityRow.cultura,
      coordX: cityRow.coordX,
      coordY: cityRow.coordY,
      impuestos: cityRow.impuestos,
      limiteTropas: cityRow.limiteTropas,
      edificios: buildingRows.map((building) => ({
        id: building.id,
        tipo: building.tipo as TipoEdificio,
        nivel: building.nivel,
        nivelMaximo: building.nivelMaximo,
        enConstruccion: building.enConstruccion,
        construccionTerminaEn: building.construccionTerminaEn?.toISOString()
      })),
      tropas: Object.fromEntries(troopRows.map((troop) => [troop.tipo, troop.cantidad])),
      produccionDiaria: cityRow.produccionDiaria,
      consumoDiario: cityRow.consumoDiario
    };
  }));

  const heroesResult: Heroe[] = heroRows.map((hero) => ({
    id: hero.id,
    nombre: hero.nombre,
    clase: hero.clase as ClaseHeroe,
    raza: hero.raza as Raza,
    nivel: hero.nivel,
    experiencia: hero.experiencia,
    experienciaSiguienteNivel: hero.experienciaSiguienteNivel,
    ubicacionTipo: hero.ubicacionTipo as 'ciudad' | 'campo',
    ubicacionId: hero.ubicacionId,
    ubicacionNombre: hero.ubicacionNombre,
    protegido: hero.protegido,
    tieneMontura: hero.tieneMontura,
    capturado: hero.capturado,
    stats: {
      ataque: hero.ataque,
      defensa: hero.defensa,
      dano: hero.dano,
      vida: hero.vida,
      velocidad: hero.velocidad,
      moral: hero.moral
    },
    puntosDesarrollo: hero.puntosDesarrollo,
    habilidades: hero.habilidades
  }));

  return {
    userId: empireRow.userId,
    nombreImperio: empireRow.nombreImperio,
    raza: empireRow.raza as Raza,
    nivel: empireRow.nivel,
    turnos: empireRow.turnos,
    turnosGastadosHoy: empireRow.turnosGastadosHoy,
    diaTemporada: empireRow.diaTemporada,
    ciudades: citiesResult,
    heroes: heroesResult,
    recursos: mapRecursos(resourceRow),
    ranking: empireRow.ranking,
    puntos: empireRow.puntos,
    pais: empireRow.pais
  };
}
