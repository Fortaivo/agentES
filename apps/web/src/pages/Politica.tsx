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
            <label htmlFor="impuestos" className="text-amber-700 text-sm font-medium block mb-1">
              Impuestos: <span className="text-amber-800 font-bold">{impuestos}%</span>
            </label>
            <input id="impuestos" type="range" min={0} max={50} value={impuestos}
              onChange={e => { setImpuestos(+e.target.value); handleChange(); }}
              className="w-full accent-amber-600" />
            <div className="flex justify-between text-xs text-amber-500 mt-1">
              <span>0% (sin ingresos)</span><span>50% (bajo malestar)</span>
            </div>
          </div>

          <div>
            <span className="text-amber-700 text-sm font-medium block mb-2">Actitud diplomática</span>
            <div className="flex gap-2">
              {(['guerra', 'neutral', 'amistoso'] as Actitud[]).map(a => (
                <button type="button" key={a} onClick={() => { setActitud(a); handleChange(); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${
                    actitud === a
                      ? a === 'guerra' ? 'bg-red-600 border-red-600 text-white'
                        : a === 'amistoso' ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-white border-yellow-400 text-amber-700'
                  }`}>
                  {a === 'guerra' ? 'Guerra' : a === 'neutral' ? 'Neutral' : 'Amistoso'}
                </button>
              ))}
            </div>
          </div>

          {cambioPendiente && (
            <button type="button" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
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
