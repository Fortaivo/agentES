// src/pages/Carromato.tsx
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const ENTREGAS_MOCK = [
  { id: 'd1', desde: 'Rosvo', hacia: 'Doghell', recurso: 'Oro', cantidad: 5000, llegaEn: '14:30' },
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
              <label htmlFor="desde" className="text-amber-700 text-sm font-medium block mb-1">Desde</label>
              <select id="desde" value={desde} onChange={e => setDesde(e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                <option>Rosvo</option><option>Doghell</option>
              </select>
            </div>
            <div>
              <label htmlFor="hacia" className="text-amber-700 text-sm font-medium block mb-1">Hacia</label>
              <select id="hacia" value={hacia} onChange={e => setHacia(e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                <option>Doghell</option><option>Rosvo</option>
              </select>
            </div>
            <div>
              <label htmlFor="recurso-carro" className="text-amber-700 text-sm font-medium block mb-1">Recurso</label>
              <select id="recurso-carro" value={recurso} onChange={e => setRecurso(e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50">
                {['oro','comida','madera','piedra','hierro','plata'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cantidad-carro" className="text-amber-700 text-sm font-medium block mb-1">Cantidad</label>
              <input id="cantidad-carro" type="number" value={cantidad} onChange={e => setCantidad(+e.target.value)} className="w-full border border-yellow-400 rounded p-2 text-amber-800 bg-amber-50" />
            </div>
            <button type="button" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Truck size={16} /> Enviar carromato
              <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">{COSTOS_TURNOS.moverTropas}T</span>
            </button>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <h2 className="text-lg font-bold text-amber-800 mb-4">Envíos en tránsito</h2>
          {ENTREGAS_MOCK.map(e => (
            <div key={e.id} className="p-3 bg-yellow-50 rounded border border-yellow-300">
              <div className="flex items-center gap-2 flex-wrap">
                <Truck size={16} className="text-amber-600" />
                <span className="font-medium text-amber-800">{e.desde} → {e.hacia}</span>
                <span className="ml-auto text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">En tránsito</span>
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
