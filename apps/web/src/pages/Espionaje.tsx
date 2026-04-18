// src/pages/Espionaje.tsx
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
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
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Nueva Misión</h2>
          <div className="space-y-3">
            <div>
              <span className="text-amber-700 text-sm font-medium block mb-1">Tipo de espionaje</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTipoSeleccionado('regional')}
                  className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${tipoSeleccionado === 'regional' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-yellow-400 text-amber-700'}`}>
                  Regional <span className={`text-xs px-1.5 rounded ml-1 ${tipoSeleccionado === 'regional' ? 'bg-amber-700 text-amber-200' : 'bg-amber-200 text-amber-700'}`}>{COSTOS_TURNOS.espionajeRegional}T</span>
                </button>
                <button type="button" onClick={() => setTipoSeleccionado('reconquista')}
                  className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${tipoSeleccionado === 'reconquista' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-yellow-400 text-amber-700'}`}>
                  Reconquista <span className={`text-xs px-1.5 rounded ml-1 ${tipoSeleccionado === 'reconquista' ? 'bg-amber-700 text-amber-200' : 'bg-amber-200 text-amber-700'}`}>{COSTOS_TURNOS.espionajeReconquista}T</span>
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="heroe-espia" className="text-amber-700 text-sm font-medium block mb-1">Héroe espía</label>
              <select id="heroe-espia" className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                <option>Doghell N1 — Bosque Verde #16</option>
              </select>
            </div>
            <div>
              <label htmlFor="objetivo" className="text-amber-700 text-sm font-medium block mb-1">Ciudad objetivo</label>
              <input id="objetivo" className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50 placeholder-amber-400" placeholder="Nombre o ID de ciudad..." />
            </div>
            <button type="button" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Eye size={16} /> Ejecutar misión
              <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">{tipoSeleccionado === 'regional' ? COSTOS_TURNOS.espionajeRegional : COSTOS_TURNOS.espionajeReconquista}T</span>
            </button>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Historial de Misiones</h2>
          <div className="space-y-3">
            {MISIONES_MOCK.map(m => (
              <div key={m.id} className={`p-3 rounded-lg border ${m.estado === 'completada' ? 'bg-green-50 border-green-300' : m.estado === 'fallida' ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-amber-800 text-sm capitalize">{m.tipo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${m.estado === 'completada' ? 'bg-green-200 text-green-800' : m.estado === 'fallida' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {m.estado === 'completada' ? 'Éxito' : m.estado === 'fallida' ? 'Fallida' : 'En progreso'}
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
