export type Raza = 'elfos' | 'elfos_oscuros' | 'enanos' | 'humanos' | 'no_muertos' | 'orcos';

export type ClaseHeroe = 'guerrero' | 'ladron' | 'sacerdote' | 'mago';

export interface Recursos {
  oro: number;
  comida: number;
  madera: number;
  piedra: number;
  hierro: number;
  mana: number;
  plata: number;
  herramientas: number;
  armas: number;
  bloques: number;
  tablas: number;
  cristal: number;
  reliquias: number;
  joyeria: number;
  karma: number;
  mithril: number;
  gemas: number;
  agua: number;
}

export const RECURSOS_COMERCIABLES: (keyof Recursos)[] = [
  'oro', 'comida', 'madera', 'piedra', 'hierro', 'plata',
  'herramientas', 'armas', 'bloques', 'tablas', 'cristal',
  'reliquias', 'joyeria', 'mithril', 'gemas', 'agua',
];

export type TipoEdificio =
  | 'castillo' | 'muralla' | 'armeria' | 'foso' | 'cuartel'
  | 'mina_oro' | 'mina_plata' | 'mina_hierro' | 'mina_piedra' | 'mina_mithril'
  | 'aserradero' | 'cultivos' | 'deposito_gemas' | 'taller' | 'forja_hierro'
  | 'forja_mithril' | 'joyeria_edif' | 'camara_cristal' | 'cantera' | 'carpinteria'
  | 'torre_magica' | 'universidad' | 'santuario' | 'templo' | 'mercado'
  | 'mercado_negro' | 'pozos' | 'vistas' | 'acueducto' | 'almacen'
  | 'coliseo' | 'burdel' | 'escuela';

export const NOMBRES_EDIFICIOS: Record<TipoEdificio, string> = {
  castillo: 'Castillo',
  muralla: 'Muralla',
  armeria: 'Armer\u00eda',
  foso: 'Foso',
  cuartel: 'Cuartel',
  mina_oro: 'Mina de Oro',
  mina_plata: 'Mina de Plata',
  mina_hierro: 'Mina de Hierro',
  mina_piedra: 'Mina de Piedra',
  mina_mithril: 'Mina de Mithril',
  aserradero: 'Aserradero',
  cultivos: 'Cultivos',
  deposito_gemas: 'Dep\u00f3sito de Gemas',
  taller: 'Taller',
  forja_hierro: 'Forja de Hierro',
  forja_mithril: 'Forja de Mithril',
  joyeria_edif: 'Joyer\u00eda',
  camara_cristal: 'C\u00e1mara de Cristal',
  cantera: 'Cantera',
  carpinteria: 'Carpinter\u00eda',
  torre_magica: 'Torre M\u00e1gica',
  universidad: 'Universidad',
  santuario: 'Santuario',
  templo: 'Templo',
  mercado: 'Mercado',
  mercado_negro: 'Mercado Negro',
  pozos: 'Pozos',
  vistas: 'Vistas',
  acueducto: 'Acueducto',
  almacen: 'Almac\u00e9n',
  coliseo: 'Coliseo',
  burdel: 'Burdel',
  escuela: 'Escuela',
};

export interface Edificio {
  id: string;
  tipo: TipoEdificio;
  nivel: number;
  nivelMaximo: number;
  enConstruccion: boolean;
  construccionTerminaEn?: string;
}

export interface StatsHeroe {
  ataque: number;
  defensa: number;
  dano: number;
  vida: number;
  velocidad: number;
  moral: number;
}

export interface Heroe {
  id: string;
  nombre: string;
  clase: ClaseHeroe;
  raza: Raza;
  nivel: number;
  experiencia: number;
  experienciaSiguienteNivel: number;
  ubicacionTipo: 'ciudad' | 'campo';
  ubicacionId: string;
  ubicacionNombre: string;
  protegido: boolean;
  tieneMontura: boolean;
  capturado: boolean;
  stats: StatsHeroe;
  puntosDesarrollo: number;
  habilidades: string[];
}

export interface MovimientoTropas {
  id: string;
  desde: string;
  hacia: string;
  tropas: Record<string, number>;
  iniciadoEn: string;
  llegaEn: string;
  estado: 'en_movimiento' | 'llegado' | 'cancelado';
}

export interface Ciudad {
  id: string;
  nombre: string;
  tipoTerreno: string;
  poblacion: number;
  felicidad: number;
  moral: number;
  corrupcion: number;
  higiene: number;
  religion: number;
  cultura: number;
  coordX: number;
  coordY: number;
  edificios: Edificio[];
  tropas: Record<string, number>;
  produccionDiaria: Partial<Recursos>;
  consumoDiario: Partial<Recursos>;
  limiteTropas: number;
  impuestos: number;
}

export interface EstadoImperio {
  userId: string;
  nombreImperio: string;
  raza: Raza;
  nivel: number;
  turnos: number;
  turnosGastadosHoy: number;
  diaTemporada: number;
  ciudades: Ciudad[];
  heroes: Heroe[];
  recursos: Recursos;
  ranking: number;
  puntos: number;
  pais: string;
}

export type EstrategiaAgente = 'agresiva' | 'economica' | 'defensiva' | 'equilibrada';
export type RelacionAgente = 'enemigo' | 'aliado';
export type ModeloIA = 'claude' | 'gpt-4o' | 'local';

export interface AccionAgente {
  timestamp: string;
  descripcion: string;
  turnosGastados: number;
  resultado: 'exito' | 'fallo';
}

export interface ImperioAgente {
  id: string;
  nombreImperio: string;
  raza: Raza;
  modelo: ModeloIA;
  estrategia: EstrategiaAgente;
  relacion: RelacionAgente;
  activo: boolean;
  ranking: number;
  turnosUsadosHoy: number;
  ultimasAcciones: AccionAgente[];
  mcpToken: string;
}

export interface RondaBatalla {
  numero: number;
  eventos: string[];
}

export interface ResultadoBatalla {
  batallaId: string;
  atacanteId: string;
  atacanteNombre: string;
  defensorId: string;
  defensorNombre: string;
  ganadorId: string;
  rondas: RondaBatalla[];
  tropasAtacantesAntes: Record<string, number>;
  tropasAtacantesDespues: Record<string, number>;
  tropasDefensorasAntes: Record<string, number>;
  tropasDefensorasDespues: Record<string, number>;
  botin: Partial<Recursos>;
  heroeCapturado?: string;
}

export interface OfertaMercado {
  id: string;
  vendedorId: string;
  vendedorNombre: string;
  recurso: keyof Recursos;
  cantidad: number;
  precioPorUnidad: number;
  precioTotal: number;
  expiraEn: string;
  creadaEn: string;
  estado: 'activa' | 'vendida' | 'expirada' | 'cancelada';
}

export interface Transaccion {
  id: string;
  compradorId: string;
  vendedorId: string;
  ofertaId: string;
  recurso: keyof Recursos;
  cantidad: number;
  precioTotal: number;
  completadaEn: string;
}

export interface Clan {
  id: string;
  nombre: string;
  acronimo: string;
  liderId: string;
  miembros: string[];
  descripcion: string;
  logo: string;
  puntos: number;
  guerrasActivas: string[];
  alianzas: string[];
  creadoEn: string;
}

export interface MisionEspionaje {
  id: string;
  tipo: 'regional' | 'reconquista';
  heroeId: string;
  objetivoId: string;
  estado: 'en_progreso' | 'completada' | 'fallida';
  resultado?: string;
  iniciadaEn: string;
  completadaEn?: string;
}

export interface Montura {
  id: string;
  tipo: string;
  nombre: string;
  bonusVelocidad: number;
  bonusCapacidad: number;
  raza: Raza;
  heroeAsignadoId?: string;
}

export interface Quest {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'diaria' | 'semanal' | 'epica';
  recompensaOro: number;
  recompensaXP: number;
  recompensaRecursos: Partial<Recursos>;
  heroeRequeridoNivel: number;
  completada: boolean;
  expiraEn?: string;
}

export const COSTOS_TURNOS = {
  mensajes: 0,
  moverTropas: 1,
  aventura: 1,
  comerciarOro: 1,
  montarHeroe: 1,
  construirEdificio: 2,
  moverHeroe: 2,
  cambiarImpuestos: 2,
  politica: 2,
  asedio: 4,
  contraataque: 4,
  espionajeRegional: 4,
  comprarTropas: 5,
  completarQuest: 5,
  magiaClam: 5,
  comprarMontura: 5,
  ataqueRegionalMismaRegion: 8,
  ataqueRegionalAdyacente: 9,
  espionajeReconquista: 10,
  reclutarHeroeCapturado: 10,
  fundarCiudad: 20,
  comprarHeroe: 20,
  declararGuerra: 30,
  fundarClan: 50,
} as const;
