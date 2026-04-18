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
        <div className="text-2xl font-bold text-amber-800">29 <span className="text-red-500">{'\u{1F48E}'}</span></div>
        <div className="text-amber-600 text-sm">Rubíes disponibles</div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PAQUETES.map(p => (
        <div key={p.cantidad} className={`rounded-lg border-2 p-5 text-center relative ${p.popular ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-300 bg-amber-50'}`}>
          {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs px-3 py-0.5 rounded-full font-bold">MÁS POPULAR</div>}
          <div className="text-3xl font-bold text-red-500 mb-1">{p.cantidad}</div>
          <div className="text-amber-600 text-sm mb-3">{'\u{1F48E}'} Rubíes</div>
          <button type="button" className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm">{p.precio}</button>
        </div>
      ))}
    </div>
    <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
      <h3 className="font-bold text-amber-800 mb-3">¿Para qué sirven los rubíes?</h3>
      <ul className="space-y-1 text-sm text-amber-700">
        <li>{'\u{1F48E}'} Acelerar construcción de edificios</li>
        <li>{'\u{1F48E}'} Recuperar turnos adicionales</li>
        <li>{'\u{1F48E}'} Desbloquear héroes especiales</li>
        <li>{'\u{1F48E}'} Comprar recursos instantáneamente</li>
      </ul>
    </div>
  </div>
);

export default Rubies;
