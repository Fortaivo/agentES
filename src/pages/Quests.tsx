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

      <div className="flex gap-2 flex-wrap">
        {(['todas', 'diaria', 'semanal', 'epica'] as const).map(f => (
          <button type="button" key={f} onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filtro === f ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
            {f === 'todas' ? 'Todas' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {questsFiltradas.map(q => (
          <div key={q.id} className={`rounded-lg border p-5 ${TIPO_COLOR[q.tipo]}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-lg">{q.titulo}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded border capitalize ${TIPO_COLOR[q.tipo]}`}>{q.tipo}</span>
                </div>
                <p className="text-sm opacity-80 mb-3">{q.descripcion}</p>
                <div className="flex gap-4 text-sm flex-wrap">
                  <span>{'\u{1FA99}'} {q.recompensaOro.toLocaleString()} oro</span>
                  <span>{'\u2B50'} {q.recompensaXP} XP</span>
                  {Object.entries(q.recompensaRecursos).map(([k, v]) => (
                    <span key={k}>+{v} {k}</span>
                  ))}
                </div>
                <p className="text-xs mt-2 opacity-60">Héroe requerido: Nivel {q.heroeRequeridoNivel}+</p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <select className="border rounded p-1.5 text-sm mb-2 block w-full sm:w-40" aria-label="Héroe para la quest">
                  <option>Doghell N1</option>
                </select>
                <button type="button" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded text-sm font-semibold flex items-center justify-center gap-1">
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
