# Empire Strike — Plan 4: Huecos Críticos

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rellenar los 4 huecos funcionales críticos que impiden que la UI sea usable: fundar ciudad, flujo de ataque, multi-ciudad y el formulario de añadir agente. Más mejoras a ResourceBar.

**Architecture:** Cada tarea es independiente. No hay dependencias entre Tasks 1–5. Se pueden ejecutar en cualquier orden o en paralelo.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React  
**Prerequisito:** Plan 1–3 completados

---

### Task 1: FundarCiudad — Implementación completa

**Files:**
- Modify: `src/pages/FundarCiudad.tsx`

- [ ] **Step 1: Reemplazar el placeholder con página funcional**

```tsx
// src/pages/FundarCiudad.tsx
import React, { useState } from 'react';
import { Building, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';
import type { Raza } from '../types/game';

type TipoTerreno = 'bosque' | 'llanura' | 'montaña' | 'costa' | 'desierto' | 'pantano';

interface Region {
  id: string;
  nombre: string;
  tipoTerreno: TipoTerreno;
  bonusProduccion: string;
  ocupada: boolean;
  coordX: number;
  coordY: number;
}

const BONUS_TERRENO: Record<TipoTerreno, { icono: string; descripcion: string; produccion: string }> = {
  bosque:   { icono: '🌲', descripcion: 'Bosque', produccion: '+30% madera, -10% comida' },
  llanura:  { icono: '🌾', descripcion: 'Llanura', produccion: '+25% comida, +10% población' },
  montaña:  { icono: '⛰️', descripcion: 'Montaña', produccion: '+40% hierro y piedra, -20% comida' },
  costa:    { icono: '🌊', descripcion: 'Costa', produccion: '+20% comercio, +15% comida' },
  desierto: { icono: '🏜️', descripcion: 'Desierto', produccion: '+50% oro, -30% comida, -20% población' },
  pantano:  { icono: '🌿', descripcion: 'Pantano', produccion: '+35% maná, -15% felicidad' },
};

const REGIONES_MOCK: Region[] = [
  { id: 'r1', nombre: 'Valle del Sol',     tipoTerreno: 'llanura',  bonusProduccion: '+25% comida', ocupada: false, coordX: 45, coordY: 30 },
  { id: 'r2', nombre: 'Bosque Profundo',   tipoTerreno: 'bosque',   bonusProduccion: '+30% madera', ocupada: false, coordX: 62, coordY: 45 },
  { id: 'r3', nombre: 'Pico del Águila',   tipoTerreno: 'montaña',  bonusProduccion: '+40% hierro',  ocupada: true,  coordX: 78, coordY: 20 },
  { id: 'r4', nombre: 'Bahía Esmeralda',   tipoTerreno: 'costa',    bonusProduccion: '+20% comercio', ocupada: false, coordX: 20, coordY: 65 },
  { id: 'r5', nombre: 'Arenas Doradas',    tipoTerreno: 'desierto', bonusProduccion: '+50% oro',     ocupada: false, coordX: 55, coordY: 70 },
  { id: 'r6', nombre: 'Marismas del Maná', tipoTerreno: 'pantano',  bonusProduccion: '+35% maná',    ocupada: false, coordX: 30, coordY: 50 },
];

const RECURSOS_NECESARIOS = { oro: 200000, madera: 5000, piedra: 3000 };

const FundarCiudad: React.FC = () => {
  const [regionSeleccionada, setRegionSeleccionada] = useState<Region | null>(null);
  const [nombreCiudad, setNombreCiudad] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const [fundada, setFundada] = useState(false);
  const [error, setError] = useState('');

  const puedeConfirmar = regionSeleccionada && nombreCiudad.trim().length >= 2;

  const handleFundar = () => {
    if (!puedeConfirmar) return;
    if (nombreCiudad.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    setError('');
    setFundada(true);
  };

  if (fundada && regionSeleccionada) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4 text-center">
        <CheckCircle size={64} className="text-green-500" />
        <h2 className="text-2xl font-bold text-amber-800">¡Ciudad fundada!</h2>
        <p className="text-amber-600">
          <strong>{nombreCiudad}</strong> ha sido establecida en {regionSeleccionada.nombre}.
        </p>
        <p className="text-amber-500 text-sm">Coste: {COSTOS_TURNOS.fundarCiudad} turnos · 200.000 oro · 5.000 madera · 3.000 piedra</p>
        <button
          onClick={() => { setFundada(false); setRegionSeleccionada(null); setNombreCiudad(''); }}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Fundar otra ciudad
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
              <Building className="text-yellow-600" /> Fundar Nueva Ciudad
            </h1>
            <p className="text-amber-600 mt-1">Elige una región libre y nombra tu nueva ciudad.</p>
          </div>
          <div className="bg-amber-50 border border-yellow-400 rounded-lg p-3 text-sm space-y-1">
            <div className="font-bold text-amber-800 flex items-center gap-1">
              Coste: <span className="text-red-600">{COSTOS_TURNOS.fundarCiudad}T</span>
            </div>
            <div className="text-amber-600">🪙 200.000 oro</div>
            <div className="text-amber-600">🪵 5.000 madera</div>
            <div className="text-amber-600">🪨 3.000 piedra</div>
          </div>
        </div>
      </div>

      {!confirmando ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selección de región */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-bold text-amber-800">1. Elige una región</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REGIONES_MOCK.map(r => {
                const terreno = BONUS_TERRENO[r.tipoTerreno];
                const seleccionada = regionSeleccionada?.id === r.id;
                return (
                  <button
                    key={r.id}
                    disabled={r.ocupada}
                    onClick={() => setRegionSeleccionada(r)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      r.ocupada
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300'
                        : seleccionada
                          ? 'border-yellow-500 bg-yellow-50 shadow-md'
                          : 'border-yellow-300 bg-amber-50 hover:border-yellow-400 hover:bg-amber-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{terreno.icono}</span>
                      <div>
                        <div className="font-bold text-amber-800">{r.nombre}</div>
                        <div className="text-xs text-amber-500">{terreno.descripcion}</div>
                      </div>
                      {r.ocupada && (
                        <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Ocupada</span>
                      )}
                      {seleccionada && (
                        <CheckCircle size={18} className="ml-auto text-yellow-600" />
                      )}
                    </div>
                    <div className="text-xs text-green-700 font-medium">{terreno.produccion}</div>
                    <div className="text-xs text-amber-500 mt-1">📍 {r.coordX}, {r.coordY}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel de confirmación */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-amber-800">2. Nombre de la ciudad</h2>
            <div>
              <input
                type="text"
                value={nombreCiudad}
                onChange={e => setNombreCiudad(e.target.value)}
                placeholder="Ej: Ciudad Nueva, Puerto Dorado…"
                maxLength={30}
                className="w-full border-2 border-yellow-400 rounded-lg p-3 text-amber-800 bg-amber-50 placeholder-amber-300 focus:outline-none focus:border-yellow-600"
              />
              <p className="text-amber-500 text-xs mt-1">{nombreCiudad.length}/30 caracteres</p>
              {error && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
            </div>

            {regionSeleccionada && (
              <div className="bg-amber-50 border border-yellow-400 rounded-lg p-4">
                <h3 className="font-bold text-amber-800 mb-2">Resumen</h3>
                <div className="text-sm space-y-1 text-amber-700">
                  <div>📍 Región: <strong>{regionSeleccionada.nombre}</strong></div>
                  <div>{BONUS_TERRENO[regionSeleccionada.tipoTerreno].icono} Terreno: {BONUS_TERRENO[regionSeleccionada.tipoTerreno].descripcion}</div>
                  <div>🌱 Bonus: {BONUS_TERRENO[regionSeleccionada.tipoTerreno].produccion}</div>
                </div>
              </div>
            )}

            <button
              disabled={!puedeConfirmar}
              onClick={() => setConfirmando(true)}
              className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                puedeConfirmar
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  : 'bg-amber-200 text-amber-400 cursor-not-allowed'
              }`}
            >
              <MapPin size={16} />
              Continuar
              <span className={`text-xs px-1.5 py-0.5 rounded ${puedeConfirmar ? 'bg-amber-700 text-amber-200' : 'bg-amber-300 text-amber-500'}`}>
                {COSTOS_TURNOS.fundarCiudad}T
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Pantalla de confirmación */
        <div className="max-w-md mx-auto bg-gradient-to-b from-amber-100 to-yellow-200 p-8 rounded-lg border-2 border-yellow-600 text-center space-y-4">
          <Building size={48} className="text-amber-600 mx-auto" />
          <h2 className="text-2xl font-bold text-amber-800">¿Confirmar fundación?</h2>
          <div className="bg-amber-50 rounded-lg p-4 text-left space-y-2 text-sm text-amber-700">
            <div>🏙️ Ciudad: <strong className="text-amber-900">{nombreCiudad}</strong></div>
            <div>📍 Región: <strong>{regionSeleccionada?.nombre}</strong></div>
            <div>🗺️ Terreno: {regionSeleccionada ? BONUS_TERRENO[regionSeleccionada.tipoTerreno].descripcion : ''}</div>
            <div className="pt-2 border-t border-yellow-300 font-semibold text-red-700">
              Coste: {COSTOS_TURNOS.fundarCiudad}T · 200.000 oro · 5.000 madera · 3.000 piedra
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmando(false)}
              className="flex-1 bg-white border border-yellow-400 text-amber-700 py-2.5 rounded-lg font-semibold hover:bg-amber-50"
            >
              Volver
            </button>
            <button
              onClick={handleFundar}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-bold"
            >
              ¡Fundar!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundarCiudad;
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/FundarCiudad.tsx
git commit -m "feat: implement FundarCiudad page with region selection, terrain bonuses, and confirmation flow"
```

---

### Task 2: Atacar — Nuevo flujo de ataque

El juego necesita una página donde el jugador elige a quién atacar, con qué héroe, y ve el resultado. La Combat page muestra el resultado; esta página lanza el ataque.

**Files:**
- Create: `src/pages/Atacar.tsx`
- Modify: `src/App.tsx` (añadir ruta 'atacar')
- Modify: `src/components/Sidebar.tsx` (añadir enlace en ACCIONES)

- [ ] **Step 1: Crear la página de ataque**

```tsx
// src/pages/Atacar.tsx
import React, { useState } from 'react';
import { Sword, Shield, Users, ChevronRight, AlertTriangle } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

type Paso = 'objetivo' | 'heroe' | 'confirmar' | 'resultado';

interface ObjetivoAtaque {
  id: string;
  nombreImperio: string;
  nombreCiudad: string;
  region: 'misma_region' | 'adyacente';
  tropasAproximadas: string;
  nivelDefensa: 'baja' | 'media' | 'alta';
  raza: string;
  ultimaActividad: string;
  esAgente: boolean;
}

interface HeroeDisponible {
  id: string;
  nombre: string;
  nivel: number;
  clase: string;
  tropas: number;
  ubicacion: string;
  motivado: boolean;
}

const OBJETIVOS_MOCK: ObjetivoAtaque[] = [
  { id: 'o1', nombreImperio: 'Imperio de las Sombras', nombreCiudad: 'Oscurheim', region: 'misma_region', tropasAproximadas: '2.100–2.500', nivelDefensa: 'media', raza: 'Orcos', ultimaActividad: 'Hace 2h', esAgente: true },
  { id: 'o2', nombreImperio: 'Montañas Grises', nombreCiudad: 'Fortaleza Enana', region: 'adyacente', tropasAproximadas: '4.000+', nivelDefensa: 'alta', raza: 'Enanos', ultimaActividad: 'Hace 30min', esAgente: false },
  { id: 'o3', nombreImperio: 'Valle Olvidado', nombreCiudad: 'Aldea Perdida', region: 'misma_region', tropasAproximadas: '300–600', nivelDefensa: 'baja', raza: 'Humanos', ultimaActividad: 'Hace 1 día', esAgente: false },
];

const HEROES_MOCK: HeroeDisponible[] = [
  { id: 'h1', nombre: 'Doghell N1', nivel: 1, clase: 'Ladrón', tropas: 850, ubicacion: 'Bosque Verde #16', motivado: true },
];

const COLOR_DEFENSA: Record<string, string> = {
  baja:  'bg-green-100 text-green-700 border-green-300',
  media: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  alta:  'bg-red-100 text-red-700 border-red-300',
};

const LABEL_DEFENSA: Record<string, string> = { baja: '⬇️ Baja', media: '➡️ Media', alta: '⬆️ Alta' };

const Atacar: React.FC = () => {
  const [paso, setPaso] = useState<Paso>('objetivo');
  const [objetivo, setObjetivo] = useState<ObjetivoAtaque | null>(null);
  const [heroe, setHeroe] = useState<HeroeDisponible | null>(null);
  const [atacando, setAtacando] = useState(false);
  const [resultado, setResultado] = useState<'victoria' | 'derrota' | null>(null);

  const costeTurnos = objetivo?.region === 'adyacente'
    ? COSTOS_TURNOS.ataqueRegionalAdyacente
    : COSTOS_TURNOS.ataqueRegionalMismaRegion;

  const lanzarAtaque = async () => {
    setAtacando(true);
    await new Promise(r => setTimeout(r, 1500)); // simula llamada API
    setResultado(Math.random() > 0.4 ? 'victoria' : 'derrota');
    setPaso('resultado');
    setAtacando(false);
  };

  // Breadcrumb de pasos
  const pasos: { id: Paso; label: string }[] = [
    { id: 'objetivo', label: 'Objetivo' },
    { id: 'heroe', label: 'Héroe' },
    { id: 'confirmar', label: 'Confirmar' },
    { id: 'resultado', label: 'Resultado' },
  ];

  const pasoIdx = pasos.findIndex(p => p.id === paso);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-gradient-to-r from-red-100 to-orange-200 p-6 rounded-lg border-2 border-red-400">
        <h1 className="text-3xl font-bold text-red-800 flex items-center gap-3">
          <Sword className="text-red-600" /> Atacar
        </h1>
        <p className="text-red-700 mt-1">Elige tu objetivo, asigna un héroe y lanza el ataque.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {pasos.map((p, i) => (
          <React.Fragment key={p.id}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              i < pasoIdx ? 'bg-green-100 text-green-700' :
              i === pasoIdx ? 'bg-amber-600 text-white' :
              'bg-amber-100 text-amber-400'
            }`}>
              {i < pasoIdx ? '✓' : i + 1}. {p.label}
            </div>
            {i < pasos.length - 1 && <ChevronRight size={14} className="text-amber-400" />}
          </React.Fragment>
        ))}
      </div>

      {/* Paso 1: Seleccionar objetivo */}
      {paso === 'objetivo' && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-amber-800">Elige tu objetivo</h2>
          {OBJETIVOS_MOCK.map(obj => (
            <button
              key={obj.id}
              onClick={() => { setObjetivo(obj); setPaso('heroe'); }}
              className="w-full text-left p-4 bg-amber-50 rounded-lg border-2 border-yellow-300 hover:border-yellow-500 hover:bg-amber-100 transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-lg">⚔️</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-amber-800">{obj.nombreCiudad}</span>
                      <span className="text-amber-600 text-sm">— {obj.nombreImperio}</span>
                      {obj.esAgente && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">🤖 IA</span>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-amber-600 flex-wrap">
                      <span>Raza: {obj.raza}</span>
                      <span>Tropas: ~{obj.tropasAproximadas}</span>
                      <span>Última actividad: {obj.ultimaActividad}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${COLOR_DEFENSA[obj.nivelDefensa]}`}>
                    {LABEL_DEFENSA[obj.nivelDefensa]} defensa
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    obj.region === 'misma_region'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {obj.region === 'misma_region' ? `${COSTOS_TURNOS.ataqueRegionalMismaRegion}T` : `${COSTOS_TURNOS.ataqueRegionalAdyacente}T`}
                  </span>
                  <ChevronRight size={16} className="text-amber-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Paso 2: Seleccionar héroe */}
      {paso === 'heroe' && objetivo && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setPaso('objetivo')} className="text-amber-600 hover:text-amber-800 text-sm">← Volver</button>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700 flex items-start gap-2">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <div>Atacando <strong>{objetivo.nombreCiudad}</strong> ({objetivo.nombreImperio}). Defensa estimada: {LABEL_DEFENSA[objetivo.nivelDefensa]}.</div>
          </div>
          <h2 className="text-lg font-bold text-amber-800">Elige el héroe que liderará el ataque</h2>
          {HEROES_MOCK.map(h => (
            <button
              key={h.id}
              onClick={() => { setHeroe(h); setPaso('confirmar'); }}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                h.motivado
                  ? 'bg-amber-50 border-yellow-300 hover:border-yellow-500 hover:bg-amber-100'
                  : 'bg-gray-50 border-gray-300 opacity-60 cursor-not-allowed'
              }`}
              disabled={!h.motivado}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-xl">⚔️</div>
                <div className="flex-1">
                  <div className="font-bold text-amber-800">{h.nombre}</div>
                  <div className="text-xs text-amber-600">{h.clase} · Nivel {h.nivel} · {h.ubicacion}</div>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="flex items-center gap-1 text-amber-700"><Users size={12} /> {h.tropas.toLocaleString()} tropas</span>
                    {!h.motivado && <span className="text-red-600">⚠️ Sin motivación (pocas tropas)</span>}
                  </div>
                </div>
                <ChevronRight size={16} className="text-amber-400" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Paso 3: Confirmar */}
      {paso === 'confirmar' && objetivo && heroe && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setPaso('heroe')} className="text-amber-600 hover:text-amber-800 text-sm">← Volver</button>
          </div>
          <div className="bg-gradient-to-b from-red-100 to-orange-200 p-6 rounded-lg border-2 border-red-400 space-y-4">
            <h2 className="text-xl font-bold text-red-800 text-center">Confirmar Ataque</h2>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-1">⚔️</div>
                <div className="font-bold text-blue-800 text-sm">{heroe.nombre}</div>
                <div className="text-xs text-blue-600">{heroe.tropas.toLocaleString()} tropas</div>
              </div>
              <div className="text-2xl font-bold text-red-600">VS</div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl mb-1">🏰</div>
                <div className="font-bold text-red-800 text-sm">{objetivo.nombreCiudad}</div>
                <div className="text-xs text-red-600">~{objetivo.tropasAproximadas} tropas</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-60 rounded-lg p-3 text-sm space-y-1 text-amber-700">
              <div className="flex justify-between"><span>Región:</span><span className="font-medium">{objetivo.region === 'misma_region' ? 'Misma región' : 'Región adyacente'}</span></div>
              <div className="flex justify-between"><span>Coste:</span><span className="font-bold text-red-700">{costeTurnos} turnos</span></div>
              <div className="flex justify-between"><span>Defensa estimada:</span><span>{LABEL_DEFENSA[objetivo.nivelDefensa]}</span></div>
            </div>
            <div className="bg-yellow-50 border border-yellow-300 rounded p-2 text-xs text-yellow-700 flex items-start gap-1">
              <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
              Las bajas son permanentes. Asegúrate de tener tropas suficientes.
            </div>
            <button
              onClick={lanzarAtaque}
              disabled={atacando}
              className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                atacando ? 'bg-amber-400 cursor-wait' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
              }`}
            >
              {atacando ? (
                <><span className="animate-spin">⚔️</span> Atacando…</>
              ) : (
                <><Sword size={18} /> ¡Atacar! <span className="bg-red-700 text-red-200 text-sm px-2 py-0.5 rounded">{costeTurnos}T</span></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Paso 4: Resultado */}
      {paso === 'resultado' && objetivo && heroe && resultado && (
        <div className="max-w-lg mx-auto text-center space-y-4">
          <div className={`p-8 rounded-lg border-2 ${resultado === 'victoria' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
            <div className="text-6xl mb-4">{resultado === 'victoria' ? '🏆' : '💀'}</div>
            <h2 className={`text-3xl font-bold mb-2 ${resultado === 'victoria' ? 'text-green-800' : 'text-red-800'}`}>
              {resultado === 'victoria' ? '¡Victoria!' : 'Derrota'}
            </h2>
            <p className={`text-sm ${resultado === 'victoria' ? 'text-green-600' : 'text-red-600'}`}>
              {resultado === 'victoria'
                ? `Has conquistado ${objetivo.nombreCiudad}. Botín obtenido: +1.200 oro, +300 comida`
                : `Tu ejército fue repelido en ${objetivo.nombreCiudad}. Bajas: ~320 tropas`}
            </p>
            <p className="text-amber-600 text-xs mt-2">Coste: {costeTurnos} turnos gastados</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setPaso('objetivo'); setObjetivo(null); setHeroe(null); setResultado(null); }}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
            >
              Nuevo ataque
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Atacar;
```

- [ ] **Step 2: Añadir ruta en App.tsx**

En `src/App.tsx`, añadir el import y el case del switch:

```tsx
// Añadir import
import Atacar from './pages/Atacar';

// Añadir en PaginaId type del Sidebar:
// 'atacar' (si no está ya)

// Añadir en renderPagina():
case 'atacar': return <Atacar />;
```

- [ ] **Step 3: Añadir entrada en Sidebar.tsx**

En el bloque `ACCIONES` del Sidebar, añadir después del item de "Mover Tropas":

```tsx
{item({ id: 'atacar' as PaginaId, label: 'Atacar', icon: Sword, insignia: '8T' })}
```

Y añadir `'atacar'` al tipo `PaginaId`:

```tsx
export type PaginaId =
  | 'dashboard' | 'ejercito' | 'alianzas' | 'conquistas'
  | 'heroes' | 'tropas' | 'monturas' | 'espionaje' | 'atacar'  // ← añadir
  // ... resto igual
```

- [ ] **Step 4: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Atacar.tsx src/App.tsx src/components/Sidebar.tsx
git commit -m "feat: add full attack flow page (Atacar) with target selection, hero assignment, and result screen"
```

---

### Task 3: Cities — Selector multi-ciudad

La página Cities actualmente muestra una sola ciudad hardcodeada. Con 2+ ciudades, el jugador necesita poder cambiar entre ellas.

**Files:**
- Modify: `src/pages/Cities.tsx`

- [ ] **Step 1: Añadir selector de ciudad al principio de Cities.tsx**

```tsx
// src/pages/Cities.tsx — añadir al inicio del componente (tras imports)

const CIUDADES_MOCK: Ciudad[] = [
  {
    id: 'c1', nombre: 'Rosvo', tipoTerreno: 'Bosque',
    poblacion: 34492, felicidad: 100, moral: 100, corrupcion: 0,
    higiene: 44, religion: 77, cultura: 71,
    coordX: 523, coordY: 12, impuestos: 19, limiteTropas: 10000,
    edificios: [
      { id: 'e1', tipo: 'castillo',  nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e2', tipo: 'muralla',   nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e3', tipo: 'armeria',   nivel: 2, nivelMaximo: 10, enConstruccion: false },
      { id: 'e4', tipo: 'foso',      nivel: 1, nivelMaximo: 10, enConstruccion: true, construccionTerminaEn: new Date(Date.now() + 3600000).toISOString() },
      { id: 'e5', tipo: 'cuartel',   nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e6', tipo: 'mina_oro',  nivel: 3, nivelMaximo: 10, enConstruccion: false },
      { id: 'e7', tipo: 'torre_magica', nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e8', tipo: 'universidad', nivel: 2, nivelMaximo: 10, enConstruccion: false },
    ],
    tropas: { 'N1_Guerreros_elfos': 850, 'N2_Arqueros_elfos': 400, 'N3_Centauros': 250, 'N4_Exploradores_elfos': 50 },
    produccionDiaria: { oro: 34492, comida: 177, madera: 482 },
    consumoDiario: { comida: 229, agua: 225 },
  },
  {
    id: 'c2', nombre: 'Doghell', tipoTerreno: 'Llanura',
    poblacion: 12000, felicidad: 88, moral: 95, corrupcion: 5,
    higiene: 60, religion: 55, cultura: 40,
    coordX: 310, coordY: 85, impuestos: 15, limiteTropas: 8000,
    edificios: [
      { id: 'e9',  tipo: 'castillo',  nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e10', tipo: 'cultivos',  nivel: 2, nivelMaximo: 10, enConstruccion: false },
      { id: 'e11', tipo: 'mercado',   nivel: 1, nivelMaximo: 10, enConstruccion: false },
    ],
    tropas: { 'N1_Guerreros_elfos': 300, 'N2_Arqueros_elfos': 240 },
    produccionDiaria: { oro: 12000, comida: 350, madera: 120 },
    consumoDiario: { comida: 180, agua: 100 },
  },
];
```

Luego reemplazar el `useState` de ciudad por:

```tsx
const Cities: React.FC = () => {
  const [ciudadId, setCiudadId] = useState<string>('c1');
  const ciudadActual = CIUDADES_MOCK.find(c => c.id === ciudadId) ?? CIUDADES_MOCK[0];
  // ... resto del componente igual
```

Y añadir el selector de ciudad en la cabecera, antes del botón "Fundar ciudad":

```tsx
{/* Selector de ciudad */}
<div className="flex gap-2 flex-wrap">
  {CIUDADES_MOCK.map(c => (
    <button
      key={c.id}
      onClick={() => setCiudadId(c.id)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2 ${
        c.id === ciudadId
          ? 'bg-amber-600 text-white border-amber-600'
          : 'bg-amber-50 text-amber-700 border-yellow-300 hover:border-yellow-500'
      }`}
    >
      🏙️ {c.nombre}
    </button>
  ))}
</div>
```

- [ ] **Step 2: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/Cities.tsx
git commit -m "feat: add multi-city switcher to Cities page with 2 mock cities"
```

---

### Task 4: ResourceBar — Producción diaria y cuenta regresiva de turnos

**Files:**
- Modify: `src/components/ResourceBar.tsx`

- [ ] **Step 1: Añadir hook de cuenta regresiva y producción diaria**

Añadir props `produccionDiaria` y mostrar la hora de reset de turnos:

```tsx
// src/components/ResourceBar.tsx — versión actualizada

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Recursos } from '../types/game';

interface ResourceBarProps {
  recursos: Recursos;
  produccionDiaria?: Partial<Recursos>;  // ← nueva prop opcional
  turnos: number;
  turnosGastadosHoy: number;
  diaTemporada: number;
}

// Hook para cuenta regresiva hasta las 22:00 UTC
function useContadorReset() {
  const [texto, setTexto] = useState('');

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date();
      const reset = new Date(ahora);
      reset.setUTCHours(22, 0, 0, 0);
      if (reset <= ahora) reset.setUTCDate(reset.getUTCDate() + 1);
      const diff = reset.getTime() - ahora.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTexto(`${h}h ${m}m`);
    };
    calcular();
    const timer = setInterval(calcular, 60000);
    return () => clearInterval(timer);
  }, []);

  return texto;
}

// ... (mantener RECURSOS_PRINCIPALES, RECURSOS_SECUNDARIOS, formatNum igual que antes)

const ResourceBar: React.FC<ResourceBarProps> = ({
  recursos, produccionDiaria, turnos, turnosGastadosHoy, diaTemporada
}) => {
  const [expandido, setExpandido] = useState(false);
  const resetEn = useContadorReset();

  return (
    <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-b-2 border-yellow-600">
      <div className="flex items-center gap-1 px-4 py-2 flex-wrap">
        {RECURSOS_PRINCIPALES.map(({ key, emoji, abrev }) => (
          <div key={key} className="flex items-center gap-1 bg-amber-950 rounded px-2 py-1 min-w-[70px]">
            <span className="text-sm">{emoji}</span>
            <div>
              <div className="text-yellow-200 text-xs font-bold leading-none">{formatNum(recursos[key])}</div>
              <div className="text-amber-500 text-[10px] leading-none flex items-center gap-0.5">
                {abrev}
                {produccionDiaria?.[key] ? (
                  <span className="text-green-400">+{formatNum(produccionDiaria[key]!)}</span>
                ) : null}
              </div>
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

        <div className="flex-1" />

        {/* Día de temporada */}
        <div className="text-amber-400 text-xs mr-3">
          Día <span className="text-yellow-200 font-bold">{diaTemporada}</span>/60
        </div>

        {/* Contador de turnos con reset */}
        <div className="flex items-center gap-2 bg-amber-950 border border-yellow-600 rounded-lg px-3 py-1">
          <Clock size={14} className="text-yellow-400" />
          <div>
            <div className="text-yellow-200 text-sm font-bold leading-none">⏳ {turnos}</div>
            <div className="text-amber-500 text-[10px] leading-none">
              -{turnosGastadosHoy} hoy · reset {resetEn}
            </div>
          </div>
        </div>
      </div>

      {expandido && (
        <div className="flex flex-wrap gap-1 px-4 pb-2">
          {RECURSOS_SECUNDARIOS.map(({ key, emoji, abrev }) => (
            <div key={key} className="flex items-center gap-1 bg-amber-950 rounded px-2 py-1 min-w-[70px]">
              <span className="text-sm">{emoji}</span>
              <div>
                <div className="text-yellow-200 text-xs font-bold leading-none">{formatNum(recursos[key])}</div>
                <div className="text-amber-500 text-[10px] leading-none flex items-center gap-0.5">
                  {abrev}
                  {produccionDiaria?.[key] ? (
                    <span className="text-green-400">+{formatNum(produccionDiaria[key]!)}</span>
                  ) : null}
                </div>
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

- [ ] **Step 2: Actualizar App.tsx para pasar produccionDiaria**

```tsx
// En App.tsx, añadir mock de producción diaria
const PRODUCCION_DIARIA_MOCK: Partial<Recursos> = {
  oro: 500, comida: 200, madera: 100, piedra: 50, hierro: 30,
};

// Y en el JSX:
<ResourceBar
  recursos={RECURSOS_MOCK}
  produccionDiaria={PRODUCCION_DIARIA_MOCK}
  turnos={73}
  turnosGastadosHoy={27}
  diaTemporada={12}
/>
```

- [ ] **Step 3: Verificar y commit**

```bash
npx tsc --noEmit
git add src/components/ResourceBar.tsx src/App.tsx
git commit -m "feat: add daily production rates and turn reset countdown to ResourceBar"
```

---

### Task 5: ImperiosAgente — Formulario real de añadir agente

**Files:**
- Modify: `src/pages/ImperiosAgente.tsx`

- [ ] **Step 1: Reemplazar el área de añadir agente con modal funcional**

Añadir estado para el modal y el formulario al componente `ImperiosAgente`:

```tsx
// Añadir estos estados en el componente ImperiosAgente:
const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
const [nuevoAgente, setNuevoAgente] = useState({
  nombreImperio: '',
  raza: 'elfos' as Raza,
  modelo: 'claude' as ModeloIA,
  estrategia: 'equilibrada' as EstrategiaAgente,
  relacion: 'enemigo' as RelacionAgente,
});
const [erroresForm, setErroresForm] = useState<string[]>([]);

const validarYCrear = () => {
  const errs: string[] = [];
  if (nuevoAgente.nombreImperio.trim().length < 2) errs.push('El nombre del imperio debe tener al menos 2 caracteres.');
  if (errs.length) { setErroresForm(errs); return; }
  
  const nuevo: ImperioAgente = {
    id: `a_${Date.now()}`,
    nombreImperio: nuevoAgente.nombreImperio.trim(),
    raza: nuevoAgente.raza,
    modelo: nuevoAgente.modelo,
    estrategia: nuevoAgente.estrategia,
    relacion: nuevoAgente.relacion,
    activo: false,
    ranking: 999,
    turnosUsadosHoy: 0,
    ultimasAcciones: [],
    mcpToken: `tok_${Math.random().toString(36).slice(2, 10)}`,
  };
  setAgentes(prev => [...prev, nuevo]);
  setMostrandoFormulario(false);
  setNuevoAgente({ nombreImperio: '', raza: 'elfos', modelo: 'claude', estrategia: 'equilibrada', relacion: 'enemigo' });
  setErroresForm([]);
};
```

Reemplazar el div de "Añadir nuevo" al final por:

```tsx
{/* Botón añadir */}
{!mostrandoFormulario ? (
  <button
    onClick={() => setMostrandoFormulario(true)}
    className="w-full border-2 border-dashed border-amber-300 rounded-lg p-8 text-center text-amber-500 hover:bg-amber-50 hover:border-amber-400 transition-colors"
  >
    <Bot size={32} className="mx-auto mb-2 text-amber-400" />
    <p className="font-medium">+ Añadir nuevo Imperio Agente</p>
    <p className="text-sm mt-1">Elige modelo · Define estrategia · Conecta via MCP</p>
  </button>
) : (
  /* Formulario inline */
  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-purple-800 text-lg flex items-center gap-2"><Bot size={18} /> Nuevo Imperio Agente</h3>
      <button onClick={() => setMostrandoFormulario(false)} className="text-purple-400 hover:text-purple-700 text-xl">✕</button>
    </div>

    {erroresForm.length > 0 && (
      <div className="bg-red-50 border border-red-300 rounded p-2 text-xs text-red-600 space-y-0.5">
        {erroresForm.map((e, i) => <div key={i}>• {e}</div>)}
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-purple-700 text-sm font-medium block mb-1">Nombre del Imperio *</label>
        <input
          type="text"
          value={nuevoAgente.nombreImperio}
          onChange={e => setNuevoAgente(p => ({ ...p, nombreImperio: e.target.value }))}
          placeholder="Ej: Legión del Caos"
          className="w-full border border-purple-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="text-purple-700 text-sm font-medium block mb-1">Raza</label>
        <select
          value={nuevoAgente.raza}
          onChange={e => setNuevoAgente(p => ({ ...p, raza: e.target.value as Raza }))}
          className="w-full border border-purple-300 rounded p-2 text-sm bg-white"
        >
          {(['elfos', 'elfos_oscuros', 'enanos', 'humanos', 'no_muertos', 'orcos'] as Raza[]).map(r => (
            <option key={r} value={r}>{NOMBRE_RAZA[r]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-purple-700 text-sm font-medium block mb-1">Modelo IA</label>
        <select
          value={nuevoAgente.modelo}
          onChange={e => setNuevoAgente(p => ({ ...p, modelo: e.target.value as ModeloIA }))}
          className="w-full border border-purple-300 rounded p-2 text-sm bg-white"
        >
          <option value="claude">Claude (Anthropic)</option>
          <option value="gpt-4o">GPT-4o (OpenAI)</option>
          <option value="local">Modelo Local</option>
        </select>
      </div>

      <div>
        <label className="text-purple-700 text-sm font-medium block mb-1">Estrategia</label>
        <select
          value={nuevoAgente.estrategia}
          onChange={e => setNuevoAgente(p => ({ ...p, estrategia: e.target.value as EstrategiaAgente }))}
          className="w-full border border-purple-300 rounded p-2 text-sm bg-white"
        >
          <option value="agresiva">Agresiva — prioriza ataques</option>
          <option value="economica">Económica — prioriza producción</option>
          <option value="defensiva">Defensiva — prioriza defensa</option>
          <option value="equilibrada">Equilibrada — estrategia mixta</option>
        </select>
      </div>

      <div>
        <label className="text-purple-700 text-sm font-medium block mb-1">Relación contigo</label>
        <div className="flex gap-2">
          {(['enemigo', 'aliado'] as RelacionAgente[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setNuevoAgente(p => ({ ...p, relacion: r }))}
              className={`flex-1 py-2 rounded text-sm font-medium border-2 transition-all ${
                nuevoAgente.relacion === r
                  ? r === 'enemigo' ? 'bg-red-600 border-red-600 text-white' : 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600'
              }`}
            >
              {r === 'enemigo' ? '⚔️ Enemigo' : '🤝 Aliado'}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-purple-100 rounded p-3 text-xs text-purple-700 space-y-1">
      <div className="font-semibold">Token MCP (generado automáticamente)</div>
      <div className="font-mono bg-white rounded px-2 py-1 text-purple-600">tok_{Math.random().toString(36).slice(2, 10)}</div>
      <div>El agente usará este token para autenticarse en el servidor MCP.</div>
    </div>

    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setMostrandoFormulario(false)}
        className="flex-1 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={validarYCrear}
        className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
      >
        <Bot size={14} className="inline mr-1" /> Crear Agente
      </button>
    </div>
  </div>
)}
```

- [ ] **Step 2: Añadir imports necesarios**

```tsx
// En ImperiosAgente.tsx añadir al import de game.ts:
import type { ImperioAgente, Raza, ModeloIA, EstrategiaAgente, RelacionAgente } from '../types/game';
```

- [ ] **Step 3: Verificar y commit**

```bash
npx tsc --noEmit
git add src/pages/ImperiosAgente.tsx
git commit -m "feat: add working Add Agent form to ImperiosAgente with validation and MCP token display"
```

---

## Verificación Final del Plan 4

1. `npx tsc --noEmit` → sin errores
2. Navegar a "Fundar ciudad" → se muestra mapa de regiones con terrenos
3. Navegar a "Atacar" → flujo completo: elegir objetivo → héroe → confirmar → resultado
4. Navegar a "Ciudades" → botones de cambio entre Rosvo y Doghell funcionan
5. ResourceBar muestra `+500` en verde bajo los recursos con producción
6. ResourceBar muestra cuenta regresiva "Xh Ym" junto al contador de turnos
7. En Imperios Agente → "+" muestra formulario completo con todos los campos
