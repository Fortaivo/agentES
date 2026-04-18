// src/pages/Clanes.tsx
import React, { useState } from 'react';
import { Users2, Shield, Sword, MessageSquare, Plus } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';
import type { Clan } from '../types/game';

const CLAN_MOCK: Clan = {
  id: 'clan1', nombre: 'Los Guardianes del Bosque', acronimo: 'LGB',
  liderId: 'u1', miembros: ['u1', 'u2', 'u3', 'u4', 'u5'],
  descripcion: 'Clan élfico dedicado a la defensa del bosque ancestral.',
  logo: '\u{1F332}', puntos: 45230,
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

      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{CLAN_MOCK.logo}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-amber-800">[{CLAN_MOCK.acronimo}] {CLAN_MOCK.nombre}</h2>
            <p className="text-amber-600 mt-1">{CLAN_MOCK.descripcion}</p>
            <div className="flex gap-4 mt-2 text-sm text-amber-700 flex-wrap">
              <span>{CLAN_MOCK.miembros.length} miembros</span>
              <span>{CLAN_MOCK.puntos.toLocaleString()} puntos</span>
              <span>{CLAN_MOCK.guerrasActivas.length} guerra(s) activa(s)</span>
              <span>{CLAN_MOCK.alianzas.length} alianza(s)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-yellow-300">
        {(['info', 'miembros', 'diplomacia', 'actividad'] as const).map(t => (
          <button type="button" key={t} onClick={() => setTab(t)}
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
            <button type="button" className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100">
              Reino de Cristal <span className="text-xs bg-blue-200 px-2 py-0.5 rounded">Aliado</span>
            </button>
          </div>
          <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2"><Sword size={16} /> Guerras activas</h3>
            <div className="text-amber-600 text-sm mb-3">1 guerra activa</div>
            <button type="button" className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100">
              Imperio de las Sombras <span className="text-xs bg-red-200 px-2 py-0.5 rounded">En guerra</span>
            </button>
            <button type="button" className="w-full mt-3 flex items-center gap-2 p-2 bg-red-100 hover:bg-red-200 border border-red-300 rounded text-red-700 text-sm">
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
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm">
              <MessageSquare size={14} /> Foro del clan
            </button>
          </div>
        </div>
      )}

      {tab === 'actividad' && (
        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4 text-amber-600 text-sm">
          <p className="text-center py-8">El historial de actividad del clan aparecerá aquí cuando el backend esté conectado.</p>
        </div>
      )}
    </div>
  );
};

export default Clanes;
