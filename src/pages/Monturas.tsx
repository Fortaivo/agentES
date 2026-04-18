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
    <div className="flex items-center justify-between flex-wrap gap-2">
      <h1 className="text-3xl font-bold text-amber-800">{'\u{1F40E}'} Monturas</h1>
      <button type="button" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
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
              ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Asignada</span>
              : <button type="button" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded text-sm flex items-center justify-center gap-1">
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
