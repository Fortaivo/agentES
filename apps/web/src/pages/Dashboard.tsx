// src/pages/Dashboard.tsx
import React from 'react';
import { Crown, Sword, Building, Users, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const ACTIVIDAD_MOCK = [
  { color: 'bg-green-500', texto: 'Tu héroe Doghell ha subido al nivel 2', hace: 'Hace 2 horas', turnos: 0 },
  { color: 'bg-blue-500', texto: 'Construcción de Armería completada en Rosvo', hace: 'Hace 4 horas', turnos: COSTOS_TURNOS.construirEdificio },
  { color: 'bg-red-500', texto: 'Ataque exitoso contra ciudad enemiga (+1.200 oro)', hace: 'Hace 6 horas', turnos: COSTOS_TURNOS.ataqueRegionalMismaRegion },
  { color: 'bg-yellow-500', texto: 'Tropas movidas a Doghell', hace: 'Hace 8 horas', turnos: COSTOS_TURNOS.moverTropas },
];

const GASTO_TURNOS_HOY = [
  { icon: '\u{1F3D7}\uFE0F', label: 'Construir ×3', turnos: 6 },
  { icon: '\u2694\uFE0F', label: 'Atacar ×2', turnos: 16 },
  { icon: '\u{1F6B6}', label: 'Mover ×5', turnos: 5 },
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
