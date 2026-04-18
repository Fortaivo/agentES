# Empire Strike — Plan 1: Cimientos

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear los contratos TypeScript compartidos, actualizar ResourceBar y Sidebar con la estructura real del juego, y cablear todas las rutas nuevas en App.tsx — desbloquea los Planes 2 y 3.

**Architecture:** `src/types/` contiene las definiciones que tanto el frontend como el servidor MCP comparten. ResourceBar muestra los 18 recursos + contador de turnos. Sidebar refleja la jerarquía de navegación real del juego. App.tsx importa páginas placeholder para cada ruta nueva.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React

---

### Task 1: Tipos del juego — src/types/game.ts

**Files:**
- Create: `src/types/game.ts`

- [ ] **Step 1: Crear el archivo con todos los tipos del dominio del juego**

```typescript
// src/types/game.ts

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
  'reliquias', 'joyeria', 'mithril', 'gemas', 'agua'
];
// Nota: 'mana' y 'karma' NO son comerciables

export type TipoEdificio =
  // Militares
  | 'castillo' | 'muralla' | 'armeria' | 'foso' | 'cuartel'
  // Producción
  | 'mina_oro' | 'mina_plata' | 'mina_hierro' | 'mina_piedra' | 'mina_mithril'
  | 'aserradero' | 'cultivos' | 'deposito_gemas' | 'taller' | 'forja_hierro'
  | 'forja_mithril' | 'joyeria_edif' | 'camara_cristal' | 'cantera' | 'carpinteria'
  // Servicio
  | 'torre_magica' | 'universidad' | 'santuario' | 'templo' | 'mercado'
  | 'mercado_negro' | 'pozos' | 'vistas' | 'acueducto' | 'almacen'
  | 'coliseo' | 'burdel' | 'escuela';

export const NOMBRES_EDIFICIOS: Record<TipoEdificio, string> = {
  castillo: 'Castillo', muralla: 'Muralla', armeria: 'Armería',
  foso: 'Foso', cuartel: 'Cuartel',
  mina_oro: 'Mina de Oro', mina_plata: 'Mina de Plata', mina_hierro: 'Mina de Hierro',
  mina_piedra: 'Mina de Piedra', mina_mithril: 'Mina de Mithril',
  aserradero: 'Aserradero', cultivos: 'Cultivos', deposito_gemas: 'Depósito de Gemas',
  taller: 'Taller', forja_hierro: 'Forja de Hierro', forja_mithril: 'Forja de Mithril',
  joyeria_edif: 'Joyería', camara_cristal: 'Cámara de Cristal', cantera: 'Cantera',
  carpinteria: 'Carpintería', torre_magica: 'Torre Mágica', universidad: 'Universidad',
  santuario: 'Santuario', templo: 'Templo', mercado: 'Mercado',
  mercado_negro: 'Mercado Negro', pozos: 'Pozos', vistas: 'Vistas',
  acueducto: 'Acueducto', almacen: 'Almacén', coliseo: 'Coliseo',
  burdel: 'Burdel', escuela: 'Escuela',
};

export interface Edificio {
  id: string;
  tipo: TipoEdificio;
  nivel: number;
  nivelMaximo: number;
  enConstruccion: boolean;
  construccionTerminaEn?: string; // ISO timestamp
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
  diaTemporada: number; // 1-60
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
```

- [ ] **Step 2: Verificar que TypeScript compila**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/types/game.ts
git commit -m "feat: add game domain types (races, buildings, heroes, troops, resources)"
```

---

### Task 2: Tipos de API — src/types/api.ts

**Files:**
- Create: `src/types/api.ts`

- [ ] **Step 1: Crear tipos de request/response para la API REST**

```typescript
// src/types/api.ts
import type { TipoEdificio, Recursos, EstadoImperio, Ciudad, Heroe, ResultadoBatalla, OfertaMercado, Transaccion, Clan, ImperioAgente } from './game';

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
```

- [ ] **Step 2: Verificar compilación**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/types/api.ts
git commit -m "feat: add API request/response types"
```

---

### Task 3: Tipos MCP — src/types/mcp.ts

**Files:**
- Create: `src/types/mcp.ts`

- [ ] **Step 1: Crear tipos de parámetros y respuestas para herramientas MCP**

```typescript
// src/types/mcp.ts
import type { Recursos } from './game';

// --- Herramientas de lectura ---
export interface ParamsGetEmpireState { }
export interface ParamsGetCity { cityId: string; }
export interface ParamsGetHero { heroId: string; }
export interface ParamsGetMap { region?: string; }
export interface ParamsGetRankings { categoria?: 'general' | 'militar' | 'economico' | 'heroes'; }
export interface ParamsGetMarket { recurso?: keyof Recursos; }
export interface ParamsGetBattleLog { limite?: number; }
export interface ParamsGetActionCosts { }
export interface ParamsGetPrison { }

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
```

- [ ] **Step 2: Verificar compilación**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/types/mcp.ts
git commit -m "feat: add MCP tool parameter and response types"
```

---

### Task 4: Actualizar ResourceBar

**Files:**
- Modify: `src/components/ResourceBar.tsx`

- [ ] **Step 1: Leer el archivo actual**

```bash
cat src/components/ResourceBar.tsx
```

- [ ] **Step 2: Reemplazar con la nueva implementación**

Muestra los 6 recursos principales siempre visibles, un expandible para el resto, y el contador de turnos prominente a la derecha.

```tsx
// src/components/ResourceBar.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Recursos } from '../types/game';

interface ResourceBarProps {
  recursos: Recursos;
  turnos: number;
  turnosGastadosHoy: number;
  diaTemporada: number;
}

const RECURSOS_PRINCIPALES: { key: keyof Recursos; emoji: string; abrev: string }[] = [
  { key: 'oro', emoji: '🪙', abrev: 'Oro' },
  { key: 'comida', emoji: '🌾', abrev: 'Comida' },
  { key: 'madera', emoji: '🪵', abrev: 'Madera' },
  { key: 'piedra', emoji: '🪨', abrev: 'Piedra' },
  { key: 'hierro', emoji: '⚙️', abrev: 'Hierro' },
  { key: 'gemas', emoji: '💎', abrev: 'Gemas' },
];

const RECURSOS_SECUNDARIOS: { key: keyof Recursos; emoji: string; abrev: string }[] = [
  { key: 'plata', emoji: '🥈', abrev: 'Plata' },
  { key: 'mana', emoji: '✨', abrev: 'Maná' },
  { key: 'herramientas', emoji: '🔧', abrev: 'Herram.' },
  { key: 'armas', emoji: '⚔️', abrev: 'Armas' },
  { key: 'bloques', emoji: '🧱', abrev: 'Bloques' },
  { key: 'tablas', emoji: '🪚', abrev: 'Tablas' },
  { key: 'cristal', emoji: '🔮', abrev: 'Cristal' },
  { key: 'reliquias', emoji: '📿', abrev: 'Reliq.' },
  { key: 'joyeria', emoji: '💍', abrev: 'Joyería' },
  { key: 'karma', emoji: '☯️', abrev: 'Karma' },
  { key: 'mithril', emoji: '🌟', abrev: 'Mithril' },
  { key: 'agua', emoji: '💧', abrev: 'Agua' },
];

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const ResourceBar: React.FC<ResourceBarProps> = ({ recursos, turnos, turnosGastadosHoy, diaTemporada }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-b-2 border-yellow-600">
      {/* Fila principal */}
      <div className="flex items-center gap-1 px-4 py-2 flex-wrap">
        {RECURSOS_PRINCIPALES.map(({ key, emoji, abrev }) => (
          <div key={key} className="flex items-center gap-1 bg-amber-950 rounded px-2 py-1 min-w-[70px]">
            <span className="text-sm">{emoji}</span>
            <div>
              <div className="text-yellow-200 text-xs font-bold leading-none">{formatNum(recursos[key])}</div>
              <div className="text-amber-500 text-[10px] leading-none">{abrev}</div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-1 text-amber-400 hover:text-yellow-200 transition-colors px-2 py-1 text-xs"
        >
          {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expandido ? 'Menos' : '+12'}
        </button>

        {/* Espaciador */}
        <div className="flex-1" />

        {/* Día de temporada */}
        <div className="text-amber-400 text-xs mr-3">
          Día <span className="text-yellow-200 font-bold">{diaTemporada}</span>/60
        </div>

        {/* Contador de turnos */}
        <div className="flex items-center gap-2 bg-amber-950 border border-yellow-600 rounded-lg px-3 py-1">
          <Clock size={14} className="text-yellow-400" />
          <div>
            <div className="text-yellow-200 text-sm font-bold leading-none">⏳ {turnos}</div>
            <div className="text-amber-500 text-[10px] leading-none">turnos · -{turnosGastadosHoy} hoy</div>
          </div>
        </div>
      </div>

      {/* Recursos secundarios expandibles */}
      {expandido && (
        <div className="flex flex-wrap gap-1 px-4 pb-2">
          {RECURSOS_SECUNDARIOS.map(({ key, emoji, abrev }) => (
            <div key={key} className="flex items-center gap-1 bg-amber-950 rounded px-2 py-1 min-w-[70px]">
              <span className="text-sm">{emoji}</span>
              <div>
                <div className="text-yellow-200 text-xs font-bold leading-none">{formatNum(recursos[key])}</div>
                <div className="text-amber-500 text-[10px] leading-none">{abrev}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceBar;
```

- [ ] **Step 3: Verificar compilación**

```bash
npx tsc --noEmit
```

Esperado: sin errores (si hay errores de props en App.tsx es normal — se arreglan en Task 6).

- [ ] **Step 4: Commit**

```bash
git add src/components/ResourceBar.tsx
git commit -m "feat: update ResourceBar with 18 resources, turn counter, season day"
```

---

### Task 5: Actualizar Sidebar

**Files:**
- Modify: `src/components/Sidebar.tsx`

- [ ] **Step 1: Reemplazar con navegación completa del juego**

```tsx
// src/components/Sidebar.tsx
import React, { useState } from 'react';
import {
  Crown, Sword, Building, Users, Shield, Trophy, ShoppingCart,
  User, Map, Users2, Eye, Scale, Lock, Horse, Scroll, Truck,
  Bot, HelpCircle, Gem, ChevronDown, ChevronRight, LogOut
} from 'lucide-react';

export type PaginaId =
  | 'dashboard' | 'ejercito' | 'alianzas' | 'conquistas'
  | 'heroes' | 'tropas' | 'monturas' | 'espionaje'
  | 'politica' | 'comercio' | 'carromato' | 'prision'
  | 'clanes' | 'cities' | 'fundar-ciudad'
  | 'mapa' | 'rankings' | 'combat' | 'quests'
  | 'imperios-agente' | 'profile' | 'rubies';

interface SidebarProps {
  paginaActual: PaginaId;
  onCambiarPagina: (pagina: PaginaId) => void;
  nombreImperio: string;
  ciudades: { id: string; nombre: string }[];
  heroes: { id: string; nombre: string; nivel: number }[];
}

interface ItemNav {
  id: PaginaId;
  label: string;
  icon: React.ElementType;
  insignia?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  paginaActual, onCambiarPagina, nombreImperio, ciudades, heroes
}) => {
  const [ciudadesExpandido, setCiudadesExpandido] = useState(true);
  const [heroesExpandido, setHeroesExpandido] = useState(true);

  const btnClase = (id: PaginaId) =>
    `w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all ${
      paginaActual === id
        ? 'bg-yellow-600 text-white font-semibold shadow'
        : 'text-amber-300 hover:bg-amber-700 hover:text-white'
    }`;

  const seccion = (titulo: string) => (
    <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1">
      {titulo}
    </div>
  );

  const item = (nav: ItemNav) => {
    const Icon = nav.icon;
    return (
      <button key={nav.id} className={btnClase(nav.id)} onClick={() => onCambiarPagina(nav.id)}>
        <Icon size={15} />
        <span className="flex-1 text-left">{nav.label}</span>
        {nav.insignia && (
          <span className="bg-amber-900 text-amber-400 text-[10px] px-1.5 rounded">{nav.insignia}</span>
        )}
      </button>
    );
  };

  return (
    <div className="w-56 bg-gradient-to-b from-amber-900 to-stone-900 text-white min-h-screen flex flex-col">
      {/* Cabecera */}
      <div className="p-4 border-b border-amber-700">
        <h2 className="text-base font-bold text-yellow-200 text-center">EMPIRE STRIKE</h2>
        <p className="text-amber-400 text-center text-xs mt-0.5 truncate">{nombreImperio}</p>
      </div>

      {/* Navegación con scroll */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 text-sm">

        {seccion('Info')}
        {item({ id: 'dashboard', label: 'Mi Imperio', icon: Crown })}
        {item({ id: 'ejercito', label: 'Mi Ejército', icon: Shield })}
        {item({ id: 'alianzas', label: 'Últimas Alianzas', icon: Users2 })}
        {item({ id: 'conquistas', label: 'Conquistas', icon: Trophy })}
        {item({ id: 'mapa', label: 'Mapa Mundial', icon: Map })}

        {seccion('Acciones')}
        {item({ id: 'heroes', label: 'Mover Héroes', icon: Sword, insignia: '2T' })}
        {item({ id: 'tropas', label: 'Mover Tropas', icon: Users, insignia: '1T' })}
        {item({ id: 'monturas', label: 'Monturas', icon: Horse, insignia: '5T' })}
        {item({ id: 'espionaje', label: 'Espionaje', icon: Eye, insignia: '4T' })}
        {item({ id: 'politica', label: 'Política', icon: Scale, insignia: '2T' })}
        {item({ id: 'comercio', label: 'Comercio', icon: ShoppingCart, insignia: '1T' })}
        {item({ id: 'carromato', label: 'Carromato', icon: Truck, insignia: '1T' })}
        {item({ id: 'prision', label: 'Prisión', icon: Lock })}

        {seccion('Clanes')}
        {item({ id: 'clanes', label: 'Mi Clan', icon: Users2 })}

        {seccion('Ciudades')}
        <button
          className="w-full flex items-center gap-2 px-3 py-1.5 text-amber-400 hover:text-yellow-200 text-xs uppercase font-bold tracking-wide"
          onClick={() => setCiudadesExpandido(!ciudadesExpandido)}
        >
          {ciudadesExpandido ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Mis ciudades
        </button>
        {ciudadesExpandido && ciudades.map(c => (
          <button
            key={c.id}
            className={btnClase('cities')}
            onClick={() => onCambiarPagina('cities')}
          >
            <Building size={13} />
            <span className="flex-1 text-left text-xs truncate">{c.nombre}</span>
          </button>
        ))}
        <button
          className="w-full flex items-center gap-2 px-3 py-1.5 text-amber-400 hover:text-yellow-200 text-xs"
          onClick={() => onCambiarPagina('fundar-ciudad')}
        >
          <span className="text-lg leading-none">+</span>
          <span>Fundar ciudad</span>
          <span className="ml-auto bg-amber-900 text-amber-400 text-[10px] px-1.5 rounded">20T</span>
        </button>

        {seccion('Héroes')}
        <button
          className="w-full flex items-center gap-2 px-3 py-1.5 text-amber-400 hover:text-yellow-200 text-xs uppercase font-bold tracking-wide"
          onClick={() => setHeroesExpandido(!heroesExpandido)}
        >
          {heroesExpandido ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Mis héroes
        </button>
        {heroesExpandido && heroes.map(h => (
          <button
            key={h.id}
            className={btnClase('heroes')}
            onClick={() => onCambiarPagina('heroes')}
          >
            <Sword size={13} />
            <span className="flex-1 text-left text-xs truncate">{h.nombre}</span>
            <span className="text-amber-500 text-[10px]">N{h.nivel}</span>
          </button>
        ))}

        {seccion('Extra')}
        {item({ id: 'quests', label: 'Quests', icon: Scroll, insignia: '5T' })}
        {item({ id: 'combat', label: 'Combate', icon: Shield })}
        {item({ id: 'rankings', label: 'Rankings', icon: Trophy })}
        {item({ id: 'imperios-agente', label: 'Imperios Agente', icon: Bot })}
        {item({ id: 'profile', label: 'Perfil', icon: User })}
        {item({ id: 'rubies', label: 'Rubíes', icon: Gem })}
      </nav>

      {/* Pie */}
      <div className="border-t border-amber-700 p-3">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-amber-400 hover:bg-red-900 hover:text-white text-sm transition-all">
          <LogOut size={15} />
          Salir
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
```

- [ ] **Step 2: Verificar compilación**

```bash
npx tsc --noEmit
```

Esperado: advertencias de props en App.tsx (se arreglan en Task 6), sin errores en Sidebar.tsx.

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat: update Sidebar with all game routes, turn cost badges, city/hero lists"
```

---

### Task 6: Actualizar App.tsx con todas las rutas

**Files:**
- Modify: `src/App.tsx`
- Create (placeholders): `src/pages/MapaMundial.tsx`, `src/pages/Clanes.tsx`, `src/pages/Espionaje.tsx`, `src/pages/Politica.tsx`, `src/pages/Prision.tsx`, `src/pages/Monturas.tsx`, `src/pages/Quests.tsx`, `src/pages/Carromato.tsx`, `src/pages/ImperiosAgente.tsx`, `src/pages/Rubies.tsx`, `src/pages/Ejercito.tsx`, `src/pages/Alianzas.tsx`, `src/pages/Conquistas.tsx`

- [ ] **Step 1: Crear páginas placeholder para las rutas nuevas**

Para cada página nueva, crear un placeholder mínimo. Ejemplo (repetir para cada una):

```tsx
// src/pages/MapaMundial.tsx
import React from 'react';
import { Map } from 'lucide-react';

const MapaMundial: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-64 text-amber-700">
    <Map size={48} className="mb-4 text-amber-400" />
    <h2 className="text-2xl font-bold text-amber-800">Mapa Mundial</h2>
    <p className="text-amber-600 mt-2">Próximamente — Plan 2</p>
  </div>
);

export default MapaMundial;
```

Repetir con nombres/iconos apropiados para: `Clanes` (Users2), `Espionaje` (Eye), `Politica` (Scale), `Prision` (Lock), `Monturas` (Horse — importar de lucide), `Quests` (Scroll), `Carromato` (Truck), `ImperiosAgente` (Bot), `Rubies` (Gem), `Ejercito` (Shield), `Alianzas` (Users2), `Conquistas` (Trophy).

- [ ] **Step 2: Actualizar App.tsx con mock data y todas las rutas**

```tsx
// src/App.tsx
import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Heroes from './pages/Heroes';
import Cities from './pages/Cities';
import Troops from './pages/Troops';
import Combat from './pages/Combat';
import Rankings from './pages/Rankings';
import Profile from './pages/Profile';
import Trade from './pages/Trade';
import MapaMundial from './pages/MapaMundial';
import Clanes from './pages/Clanes';
import Espionaje from './pages/Espionaje';
import Politica from './pages/Politica';
import Prision from './pages/Prision';
import Monturas from './pages/Monturas';
import Quests from './pages/Quests';
import Carromato from './pages/Carromato';
import ImperiosAgente from './pages/ImperiosAgente';
import Rubies from './pages/Rubies';
import Ejercito from './pages/Ejercito';
import Alianzas from './pages/Alianzas';
import Conquistas from './pages/Conquistas';
import Sidebar, { type PaginaId } from './components/Sidebar';
import ResourceBar from './components/ResourceBar';
import type { Recursos } from './types/game';

const RECURSOS_MOCK: Recursos = {
  oro: 4200, comida: 3900, madera: 1800, piedra: 642,
  hierro: 819, mana: 50, plata: 1200, herramientas: 300,
  armas: 150, bloques: 200, tablas: 180, cristal: 40,
  reliquias: 12, joyeria: 8, karma: 5, mithril: 3,
  gemas: 29, agua: 1019,
};

const CIUDADES_MOCK = [
  { id: 'c1', nombre: 'Rosvo' },
  { id: 'c2', nombre: 'Doghell' },
];

const HEROES_MOCK = [
  { id: 'h1', nombre: 'Doghell N1', nivel: 1 },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paginaActual, setPaginaActual] = useState<PaginaId>('dashboard');

  const renderPagina = () => {
    switch (paginaActual) {
      case 'dashboard': return <Dashboard />;
      case 'heroes': return <Heroes />;
      case 'cities': return <Cities />;
      case 'tropas': return <Troops />;
      case 'combat': return <Combat />;
      case 'rankings': return <Rankings />;
      case 'comercio': return <Trade />;
      case 'profile': return <Profile />;
      case 'mapa': return <MapaMundial />;
      case 'clanes': return <Clanes />;
      case 'espionaje': return <Espionaje />;
      case 'politica': return <Politica />;
      case 'prision': return <Prision />;
      case 'monturas': return <Monturas />;
      case 'quests': return <Quests />;
      case 'carromato': return <Carromato />;
      case 'imperios-agente': return <ImperiosAgente />;
      case 'rubies': return <Rubies />;
      case 'ejercito': return <Ejercito />;
      case 'alianzas': return <Alianzas />;
      case 'conquistas': return <Conquistas />;
      default: return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex">
      <Sidebar
        paginaActual={paginaActual}
        onCambiarPagina={setPaginaActual}
        nombreImperio="Tierras Doradas"
        ciudades={CIUDADES_MOCK}
        heroes={HEROES_MOCK}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResourceBar
          recursos={RECURSOS_MOCK}
          turnos={73}
          turnosGastadosHoy={27}
          diaTemporada={12}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderPagina()}
        </main>
      </div>
    </div>
  );
};

export default App;
```

- [ ] **Step 3: Verificar que compila y corre**

```bash
npx tsc --noEmit
npm run dev
```

Esperado: sin errores TypeScript. App arranca, puedes navegar a todas las páginas (muestran placeholder "Próximamente").

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/pages/MapaMundial.tsx src/pages/Clanes.tsx src/pages/Espionaje.tsx src/pages/Politica.tsx src/pages/Prision.tsx src/pages/Monturas.tsx src/pages/Quests.tsx src/pages/Carromato.tsx src/pages/ImperiosAgente.tsx src/pages/Rubies.tsx src/pages/Ejercito.tsx src/pages/Alianzas.tsx src/pages/Conquistas.tsx
git commit -m "feat: wire all routes in App.tsx, add placeholder pages for new sections"
```

---

### Task 7: .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Añadir entrada para archivos de brainstorming**

```bash
echo "" >> .gitignore
echo "# Brainstorming visual companion" >> .gitignore
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers/ brainstorm files"
```

---

## Verificación Final del Plan 1

Tras completar las 7 tareas:

1. `npx tsc --noEmit` → sin errores
2. `npm run dev` → app arranca
3. Puedes navegar las 17+ rutas en la sidebar
4. ResourceBar muestra 6 recursos principales + expandible + contador de turnos
5. Cada botón de acción en Sidebar tiene insignia de coste (`2T`, `1T`, etc.)

**Siguiente paso:** Ejecutar Plan 2 (páginas completas) o Plan 3 (servidor MCP) — son independientes una vez terminado el Plan 1.
