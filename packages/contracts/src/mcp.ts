// src/types/mcp.ts
import type { Recursos } from './game.js';

// --- Herramientas de lectura ---
export type ParamsGetEmpireState = Record<string, never>;
export interface ParamsGetCity { cityId: string; }
export interface ParamsGetHero { heroId: string; }
export interface ParamsGetMap { region?: string; }
export interface ParamsGetRankings { categoria?: 'general' | 'militar' | 'economico' | 'heroes'; }
export interface ParamsGetMarket { recurso?: keyof Recursos; }
export interface ParamsGetBattleLog { limite?: number; }
export type ParamsGetActionCosts = Record<string, never>;
export type ParamsGetPrison = Record<string, never>;

// --- Herramientas de escritura ---
export interface ParamsBuildBuilding {
  cityId: string;
  type: string;
  level?: number;
}

export interface ParamsAttack {
  heroId: string;
  targetCityId: string;
}

export interface ParamsMoveTroops {
  from: string;
  to: string;
  troops: Record<string, number>;
}

export interface ParamsTrainTroops {
  cityId: string;
  type: string;
  quantity: number;
}

export interface ParamsMoveHero {
  heroId: string;
  destination: string;
}

export interface ParamsDoQuest {
  heroId: string;
  questId: string;
}

export interface ParamsSpy {
  targetId: string;
  heroId: string;
  type: 'regional' | 'reconquista';
}

export interface ParamsDeclareWar {
  targetClanId: string;
}

export interface ParamsOfferTrade {
  resource: keyof Recursos;
  quantity: number;
  pricePerUnit: number;
}

export interface ParamsFoundCity {
  regionId: string;
  name: string;
}

// --- Respuesta universal de escritura ---
export interface MCPActionResponse<T = Record<string, unknown>> {
  exito: boolean;
  turnosGastados: number;
  turnosRestantes: number;
  resultado: T;
  diaTemporada: number;
  sugerencias?: string[];
  error?: string;
}

// Costos de acciones para get_action_costs
export interface CostosAcciones {
  moverTropas: number;
  aventura: number;
  comerciarOro: number;
  construirEdificio: number;
  moverHeroe: number;
  cambiarPolitica: number;
  asedio: number;
  espionajeRegional: number;
  comprarTropas: number;
  completarQuest: number;
  ataqueRegionalMismaRegion: number;
  ataqueRegionalAdyacente: number;
  espionajeReconquista: number;
  reclutarHeroeCapturado: number;
  fundarCiudad: number;
  comprarHeroe: number;
  declararGuerra: number;
  fundarClan: number;
}
