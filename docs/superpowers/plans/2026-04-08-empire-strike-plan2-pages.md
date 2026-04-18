# Empire Strike — Plan 2: Páginas Frontend

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar las 17 páginas del juego en español — 8 existentes refinadas con insignias de turnos y tipos correctos, 9 nuevas construidas desde cero.

**Architecture:** Cada página es un componente React independiente en `src/pages/`. Usa datos mock tipados con los tipos de `src/types/game.ts`. Sin estado global — cada página recibe sus datos como props o usa constantes mock locales.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React  
**Prerequisito:** Plan 1 completado (tipos en `src/types/` disponibles)

---

### Task 1: Dashboard — Refinado

**Files:**
- Modify: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Reemplazar con versión refinada**

```tsx
// src/pages/Dashboard.tsx
import React from 'react';
import { Crown, Sword, Building, Users, TrendingUp, TrendingDown, AlertCircle, Clock } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const ACTIVIDAD_MOCK = [
  { color: 'bg-green-500', texto: 'Tu héroe Doghell ha subido al nivel 2', hace: 'Hace 2 horas', turnos: 0 },
  { color: 'bg-blue-500', texto: 'Construcción de Armería completada en Rosvo', hace: 'Hace 4 horas', turnos: COSTOS_TURNOS.construirEdificio },
  { color: 'bg-red-500', texto: 'Ataque exitoso contra ciudad enemiga (+1.200 oro)', hace: 'Hace 6 horas', turnos: COSTOS_TURNOS.ataqueRegionalMismaRegion },
  { color: 'bg-yellow-500', texto: 'Tropas movidas a Doghell', hace: 'Hace 8 horas', turnos: COSTOS_TURNOS.moverTropas },
];

const GASTO_TURNOS_HOY = [
  { icon: '🏗️', label: 'Construir ×3', turnos: 6 },
  { icon: '⚔️', label: 'Atacar ×2', turnos: 16 },
  { icon: '🚶', label: 'Mover ×5', turnos: 5 },
];

const Dashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
            <Crown className="text-yellow-600" />
            Imperio de las Tierras Doradas
          </h1>
          <p className="text-amber-700 mt-1">Día 12 de la Temporada · Raza: Elfos · País: España</p>
        </div>
        <div className="text-right">
          <div className="text-amber-600 text-sm">Temporada</div>
          <div className="text-amber-800 font-bold text-lg">12 / 60 días</div>
          <div className="w-48 bg-amber-200 rounded-full h-2 mt-1">
            <div className="bg-amber-600 h-2 rounded-full" style={{ width: '20%' }} />
          </div>
        </div>
      </div>
    </div>

    {/* Stats rápidas */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Ciudades', valor: '2', icon: Building, color: 'text-yellow-600' },
        { label: 'Héroes', valor: '1', icon: Sword, color: 'text-yellow-600' },
        { label: 'Tropas', valor: '8.450', icon: Users, color: 'text-yellow-600' },
        { label: 'Ranking', valor: '#47', icon: TrendingUp, color: 'text-green-600' },
      ].map(({ label, valor, icon: Icon, color }) => (
        <div key={label} className="bg-amber-50 p-4 rounded-lg border border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm">{label}</p>
              <p className="text-2xl font-bold text-amber-800">{valor}</p>
            </div>
            <Icon className={color} size={32} />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Actividad reciente */}
      <div className="lg:col-span-2 bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h2 className="text-xl font-bold text-amber-800 mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          {ACTIVIDAD_MOCK.map((a, i) => (
            <div key={i} className="bg-amber-50 p-3 rounded border border-yellow-400 flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
              <div className="flex-1">
                <span className="text-amber-800 text-sm">{a.texto}</span>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-amber-600 text-xs">{a.hace}</p>
                  {a.turnos > 0 && (
                    <span className="bg-amber-200 text-amber-700 text-xs px-1.5 rounded">-{a.turnos}T</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gasto de turnos */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h2 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
          <Clock size={18} /> Turnos Hoy
        </h2>
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-amber-800">73</div>
          <div className="text-amber-600 text-sm">restantes de 100</div>
          <div className="w-full bg-amber-200 rounded-full h-3 mt-2">
            <div className="bg-amber-600 h-3 rounded-full" style={{ width: '73%' }} />
          </div>
        </div>
        <div className="space-y-2">
          {GASTO_TURNOS_HOY.map((g, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-amber-700">{g.icon} {g.label}</span>
              <span className="text-amber-800 font-bold">-{g.turnos}T</span>
            </div>
          ))}
          <div className="border-t border-yellow-400 pt-2 flex items-center justify-between font-bold">
            <span className="text-amber-800">Total gastado</span>
            <span className="text-red-700">-27T</span>
          </div>
        </div>
      </div>
    </div>

    {/* Estado del imperio */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h2 className="text-xl font-bold text-amber-800 mb-4">Estado del Imperio</h2>
        {[
          { label: 'Felicidad General', valor: 85, color: 'bg-green-500' },
          { label: 'Moral de Tropas', valor: 92, color: 'bg-blue-500' },
          { label: 'Economía', valor: 78, color: 'bg-yellow-500' },
          { label: 'Cultura', valor: 61, color: 'bg-purple-500' },
        ].map(({ label, valor, color }) => (
          <div key={label} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-amber-800 text-sm">{label}</span>
              <span className="text-amber-700 font-semibold text-sm">{valor}%</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2">
              <div className={`${color} h-2 rounded-full`} style={{ width: `${valor}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-red-100 to-orange-200 p-4 rounded-lg border-2 border-red-400 h-fit">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-red-800 font-bold">Alerta Militar</h3>
            <p className="text-red-700 text-sm mt-1">Se han detectado tropas enemigas cerca de tu frontera norte. Considera reforzar las defensas.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
```

- [ ] **Step 2: Verificar**

```bash
npx tsc --noEmit && npm run dev
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: refine Dashboard with turn usage chart and season timer"
```

---

### Task 2: Heroes — Refinado

**Files:**
- Modify: `src/pages/Heroes.tsx`

- [ ] **Step 1: Reemplazar con versión tipada**

```tsx
// src/pages/Heroes.tsx
import React, { useState } from 'react';
import { Sword, Shield, Zap, Heart, Wind, Star, Move, Compass, Scroll, ChevronRight } from 'lucide-react';
import type { Heroe } from '../types/game';
import { COSTOS_TURNOS } from '../types/game';

const HEROES_MOCK: Heroe[] = [
  {
    id: 'h1', nombre: 'Doghell N1', clase: 'ladron', raza: 'elfos',
    nivel: 1, experiencia: 100, experienciaSiguienteNivel: 600,
    ubicacionTipo: 'campo', ubicacionId: 'r16', ubicacionNombre: 'Bosque Verde #16',
    protegido: true, tieneMontura: false, capturado: false,
    stats: { ataque: 10, defensa: 10, dano: 7, vida: 19, velocidad: 8, moral: 8 },
    puntosDesarrollo: 0, habilidades: [],
  },
];

const NOMBRE_CLASE: Record<string, string> = {
  guerrero: 'Guerrero', ladron: 'Ladrón', sacerdote: 'Sacerdote', mago: 'Mago'
};

const NOMBRE_RAZA: Record<string, string> = {
  elfos: 'Elfos', elfos_oscuros: 'Elfos Oscuros', enanos: 'Enanos',
  humanos: 'Humanos', no_muertos: 'No Muertos', orcos: 'Orcos'
};

const TurnoBadge: React.FC<{ costo: number }> = ({ costo }) => (
  <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded ml-1">{costo}T</span>
);

const Heroes: React.FC = () => {
  const [heroeSeleccionado, setHeroeSeleccionado] = useState<Heroe | null>(HEROES_MOCK[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Sword className="text-yellow-600" /> Héroes
        </h1>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
          + Contratar héroe <TurnoBadge costo={COSTOS_TURNOS.comprarHeroe} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista */}
        <div className="space-y-3">
          {HEROES_MOCK.map(h => (
            <button
              key={h.id}
              onClick={() => setHeroeSeleccionado(h)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                heroeSeleccionado?.id === h.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-yellow-300 bg-amber-50 hover:border-yellow-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <Sword size={20} className="text-amber-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-800">{h.nombre}</h3>
                  <p className="text-amber-600 text-xs">{NOMBRE_CLASE[h.clase]} · {NOMBRE_RAZA[h.raza]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-amber-600">Nivel {h.nivel}</span>
                    <div className="flex-1 bg-amber-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${(h.experiencia / h.experienciaSiguienteNivel) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-amber-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Detalle */}
        {heroeSeleccionado && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-amber-300 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sword size={36} className="text-amber-700" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-amber-800">{heroeSeleccionado.nombre}</h2>
                  <p className="text-amber-600">{NOMBRE_CLASE[heroeSeleccionado.clase]} · {NOMBRE_RAZA[heroeSeleccionado.raza]}</p>
                  <p className="text-amber-600 text-sm mt-1">📍 {heroeSeleccionado.ubicacionNombre}</p>
                  <div className="flex gap-2 mt-2">
                    {heroeSeleccionado.protegido && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">🛡️ Protegido</span>
                    )}
                    {heroeSeleccionado.capturado && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">🔒 Capturado</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-600 text-sm">Nivel {heroeSeleccionado.nivel}</div>
                  <div className="text-amber-500 text-xs">{heroeSeleccionado.experiencia} / {heroeSeleccionado.experienciaSiguienteNivel} XP</div>
                  <div className="w-24 bg-amber-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(heroeSeleccionado.experiencia / heroeSeleccionado.experienciaSiguienteNivel) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-amber-50 p-4 rounded-lg border border-yellow-400">
              <h3 className="font-bold text-amber-800 mb-3">Características</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Ataque', valor: heroeSeleccionado.stats.ataque, icon: Sword, color: 'text-red-600' },
                  { label: 'Defensa', valor: heroeSeleccionado.stats.defensa, icon: Shield, color: 'text-blue-600' },
                  { label: 'Daño', valor: heroeSeleccionado.stats.dano, icon: Zap, color: 'text-orange-600' },
                  { label: 'Vida', valor: heroeSeleccionado.stats.vida, icon: Heart, color: 'text-red-500' },
                  { label: 'Velocidad', valor: heroeSeleccionado.stats.velocidad, icon: Wind, color: 'text-green-600' },
                  { label: 'Moral', valor: heroeSeleccionado.stats.moral, icon: Star, color: 'text-yellow-600' },
                ].map(({ label, valor, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-2 p-2 bg-white rounded border border-yellow-200">
                    <Icon size={16} className={color} />
                    <div>
                      <div className="text-xs text-amber-600">{label}</div>
                      <div className="font-bold text-amber-800">{valor}</div>
                    </div>
                  </div>
                ))}
              </div>
              {heroeSeleccionado.puntosDesarrollo > 0 && (
                <p className="text-amber-700 text-sm mt-3 font-semibold">
                  ✨ {heroeSeleccionado.puntosDesarrollo} puntos de desarrollo disponibles
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="bg-amber-50 p-4 rounded-lg border border-yellow-400">
              <h3 className="font-bold text-amber-800 mb-3">Acciones</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Move size={16} /> Mover tropas <TurnoBadge costo={COSTOS_TURNOS.moverTropas} />
                </button>
                <button className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Compass size={16} /> Aventura <TurnoBadge costo={COSTOS_TURNOS.aventura} />
                </button>
                <button className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Scroll size={16} /> Realizar Quest <TurnoBadge costo={COSTOS_TURNOS.completarQuest} />
                </button>
                <button className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Move size={16} /> Mover héroe <TurnoBadge costo={COSTOS_TURNOS.moverHeroe} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heroes;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Heroes.tsx
git commit -m "feat: refine Heroes page with typed stats, classes, races and turn badges"
```

---

### Task 3: Cities — Refinado

**Files:**
- Modify: `src/pages/Cities.tsx`

- [ ] **Step 1: Reemplazar con versión tipada**

```tsx
// src/pages/Cities.tsx
import React, { useState } from 'react';
import { Building, Users, Heart, Plus } from 'lucide-react';
import type { Ciudad } from '../types/game';
import { NOMBRES_EDIFICIOS, COSTOS_TURNOS } from '../types/game';

const CIUDAD_MOCK: Ciudad = {
  id: 'c1', nombre: 'Rosvo', tipoTerreno: 'Bosque', poblacion: 34492,
  felicidad: 100, moral: 100, corrupcion: 0, higiene: 44, religion: 77, cultura: 71,
  coordX: 523, coordY: 12, impuestos: 19, limiteTropas: 10000,
  edificios: [
    { id: 'e1', tipo: 'castillo', nivel: 1, nivelMaximo: 10, enConstruccion: false },
    { id: 'e2', tipo: 'muralla', nivel: 1, nivelMaximo: 10, enConstruccion: false },
    { id: 'e3', tipo: 'armeria', nivel: 2, nivelMaximo: 10, enConstruccion: false },
    { id: 'e4', tipo: 'foso', nivel: 1, nivelMaximo: 10, enConstruccion: true, construccionTerminaEn: new Date(Date.now() + 3600000).toISOString() },
    { id: 'e5', tipo: 'cuartel', nivel: 1, nivelMaximo: 10, enConstruccion: false },
    { id: 'e6', tipo: 'mina_oro', nivel: 3, nivelMaximo: 10, enConstruccion: false },
    { id: 'e7', tipo: 'torre_magica', nivel: 1, nivelMaximo: 10, enConstruccion: false },
    { id: 'e8', tipo: 'universidad', nivel: 2, nivelMaximo: 10, enConstruccion: false },
  ],
  tropas: { 'N1_Guerreros_elfos': 850, 'N2_Arqueros_elfos': 400, 'N3_Centauros': 250, 'N4_Exploradores_elfos': 50 },
  produccionDiaria: { oro: 34492, comida: 177, madera: 482 },
  consumoDiario: { comida: 229, agua: 225 },
};

const Cities: React.FC = () => {
  const [ciudadActual] = useState<Ciudad>(CIUDAD_MOCK);

  const totalTropas = Object.values(ciudadActual.tropas).reduce((a, b) => a + b, 0);
  const porcentajeTropas = Math.round((totalTropas / ciudadActual.limiteTropas) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Building className="text-yellow-600" /> Ciudades
        </h1>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
          + Fundar ciudad
          <span className="bg-amber-800 text-amber-200 text-xs px-1.5 py-0.5 rounded ml-1">{COSTOS_TURNOS.fundarCiudad}T</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info ciudad */}
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
          <h2 className="text-xl font-bold text-amber-800 mb-1">{ciudadActual.nombre} #{ciudadActual.coordX}</h2>
          <p className="text-amber-600 text-sm mb-4">Terreno: {ciudadActual.tipoTerreno} · Impuestos: {ciudadActual.impuestos}%</p>

          <div className="space-y-3">
            {[
              { label: 'Felicidad', val: ciudadActual.felicidad, color: 'bg-green-500' },
              { label: 'Moral', val: ciudadActual.moral, color: 'bg-blue-500' },
              { label: 'Higiene', val: ciudadActual.higiene, color: 'bg-teal-500' },
              { label: 'Religión', val: ciudadActual.religion, color: 'bg-purple-500' },
              { label: 'Cultura', val: ciudadActual.cultura, color: 'bg-pink-500' },
              { label: 'Corrupción', val: ciudadActual.corrupcion, color: 'bg-red-500' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-700">{label}</span>
                  <span className="font-semibold text-amber-800">{val}%</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div className={`${color} h-2 rounded-full`} style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-yellow-400">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700 flex items-center gap-1"><Users size={14} /> Población</span>
              <span className="font-bold text-amber-800">{ciudadActual.poblacion.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-amber-700">Tropas</span>
              <span className="font-bold text-amber-800">{totalTropas.toLocaleString()} / {ciudadActual.limiteTropas.toLocaleString()} ({porcentajeTropas}%)</span>
            </div>
          </div>
        </div>

        {/* Edificios */}
        <div className="lg:col-span-2 bg-amber-50 p-5 rounded-lg border border-yellow-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-amber-800 text-lg">Edificios ({ciudadActual.edificios.length})</h3>
            <button className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-sm">
              <Plus size={14} /> Construir
              <span className="bg-amber-800 text-amber-200 text-xs px-1 rounded ml-1">{COSTOS_TURNOS.construirEdificio}T</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ciudadActual.edificios.map(e => (
              <div key={e.id} className={`flex items-center justify-between p-3 rounded-lg border ${e.enConstruccion ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-gray-200'}`}>
                <div>
                  <span className="font-medium text-amber-800">{NOMBRES_EDIFICIOS[e.tipo]}</span>
                  {e.enConstruccion && <span className="text-yellow-600 text-xs ml-2">⚙️ En construcción...</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: e.nivelMaximo }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${i < e.nivel ? 'bg-amber-500' : 'bg-amber-100'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-amber-600">Nv {e.nivel}</span>
                  <button className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-1 rounded">
                    Mejorar <span className="bg-amber-300 text-amber-800 px-1 rounded">{COSTOS_TURNOS.construirEdificio}T</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Cities.tsx
git commit -m "feat: refine Cities page with 33 building types, construction queue, typed stats"
```

---

### Task 4: Tropas, Combate, Rankings, Comercio, Perfil — Insignias de turnos

**Files:**
- Modify: `src/pages/Troops.tsx`, `src/pages/Combat.tsx`, `src/pages/Rankings.tsx`, `src/pages/Trade.tsx`, `src/pages/Profile.tsx`

Estas páginas mantienen su estructura actual. Solo se añaden insignias de costo de turno en los botones de acción y el temporizador de temporada en Rankings.

- [ ] **Step 1: Añadir insignia helper en cada archivo**

En cada página, añadir este componente local al inicio del archivo (tras los imports):

```tsx
const TurnoBadge: React.FC<{ costo: number }> = ({ costo }) => (
  <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded ml-1">{costo}T</span>
);
```

- [ ] **Step 2: En Troops.tsx — añadir insignias**

Buscar el botón "Efectuar movimiento" y añadir `<TurnoBadge costo={1} />` junto a él.  
Buscar cualquier botón de entrenar tropas y añadir `<TurnoBadge costo={5} />`.

- [ ] **Step 3: En Combat.tsx — añadir insignias**

En los botones de atacar añadir `<TurnoBadge costo={8} />` (misma región) o `<TurnoBadge costo={9} />` (adyacente).  
En botones de asedio: `<TurnoBadge costo={4} />`.

- [ ] **Step 4: En Rankings.tsx — añadir temporizador de temporada**

Añadir arriba del componente, antes de la tabla principal:

```tsx
<div className="bg-amber-100 border border-yellow-400 rounded-lg p-3 flex items-center gap-3 mb-4">
  <span className="text-2xl">⏳</span>
  <div>
    <span className="font-bold text-amber-800">Temporada en curso</span>
    <span className="text-amber-600 text-sm ml-2">Día 12 de 60 — quedan 48 días</span>
  </div>
  <div className="flex-1" />
  <div className="text-amber-600 text-sm">Fin de temporada: premia a los top 10 de cada categoría</div>
</div>
```

- [ ] **Step 5: En Trade.tsx — marcar Maná y Karma como no comerciables**

Añadir en el componente, cerca del selector de recurso, una nota:

```tsx
<p className="text-amber-600 text-xs mt-1">⚠️ El Maná y el Karma no son comerciables</p>
```

Y añadir insignia al botón de publicar oferta: `<TurnoBadge costo={1} />`.

- [ ] **Step 6: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Troops.tsx src/pages/Combat.tsx src/pages/Rankings.tsx src/pages/Trade.tsx src/pages/Profile.tsx
git commit -m "feat: add turn cost badges to existing pages, season timer in Rankings"
```

---

### Task 5: Mapa Mundial — Nueva página

**Files:**
- Modify: `src/pages/MapaMundial.tsx`

- [ ] **Step 1: Implementar página de mapa**

```tsx
// src/pages/MapaMundial.tsx
import React, { useState } from 'react';
import { Map, Sword, Eye, ChevronRight } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const MUNDOS = ['Gaia', 'Leza', 'Jadpian'] as const;
type Mundo = typeof MUNDOS[number];

interface TerritorioBrief {
  id: string; nombre: string; propietario: string; raza: string;
  esPropio: boolean; esAliado: boolean; x: number; y: number;
}

const TERRITORIOS_MOCK: TerritorioBrief[] = [
  { id: 't1', nombre: 'Rosvo', propietario: 'Tierras Doradas', raza: 'Elfos', esPropio: true, esAliado: false, x: 30, y: 25 },
  { id: 't2', nombre: 'Doghell', propietario: 'Tierras Doradas', raza: 'Elfos', esPropio: true, esAliado: false, x: 45, y: 40 },
  { id: 't3', nombre: 'Oscurheim', propietario: 'Imperio de las Sombras', raza: 'Orcos', esPropio: false, esAliado: false, x: 65, y: 30 },
  { id: 't4', nombre: 'Cristalia', propietario: 'Reino de Cristal', raza: 'Elfos', esPropio: false, esAliado: true, x: 20, y: 60 },
  { id: 't5', nombre: 'Fortaleza Enana', propietario: 'Montañas Grises', raza: 'Enanos', esPropio: false, esAliado: false, x: 75, y: 65 },
];

const MapaMundial: React.FC = () => {
  const [mundoActual, setMundoActual] = useState<Mundo>('Gaia');
  const [territorioSeleccionado, setTerritorioSeleccionado] = useState<TerritorioBrief | null>(null);

  const colorTerritorio = (t: TerritorioBrief) => {
    if (t.esPropio) return 'bg-green-500 border-green-700';
    if (t.esAliado) return 'bg-blue-400 border-blue-600';
    return 'bg-red-400 border-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Map className="text-yellow-600" /> Mapa Mundial
        </h1>
        <div className="flex gap-2">
          {MUNDOS.map(m => (
            <button
              key={m}
              onClick={() => setMundoActual(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mundoActual === m ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >{m}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-amber-700">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Tus ciudades</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 inline-block" /> Aliados</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Enemigos</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Mapa visual */}
        <div className="lg:col-span-3 bg-gradient-to-br from-green-900 to-emerald-950 rounded-lg border-2 border-amber-600 relative overflow-hidden" style={{ minHeight: '450px' }}>
          {/* Grid decorativo */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#fff" strokeWidth="1" />
                <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#fff" strokeWidth="1" />
              </React.Fragment>
            ))}
          </svg>

          {/* Territorios */}
          {TERRITORIOS_MOCK.map(t => (
            <button
              key={t.id}
              onClick={() => setTerritorioSeleccionado(t)}
              className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform ${colorTerritorio(t)} ${territorioSeleccionado?.id === t.id ? 'ring-2 ring-yellow-400 scale-110' : ''}`}
              style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
              title={t.nombre}
            >
              🏰
            </button>
          ))}

          <div className="absolute bottom-2 right-2 text-amber-400 text-xs opacity-70">
            Mundo: {mundoActual}
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-3">
          {territorioSeleccionado ? (
            <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
              <h3 className="font-bold text-amber-800 text-lg">{territorioSeleccionado.nombre}</h3>
              <p className="text-amber-600 text-sm">{territorioSeleccionado.propietario}</p>
              <p className="text-amber-600 text-sm">Raza: {territorioSeleccionado.raza}</p>
              <div className="mt-3 space-y-2">
                {!territorioSeleccionado.esPropio && (
                  <>
                    <button className="w-full flex items-center gap-2 p-2 bg-red-100 hover:bg-red-200 border border-red-300 rounded text-red-700 text-sm">
                      <Sword size={14} /> Atacar
                      <span className="ml-auto bg-red-200 text-red-800 text-xs px-1.5 rounded">{COSTOS_TURNOS.ataqueRegionalMismaRegion}T</span>
                    </button>
                    <button className="w-full flex items-center gap-2 p-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded text-amber-700 text-sm">
                      <Eye size={14} /> Espiar
                      <span className="ml-auto bg-amber-200 text-amber-800 text-xs px-1.5 rounded">{COSTOS_TURNOS.espionajeRegional}T</span>
                    </button>
                  </>
                )}
                <button className="w-full flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-blue-700 text-sm">
                  <ChevronRight size={14} /> Ver detalles
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4 text-center">
              <Map size={32} className="text-amber-400 mx-auto mb-2" />
              <p className="text-amber-600 text-sm">Haz clic en un territorio para ver opciones</p>
            </div>
          )}

          <div className="bg-amber-50 rounded-lg border border-yellow-400 p-3">
            <h4 className="font-semibold text-amber-800 text-sm mb-2">Tus territorios</h4>
            {TERRITORIOS_MOCK.filter(t => t.esPropio).map(t => (
              <button key={t.id} onClick={() => setTerritorioSeleccionado(t)} className="w-full text-left p-2 hover:bg-amber-100 rounded text-sm text-amber-700 flex items-center gap-2">
                🏰 {t.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaMundial;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/MapaMundial.tsx
git commit -m "feat: implement World Map page with territories, attack/spy actions, turn badges"
```

---

### Task 6: Clanes — Nueva página

**Files:**
- Modify: `src/pages/Clanes.tsx`

- [ ] **Step 1: Implementar página de clanes**

```tsx
// src/pages/Clanes.tsx
import React, { useState } from 'react';
import { Users2, Shield, Sword, MessageSquare, Plus } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';
import type { Clan } from '../types/game';

const CLAN_MOCK: Clan = {
  id: 'clan1', nombre: 'Los Guardianes del Bosque', acronimo: 'LGB',
  liderId: 'u1', miembros: ['u1', 'u2', 'u3', 'u4', 'u5'],
  descripcion: 'Clan élfico dedicado a la defensa del bosque ancestral.',
  logo: '🌲', puntos: 45230,
  guerrasActivas: ['clan3'], alianzas: ['clan2'],
  creadoEn: '2026-03-01T00:00:00Z',
};

const MIEMBROS_MOCK = [
  { id: 'u1', nombre: 'Tierras Doradas', rango: 'Líder', puntos: 12400, online: true },
  { id: 'u2', nombre: 'Valle Eterno', rango: 'General', puntos: 9800, online: true },
  { id: 'u3', nombre: 'Costa Dorada', rango: 'Guerrero', puntos: 7200, online: false },
  { id: 'u4', nombre: 'Río Claro', rango: 'Guerrero', puntos: 5100, online: false },
  { id: 'u5', nombre: 'Monte Verde', rango: 'Guerrero', puntos: 3200, online: false },
];

const Clanes: React.FC = () => {
  const [tab, setTab] = useState<'info' | 'miembros' | 'diplomacia' | 'actividad'>('info');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Users2 className="text-yellow-600" /> Clanes
        </h1>
      </div>

      {/* Cabecera del clan */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{CLAN_MOCK.logo}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-amber-800">[{CLAN_MOCK.acronimo}] {CLAN_MOCK.nombre}</h2>
            <p className="text-amber-600 mt-1">{CLAN_MOCK.descripcion}</p>
            <div className="flex gap-4 mt-2 text-sm text-amber-700">
              <span>👥 {CLAN_MOCK.miembros.length} miembros</span>
              <span>⭐ {CLAN_MOCK.puntos.toLocaleString()} puntos</span>
              <span>⚔️ {CLAN_MOCK.guerrasActivas.length} guerra(s) activa(s)</span>
              <span>🤝 {CLAN_MOCK.alianzas.length} alianza(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-yellow-300">
        {(['info', 'miembros', 'diplomacia', 'actividad'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-all ${tab === t ? 'border-b-2 border-amber-600 text-amber-800' : 'text-amber-500 hover:text-amber-700'}`}>
            {t === 'info' ? 'Info' : t === 'miembros' ? 'Miembros' : t === 'diplomacia' ? 'Diplomacia' : 'Actividad'}
          </button>
        ))}
      </div>

      {tab === 'miembros' && (
        <div className="bg-amber-50 rounded-lg border border-yellow-400 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-100">
              <tr>
                <th className="text-left p-3 text-amber-700">Imperio</th>
                <th className="text-left p-3 text-amber-700">Rango</th>
                <th className="text-right p-3 text-amber-700">Puntos</th>
                <th className="text-center p-3 text-amber-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {MIEMBROS_MOCK.map((m, i) => (
                <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                  <td className="p-3 font-medium text-amber-800">{m.nombre}</td>
                  <td className="p-3 text-amber-600">{m.rango}</td>
                  <td className="p-3 text-right text-amber-700">{m.puntos.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${m.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {m.online ? '● Online' : 'Offline'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'diplomacia' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2"><Shield size={16} /> Alianzas activas</h3>
            <div className="text-amber-600 text-sm mb-3">1 alianza activa</div>
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100">
              🤝 Reino de Cristal <span className="text-xs bg-blue-200 px-2 py-0.5 rounded">Aliado</span>
            </button>
          </div>
          <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2"><Sword size={16} /> Guerras activas</h3>
            <div className="text-amber-600 text-sm mb-3">1 guerra activa</div>
            <button className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100">
              ⚔️ Imperio de las Sombras <span className="text-xs bg-red-200 px-2 py-0.5 rounded">En guerra</span>
            </button>
            <button className="w-full mt-3 flex items-center gap-2 p-2 bg-red-100 hover:bg-red-200 border border-red-300 rounded text-red-700 text-sm">
              <Plus size={14} /> Declarar guerra
              <span className="ml-auto bg-red-200 text-red-800 text-xs px-1.5 rounded">{COSTOS_TURNOS.declararGuerra}T</span>
            </button>
          </div>
        </div>
      )}

      {tab === 'info' && (
        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-amber-600">Fundado:</span> <span className="text-amber-800 font-medium">1 Mar 2026</span></div>
            <div><span className="text-amber-600">Acrónimo:</span> <span className="text-amber-800 font-bold">[{CLAN_MOCK.acronimo}]</span></div>
            <div><span className="text-amber-600">Coste fundar clan:</span> <span className="text-amber-800">200.000 oro · {COSTOS_TURNOS.fundarClan}T</span></div>
            <div><span className="text-amber-600">Coste unirse:</span> <span className="text-amber-800">30.000 oro</span></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm">
              <MessageSquare size={14} /> Foro del clan
            </button>
          </div>
        </div>
      )}

      {tab === 'actividad' && (
        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4 text-amber-600 text-sm">
          <p className="text-center py-8">📋 El historial de actividad del clan aparecerá aquí cuando el backend esté conectado.</p>
        </div>
      )}
    </div>
  );
};

export default Clanes;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Clanes.tsx
git commit -m "feat: implement Clans page with members, diplomacy, war/alliance management"
```

---

### Task 7: Espionaje, Política, Prisión, Monturas — Nuevas páginas

**Files:**
- Modify: `src/pages/Espionaje.tsx`, `src/pages/Politica.tsx`, `src/pages/Prision.tsx`, `src/pages/Monturas.tsx`

- [ ] **Step 1: Implementar Espionaje.tsx**

```tsx
// src/pages/Espionaje.tsx
import React, { useState } from 'react';
import { Eye, AlertCircle } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';
import type { MisionEspionaje } from '../types/game';

const MISIONES_MOCK: MisionEspionaje[] = [
  { id: 'm1', tipo: 'regional', heroeId: 'h1', objetivoId: 'c3', estado: 'completada', resultado: 'Obtenida: 2.100 tropas, 3 edificios de nivel 3', iniciadaEn: '2026-04-07T10:00:00Z', completadaEn: '2026-04-07T10:05:00Z' },
  { id: 'm2', tipo: 'reconquista', heroeId: 'h1', objetivoId: 'c5', estado: 'fallida', resultado: 'Espía detectado y eliminado', iniciadaEn: '2026-04-07T14:00:00Z', completadaEn: '2026-04-07T14:05:00Z' },
];

const Espionaje: React.FC = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'regional' | 'reconquista'>('regional');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Eye className="text-yellow-600" /> Espionaje
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nueva misión */}
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Nueva Misión</h2>
          <div className="space-y-3">
            <div>
              <label className="text-amber-700 text-sm font-medium block mb-1">Tipo de espionaje</label>
              <div className="flex gap-2">
                <button onClick={() => setTipoSeleccionado('regional')}
                  className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${tipoSeleccionado === 'regional' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-yellow-400 text-amber-700'}`}>
                  Regional <span className={`text-xs px-1.5 rounded ml-1 ${tipoSeleccionado === 'regional' ? 'bg-amber-700 text-amber-200' : 'bg-amber-200 text-amber-700'}`}>{COSTOS_TURNOS.espionajeRegional}T</span>
                </button>
                <button onClick={() => setTipoSeleccionado('reconquista')}
                  className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${tipoSeleccionado === 'reconquista' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-yellow-400 text-amber-700'}`}>
                  Reconquista <span className={`text-xs px-1.5 rounded ml-1 ${tipoSeleccionado === 'reconquista' ? 'bg-amber-700 text-amber-200' : 'bg-amber-200 text-amber-700'}`}>{COSTOS_TURNOS.espionajeReconquista}T</span>
                </button>
              </div>
            </div>
            <div>
              <label className="text-amber-700 text-sm font-medium block mb-1">Héroe espía</label>
              <select className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                <option>Doghell N1 — Bosque Verde #16</option>
              </select>
            </div>
            <div>
              <label className="text-amber-700 text-sm font-medium block mb-1">Ciudad objetivo</label>
              <input className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50 placeholder-amber-400" placeholder="Nombre o ID de ciudad..." />
            </div>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Eye size={16} /> Ejecutar misión
              <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">{tipoSeleccionado === 'regional' ? COSTOS_TURNOS.espionajeRegional : COSTOS_TURNOS.espionajeReconquista}T</span>
            </button>
          </div>
        </div>

        {/* Historial */}
        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Historial de Misiones</h2>
          <div className="space-y-3">
            {MISIONES_MOCK.map(m => (
              <div key={m.id} className={`p-3 rounded-lg border ${m.estado === 'completada' ? 'bg-green-50 border-green-300' : m.estado === 'fallida' ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-amber-800 text-sm capitalize">{m.tipo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${m.estado === 'completada' ? 'bg-green-200 text-green-800' : m.estado === 'fallida' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {m.estado === 'completada' ? '✅ Éxito' : m.estado === 'fallida' ? '❌ Fallida' : '⏳ En progreso'}
                  </span>
                </div>
                {m.resultado && <p className="text-amber-700 text-xs">{m.resultado}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Espionaje;
```

- [ ] **Step 2: Implementar Politica.tsx**

```tsx
// src/pages/Politica.tsx
import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

type Actitud = 'guerra' | 'neutral' | 'amistoso';

const Politica: React.FC = () => {
  const [impuestos, setImpuestos] = useState(19);
  const [actitud, setActitud] = useState<Actitud>('neutral');
  const [cambioPendiente, setCambioPendiente] = useState(false);

  const handleChange = () => setCambioPendiente(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Scale className="text-yellow-600" /> Política
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600 space-y-5">
          <h2 className="text-lg font-bold text-amber-800">Configuración del Imperio</h2>

          <div>
            <label className="text-amber-700 text-sm font-medium block mb-1">
              Impuestos: <span className="text-amber-800 font-bold">{impuestos}%</span>
            </label>
            <input type="range" min={0} max={50} value={impuestos}
              onChange={e => { setImpuestos(+e.target.value); handleChange(); }}
              className="w-full accent-amber-600" />
            <div className="flex justify-between text-xs text-amber-500 mt-1">
              <span>0% (sin ingresos)</span><span>50% (bajo malestar)</span>
            </div>
          </div>

          <div>
            <label className="text-amber-700 text-sm font-medium block mb-2">Actitud diplomática</label>
            <div className="flex gap-2">
              {(['guerra', 'neutral', 'amistoso'] as Actitud[]).map(a => (
                <button key={a} onClick={() => { setActitud(a); handleChange(); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${
                    actitud === a
                      ? a === 'guerra' ? 'bg-red-600 border-red-600 text-white'
                        : a === 'amistoso' ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-white border-yellow-400 text-amber-700'
                  }`}>
                  {a === 'guerra' ? '⚔️ Guerra' : a === 'neutral' ? '⚖️ Neutral' : '🤝 Amistoso'}
                </button>
              ))}
            </div>
          </div>

          {cambioPendiente && (
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
              Aplicar cambios
              <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">{COSTOS_TURNOS.politica}T</span>
            </button>
          )}
        </div>

        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Relaciones diplomáticas</h2>
          <div className="space-y-2 text-sm">
            {[
              { nombre: 'Imperio de las Sombras', estado: 'En guerra', color: 'text-red-700 bg-red-50 border-red-200' },
              { nombre: 'Reino de Cristal', estado: 'Aliado', color: 'text-blue-700 bg-blue-50 border-blue-200' },
              { nombre: 'Montañas Grises', estado: 'Neutral', color: 'text-amber-700 bg-amber-50 border-amber-200' },
            ].map(r => (
              <div key={r.nombre} className={`flex items-center justify-between p-3 rounded-lg border ${r.color}`}>
                <span className="font-medium">{r.nombre}</span>
                <span className="text-xs font-semibold">{r.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Politica;
```

- [ ] **Step 3: Implementar Prision.tsx**

```tsx
// src/pages/Prision.tsx
import React from 'react';
import { Lock } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const Prision: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
      <Lock className="text-yellow-600" /> Prisión
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
        <h2 className="text-lg font-bold text-amber-800 mb-4">Héroes capturados (enemigos)</h2>
        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-amber-800">Jasbra N3 (Mago)</h3>
              <p className="text-amber-600 text-sm">Capturado en batalla — Día 10</p>
              <p className="text-amber-600 text-sm">Imperio: Montañas Grises</p>
            </div>
            <div className="text-right">
              <p className="text-amber-700 text-sm font-medium">Rescate: 50.000 oro</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded text-sm flex items-center justify-center gap-1">
              Reclutar <span className="bg-amber-700 text-amber-200 text-xs px-1 rounded">{COSTOS_TURNOS.reclutarHeroeCapturado}T</span>
            </button>
            <button className="flex-1 bg-white hover:bg-amber-50 border border-yellow-400 text-amber-700 py-1.5 rounded text-sm">
              Fijar rescate
            </button>
          </div>
        </div>
      </div>
      <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
        <h2 className="text-lg font-bold text-amber-800 mb-4">Tus héroes cautivos</h2>
        <div className="text-center py-8 text-amber-600">
          <Lock size={32} className="mx-auto mb-2 text-amber-400" />
          <p>Ninguno de tus héroes está capturado actualmente</p>
        </div>
      </div>
    </div>
  </div>
);

export default Prision;
```

- [ ] **Step 4: Implementar Monturas.tsx**

```tsx
// src/pages/Monturas.tsx
import React from 'react';
import { COSTOS_TURNOS } from '../types/game';
import type { Montura } from '../types/game';

const MONTURAS_MOCK: Montura[] = [
  { id: 'm1', tipo: 'caballo_guerra', nombre: 'Corcel de Guerra', bonusVelocidad: 3, bonusCapacidad: 500, raza: 'humanos' },
  { id: 'm2', tipo: 'unicornio', nombre: 'Unicornio Élfico', bonusVelocidad: 5, bonusCapacidad: 300, raza: 'elfos', heroeAsignadoId: undefined },
];

const Monturas: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-amber-800">🐴 Monturas</h1>
      <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
        + Comprar montura
        <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">{COSTOS_TURNOS.comprarMontura}T</span>
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MONTURAS_MOCK.map(m => (
        <div key={m.id} className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
          <h3 className="font-bold text-amber-800 text-lg">{m.nombre}</h3>
          <p className="text-amber-500 text-xs capitalize mb-3">{m.raza}</p>
          <div className="space-y-1 text-sm text-amber-700">
            <div className="flex justify-between"><span>Bonus velocidad</span><span className="font-bold text-green-700">+{m.bonusVelocidad}</span></div>
            <div className="flex justify-between"><span>Bonus capacidad</span><span className="font-bold text-blue-700">+{m.bonusCapacidad}</span></div>
          </div>
          <div className="mt-3">
            {m.heroeAsignadoId
              ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✅ Asignada</span>
              : <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded text-sm flex items-center justify-center gap-1">
                  Asignar a héroe
                  <span className="bg-amber-700 text-amber-200 text-xs px-1 rounded ml-1">{COSTOS_TURNOS.montarHeroe}T</span>
                </button>
            }
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Monturas;
```

- [ ] **Step 5: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Espionaje.tsx src/pages/Politica.tsx src/pages/Prision.tsx src/pages/Monturas.tsx
git commit -m "feat: implement Espionaje, Politica, Prision, Monturas pages with turn badges"
```

---

### Task 8: Quests, Carromato, Imperios Agente, Rubíes — Nuevas páginas

**Files:**
- Modify: `src/pages/Quests.tsx`, `src/pages/Carromato.tsx`, `src/pages/ImperiosAgente.tsx`, `src/pages/Rubies.tsx`

- [ ] **Step 1: Implementar Quests.tsx**

```tsx
// src/pages/Quests.tsx
import React, { useState } from 'react';
import { Scroll } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';
import type { Quest } from '../types/game';

const QUESTS_MOCK: Quest[] = [
  { id: 'q1', titulo: 'El Comerciante Perdido', descripcion: 'Escolta a un comerciante a través del bosque peligroso.', tipo: 'diaria', recompensaOro: 800, recompensaXP: 50, recompensaRecursos: { comida: 100 }, heroeRequeridoNivel: 1, completada: false, expiraEn: new Date(Date.now() + 72000000).toISOString() },
  { id: 'q2', titulo: 'Minas de Mithril', descripcion: 'Despeja las minas de mithril de monstruos subterráneos.', tipo: 'semanal', recompensaOro: 3000, recompensaXP: 200, recompensaRecursos: { mithril: 10 }, heroeRequeridoNivel: 3, completada: false },
  { id: 'q3', titulo: 'La Profecía del Dragón', descripcion: 'Una cadena épica que lleva al corazón de las montañas.', tipo: 'epica', recompensaOro: 15000, recompensaXP: 1000, recompensaRecursos: { gemas: 5, reliquias: 3 }, heroeRequeridoNivel: 5, completada: false },
];

const TIPO_COLOR: Record<string, string> = {
  diaria: 'bg-green-100 text-green-800 border-green-300',
  semanal: 'bg-blue-100 text-blue-800 border-blue-300',
  epica: 'bg-purple-100 text-purple-800 border-purple-300',
};

const Quests: React.FC = () => {
  const [filtro, setFiltro] = useState<'todas' | 'diaria' | 'semanal' | 'epica'>('todas');

  const questsFiltradas = filtro === 'todas' ? QUESTS_MOCK : QUESTS_MOCK.filter(q => q.tipo === filtro);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Scroll className="text-yellow-600" /> Quests y Aventuras
      </h1>

      <div className="flex gap-2">
        {(['todas', 'diaria', 'semanal', 'epica'] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filtro === f ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
            {f === 'todas' ? 'Todas' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {questsFiltradas.map(q => (
          <div key={q.id} className={`rounded-lg border p-5 ${TIPO_COLOR[q.tipo]}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{q.titulo}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded border capitalize ${TIPO_COLOR[q.tipo]}`}>{q.tipo}</span>
                </div>
                <p className="text-sm opacity-80 mb-3">{q.descripcion}</p>
                <div className="flex gap-4 text-sm flex-wrap">
                  <span>🪙 {q.recompensaOro.toLocaleString()} oro</span>
                  <span>⭐ {q.recompensaXP} XP</span>
                  {Object.entries(q.recompensaRecursos).map(([k, v]) => (
                    <span key={k}>+{v} {k}</span>
                  ))}
                </div>
                <p className="text-xs mt-2 opacity-60">Héroe requerido: Nivel {q.heroeRequeridoNivel}+</p>
              </div>
              <div className="flex-shrink-0">
                <select className="border rounded p-1.5 text-sm mb-2 block w-full">
                  <option>Doghell N1</option>
                </select>
                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded text-sm font-semibold flex items-center justify-center gap-1">
                  Completar
                  <span className="bg-amber-700 text-amber-200 text-xs px-1.5 rounded ml-1">{COSTOS_TURNOS.completarQuest}T</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quests;
```

- [ ] **Step 2: Implementar Carromato.tsx**

```tsx
// src/pages/Carromato.tsx
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const ENTREGAS_MOCK = [
  { id: 'd1', desde: 'Rosvo', hacia: 'Doghell', recurso: 'Oro', cantidad: 5000, estado: 'en_tránsito', llegaEn: '14:30' },
];

const Carromato: React.FC = () => {
  const [desde, setDesde] = useState('Rosvo');
  const [hacia, setHacia] = useState('Doghell');
  const [recurso, setRecurso] = useState('oro');
  const [cantidad, setCantidad] = useState(1000);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Truck className="text-yellow-600" /> Carromato
      </h1>
      <p className="text-amber-600">Transporta recursos entre tus ciudades.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Nuevo envío</h2>
          <div className="space-y-3">
            <div>
              <label className="text-amber-700 text-sm font-medium block mb-1">Desde</label>
              <select value={desde} onChange={e => setDesde(e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                <option>Rosvo</option><option>Doghell</option>
              </select>
            </div>
            <div>
              <label className="text-amber-700 text-sm font-medium block mb-1">Hacia</label>
              <select value={hacia} onChange={e => setHacia(e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                <option>Doghell</option><option>Rosvo</option>
              </select>
            </div>
            <div>
              <label className="text-amber-700 text-sm font-medium block mb-1">Recurso</label>
              <select value={recurso} onChange={e => setRecurso(e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                {['oro','comida','madera','piedra','hierro','plata'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-amber-700 text-sm font-medium block mb-1">Cantidad</label>
              <input type="number" value={cantidad} onChange={e => setCantidad(+e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50" />
            </div>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Truck size={16} /> Enviar carromato
              <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">{COSTOS_TURNOS.moverTropas}T</span>
            </button>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Envíos en tránsito</h2>
          {ENTREGAS_MOCK.map(e => (
            <div key={e.id} className="p-3 bg-yellow-50 rounded border border-yellow-300">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-amber-600" />
                <span className="font-medium text-amber-800">{e.desde} → {e.hacia}</span>
                <span className="ml-auto text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">⏳ En tránsito</span>
              </div>
              <div className="text-sm text-amber-600 mt-1">{e.cantidad.toLocaleString()} {e.recurso} · Llega a las {e.llegaEn}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carromato;
```

- [ ] **Step 3: Implementar ImperiosAgente.tsx**

```tsx
// src/pages/ImperiosAgente.tsx
import React, { useState } from 'react';
import { Bot, Plus, Pause, Play, Trash2 } from 'lucide-react';
import type { ImperioAgente } from '../types/game';

const AGENTES_MOCK: ImperioAgente[] = [
  {
    id: 'a1', nombreImperio: 'Imperio de las Sombras', raza: 'orcos', modelo: 'claude',
    estrategia: 'agresiva', relacion: 'enemigo', activo: true, ranking: 12,
    turnosUsadosHoy: 41, mcpToken: 'tok_a1',
    ultimasAcciones: [
      { timestamp: '2026-04-08T12:34:00Z', descripcion: 'Atacó ciudad Bosque Verde #7 — DERROTA (−320 tropas)', turnosGastados: 8, resultado: 'fallo' },
      { timestamp: '2026-04-08T11:20:00Z', descripcion: 'Construyó Armería (nivel 3) en Oscurheim', turnosGastados: 2, resultado: 'exito' },
      { timestamp: '2026-04-08T10:55:00Z', descripcion: 'Entrenó 500 Guerreros Orcos N2 en Oscurheim', turnosGastados: 5, resultado: 'exito' },
    ],
  },
  {
    id: 'a2', nombreImperio: 'Reino de Cristal', raza: 'elfos', modelo: 'gpt-4o',
    estrategia: 'economica', relacion: 'aliado', activo: true, ranking: 5,
    turnosUsadosHoy: 67, mcpToken: 'tok_a2',
    ultimasAcciones: [
      { timestamp: '2026-04-08T12:10:00Z', descripcion: 'Publicó oferta de comercio: 2.000 madera a 3 oro/unidad', turnosGastados: 1, resultado: 'exito' },
      { timestamp: '2026-04-08T11:00:00Z', descripcion: 'Fundó nueva ciudad en Llanura #44', turnosGastados: 20, resultado: 'exito' },
    ],
  },
];

const NOMBRE_MODELO: Record<string, string> = { claude: 'Claude', 'gpt-4o': 'GPT-4o', local: 'Modelo Local' };
const NOMBRE_ESTRATEGIA: Record<string, string> = { agresiva: 'Agresiva', economica: 'Económica', defensiva: 'Defensiva', equilibrada: 'Equilibrada' };
const NOMBRE_RAZA: Record<string, string> = { elfos: 'Elfos', elfos_oscuros: 'Elfos Oscuros', enanos: 'Enanos', humanos: 'Humanos', no_muertos: 'No Muertos', orcos: 'Orcos' };

const ImperiosAgente: React.FC = () => {
  const [agentes, setAgentes] = useState<ImperioAgente[]>(AGENTES_MOCK);
  const [mostrandoRazonamiento, setMostrandoRazonamiento] = useState<string | null>(null);

  const toggleActivo = (id: string) => {
    setAgentes(prev => prev.map(a => a.id === id ? { ...a, activo: !a.activo } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Bot className="text-yellow-600" /> Imperios Agente
        </h1>
        <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} /> Añadir Imperio IA
        </button>
      </div>

      <p className="text-amber-600 text-sm">Configura y gestiona imperios controlados por inteligencia artificial. Cada agente usa el mismo sistema de turnos que los jugadores humanos.</p>

      <div className="space-y-4">
        {agentes.map(agente => (
          <div key={agente.id} className={`rounded-lg border-2 p-5 ${agente.relacion === 'enemigo' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${agente.relacion === 'enemigo' ? 'bg-red-200' : 'bg-blue-200'}`}>
                {agente.relacion === 'enemigo' ? '🔥' : '✨'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-lg ${agente.relacion === 'enemigo' ? 'text-red-800' : 'text-blue-800'}`}>{agente.nombreImperio}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${agente.relacion === 'enemigo' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
                    {agente.relacion === 'enemigo' ? 'ENEMIGO' : 'ALIADO'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${agente.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {agente.activo ? '● Activo' : '⏸ Pausado'}
                  </span>
                </div>
                <p className="text-sm mt-0.5 opacity-70">
                  Raza: {NOMBRE_RAZA[agente.raza]} · Modelo: {NOMBRE_MODELO[agente.modelo]} · Estrategia: {NOMBRE_ESTRATEGIA[agente.estrategia]}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-amber-800 text-sm"># {agente.ranking} Ranking</div>
                <div className="text-amber-600 text-xs">⏳ {agente.turnosUsadosHoy}T usados hoy</div>
              </div>
            </div>

            {/* Últimas acciones */}
            <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3 text-xs space-y-1.5">
              <div className="font-semibold text-amber-700 mb-1">Últimas acciones:</div>
              {agente.ultimasAcciones.map((acc, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gray-400 flex-shrink-0">{new Date(acc.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={acc.resultado === 'exito' ? 'text-gray-700' : 'text-red-600'}>{acc.descripcion}</span>
                  <span className={`flex-shrink-0 ml-auto px-1 rounded text-[10px] font-bold ${acc.resultado === 'exito' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    -{acc.turnosGastados}T
                  </span>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setMostrandoRazonamiento(mostrandoRazonamiento === agente.id ? null : agente.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded text-amber-700 text-sm"
              >
                <Bot size={13} /> Ver razonamiento
              </button>
              <button
                onClick={() => toggleActivo(agente.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
              >
                {agente.activo ? <><Pause size={13} /> Pausar</> : <><Play size={13} /> Reanudar</>}
              </button>
              {agente.relacion === 'enemigo'
                ? <button className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-300 rounded text-green-700 text-sm">🤝 Proponer alianza</button>
                : <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 rounded text-red-700 text-sm">⚔️ Romper alianza</button>
              }
              <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-red-600 text-sm ml-auto">
                <Trash2 size={13} /> Eliminar
              </button>
            </div>

            {mostrandoRazonamiento === agente.id && (
              <div className="mt-3 bg-gray-900 rounded-lg p-3 text-xs text-green-300 font-mono">
                <div className="text-gray-500 mb-1"># Razonamiento del agente — {agente.nombreImperio}</div>
                <div>Estado: turnos_restantes=59, ranking=#{agente.ranking}, estrategia={agente.estrategia}</div>
                <div className="mt-1">Análisis: con estrategia {agente.estrategia}, priorizo {agente.estrategia === 'agresiva' ? 'ataques a ciudades enemigas débiles' : 'construcción de edificios de producción'}.</div>
                <div className="mt-1 text-gray-400">[El razonamiento real aparecerá cuando el servidor MCP esté conectado]</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center text-amber-500 cursor-pointer hover:bg-amber-50 transition-colors">
        <Bot size={32} className="mx-auto mb-2 text-amber-400" />
        <p className="font-medium">+ Añadir nuevo Imperio Agente</p>
        <p className="text-sm mt-1">Elige modelo · Define estrategia · Conecta via MCP</p>
      </div>
    </div>
  );
};

export default ImperiosAgente;
```

- [ ] **Step 4: Implementar Rubies.tsx**

```tsx
// src/pages/Rubies.tsx
import React from 'react';
import { Gem } from 'lucide-react';

const PAQUETES = [
  { cantidad: 50, precio: '0,99€', popular: false },
  { cantidad: 150, precio: '2,99€', popular: false },
  { cantidad: 500, precio: '7,99€', popular: true },
  { cantidad: 1200, precio: '14,99€', popular: false },
];

const Rubies: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
      <Gem className="text-red-500" /> Rubíes
    </h1>
    <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4 flex items-center gap-4">
      <Gem size={32} className="text-red-500" />
      <div>
        <div className="text-2xl font-bold text-amber-800">29 <span className="text-red-500">💎</span></div>
        <div className="text-amber-600 text-sm">Rubíes disponibles</div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PAQUETES.map(p => (
        <div key={p.cantidad} className={`rounded-lg border-2 p-5 text-center relative ${p.popular ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-300 bg-amber-50'}`}>
          {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs px-3 py-0.5 rounded-full font-bold">MÁS POPULAR</div>}
          <div className="text-3xl font-bold text-red-500 mb-1">{p.cantidad}</div>
          <div className="text-amber-600 text-sm mb-3">💎 Rubíes</div>
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm">{p.precio}</button>
        </div>
      ))}
    </div>
    <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
      <h3 className="font-bold text-amber-800 mb-3">¿Para qué sirven los rubíes?</h3>
      <ul className="space-y-1 text-sm text-amber-700">
        <li>💎 Acelerar construcción de edificios</li>
        <li>💎 Recuperar turnos adicionales</li>
        <li>💎 Desbloquear héroes especiales</li>
        <li>💎 Comprar recursos instantáneamente</li>
      </ul>
    </div>
  </div>
);

export default Rubies;
```

- [ ] **Step 5: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Quests.tsx src/pages/Carromato.tsx src/pages/ImperiosAgente.tsx src/pages/Rubies.tsx
git commit -m "feat: implement Quests, Carromato, ImperiosAgente, Rubies pages"
```

---

### Task 9: Páginas de info — Ejercito, Alianzas, Conquistas

**Files:**
- Modify: `src/pages/Ejercito.tsx`, `src/pages/Alianzas.tsx`, `src/pages/Conquistas.tsx`

- [ ] **Step 1: Implementar Ejercito.tsx**

```tsx
// src/pages/Ejercito.tsx
import React from 'react';
import { Shield } from 'lucide-react';

const TROPAS_TOTALES = [
  { tipo: 'N1 Guerreros Elfos', cantidad: 1850, ubicacion: 'Rosvo', porcentaje: 32 },
  { tipo: 'N2 Arqueros Elfos', cantidad: 1800, ubicacion: 'Rosvo', porcentaje: 30 },
  { tipo: 'N3 Centauros', cantidad: 1680, ubicacion: 'Doghell', porcentaje: 28 },
  { tipo: 'N4 Exploradores Elfos', cantidad: 300, ubicacion: 'Doghell', porcentaje: 7 },
];

const Ejercito: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
      <Shield className="text-yellow-600" /> Mi Ejército
    </h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[{ label: 'Total tropas', val: '5.630' }, { label: 'Potencial', val: '2.100' }, { label: 'Unidades activas', val: '4' }, { label: 'En movimiento', val: '0' }].map(s => (
        <div key={s.label} className="bg-amber-50 rounded-lg border border-yellow-400 p-4 text-center">
          <div className="text-2xl font-bold text-amber-800">{s.val}</div>
          <div className="text-amber-600 text-sm">{s.label}</div>
        </div>
      ))}
    </div>
    <div className="bg-amber-50 rounded-lg border border-yellow-400 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-amber-100">
          <tr>
            <th className="text-left p-3 text-amber-700">Tipo</th>
            <th className="text-right p-3 text-amber-700">Cantidad</th>
            <th className="text-left p-3 text-amber-700">Ubicación</th>
            <th className="p-3 text-amber-700">% del ejército</th>
          </tr>
        </thead>
        <tbody>
          {TROPAS_TOTALES.map((t, i) => (
            <tr key={t.tipo} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
              <td className="p-3 font-medium text-amber-800">{t.tipo}</td>
              <td className="p-3 text-right text-amber-700">{t.cantidad.toLocaleString()}</td>
              <td className="p-3 text-amber-600">{t.ubicacion}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-amber-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${t.porcentaje}%` }} />
                  </div>
                  <span className="text-xs text-amber-600 w-8">{t.porcentaje}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Ejercito;
```

- [ ] **Step 2: Implementar Alianzas.tsx**

```tsx
// src/pages/Alianzas.tsx
import React from 'react';
import { Users2 } from 'lucide-react';

const ALIANZAS_MOCK = [
  { tipo: 'alianza_formada', texto: '[LGB] Los Guardianes del Bosque han formado alianza con [RC] Reino de Cristal', hace: 'Hace 2 días' },
  { tipo: 'guerra_declarada', texto: '[IS] Imperio de las Sombras ha declarado guerra a [LGB] Los Guardianes del Bosque', hace: 'Hace 3 días' },
  { tipo: 'paz', texto: '[MG] Montañas Grises y [LC] Las Cataratas han firmado la paz', hace: 'Hace 5 días' },
];

const Alianzas: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
      <Users2 className="text-yellow-600" /> Últimas Alianzas
    </h1>
    <div className="space-y-3">
      {ALIANZAS_MOCK.map((a, i) => (
        <div key={i} className={`p-4 rounded-lg border ${a.tipo === 'guerra_declarada' ? 'bg-red-50 border-red-200' : a.tipo === 'alianza_formada' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">{a.tipo === 'guerra_declarada' ? '⚔️' : a.tipo === 'alianza_formada' ? '🤝' : '☮️'}</span>
            <div>
              <p className="text-amber-800 text-sm">{a.texto}</p>
              <p className="text-amber-500 text-xs mt-1">{a.hace}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Alianzas;
```

- [ ] **Step 3: Implementar Conquistas.tsx**

```tsx
// src/pages/Conquistas.tsx
import React from 'react';
import { Trophy } from 'lucide-react';

const CONQUISTAS_MOCK = [
  { tipo: 'victoria', atacante: 'Tierras Doradas', defensor: 'Ciudad del Norte #3', resultado: 'Victoria (+1.200 oro, +500 comida)', hace: 'Hace 6 horas' },
  { tipo: 'derrota', atacante: 'Imperio de las Sombras', defensor: 'Rosvo', resultado: 'Defensa exitosa (−320 atacantes)', hace: 'Hace 1 día' },
  { tipo: 'victoria', atacante: 'Tierras Doradas', defensor: 'Bosque Verde #7', resultado: 'Victoria (+800 madera)', hace: 'Hace 2 días' },
];

const Conquistas: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
      <Trophy className="text-yellow-600" /> Conquistas Generales
    </h1>
    <div className="space-y-3">
      {CONQUISTAS_MOCK.map((c, i) => (
        <div key={i} className={`p-4 rounded-lg border ${c.tipo === 'victoria' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span>{c.tipo === 'victoria' ? '✅' : '🛡️'}</span>
                <span className="font-medium text-amber-800">{c.atacante}</span>
                <span className="text-amber-500">vs</span>
                <span className="font-medium text-amber-800">{c.defensor}</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">{c.resultado}</p>
            </div>
            <span className="text-xs text-amber-500 flex-shrink-0">{c.hace}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Conquistas;
```

- [ ] **Step 4: Verificar y commit final**

```bash
npx tsc --noEmit
npm run dev
git add src/pages/Ejercito.tsx src/pages/Alianzas.tsx src/pages/Conquistas.tsx
git commit -m "feat: implement Ejercito, Alianzas, Conquistas info pages"
```

---

## Verificación Final del Plan 2

Tras completar las 9 tareas:

1. `npx tsc --noEmit` → sin errores
2. `npm run dev` → app arranca sin errores de consola
3. Navegar todas las páginas — ninguna muestra "Próximamente"
4. Cada página con acciones muestra insignias de turnos `(2T)`, `(8T)`, etc.
5. ResourceBar siempre visible con turnos y recursos

**Siguiente paso:** Plan 3 — Servidor MCP para agentes IA.
