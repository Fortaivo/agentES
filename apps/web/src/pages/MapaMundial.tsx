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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Map className="text-yellow-600" /> Mapa Mundial
        </h1>
        <div className="flex gap-2">
          {MUNDOS.map(m => (
            <button
              type="button"
              key={m}
              onClick={() => setMundoActual(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mundoActual === m ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >{m}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-amber-700 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Tus ciudades</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 inline-block" /> Aliados</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Enemigos</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-gradient-to-br from-green-900 to-emerald-950 rounded-lg border-2 border-amber-600 relative overflow-hidden" style={{ minHeight: '450px' }}>
          <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden>
            {Array.from({ length: 10 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#fff" strokeWidth="1" />
                <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#fff" strokeWidth="1" />
              </React.Fragment>
            ))}
          </svg>

          {TERRITORIOS_MOCK.map(t => (
            <button
              type="button"
              key={t.id}
              onClick={() => setTerritorioSeleccionado(t)}
              className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform ${colorTerritorio(t)} ${territorioSeleccionado?.id === t.id ? 'ring-2 ring-yellow-400 scale-110' : ''}`}
              style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
              title={t.nombre}
            >
              {'\u{1F3F0}'}
            </button>
          ))}

          <div className="absolute bottom-2 right-2 text-amber-400 text-xs opacity-70">
            Mundo: {mundoActual}
          </div>
        </div>

        <div className="space-y-3">
          {territorioSeleccionado ? (
            <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
              <h3 className="font-bold text-amber-800 text-lg">{territorioSeleccionado.nombre}</h3>
              <p className="text-amber-600 text-sm">{territorioSeleccionado.propietario}</p>
              <p className="text-amber-600 text-sm">Raza: {territorioSeleccionado.raza}</p>
              <div className="mt-3 space-y-2">
                {!territorioSeleccionado.esPropio && (
                  <>
                    <button type="button" className="w-full flex items-center gap-2 p-2 bg-red-100 hover:bg-red-200 border border-red-300 rounded text-red-700 text-sm">
                      <Sword size={14} /> Atacar
                      <span className="ml-auto bg-red-200 text-red-800 text-xs px-1.5 rounded">{COSTOS_TURNOS.ataqueRegionalMismaRegion}T</span>
                    </button>
                    <button type="button" className="w-full flex items-center gap-2 p-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded text-amber-700 text-sm">
                      <Eye size={14} /> Espiar
                      <span className="ml-auto bg-amber-200 text-amber-800 text-xs px-1.5 rounded">{COSTOS_TURNOS.espionajeRegional}T</span>
                    </button>
                  </>
                )}
                <button type="button" className="w-full flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-blue-700 text-sm">
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
              <button type="button" key={t.id} onClick={() => setTerritorioSeleccionado(t)} className="w-full text-left p-2 hover:bg-amber-100 rounded text-sm text-amber-700 flex items-center gap-2">
                {'\u{1F3F0}'} {t.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaMundial;
