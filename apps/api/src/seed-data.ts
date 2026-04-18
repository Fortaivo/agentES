import type { EstadoImperio, Recursos } from '@agentes/contracts/game';

export const RECURSOS_SEED: Recursos = {
  oro: 4200,
  comida: 3900,
  madera: 1800,
  piedra: 642,
  hierro: 819,
  mana: 50,
  plata: 1200,
  herramientas: 300,
  armas: 150,
  bloques: 200,
  tablas: 180,
  cristal: 40,
  reliquias: 12,
  joyeria: 8,
  karma: 5,
  mithril: 3,
  gemas: 29,
  agua: 1019
};

export const ESTADO_IMPERIO_SEED: EstadoImperio = {
  userId: 'demo-user',
  nombreImperio: 'Tierras Doradas',
  raza: 'elfos',
  nivel: 12,
  turnos: 73,
  turnosGastadosHoy: 27,
  diaTemporada: 12,
  ciudades: [
    {
      id: 'c1',
      nombre: 'Rosvo',
      tipoTerreno: 'Bosque',
      poblacion: 34492,
      felicidad: 100,
      moral: 100,
      corrupcion: 0,
      higiene: 44,
      religion: 77,
      cultura: 71,
      coordX: 523,
      coordY: 12,
      impuestos: 19,
      limiteTropas: 10000,
      edificios: [
        { id: 'e1', tipo: 'castillo', nivel: 1, nivelMaximo: 10, enConstruccion: false },
        { id: 'e2', tipo: 'muralla', nivel: 1, nivelMaximo: 10, enConstruccion: false },
        { id: 'e3', tipo: 'armeria', nivel: 2, nivelMaximo: 10, enConstruccion: false },
        { id: 'e4', tipo: 'foso', nivel: 1, nivelMaximo: 10, enConstruccion: true, construccionTerminaEn: new Date(Date.now() + 3600000).toISOString() }
      ],
      tropas: {
        N1_Guerreros_elfos: 850,
        N2_Arqueros_elfos: 400,
        N3_Centauros: 250,
        N4_Exploradores_elfos: 50
      },
      produccionDiaria: { oro: 34492, comida: 177, madera: 482 },
      consumoDiario: { comida: 229, agua: 225 }
    }
  ],
  heroes: [
    {
      id: 'h1',
      nombre: 'Arel N6',
      clase: 'guerrero',
      raza: 'elfos',
      nivel: 6,
      experiencia: 4850,
      experienciaSiguienteNivel: 7200,
      ubicacionTipo: 'ciudad',
      ubicacionId: 'c1',
      ubicacionNombre: 'Rosvo',
      protegido: false,
      tieneMontura: true,
      capturado: false,
      stats: { ataque: 48, defensa: 35, dano: 31, vida: 85, velocidad: 16, moral: 22 },
      puntosDesarrollo: 2,
      habilidades: ['Golpe de guerra', 'Grito de mando']
    }
  ],
  recursos: RECURSOS_SEED,
  ranking: 18,
  puntos: 15432,
  pais: 'CO'
};
