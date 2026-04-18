// mcp-server/src/mock-state.ts

export interface EstadoJugador {
  userId: string;
  nombreImperio: string;
  raza: string;
  turnos: number;
  turnosGastadosHoy: number;
  diaTemporada: number;
  ranking: number;
  recursos: Record<string, number>;
  ciudades: CiudadMock[];
  heroes: HeroeMock[];
}

export interface CiudadMock {
  id: string;
  nombre: string;
  tipoTerreno: string;
  poblacion: number;
  felicidad: number;
  edificios: { tipo: string; nivel: number }[];
  tropas: Record<string, number>;
  produccionDiaria: Record<string, number>;
}

export interface HeroeMock {
  id: string;
  nombre: string;
  clase: string;
  nivel: number;
  ubicacionNombre: string;
  capturado: boolean;
  stats: { ataque: number; defensa: number; dano: number; vida: number; velocidad: number; moral: number };
}

const crearEstadoInicial = (): EstadoJugador => ({
  userId: 'agente-demo',
  nombreImperio: 'Imperio Agente Demo',
  raza: 'elfos',
  turnos: 100,
  turnosGastadosHoy: 0,
  diaTemporada: 12,
  ranking: 99,
  recursos: {
    oro: 5000, comida: 4000, madera: 2000, piedra: 800, hierro: 500,
    mana: 50, plata: 300, herramientas: 200, armas: 100, bloques: 150,
    tablas: 100, cristal: 30, reliquias: 5, joyeria: 3, karma: 2,
    mithril: 1, gemas: 20, agua: 900,
  },
  ciudades: [
    {
      id: 'c1', nombre: 'Ciudad Principal', tipoTerreno: 'Bosque',
      poblacion: 10000, felicidad: 85,
      edificios: [
        { tipo: 'castillo', nivel: 1 },
        { tipo: 'muralla', nivel: 1 },
        { tipo: 'cuartel', nivel: 1 },
        { tipo: 'mina_oro', nivel: 2 },
      ],
      tropas: {
        N1_Guerreros_elfos: 2000,
        N2_Arqueros_elfos: 1500,
      },
      produccionDiaria: { oro: 500, comida: 200, madera: 100 },
    },
  ],
  heroes: [
    {
      id: 'h1', nombre: 'Héroe Agente N1', clase: 'guerrero', nivel: 1,
      ubicacionNombre: 'Ciudad Principal', capturado: false,
      stats: { ataque: 10, defensa: 10, dano: 7, vida: 19, velocidad: 8, moral: 8 },
    },
  ],
});

const estados = new Map<string, EstadoJugador>();

export function obtenerEstado(token: string): EstadoJugador {
  if (!estados.has(token)) {
    estados.set(token, crearEstadoInicial());
  }
  return estados.get(token)!;
}

export function gastarTurnos(token: string, cantidad: number): { ok: boolean; turnosRestantes: number; error?: string } {
  const estado = obtenerEstado(token);
  if (estado.turnos < cantidad) {
    return { ok: false, turnosRestantes: estado.turnos, error: `Turnos insuficientes. Necesitas ${cantidad}T pero tienes ${estado.turnos}T.` };
  }
  estado.turnos -= cantidad;
  estado.turnosGastadosHoy += cantidad;
  return { ok: true, turnosRestantes: estado.turnos };
}

export const COSTOS_TURNOS: Record<string, number> = {
  moverTropas: 1, aventura: 1, comerciarOro: 1, montarHeroe: 1,
  construirEdificio: 2, moverHeroe: 2, cambiarPolitica: 2,
  asedio: 4, espionajeRegional: 4,
  comprarTropas: 5, completarQuest: 5, comprarMontura: 5,
  ataqueRegionalMismaRegion: 8, ataqueRegionalAdyacente: 9,
  espionajeReconquista: 10, reclutarHeroeCapturado: 10,
  fundarCiudad: 20, comprarHeroe: 20,
  declararGuerra: 30, fundarClan: 50,
};
