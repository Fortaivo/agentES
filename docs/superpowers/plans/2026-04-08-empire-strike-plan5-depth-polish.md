# Empire Strike — Plan 5: Profundidad y Pulido

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enriquecer las páginas delgadas (Alianzas, Conquistas, Ejercito), añadir modales de detalle de edificios, una página de historial de batallas completo, y la motivación de héroes. Completar la UI para que cada sección tenga contenido suficiente para el backend.

**Architecture:** Cada tarea es un componente o página independiente. Sin dependencias entre tareas.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React  
**Prerequisito:** Planes 1–4 completados

---

### Task 1: Alianzas — Página completa

La página actual solo muestra 3 noticias en una lista. Necesita: estadísticas globales, filtros, y un panel de diplomacia activa.

**Files:**
- Modify: `src/pages/Alianzas.tsx`

- [ ] **Step 1: Reemplazar con versión completa**

```tsx
// src/pages/Alianzas.tsx
import React, { useState } from 'react';
import { Users2, Shield, Sword, TrendingUp, Filter } from 'lucide-react';

type TipoEvento = 'alianza_formada' | 'guerra_declarada' | 'paz' | 'traicion' | 'clan_creado';
type FiltroEvento = 'todos' | TipoEvento;

interface EventoDiplomatico {
  id: string;
  tipo: TipoEvento;
  texto: string;
  hace: string;
  clan1: string;
  clan2?: string;
  impactoRanking?: number;
}

const EVENTOS_MOCK: EventoDiplomatico[] = [
  { id: 'e1', tipo: 'alianza_formada',  texto: '[LGB] Los Guardianes del Bosque han formado alianza con [RC] Reino de Cristal', hace: 'Hace 2 días', clan1: 'LGB', clan2: 'RC', impactoRanking: 0 },
  { id: 'e2', tipo: 'guerra_declarada', texto: '[IS] Imperio de las Sombras ha declarado guerra a [LGB] Los Guardianes del Bosque', hace: 'Hace 3 días', clan1: 'IS', clan2: 'LGB', impactoRanking: -50 },
  { id: 'e3', tipo: 'paz',              texto: '[MG] Montañas Grises y [LC] Las Cataratas han firmado la paz', hace: 'Hace 5 días', clan1: 'MG', clan2: 'LC', impactoRanking: 20 },
  { id: 'e4', tipo: 'clan_creado',      texto: '[NE] Nueva Élite ha sido fundado por DragonLord', hace: 'Hace 6 días', clan1: 'NE' },
  { id: 'e5', tipo: 'traicion',         texto: '[MG] Montañas Grises ha expulsado a "Valle Olvidado" del clan', hace: 'Hace 7 días', clan1: 'MG', impactoRanking: -10 },
  { id: 'e6', tipo: 'alianza_formada',  texto: '[MG] Montañas Grises y [NE] Nueva Élite han sellado una alianza militar', hace: 'Hace 8 días', clan1: 'MG', clan2: 'NE', impactoRanking: 0 },
  { id: 'e7', tipo: 'guerra_declarada', texto: '[RC] Reino de Cristal ha declarado guerra a [IS] Imperio de las Sombras', hace: 'Hace 10 días', clan1: 'RC', clan2: 'IS', impactoRanking: -80 },
];

const CONFIG_TIPO: Record<TipoEvento, { icono: string; color: string; label: string }> = {
  alianza_formada:  { icono: '🤝', color: 'bg-blue-50 border-blue-200',  label: 'Alianza' },
  guerra_declarada: { icono: '⚔️', color: 'bg-red-50 border-red-200',    label: 'Guerra' },
  paz:              { icono: '☮️', color: 'bg-green-50 border-green-200', label: 'Paz' },
  traicion:         { icono: '🗡️', color: 'bg-orange-50 border-orange-200', label: 'Traición' },
  clan_creado:      { icono: '🏰', color: 'bg-purple-50 border-purple-200', label: 'Clan nuevo' },
};

const ESTADO_DIPLOMATICO = [
  { clan: 'Los Guardianes del Bosque', acronimo: 'LGB', estado: 'Aliado', color: 'text-blue-700 bg-blue-50 border-blue-200', puntos: 45230 },
  { clan: 'Imperio de las Sombras',    acronimo: 'IS',  estado: 'En guerra', color: 'text-red-700 bg-red-50 border-red-200', puntos: 38900 },
  { clan: 'Montañas Grises',           acronimo: 'MG',  estado: 'Neutral',   color: 'text-gray-700 bg-gray-50 border-gray-200', puntos: 29100 },
  { clan: 'Nueva Élite',               acronimo: 'NE',  estado: 'Neutral',   color: 'text-gray-700 bg-gray-50 border-gray-200', puntos: 12500 },
];

const Alianzas: React.FC = () => {
  const [filtro, setFiltro] = useState<FiltroEvento>('todos');

  const eventosFiltrados = filtro === 'todos'
    ? EVENTOS_MOCK
    : EVENTOS_MOCK.filter(e => e.tipo === filtro);

  const conteoTipos = EVENTOS_MOCK.reduce((acc, e) => {
    acc[e.tipo] = (acc[e.tipo] ?? 0) + 1;
    return acc;
  }, {} as Record<TipoEvento, number>);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Users2 className="text-yellow-600" /> Últimas Alianzas y Diplomacia
      </h1>

      {/* Estadísticas globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Alianzas activas',  valor: 3,  icono: '🤝', color: 'text-blue-700' },
          { label: 'Guerras en curso',  valor: 2,  icono: '⚔️', color: 'text-red-700' },
          { label: 'Clanes activos',    valor: 12, icono: '🏰', color: 'text-purple-700' },
          { label: 'Paces firmadas',    valor: 1,  icono: '☮️', color: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className="bg-amber-50 rounded-lg border border-yellow-400 p-3 text-center">
            <div className="text-2xl">{s.icono}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.valor}</div>
            <div className="text-xs text-amber-600 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Noticias */}
        <div className="lg:col-span-2 space-y-3">
          {/* Filtros */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-amber-500" />
            {(['todos', 'alianza_formada', 'guerra_declarada', 'paz', 'traicion'] as FiltroEvento[]).map(f => (
              <button key={f} onClick={() => setFiltro(f)}
                className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                  filtro === f ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}>
                {f === 'todos' ? `Todos (${EVENTOS_MOCK.length})` :
                 f === 'alianza_formada' ? `🤝 Alianzas (${conteoTipos.alianza_formada ?? 0})` :
                 f === 'guerra_declarada' ? `⚔️ Guerras (${conteoTipos.guerra_declarada ?? 0})` :
                 f === 'paz' ? `☮️ Paces (${conteoTipos.paz ?? 0})` :
                 `🗡️ Traiciones (${conteoTipos.traicion ?? 0})`}
              </button>
            ))}
          </div>

          {eventosFiltrados.map(ev => {
            const cfg = CONFIG_TIPO[ev.tipo];
            return (
              <div key={ev.id} className={`p-4 rounded-lg border ${cfg.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{cfg.icono}</span>
                  <div className="flex-1">
                    <p className="text-amber-800 text-sm">{ev.texto}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <p className="text-amber-500 text-xs">{ev.hace}</p>
                      <span className={`text-xs px-2 py-0.5 rounded border ${cfg.color}`}>{cfg.label}</span>
                      {ev.impactoRanking !== undefined && ev.impactoRanking !== 0 && (
                        <span className={`text-xs font-medium ${ev.impactoRanking > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {ev.impactoRanking > 0 ? '+' : ''}{ev.impactoRanking} pts ranking
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado diplomático con clanes */}
        <div className="space-y-3">
          <h2 className="font-bold text-amber-800 text-lg flex items-center gap-2"><Shield size={16} /> Tu diplomacia</h2>
          {ESTADO_DIPLOMATICO.map(d => (
            <div key={d.acronimo} className={`p-3 rounded-lg border ${d.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm">[{d.acronimo}]</span>
                  <span className="text-xs text-amber-600 ml-1 truncate block">{d.clan}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold">{d.estado}</div>
                  <div className="text-xs opacity-70">{d.puntos.toLocaleString()} pts</div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-amber-50 rounded-lg border border-yellow-400 p-3 text-xs text-amber-600 text-center">
            Gestiona la diplomacia desde la página de <strong>Clanes</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alianzas;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Alianzas.tsx
git commit -m "feat: expand Alianzas page with stats, filters, and diplomatic status panel"
```

---

### Task 2: Conquistas — Historial de batallas completo

**Files:**
- Modify: `src/pages/Conquistas.tsx`

- [ ] **Step 1: Reemplazar con versión completa**

```tsx
// src/pages/Conquistas.tsx
import React, { useState } from 'react';
import { Trophy, Sword, Shield, TrendingUp, Search } from 'lucide-react';

type TipoBatalla = 'victoria_ataque' | 'derrota_ataque' | 'victoria_defensa' | 'derrota_defensa';
type FiltroConquista = 'todas' | 'victorias' | 'derrotas' | 'defensa';

interface EntradaHistorial {
  id: string;
  tipo: TipoBatalla;
  nombreEnemigo: string;
  ciudadObjetivo: string;
  resultado: string;
  botin: { oro?: number; comida?: number; madera?: number };
  bajasPropias: number;
  bajasEnemigas: number;
  hace: string;
  heroeUsado?: string;
  esAgente: boolean;
}

const HISTORIAL_MOCK: EntradaHistorial[] = [
  { id: 'b1', tipo: 'victoria_ataque',  nombreEnemigo: 'Valle Olvidado',      ciudadObjetivo: 'Aldea Perdida',     resultado: 'Victoria', botin: { oro: 1200, comida: 500 }, bajasPropias: 45,  bajasEnemigas: 320, hace: 'Hace 6h',   heroeUsado: 'Doghell N1', esAgente: false },
  { id: 'b2', tipo: 'victoria_defensa', nombreEnemigo: 'Imp. de las Sombras', ciudadObjetivo: 'Rosvo',             resultado: 'Defensa',  botin: {},                         bajasPropias: 120, bajasEnemigas: 650, hace: 'Hace 1d',   heroeUsado: undefined,    esAgente: true  },
  { id: 'b3', tipo: 'victoria_ataque',  nombreEnemigo: 'Costa del Sur',       ciudadObjetivo: 'Puerto Brumoso',    resultado: 'Victoria', botin: { oro: 800, madera: 300 }, bajasPropias: 80,  bajasEnemigas: 210, hace: 'Hace 2d',   heroeUsado: 'Doghell N1', esAgente: false },
  { id: 'b4', tipo: 'derrota_ataque',   nombreEnemigo: 'Montañas Grises',     ciudadObjetivo: 'Fortaleza Enana',  resultado: 'Derrota',  botin: {},                         bajasPropias: 820, bajasEnemigas: 150, hace: 'Hace 3d',   heroeUsado: 'Doghell N1', esAgente: false },
  { id: 'b5', tipo: 'derrota_defensa',  nombreEnemigo: 'Reino de Acero',      ciudadObjetivo: 'Doghell',           resultado: 'Saqueo',   botin: {},                         bajasPropias: 200, bajasEnemigas: 50,  hace: 'Hace 5d',   heroeUsado: undefined,    esAgente: false },
  { id: 'b6', tipo: 'victoria_ataque',  nombreEnemigo: 'Tierras del Norte',   ciudadObjetivo: 'Ciudad del Norte',  resultado: 'Victoria', botin: { oro: 2100, comida: 800 }, bajasPropias: 30,  bajasEnemigas: 480, hace: 'Hace 6d',   heroeUsado: 'Doghell N1', esAgente: false },
];

const CONFIG_TIPO: Record<TipoBatalla, { icono: string; color: string; etiqueta: string }> = {
  victoria_ataque:  { icono: '✅', color: 'bg-green-50 border-green-200',   etiqueta: 'Victoria (ataque)' },
  derrota_ataque:   { icono: '❌', color: 'bg-red-50 border-red-200',       etiqueta: 'Derrota (ataque)' },
  victoria_defensa: { icono: '🛡️', color: 'bg-blue-50 border-blue-200',    etiqueta: 'Victoria (defensa)' },
  derrota_defensa:  { icono: '💀', color: 'bg-orange-50 border-orange-200', etiqueta: 'Derrota (defensa)' },
};

const Conquistas: React.FC = () => {
  const [filtro, setFiltro] = useState<FiltroConquista>('todas');
  const [busqueda, setBusqueda] = useState('');

  const batallasVictorias  = HISTORIAL_MOCK.filter(b => b.tipo.startsWith('victoria')).length;
  const batallasDerrotas   = HISTORIAL_MOCK.filter(b => b.tipo.startsWith('derrota')).length;
  const totalBajasPropias  = HISTORIAL_MOCK.reduce((s, b) => s + b.bajasPropias, 0);
  const totalBajasEnemigas = HISTORIAL_MOCK.reduce((s, b) => s + b.bajasEnemigas, 0);
  const totalBotin         = HISTORIAL_MOCK.reduce((s, b) => s + (b.botin.oro ?? 0), 0);

  const filtradas = HISTORIAL_MOCK
    .filter(b => {
      if (filtro === 'victorias') return b.tipo.startsWith('victoria');
      if (filtro === 'derrotas')  return b.tipo.startsWith('derrota');
      if (filtro === 'defensa')   return b.tipo.endsWith('defensa');
      return true;
    })
    .filter(b =>
      busqueda === '' ||
      b.nombreEnemigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      b.ciudadObjetivo.toLowerCase().includes(busqueda.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Trophy className="text-yellow-600" /> Historial de Conquistas
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Batallas',   valor: HISTORIAL_MOCK.length, icono: <Sword size={16} />,     color: 'text-amber-700' },
          { label: 'Victorias',  valor: batallasVictorias,     icono: '✅',                    color: 'text-green-700' },
          { label: 'Derrotas',   valor: batallasDerrotas,      icono: '❌',                    color: 'text-red-700' },
          { label: 'Botín oro',  valor: `${totalBotin.toLocaleString()}`, icono: '🪙',          color: 'text-yellow-700' },
          { label: 'Win rate',   valor: `${Math.round((batallasVictorias/HISTORIAL_MOCK.length)*100)}%`, icono: <TrendingUp size={16} />, color: 'text-blue-700' },
        ].map((s, i) => (
          <div key={i} className="bg-amber-50 rounded-lg border border-yellow-400 p-3 text-center">
            <div className="text-lg">{s.icono}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.valor}</div>
            <div className="text-xs text-amber-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bajas totales */}
      <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-700">{totalBajasPropias.toLocaleString()}</div>
          <div className="text-xs text-amber-600">Tus bajas totales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-700">{totalBajasEnemigas.toLocaleString()}</div>
          <div className="text-xs text-amber-600">Bajas enemigas causadas</div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
          <input
            type="text"
            placeholder="Buscar por enemigo o ciudad…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-yellow-400 rounded-lg text-sm bg-amber-50 text-amber-800 focus:outline-none focus:border-yellow-600"
          />
        </div>
        <div className="flex gap-2">
          {(['todas', 'victorias', 'derrotas', 'defensa'] as FiltroConquista[]).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`text-xs px-3 py-1.5 rounded-full capitalize transition-all ${
                filtro === f ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Historial */}
      <div className="space-y-3">
        {filtradas.map(b => {
          const cfg = CONFIG_TIPO[b.tipo];
          return (
            <div key={b.id} className={`p-4 rounded-lg border ${cfg.color}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{cfg.icono}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-amber-800">{b.ciudadObjetivo}</span>
                      <span className="text-amber-500 text-sm">vs {b.nombreEnemigo}</span>
                      {b.esAgente && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">🤖 IA</span>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-amber-600 flex-wrap">
                      {b.heroeUsado && <span>⚔️ {b.heroeUsado}</span>}
                      <span className="text-blue-600">⬇️ Tus bajas: {b.bajasPropias}</span>
                      <span className="text-red-600">💀 Enemigas: {b.bajasEnemigas}</span>
                      {Object.keys(b.botin).length > 0 && (
                        <span className="text-green-600">
                          Botín: {b.botin.oro ? `+${b.botin.oro.toLocaleString()}🪙` : ''}
                          {b.botin.comida ? ` +${b.botin.comida}🌾` : ''}
                          {b.botin.madera ? ` +${b.botin.madera}🪵` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded border ${cfg.color}`}>{cfg.etiqueta}</span>
                  <div className="text-xs text-amber-500 mt-1">{b.hace}</div>
                </div>
              </div>
            </div>
          );
        })}
        {filtradas.length === 0 && (
          <div className="text-center py-8 text-amber-500">
            <Trophy size={32} className="mx-auto mb-2 text-amber-300" />
            <p>No hay batallas que coincidan con el filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conquistas;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Conquistas.tsx
git commit -m "feat: expand Conquistas page with full battle history, stats, filters, and loot tracking"
```

---

### Task 3: Ejercito — Vista detallada del ejército

**Files:**
- Modify: `src/pages/Ejercito.tsx`

- [ ] **Step 1: Reemplazar con versión completa**

```tsx
// src/pages/Ejercito.tsx
import React, { useState } from 'react';
import { Shield, Users, Sword, Plus } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

interface StackTropas {
  tipo: string;
  nivel: number;
  raza: string;
  cantidad: number;
  ubicacion: string;
  tipoUbicacion: 'ciudad' | 'heroe' | 'movimiento';
  enMovimiento?: boolean;
}

const EJERCITO_MOCK: StackTropas[] = [
  { tipo: 'Guerreros Elfos',      nivel: 1, raza: 'Elfos', cantidad: 850,  ubicacion: 'Rosvo',          tipoUbicacion: 'ciudad' },
  { tipo: 'Arqueros Elfos',       nivel: 2, raza: 'Elfos', cantidad: 400,  ubicacion: 'Rosvo',          tipoUbicacion: 'ciudad' },
  { tipo: 'Centauros',            nivel: 3, raza: 'Elfos', cantidad: 250,  ubicacion: 'Rosvo',          tipoUbicacion: 'ciudad' },
  { tipo: 'Exploradores Elfos',   nivel: 4, raza: 'Elfos', cantidad: 50,   ubicacion: 'Rosvo',          tipoUbicacion: 'ciudad' },
  { tipo: 'Guerreros Elfos',      nivel: 1, raza: 'Elfos', cantidad: 300,  ubicacion: 'Doghell',        tipoUbicacion: 'ciudad' },
  { tipo: 'Arqueros Elfos',       nivel: 2, raza: 'Elfos', cantidad: 240,  ubicacion: 'Doghell',        tipoUbicacion: 'ciudad' },
  { tipo: 'Guerreros Elfos',      nivel: 1, raza: 'Elfos', cantidad: 500,  ubicacion: 'Doghell N1',     tipoUbicacion: 'heroe' },
];

const COLOR_NIVEL: Record<number, string> = {
  1: 'bg-gray-100 text-gray-700', 2: 'bg-green-100 text-green-700',
  3: 'bg-blue-100 text-blue-700', 4: 'bg-purple-100 text-purple-700',
};

const Ejercito: React.FC = () => {
  const [agrupacion, setAgrupacion] = useState<'tipo' | 'ubicacion'>('ubicacion');

  const totalTropas = EJERCITO_MOCK.reduce((s, t) => s + t.cantidad, 0);
  const potencialTotal = EJERCITO_MOCK.reduce((s, t) => s + t.cantidad * t.nivel, 0);

  const porUbicacion = EJERCITO_MOCK.reduce((acc, t) => {
    if (!acc[t.ubicacion]) acc[t.ubicacion] = [];
    acc[t.ubicacion].push(t);
    return acc;
  }, {} as Record<string, StackTropas[]>);

  const porTipo = EJERCITO_MOCK.reduce((acc, t) => {
    const key = `N${t.nivel} ${t.tipo}`;
    if (!acc[key]) acc[key] = { total: 0, nivel: t.nivel, tipo: t.tipo, raza: t.raza, ubicaciones: [] };
    acc[key].total += t.cantidad;
    acc[key].ubicaciones.push({ ubicacion: t.ubicacion, cantidad: t.cantidad });
    return acc;
  }, {} as Record<string, { total: number; nivel: number; tipo: string; raza: string; ubicaciones: { ubicacion: string; cantidad: number }[] }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Shield className="text-yellow-600" /> Mi Ejército
        </h1>
        <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={14} /> Entrenar tropas
          <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded ml-1">{COSTOS_TURNOS.comprarTropas}T</span>
        </button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tropas totales',   valor: totalTropas.toLocaleString(),   icono: <Users size={20} className="text-amber-600" /> },
          { label: 'Potencial',        valor: potencialTotal.toLocaleString(), icono: <Sword size={20} className="text-red-600" /> },
          { label: 'Tipos distintos',  valor: Object.keys(porTipo).length,     icono: '🎖️' },
          { label: 'Ubicaciones',      valor: Object.keys(porUbicacion).length, icono: '📍' },
        ].map((s, i) => (
          <div key={i} className="bg-amber-50 rounded-lg border border-yellow-400 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">{s.icono}</div>
            <div>
              <div className="text-xl font-bold text-amber-800">{s.valor}</div>
              <div className="text-amber-600 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle agrupación */}
      <div className="flex gap-2">
        <button onClick={() => setAgrupacion('ubicacion')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${agrupacion === 'ubicacion' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
          📍 Por ubicación
        </button>
        <button onClick={() => setAgrupacion('tipo')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${agrupacion === 'tipo' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
          🎖️ Por tipo
        </button>
      </div>

      {agrupacion === 'ubicacion' && (
        <div className="space-y-4">
          {Object.entries(porUbicacion).map(([ubicacion, tropas]) => {
            const totalUbicacion = tropas.reduce((s, t) => s + t.cantidad, 0);
            const esHeroe = tropas[0]?.tipoUbicacion === 'heroe';
            return (
              <div key={ubicacion} className="bg-amber-50 rounded-lg border border-yellow-400 overflow-hidden">
                <div className={`px-4 py-2 flex items-center justify-between ${esHeroe ? 'bg-purple-100' : 'bg-amber-100'}`}>
                  <span className="font-bold text-amber-800 flex items-center gap-2">
                    {esHeroe ? '⚔️' : '🏙️'} {ubicacion}
                    <span className="text-xs text-amber-500 font-normal">{esHeroe ? '(Héroe)' : '(Ciudad)'}</span>
                  </span>
                  <span className="text-amber-700 text-sm font-semibold">{totalUbicacion.toLocaleString()} tropas</span>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {tropas.map((t, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                        <td className="p-2 pl-4 font-medium text-amber-800">N{t.nivel} {t.tipo}</td>
                        <td className="p-2 text-amber-600 text-xs">{t.raza}</td>
                        <td className="p-2 text-right font-bold text-amber-800">{t.cantidad.toLocaleString()}</td>
                        <td className="p-2 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded ${COLOR_NIVEL[t.nivel] ?? 'bg-gray-100 text-gray-700'}`}>
                            N{t.nivel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {agrupacion === 'tipo' && (
        <div className="space-y-2">
          {Object.entries(porTipo)
            .sort((a, b) => b[1].nivel - a[1].nivel || b[1].total - a[1].total)
            .map(([key, data]) => (
              <div key={key} className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${COLOR_NIVEL[data.nivel] ?? 'bg-gray-100 text-gray-700'}`}>N{data.nivel}</span>
                    <div>
                      <div className="font-bold text-amber-800">{data.tipo}</div>
                      <div className="text-xs text-amber-500">{data.raza}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-800 text-lg">{data.total.toLocaleString()}</div>
                    <div className="text-xs text-amber-500 flex gap-2">
                      {data.ubicaciones.map((u, i) => (
                        <span key={i}>{u.ubicacion}: {u.cantidad}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-amber-200 rounded-full h-1.5">
                  <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${(data.total / totalTropas) * 100}%` }} />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Ejercito;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Ejercito.tsx
git commit -m "feat: expand Ejercito page with grouped views, stats, and location/type toggle"
```

---

### Task 4: Prision — Gestión completa de cautivos y rescates

**Files:**
- Modify: `src/pages/Prision.tsx`

- [ ] **Step 1: Reemplazar con versión completa**

```tsx
// src/pages/Prision.tsx
import React, { useState } from 'react';
import { Lock, DollarSign, UserPlus, AlertTriangle } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

interface HeroeCautivo {
  id: string;
  nombre: string;
  clase: string;
  nivel: number;
  imperio: string;
  capturadoEn: string;
  rescate: number;
  diasCautivo: number;
}

interface MiHeroeCapturado {
  id: string;
  nombre: string;
  clase: string;
  nivel: number;
  captor: string;
  rescatePedido: number;
  diasCautivo: number;
}

const CAUTIVOS_MOCK: HeroeCautivo[] = [
  { id: 'c1', nombre: 'Jasbra N3', clase: 'Mago', nivel: 3, imperio: 'Montañas Grises', capturadoEn: 'Batalla de Pico Frío', rescate: 50000, diasCautivo: 2 },
  { id: 'c2', nombre: 'Thorn N2', clase: 'Guerrero', nivel: 2, imperio: 'Costa del Sur', capturadoEn: 'Asedio de Puerto Brumoso', rescate: 25000, diasCautivo: 5 },
];

const MIS_CAPTURADOS_MOCK: MiHeroeCapturado[] = [];

const Prision: React.FC = () => {
  const [cautivos, setCautivos] = useState<HeroeCautivo[]>(CAUTIVOS_MOCK);
  const [rescateEditando, setRescateEditando] = useState<string | null>(null);
  const [nuevoRescate, setNuevoRescate] = useState('');
  const [reclutando, setReclutando] = useState<string | null>(null);

  const actualizarRescate = (id: string) => {
    const valor = parseInt(nuevoRescate);
    if (isNaN(valor) || valor < 0) return;
    setCautivos(prev => prev.map(c => c.id === id ? { ...c, rescate: valor } : c));
    setRescateEditando(null);
    setNuevoRescate('');
  };

  const reclutar = (id: string) => {
    setReclutando(id);
    setTimeout(() => {
      setCautivos(prev => prev.filter(c => c.id !== id));
      setReclutando(null);
    }, 1000);
  };

  const liberar = (id: string) => {
    setCautivos(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Lock className="text-yellow-600" /> Prisión
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Prisioneros',      valor: cautivos.length,          icono: '🔒' },
          { label: 'Rescate total',    valor: `${cautivos.reduce((s,c) => s+c.rescate,0).toLocaleString()} oro`, icono: '💰' },
          { label: 'Tus capturados',   valor: MIS_CAPTURADOS_MOCK.length, icono: '⚠️' },
        ].map(s => (
          <div key={s.label} className="bg-amber-50 rounded-lg border border-yellow-400 p-4 text-center">
            <div className="text-2xl">{s.icono}</div>
            <div className="text-xl font-bold text-amber-800">{s.valor}</div>
            <div className="text-xs text-amber-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Héroes capturados */}
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
          <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
            <Lock size={16} /> Héroes capturados ({cautivos.length})
          </h2>
          <div className="space-y-3">
            {cautivos.length === 0 && (
              <p className="text-center text-amber-600 py-4">No tienes prisioneros.</p>
            )}
            {cautivos.map(c => (
              <div key={c.id} className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-bold text-amber-800">{c.nombre}</div>
                    <div className="text-xs text-amber-600">{c.clase} Nv.{c.nivel} · {c.imperio}</div>
                    <div className="text-xs text-amber-500 mt-0.5">
                      Capturado en: {c.capturadoEn} · hace {c.diasCautivo}d
                    </div>
                  </div>
                  <div className="text-right">
                    {rescateEditando === c.id ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          value={nuevoRescate}
                          onChange={e => setNuevoRescate(e.target.value)}
                          className="w-24 border border-yellow-400 rounded px-2 py-1 text-xs text-amber-800"
                          placeholder="oro…"
                        />
                        <button onClick={() => actualizarRescate(c.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">✓</button>
                        <button onClick={() => setRescateEditando(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setRescateEditando(c.id); setNuevoRescate(String(c.rescate)); }}
                        className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
                      >
                        <DollarSign size={12} /> {c.rescate.toLocaleString()} oro
                        <span className="text-amber-400">(editar)</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => reclutar(c.id)}
                    disabled={reclutando === c.id}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-1.5 rounded text-sm flex items-center justify-center gap-1"
                  >
                    <UserPlus size={12} />
                    {reclutando === c.id ? 'Reclutando…' : 'Reclutar'}
                    <span className="bg-purple-700 text-purple-200 text-xs px-1 rounded">{COSTOS_TURNOS.reclutarHeroeCapturado}T</span>
                  </button>
                  <button
                    onClick={() => liberar(c.id)}
                    className="flex-1 bg-white hover:bg-amber-50 border border-yellow-400 text-amber-700 py-1.5 rounded text-sm"
                  >
                    Liberar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tus héroes cautivos */}
        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-600" /> Tus héroes cautivos
          </h2>
          {MIS_CAPTURADOS_MOCK.length === 0 ? (
            <div className="text-center py-8 text-amber-600">
              <Lock size={32} className="mx-auto mb-2 text-amber-300" />
              <p>Ninguno de tus héroes está capturado.</p>
              <p className="text-xs text-amber-500 mt-1">Si un héroe cae en batalla, aparecerá aquí.</p>
            </div>
          ) : (
            MIS_CAPTURADOS_MOCK.map(h => (
              <div key={h.id} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                <div className="font-bold text-red-800">{h.nombre}</div>
                <div className="text-xs text-red-600">{h.clase} Nv.{h.nivel} · Captor: {h.captor}</div>
                <div className="text-xs text-red-500 mt-1">Rescate pedido: {h.rescatePedido.toLocaleString()} oro</div>
                <button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm">
                  Pagar rescate ({h.rescatePedido.toLocaleString()} oro)
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Prision;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Prision.tsx
git commit -m "feat: expand Prision page with ransom editing, recruit action, and prisoner stats"
```

---

### Task 5: Cities — Modal de detalle de edificio

Cuando el jugador hace clic en un edificio, debe ver sus efectos actuales, el costo de mejora y la información de producción.

**Files:**
- Modify: `src/pages/Cities.tsx`

- [ ] **Step 1: Añadir estado del modal y datos de efectos por edificio**

En `Cities.tsx`, añadir estos datos y el modal al inicio del componente:

```tsx
// Datos de efectos por tipo de edificio (añadir antes del componente Cities)
const EFECTOS_EDIFICIO: Partial<Record<TipoEdificio, { efecto: string; costoNivel: { oro: number; madera?: number; piedra?: number } }>> = {
  castillo:    { efecto: 'Genera más tropas cada día',           costoNivel: { oro: 1000, madera: 200 } },
  muralla:     { efecto: 'Aumenta la defensa de las tropas',     costoNivel: { oro: 800,  piedra: 300 } },
  armeria:     { efecto: 'Aumenta el daño de la milicia al defender', costoNivel: { oro: 900, madera: 150 } },
  foso:        { efecto: 'Aumenta velocidad y posibilidad de atacar primero', costoNivel: { oro: 700, madera: 100 } },
  cuartel:     { efecto: 'Reduce corrupción, aumenta límite de tropas', costoNivel: { oro: 1200, piedra: 200 } },
  mina_oro:    { efecto: 'Aumenta producción de oro, reduce higiene', costoNivel: { oro: 500, madera: 100 } },
  torre_magica: { efecto: 'Aumenta cultura y producción de maná', costoNivel: { oro: 1500, piedra: 400 } },
  universidad: { efecto: 'Aumenta cultura',                      costoNivel: { oro: 2000, madera: 500 } },
};
```

Añadir estado del modal en el componente:

```tsx
const [edificioDetalle, setEdificioDetalle] = useState<Edificio | null>(null);
```

En la lista de edificios, cambiar el botón "Mejorar" para también abrir el modal al hacer clic en el nombre:

```tsx
// Cada fila de edificio:
<div
  key={e.id}
  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
    e.enConstruccion ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-gray-200 hover:border-yellow-300'
  }`}
  onClick={() => setEdificioDetalle(e)}
>
```

Añadir el modal al final del JSX del componente:

```tsx
{/* Modal detalle de edificio */}
{edificioDetalle && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setEdificioDetalle(null)}>
    <div className="bg-white rounded-xl border-2 border-yellow-500 p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-amber-800">{NOMBRES_EDIFICIOS[edificioDetalle.tipo]}</h3>
        <button onClick={() => setEdificioDetalle(null)} className="text-amber-400 hover:text-amber-700 text-xl">✕</button>
      </div>
      
      <div className="flex gap-2 mb-4">
        {Array.from({ length: edificioDetalle.nivelMaximo }).map((_, i) => (
          <div key={i} className={`flex-1 h-3 rounded ${i < edificioDetalle.nivel ? 'bg-amber-500' : 'bg-amber-100'}`} />
        ))}
      </div>
      <p className="text-sm text-amber-600 mb-1">Nivel {edificioDetalle.nivel} / {edificioDetalle.nivelMaximo}</p>
      
      {EFECTOS_EDIFICIO[edificioDetalle.tipo] && (
        <div className="bg-amber-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-amber-800 mb-1">📋 Efecto</p>
          <p className="text-sm text-amber-700">{EFECTOS_EDIFICIO[edificioDetalle.tipo]!.efecto}</p>
        </div>
      )}
      
      {edificioDetalle.enConstruccion ? (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-700 flex items-center gap-2 mb-4">
          ⚙️ En construcción...
          {edificioDetalle.construccionTerminaEn && (
            <span className="text-xs">Termina: {new Date(edificioDetalle.construccionTerminaEn).toLocaleTimeString('es')}</span>
          )}
        </div>
      ) : edificioDetalle.nivel < edificioDetalle.nivelMaximo ? (
        <div className="space-y-3">
          {EFECTOS_EDIFICIO[edificioDetalle.tipo] && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-700 mb-1">Coste para nivel {edificioDetalle.nivel + 1}:</p>
              <div className="flex gap-3 text-gray-600">
                <span>🪙 {EFECTOS_EDIFICIO[edificioDetalle.tipo]!.costoNivel.oro.toLocaleString()} oro</span>
                {EFECTOS_EDIFICIO[edificioDetalle.tipo]!.costoNivel.madera && (
                  <span>🪵 {EFECTOS_EDIFICIO[edificioDetalle.tipo]!.costoNivel.madera} madera</span>
                )}
                {EFECTOS_EDIFICIO[edificioDetalle.tipo]!.costoNivel.piedra && (
                  <span>🪨 {EFECTOS_EDIFICIO[edificioDetalle.tipo]!.costoNivel.piedra} piedra</span>
                )}
              </div>
            </div>
          )}
          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
            Mejorar a nivel {edificioDetalle.nivel + 1}
            <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">{COSTOS_TURNOS.construirEdificio}T</span>
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-700 text-center">
          ✅ Nivel máximo alcanzado
        </div>
      )}
    </div>
  </div>
)}
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Cities.tsx
git commit -m "feat: add building detail modal with effects, upgrade costs and construction status"
```

---

### Task 6: Heroes — Sistema de motivación de héroes

El wiki dice: "a partir del nivel 5, los héroes necesitan un mínimo de tropas (~1500 por nivel) para estar motivados; sin motivación -60% ataques y -50% daño."

**Files:**
- Modify: `src/pages/Heroes.tsx`

- [ ] **Step 1: Añadir lógica y UI de motivación**

Añadir la función de motivación y el indicador al detalle del héroe en `Heroes.tsx`:

```tsx
// Añadir función antes del componente:
function calcularMotivacion(heroe: Heroe, tropasLideradas: number): {
  motivado: boolean;
  tropasMinimas: number;
  porcentaje: number;
} {
  if (heroe.nivel < 5) return { motivado: true, tropasMinimas: 0, porcentaje: 100 };
  // Orcos necesitan solo 50% del umbral
  const factor = heroe.raza === 'orcos' ? 0.5 : 1;
  const tropasMinimas = Math.floor(1500 * heroe.nivel * factor);
  const motivado = tropasLideradas >= tropasMinimas;
  const porcentaje = Math.min(100, Math.round((tropasLideradas / tropasMinimas) * 100));
  return { motivado, tropasMinimas, porcentaje };
}
```

En el panel de detalle del héroe, después de los stats, añadir:

```tsx
{/* Motivación (solo si nivel >= 5) */}
{heroeSeleccionado.nivel >= 5 && (() => {
  const tropasLideradas = 850; // mock — vendrá de la API
  const mot = calcularMotivacion(heroeSeleccionado, tropasLideradas);
  return (
    <div className={`p-4 rounded-lg border ${mot.motivado ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
      <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
        {mot.motivado ? '✅' : '⚠️'} Motivación del héroe
      </h3>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-amber-700">Tropas lideradas:</span>
          <span className="font-bold">{tropasLideradas.toLocaleString()} / {mot.tropasMinimas.toLocaleString()} mínimas</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${mot.motivado ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${mot.porcentaje}%` }}
          />
        </div>
        {!mot.motivado && (
          <p className="text-red-600 text-xs">⚠️ Sin motivación: -60% ataques, -50% daño, sin habilidades especiales.</p>
        )}
      </div>
    </div>
  );
})()}
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Heroes.tsx
git commit -m "feat: add hero motivation system (level 5+, min troops per level, orc 50% threshold)"
```

---

### Task 7: Login — Polish y consistencia

**Files:**
- Modify: `src/pages/LoginPage.tsx`

- [ ] **Step 1: Verificar que el Login está correcto**

```bash
head -30 src/pages/LoginPage.tsx
```

Si la página ya tiene el diseño medieval con las screenshots del juego y el ranking en tiempo real del diseño original, está completa. Solo verificar que:
- El título "EMPIRE STRIKE" aparece prominente
- Hay campos de email/contraseña
- Botones de Facebook y Google
- Sección "New User" / "Nuevo usuario"
- Ranking en la parte inferior

Si todo está presente, solo añadir la referencia a las razas disponibles:

```tsx
// Buscar la sección "Nuevo usuario" y añadir tras el botón de Google:
<div className="mt-4 text-center">
  <p className="text-amber-600 text-xs mb-2">Razas disponibles:</p>
  <div className="flex justify-center gap-2 flex-wrap">
    {['Elfos', 'Elfos Oscuros', 'Enanos', 'Humanos', 'No Muertos', 'Orcos'].map(r => (
      <span key={r} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-yellow-300">{r}</span>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
npx tsc --noEmit
git add src/pages/LoginPage.tsx
git commit -m "feat: add available races display to Login page"
```

---

## Verificación Final del Plan 5

1. `npx tsc --noEmit` → sin errores
2. Alianzas: muestra estadísticas, filtros funcionales, panel diplomático
3. Conquistas: tabla completa con búsqueda, filtros, win rate y botín
4. Ejercito: toggle "por ubicación" / "por tipo" funciona correctamente
5. Prisión: se puede editar el rescate inline, reclutar descuenta del listado
6. Cities: clic en cualquier edificio abre modal con efectos y costo de mejora
7. Heroes: héroes de nivel 5+ muestran barra de motivación
8. Login: muestra las 6 razas disponibles

---

## Estado final del proyecto tras los 5 planes

| Sección | Estado |
|---------|--------|
| Tipos TypeScript compartidos | ✅ Completo |
| ResourceBar (18 recursos + turnos + reset) | ✅ Completo |
| Sidebar (todas las rutas) | ✅ Completo |
| Login | ✅ Completo |
| Dashboard | ✅ Completo |
| Heroes (con motivación) | ✅ Completo |
| Cities (multi-ciudad + modales) | ✅ Completo |
| Tropas | ✅ Completo |
| Combate (resultados) | ✅ Completo |
| Atacar (flujo completo) | ✅ Completo |
| Rankings | ✅ Completo |
| Comercio | ✅ Completo |
| Perfil | ✅ Completo |
| Mapa Mundial | ✅ Completo |
| Clanes | ✅ Completo |
| Espionaje | ✅ Completo |
| Política | ✅ Completo |
| Prisión (con rescates) | ✅ Completo |
| Monturas | ✅ Completo |
| Quests | ✅ Completo |
| Carromato | ✅ Completo |
| Fundar Ciudad | ✅ Completo |
| Ejercito (detallado) | ✅ Completo |
| Alianzas (con filtros) | ✅ Completo |
| Conquistas (historial) | ✅ Completo |
| Imperios Agente (con formulario) | ✅ Completo |
| Rubíes | ✅ Completo |
| Servidor MCP (19 herramientas) | ✅ Completo |

**El frontend está listo para conectar con el backend real.**
