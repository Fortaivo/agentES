// src/types/api.ts
import type { TipoEdificio, Recursos, EstadoImperio } from './game.js';

export interface RespuestaAPI<T> {
  exito: boolean;
  datos: T;
  error?: string;
  mensaje?: string;
}

export interface RespuestaAccion<T> {
  exito: boolean;
  turnosGastados: number;
  turnosRestantes: number;
  resultado: T;
  diaTemporada: number;
  sugerencias?: string[];
  error?: string;
}

// Auth
export interface PeticionRegistro {
  email: string;
  contrasena: string;
  nombreUsuario: string;
  nombreImperio: string;
  raza: string;
  pais: string;
}

export interface PeticionLogin {
  email: string;
  contrasena: string;
}

export interface RespuestaAuth {
  token: string;
  usuario: { id: string; email: string; nombreUsuario: string };
  estado: EstadoImperio;
}

// Ciudades
export interface PeticionConstruirEdificio {
  tipo: TipoEdificio;
  nivel?: number;
}

export interface PeticionFundarCiudad {
  nombre: string;
  regionId: string;
}

// Tropas
export interface PeticionMoverTropas {
  desde: { tipo: 'ciudad' | 'heroe'; id: string };
  hacia: { tipo: 'ciudad' | 'heroe'; id: string };
  tropas: Record<string, number>;
}

export interface PeticionEntrenarTropas {
  tipo: string;
  cantidad: number;
}

// Héroes
export interface PeticionMoverHeroe {
  destino: string;
  destinoTipo: 'ciudad' | 'region';
}

export interface PeticionMejorarStats {
  stat: 'ataque' | 'defensa' | 'dano' | 'vida' | 'velocidad' | 'moral';
  puntos: number;
}

// Combate
export interface PeticionAtacar {
  heroeId: string;
  ciudadObjetivoId: string;
}

// Comercio
export interface PeticionCrearOferta {
  recurso: keyof Recursos;
  cantidad: number;
  precioPorUnidad: number;
}

export interface PeticionComprar {
  ofertaId: string;
  cantidad?: number;
}

// Espionaje
export interface PeticionEspionaje {
  heroeId: string;
  objetivoId: string;
  tipo: 'regional' | 'reconquista';
}

// Rankings
export interface EntradaRanking {
  posicion: number;
  userId: string;
  nombreImperio: string;
  pais: string;
  raza: string;
  puntos: number;
  tendencia: 'subiendo' | 'bajando' | 'igual';
  esAgente: boolean;
}

export interface RespuestaRankings {
  general: EntradaRanking[];
  militar: EntradaRanking[];
  economico: EntradaRanking[];
  heroes: EntradaRanking[];
  actualizadoEn: string;
}

// Agentes
export interface PeticionCrearAgente {
  nombreImperio: string;
  raza: string;
  modelo: 'claude' | 'gpt-4o' | 'local';
  estrategia: 'agresiva' | 'economica' | 'defensiva' | 'equilibrada';
  relacion: 'enemigo' | 'aliado';
}
