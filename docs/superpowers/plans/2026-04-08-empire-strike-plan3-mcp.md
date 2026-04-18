# Empire Strike — Plan 3: Servidor MCP

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el servidor MCP standalone que expone las acciones del juego como herramientas para agentes IA. Funciona contra datos mock mientras el backend no está listo.

**Architecture:** Servidor Node.js independiente en `mcp-server/` usando `@modelcontextprotocol/sdk`. Cada herramienta MCP valida parámetros, descuenta turnos del estado mock, y retorna `{ exito, turnosGastados, turnosRestantes, resultado, diaTemporada }`. El mismo servidor se conecta al backend real cuando esté listo — solo cambia la capa de datos, no las herramientas.

**Tech Stack:** Node.js, TypeScript, `@modelcontextprotocol/sdk`, `zod` (validación)  
**Prerequisito:** Plan 1 completado (tipos compartidos en `src/types/`)

---

### Task 1: Setup del proyecto MCP

**Files:**
- Create: `mcp-server/package.json`
- Create: `mcp-server/tsconfig.json`
- Create: `mcp-server/src/index.ts`

- [ ] **Step 1: Crear directorio y package.json**

```bash
mkdir mcp-server && cd mcp-server
```

```json
// mcp-server/package.json
{
  "name": "empire-strike-mcp",
  "version": "1.0.0",
  "description": "Servidor MCP para Empire Strike — agentes IA",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

- [ ] **Step 2: Instalar dependencias**

```bash
cd mcp-server && npm install
```

Esperado: `node_modules/` creado, sin errores.

- [ ] **Step 3: Crear tsconfig.json**

```json
// mcp-server/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Commit**

```bash
cd ..
git add mcp-server/package.json mcp-server/tsconfig.json
git commit -m "feat: scaffold MCP server project"
```

---

### Task 2: Estado mock del juego

**Files:**
- Create: `mcp-server/src/mock-state.ts`

- [ ] **Step 1: Crear estado mock tipado**

Este módulo simula la base de datos. Cuando el backend real esté listo, se reemplaza por llamadas HTTP.

```typescript
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

// Estado inicial mock — se reinicia en cada arranque del servidor
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
        'N1_Guerreros_elfos': 2000,
        'N2_Arqueros_elfos': 1500,
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

// Mapa de estado por token de autenticación
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
```

- [ ] **Step 2: Verificar compilación**

```bash
cd mcp-server && npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
cd ..
git add mcp-server/src/mock-state.ts
git commit -m "feat: add mock game state for MCP server"
```

---

### Task 3: Herramientas de lectura (0 turnos)

**Files:**
- Create: `mcp-server/src/tools/read-tools.ts`

- [ ] **Step 1: Implementar las 9 herramientas de lectura**

```typescript
// mcp-server/src/tools/read-tools.ts
import { z } from 'zod';
import { obtenerEstado, COSTOS_TURNOS } from '../mock-state.js';

export type HerramientaLectura = {
  nombre: string;
  descripcion: string;
  parametros: z.ZodSchema;
  ejecutar: (params: unknown, token: string) => unknown;
};

export const herramientasLectura: HerramientaLectura[] = [
  {
    nombre: 'get_empire_state',
    descripcion: 'Retorna el estado completo del imperio: turnos, recursos (18 tipos), ciudades, héroes, ranking y día de temporada. Costo: 0 turnos.',
    parametros: z.object({}),
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
        ciudades: estado.ciudades.map(c => ({ id: c.id, nombre: c.nombre, poblacion: c.poblacion, numEdificios: c.edificios.length, tropasTotal: Object.values(c.tropas).reduce((a, b) => a + b, 0) })),
        heroes: estado.heroes.map(h => ({ id: h.id, nombre: h.nombre, nivel: h.nivel, ubicacion: h.ubicacionNombre, capturado: h.capturado })),
      };
    },
  },
  {
    nombre: 'get_city',
    descripcion: 'Retorna información detallada de una ciudad: edificios, tropas, producción diaria, estadísticas.',
    parametros: z.object({ cityId: z.string().describe('ID de la ciudad') }),
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
    parametros: z.object({ heroId: z.string().describe('ID del héroe') }),
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
    parametros: z.object({ region: z.string().optional().describe('Filtrar por región específica') }),
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
    parametros: z.object({ categoria: z.enum(['general', 'militar', 'economico', 'heroes']).optional() }),
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
    parametros: z.object({ recurso: z.string().optional().describe('Filtrar por tipo de recurso') }),
    ejecutar: (_params, _token) => ({
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
    parametros: z.object({ limite: z.number().int().min(1).max(20).default(5) }),
    ejecutar: (_params, _token) => ({
      batallas: [
        { id: 'b1', tipo: 'ataque_tuyo', objetivo: 'Oscurheim', resultado: 'derrota', tropasPerdidasTuyas: 320, turnosGastados: 8, hace: '2h' },
        { id: 'b2', tipo: 'defensa', atacante: 'Imperio de las Sombras', resultado: 'victoria_defensa', tropasAtacantesEliminadas: 150, hace: '1d' },
      ],
    }),
  },
  {
    nombre: 'get_action_costs',
    descripcion: 'Retorna el costo en turnos de cada acción disponible. Úsalo para planificar tu presupuesto de turnos.',
    parametros: z.object({}),
    ejecutar: (_params, _token) => COSTOS_TURNOS,
  },
  {
    nombre: 'get_prison',
    descripcion: 'Retorna los héroes enemigos capturados y tus héroes en cautiverio.',
    parametros: z.object({}),
    ejecutar: (_params, token) => {
      const estado = obtenerEstado(token);
      return {
        heroesCaptrados: [
          { id: 'p1', nombre: 'Jasbra N3', clase: 'mago', propietario: 'Montañas Grises', rescate: 50000, costoReclutar: COSTOS_TURNOS.reclutarHeroeCapturado },
        ],
        tuHeroesCautivos: estado.heroes.filter(h => h.capturado).map(h => ({ id: h.id, nombre: h.nombre, capturadorId: 'desconocido' })),
      };
    },
  },
];
```

- [ ] **Step 2: Verificar compilación**

```bash
cd mcp-server && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd ..
git add mcp-server/src/tools/read-tools.ts
git commit -m "feat: implement 9 MCP read tools (0 turns, intel gathering)"
```

---

### Task 4: Herramientas de escritura (cuestan turnos)

**Files:**
- Create: `mcp-server/src/tools/write-tools.ts`

- [ ] **Step 1: Implementar las 10 herramientas de escritura**

```typescript
// mcp-server/src/tools/write-tools.ts
import { z } from 'zod';
import { obtenerEstado, gastarTurnos, COSTOS_TURNOS } from '../mock-state.js';

export type HerramientaEscritura = {
  nombre: string;
  descripcion: string;
  parametros: z.ZodSchema;
  ejecutar: (params: unknown, token: string) => unknown;
};

function respuestaAccion<T>(
  turnosGastados: number, turnosRestantes: number,
  resultado: T, diaTemporada: number, sugerencias?: string[]
) {
  return { exito: true, turnosGastados, turnosRestantes, resultado, diaTemporada, ...(sugerencias ? { sugerencias } : {}) };
}

function respuestaError(error: string, turnosRestantes: number, diaTemporada: number) {
  return { exito: false, error, turnosRestantes, turnosGastados: 0, diaTemporada };
}

export const herramientasEscritura: HerramientaEscritura[] = [
  {
    nombre: 'build_building',
    descripcion: `Construye o mejora un edificio en una ciudad. Costo: ${COSTOS_TURNOS.construirEdificio} turnos.`,
    parametros: z.object({
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
        COSTOS_TURNOS.construirEdificio, gasto.turnosRestantes,
        { ciudadId: cityId, edificio: type, nivelAnterior: nivelActual, nivelNuevo },
        estado.diaTemporada,
        nivelNuevo >= 5 ? [`${type} nivel ${nivelNuevo} proporciona un bono de producción significativo.`] : undefined
      );
    },
  },
  {
    nombre: 'attack',
    descripcion: `Lanza un ataque contra una ciudad enemiga. Costo: ${COSTOS_TURNOS.ataqueRegionalMismaRegion}T misma región, ${COSTOS_TURNOS.ataqueRegionalAdyacente}T adyacente.`,
    parametros: z.object({
      heroId: z.string().describe('ID del héroe que lidera el ataque'),
      targetCityId: z.string().describe('ID de la ciudad objetivo'),
      regionType: z.enum(['misma_region', 'adyacente']).default('misma_region'),
    }),
    ejecutar: (params, token) => {
      const { heroId, targetCityId, regionType } = params as { heroId: string; targetCityId: string; regionType: string };
      const estado = obtenerEstado(token);
      const heroe = estado.heroes.find(h => h.id === heroId);
      if (!heroe) return respuestaError(`Héroe "${heroId}" no encontrado.`, estado.turnos, estado.diaTemporada);
      if (heroe.capturado) return respuestaError(`El héroe ${heroe.nombre} está capturado y no puede atacar.`, estado.turnos, estado.diaTemporada);

      const costo = regionType === 'adyacente' ? COSTOS_TURNOS.ataqueRegionalAdyacente : COSTOS_TURNOS.ataqueRegionalMismaRegion;
      const gasto = gastarTurnos(token, costo);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      // Resultado mock: victoria o derrota basado en nivel del héroe
      const victoria = heroe.nivel >= 2 || Math.random() > 0.4;
      const tropasPerdidasAtacante = victoria ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 400) + 100;
      const botin = victoria ? { oro: Math.floor(Math.random() * 1000) + 500, comida: Math.floor(Math.random() * 300) } : {};

      if (victoria && botin.oro) {
        estado.recursos.oro = (estado.recursos.oro ?? 0) + botin.oro;
      }

      return respuestaAccion(
        costo, gasto.turnosRestantes,
        { batallaId: `b_${Date.now()}`, resultado: victoria ? 'victoria' : 'derrota', tropasPerdidasAtacante, botin, heroeId: heroId, ciudadObjetivo: targetCityId },
        estado.diaTemporada,
        victoria ? ['Victoria registrada. Considera reforzar tus defensas antes del próximo ataque.'] : ['Derrota. Evalúa entrenar más tropas antes del siguiente intento.']
      );
    },
  },
  {
    nombre: 'move_troops',
    descripcion: `Mueve tropas entre ciudades o héroes. Costo: ${COSTOS_TURNOS.moverTropas} turno.`,
    parametros: z.object({
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
        COSTOS_TURNOS.moverTropas, gasto.turnosRestantes,
        { movimientoId: `mov_${Date.now()}`, desde: from, hacia: to, tropas: troops, llegaEn: new Date(Date.now() + 3600000).toISOString() },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'train_troops',
    descripcion: `Entrena (compra) tropas en una ciudad. Costo: ${COSTOS_TURNOS.comprarTropas} turnos.`,
    parametros: z.object({
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
      const costoOro = quantity * 10; // mock: 10 oro por tropa
      estado.recursos.oro = Math.max(0, (estado.recursos.oro ?? 0) - costoOro);

      return respuestaAccion(
        COSTOS_TURNOS.comprarTropas, gasto.turnosRestantes,
        { ciudadId: cityId, tipo: type, cantidadEntrenada: quantity, totalEnCiudad: ciudad.tropas[type], costoOro },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'move_hero',
    descripcion: `Mueve un héroe a otra región o ciudad. Costo: ${COSTOS_TURNOS.moverHeroe} turnos.`,
    parametros: z.object({
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
        COSTOS_TURNOS.moverHeroe, gasto.turnosRestantes,
        { heroeId, nombre: heroe.nombre, desde: ubicacionAnterior, hacia: destination, tiempoViaje: '1h' },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'do_quest',
    descripcion: `Envía un héroe a completar una quest. Costo: ${COSTOS_TURNOS.completarQuest} turnos.`,
    parametros: z.object({
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
        COSTOS_TURNOS.completarQuest, gasto.turnosRestantes,
        { heroeId, questId, recompensaOro, recompensaXP, nivelHeroe: heroe.nivel },
        estado.diaTemporada,
        ['Quest completada. El héroe ganó experiencia valiosa.']
      );
    },
  },
  {
    nombre: 'spy',
    descripcion: `Ejecuta una misión de espionaje. Regional: ${COSTOS_TURNOS.espionajeRegional}T, Reconquista: ${COSTOS_TURNOS.espionajeReconquista}T.`,
    parametros: z.object({
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
        costo, gasto.turnosRestantes,
        exito
          ? { exito: true, objetivo: targetId, intelObtenida: { tropasAproximadas: '2.100-2.500', edificiosDetectados: 4, heroePresente: true } }
          : { exito: false, objetivo: targetId, mensaje: 'El espía fue detectado.' },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'declare_war',
    descripcion: `Declara guerra a un clan enemigo. Costo: ${COSTOS_TURNOS.declararGuerra} turnos. ¡Decisión irreversible a corto plazo!`,
    parametros: z.object({
      targetClanId: z.string().describe('ID del clan objetivo'),
    }),
    ejecutar: (params, token) => {
      const { targetClanId } = params as { targetClanId: string };
      const estado = obtenerEstado(token);
      const gasto = gastarTurnos(token, COSTOS_TURNOS.declararGuerra);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      return respuestaAccion(
        COSTOS_TURNOS.declararGuerra, gasto.turnosRestantes,
        { guerraId: `war_${Date.now()}`, clanObjetivo: targetClanId, estado: 'guerra_declarada' },
        estado.diaTemporada,
        ['Guerra declarada. Refuerza tus ciudades fronterizas inmediatamente.']
      );
    },
  },
  {
    nombre: 'offer_trade',
    descripcion: `Publica una oferta en el mercado. Costo: ${COSTOS_TURNOS.comerciarOro} turno. Nota: maná y karma no son comerciables.`,
    parametros: z.object({
      resource: z.string().describe('Tipo de recurso a vender (no puede ser mana ni karma)'),
      quantity: z.number().int().min(1),
      pricePerUnit: z.number().positive(),
    }),
    ejecutar: (params, token) => {
      const { resource, quantity, pricePerUnit } = params as { resource: string; quantity: number; pricePerUnit: number };
      if (resource === 'mana' || resource === 'karma') {
        return respuestaError(`El ${resource} no es comerciable.`, obtenerEstado(token).turnos, obtenerEstado(token).diaTemporada);
      }
      const estado = obtenerEstado(token);
      if ((estado.recursos[resource] ?? 0) < quantity) {
        return respuestaError(`Recursos insuficientes. Tienes ${estado.recursos[resource] ?? 0} ${resource}.`, estado.turnos, estado.diaTemporada);
      }
      const gasto = gastarTurnos(token, COSTOS_TURNOS.comerciarOro);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      estado.recursos[resource] = (estado.recursos[resource] ?? 0) - quantity;

      return respuestaAccion(
        COSTOS_TURNOS.comerciarOro, gasto.turnosRestantes,
        { ofertaId: `off_${Date.now()}`, recurso: resource, cantidad: quantity, precioPorUnidad: pricePerUnit, precioTotal: quantity * pricePerUnit, expiraEn: new Date(Date.now() + 86400000).toISOString() },
        estado.diaTemporada
      );
    },
  },
  {
    nombre: 'found_city',
    descripcion: `Funda una nueva ciudad en el mapa. Costo: ${COSTOS_TURNOS.fundarCiudad} turnos.`,
    parametros: z.object({
      regionId: z.string().describe('ID de la región donde fundar la ciudad'),
      name: z.string().min(2).max(30).describe('Nombre de la nueva ciudad'),
    }),
    ejecutar: (params, token) => {
      const { regionId, name } = params as { regionId: string; name: string };
      const estado = obtenerEstado(token);
      const gasto = gastarTurnos(token, COSTOS_TURNOS.fundarCiudad);
      if (!gasto.ok) return respuestaError(gasto.error!, gasto.turnosRestantes, estado.diaTemporada);

      const nuevaCiudad = {
        id: `c_${Date.now()}`, nombre: name, tipoTerreno: 'Llanura',
        poblacion: 1000, felicidad: 100,
        edificios: [{ tipo: 'castillo', nivel: 1 }],
        tropas: {},
        produccionDiaria: { oro: 100, comida: 50 },
      };
      estado.ciudades.push(nuevaCiudad);

      return respuestaAccion(
        COSTOS_TURNOS.fundarCiudad, gasto.turnosRestantes,
        { ciudadId: nuevaCiudad.id, nombre: name, region: regionId, poblacionInicial: 1000, edificiosIniciales: ['castillo'] },
        estado.diaTemporada,
        ['Nueva ciudad fundada. Construye cultivos y un cuartel lo antes posible.']
      );
    },
  },
];
```

- [ ] **Step 2: Verificar compilación**

```bash
cd mcp-server && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd ..
git add mcp-server/src/tools/write-tools.ts
git commit -m "feat: implement 10 MCP write tools with turn costs and mock state"
```

---

### Task 5: Servidor principal y arranque

**Files:**
- Create: `mcp-server/src/index.ts`

- [ ] **Step 1: Crear el servidor MCP principal**

```typescript
// mcp-server/src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { herramientasLectura } from './tools/read-tools.js';
import { herramientasEscritura } from './tools/write-tools.js';

const servidor = new McpServer({
  name: 'empire-strike',
  version: '1.0.0',
});

// Token de autenticación mock — en producción vendrá en los headers
const TOKEN_DEMO = 'demo-token';

// Registrar herramientas de lectura
for (const herramienta of herramientasLectura) {
  servidor.tool(
    herramienta.nombre,
    herramienta.descripcion,
    herramienta.parametros,
    async (params) => {
      try {
        const resultado = herramienta.ejecutar(params, TOKEN_DEMO);
        return {
          content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: String(error) }) }],
          isError: true,
        };
      }
    }
  );
}

// Registrar herramientas de escritura
for (const herramienta of herramientasEscritura) {
  servidor.tool(
    herramienta.nombre,
    herramienta.descripcion,
    herramienta.parametros,
    async (params) => {
      try {
        const resultado = herramienta.ejecutar(params, TOKEN_DEMO);
        return {
          content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: String(error) }) }],
          isError: true,
        };
      }
    }
  );
}

// Arrancar servidor via stdio (estándar MCP)
async function main() {
  const transporte = new StdioServerTransport();
  await servidor.connect(transporte);
  console.error('Empire Strike MCP Server arrancado. Herramientas: 9 lectura + 10 escritura.');
}

main().catch(console.error);
```

- [ ] **Step 2: Compilar**

```bash
cd mcp-server && npm run build
```

Esperado: directorio `mcp-server/dist/` creado sin errores.

- [ ] **Step 3: Test rápido — arrancar el servidor**

```bash
cd mcp-server && echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

Esperado: respuesta JSON con `tools` listando las 19 herramientas (9 lectura + 10 escritura).

- [ ] **Step 4: Commit**

```bash
cd ..
git add mcp-server/src/index.ts mcp-server/dist/
git commit -m "feat: wire MCP server with all 19 tools, stdio transport"
```

---

### Task 6: Configuración para Claude Desktop / Claude Code

**Files:**
- Create: `mcp-server/README.md` (instrucciones de conexión)

- [ ] **Step 1: Crear instrucciones de conexión**

```markdown
<!-- mcp-server/README.md -->
# Empire Strike MCP Server

Servidor MCP para agentes IA que juegan Empire Strike.

## Arrancar el servidor

```bash
cd mcp-server && npm run build && node dist/index.js
```

## Conectar con Claude Desktop

Añadir a `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
o `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "empire-strike": {
      "command": "node",
      "args": ["C:/ruta/a/AgentES/mcp-server/dist/index.js"]
    }
  }
}
```

Reiniciar Claude Desktop. El agente verá las 19 herramientas del juego.

## Conectar con Claude Code

```bash
claude mcp add empire-strike node /ruta/absoluta/a/mcp-server/dist/index.js
```

## Herramientas disponibles

**Lectura (0T):** get_empire_state, get_city, get_hero, get_map, get_rankings, get_market, get_battle_log, get_action_costs, get_prison

**Escritura (cuestan turnos):** build_building (2T), attack (8T/9T), move_troops (1T), train_troops (5T), move_hero (2T), do_quest (5T), spy (4T/10T), declare_war (30T), offer_trade (1T), found_city (20T)

## Ejemplo de prompt para un agente

> Eres un general del Imperio de las Sombras en Empire Strike. Tienes 100 turnos hoy. Tu objetivo es subir al top 10 del ranking antes del día 60. Usa get_empire_state para ver tu situación actual y luego toma las mejores decisiones estratégicas con los turnos disponibles.
```

- [ ] **Step 2: Commit final**

```bash
git add mcp-server/README.md
git commit -m "docs: add MCP server connection instructions for Claude Desktop and Claude Code"
```

---

## Verificación Final del Plan 3

Tras completar las 6 tareas:

1. `cd mcp-server && npm run build` → compila sin errores
2. `echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js` → lista 19 herramientas
3. Conectar a Claude Desktop o Claude Code via la config → Claude ve las herramientas
4. Probar con prompt: "Usa get_empire_state para ver el estado de mi imperio" → retorna JSON válido
5. Probar con prompt: "Construye una armería en mi ciudad principal" → descuenta 2T, retorna confirmación

**Integración completa:** Los 3 planes juntos producen el juego Empire Strike con UI completa en español + MCP server funcional para agentes IA.
