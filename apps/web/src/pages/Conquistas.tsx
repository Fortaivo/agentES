// src/pages/Conquistas.tsx
import React, { useState } from 'react';
import { Search, Sword, TrendingUp, Trophy } from 'lucide-react';

type TipoBatalla = 'victoria_ataque' | 'derrota_ataque' | 'victoria_defensa' | 'derrota_defensa';
type FiltroConquista = 'todas' | 'victorias' | 'derrotas' | 'defensa';

interface EntradaHistorial {
  id: string;
  tipo: TipoBatalla;
  nombreEnemigo: string;
  ciudadObjetivo: string;
  resultado: string;
  botin: { oro?: number; comida?: number; madera?: number };
  bajasPropias: number;
  bajasEnemigas: number;
  hace: string;
  heroeUsado?: string;
  esAgente: boolean;
}

const HISTORIAL_MOCK: EntradaHistorial[] = [
  {
    id: 'b1',
    tipo: 'victoria_ataque',
    nombreEnemigo: 'Valle Olvidado',
    ciudadObjetivo: 'Aldea Perdida',
    resultado: 'Victoria',
    botin: { oro: 1200, comida: 500 },
    bajasPropias: 45,
    bajasEnemigas: 320,
    hace: 'Hace 6h',
    heroeUsado: 'Doghell N1',
    esAgente: false,
  },
  {
    id: 'b2',
    tipo: 'victoria_defensa',
    nombreEnemigo: 'Imperio de las Sombras',
    ciudadObjetivo: 'Rosvo',
    resultado: 'Defensa',
    botin: {},
    bajasPropias: 120,
    bajasEnemigas: 650,
    hace: 'Hace 1 dia',
    esAgente: true,
  },
  {
    id: 'b3',
    tipo: 'victoria_ataque',
    nombreEnemigo: 'Costa del Sur',
    ciudadObjetivo: 'Puerto Brumoso',
    resultado: 'Victoria',
    botin: { oro: 800, madera: 300 },
    bajasPropias: 80,
    bajasEnemigas: 210,
    hace: 'Hace 2 dias',
    heroeUsado: 'Doghell N1',
    esAgente: false,
  },
  {
    id: 'b4',
    tipo: 'derrota_ataque',
    nombreEnemigo: 'Montanas Grises',
    ciudadObjetivo: 'Fortaleza Enana',
    resultado: 'Derrota',
    botin: {},
    bajasPropias: 820,
    bajasEnemigas: 150,
    hace: 'Hace 3 dias',
    heroeUsado: 'Doghell N1',
    esAgente: false,
  },
  {
    id: 'b5',
    tipo: 'derrota_defensa',
    nombreEnemigo: 'Reino de Acero',
    ciudadObjetivo: 'Doghell',
    resultado: 'Saqueo',
    botin: {},
    bajasPropias: 200,
    bajasEnemigas: 50,
    hace: 'Hace 5 dias',
    esAgente: false,
  },
  {
    id: 'b6',
    tipo: 'victoria_ataque',
    nombreEnemigo: 'Tierras del Norte',
    ciudadObjetivo: 'Ciudad del Norte',
    resultado: 'Victoria',
    botin: { oro: 2100, comida: 800 },
    bajasPropias: 30,
    bajasEnemigas: 480,
    hace: 'Hace 6 dias',
    heroeUsado: 'Doghell N1',
    esAgente: false,
  },
];

const CONFIG_TIPO: Record<TipoBatalla, { icono: string; color: string; etiqueta: string }> = {
  victoria_ataque: { icono: '✅', color: 'bg-green-50 border-green-200', etiqueta: 'Victoria (ataque)' },
  derrota_ataque: { icono: '❌', color: 'bg-red-50 border-red-200', etiqueta: 'Derrota (ataque)' },
  victoria_defensa: { icono: '🛡️', color: 'bg-blue-50 border-blue-200', etiqueta: 'Victoria (defensa)' },
  derrota_defensa: { icono: '💀', color: 'bg-orange-50 border-orange-200', etiqueta: 'Derrota (defensa)' },
};

const FILTROS: FiltroConquista[] = ['todas', 'victorias', 'derrotas', 'defensa'];

const Conquistas: React.FC = () => {
  const [filtro, setFiltro] = useState<FiltroConquista>('todas');
  const [busqueda, setBusqueda] = useState('');

  const batallasVictorias = HISTORIAL_MOCK.filter((batalla) => batalla.tipo.startsWith('victoria')).length;
  const batallasDerrotas = HISTORIAL_MOCK.filter((batalla) => batalla.tipo.startsWith('derrota')).length;
  const totalBajasPropias = HISTORIAL_MOCK.reduce((suma, batalla) => suma + batalla.bajasPropias, 0);
  const totalBajasEnemigas = HISTORIAL_MOCK.reduce((suma, batalla) => suma + batalla.bajasEnemigas, 0);
  const totalBotinOro = HISTORIAL_MOCK.reduce((suma, batalla) => suma + (batalla.botin.oro ?? 0), 0);

  const filtradas = HISTORIAL_MOCK
    .filter((batalla) => {
      if (filtro === 'victorias') {
        return batalla.tipo.startsWith('victoria');
      }
      if (filtro === 'derrotas') {
        return batalla.tipo.startsWith('derrota');
      }
      if (filtro === 'defensa') {
        return batalla.tipo.endsWith('defensa');
      }
      return true;
    })
    .filter((batalla) => {
      const termino = busqueda.trim().toLowerCase();
      if (termino === '') {
        return true;
      }
      return batalla.nombreEnemigo.toLowerCase().includes(termino)
        || batalla.ciudadObjetivo.toLowerCase().includes(termino);
    });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Trophy className="text-yellow-600" />
        Historial de conquistas
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Batallas', valor: HISTORIAL_MOCK.length, icono: <Sword size={16} />, color: 'text-amber-700' },
          { label: 'Victorias', valor: batallasVictorias, icono: '✅', color: 'text-green-700' },
          { label: 'Derrotas', valor: batallasDerrotas, icono: '❌', color: 'text-red-700' },
          { label: 'Botin oro', valor: totalBotinOro.toLocaleString(), icono: '🪙', color: 'text-yellow-700' },
          {
            label: 'Win rate',
            valor: `${Math.round((batallasVictorias / HISTORIAL_MOCK.length) * 100)}%`,
            icono: <TrendingUp size={16} />,
            color: 'text-blue-700',
          },
        ].map((item) => (
          <div key={item.label} className="bg-amber-50 rounded-lg border border-yellow-400 p-3 text-center">
            <div className="text-lg flex justify-center text-amber-700">{item.icono}</div>
            <div className={`text-xl font-bold ${item.color}`}>{item.valor}</div>
            <div className="text-xs text-amber-600">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-700">{totalBajasPropias.toLocaleString()}</div>
          <div className="text-xs text-amber-600">Tus bajas totales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-700">{totalBajasEnemigas.toLocaleString()}</div>
          <div className="text-xs text-amber-600">Bajas enemigas causadas</div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
          <input
            type="text"
            placeholder="Buscar por enemigo o ciudad..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-yellow-400 rounded-lg text-sm bg-amber-50 text-amber-800 focus:outline-none focus:border-yellow-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFiltro(item)}
              className={`text-xs px-3 py-1.5 rounded-full capitalize transition-all ${
                filtro === item
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtradas.map((batalla) => {
          const config = CONFIG_TIPO[batalla.tipo];
          const resumenBotin = [
            batalla.botin.oro ? `+${batalla.botin.oro.toLocaleString()} oro` : null,
            batalla.botin.comida ? `+${batalla.botin.comida.toLocaleString()} comida` : null,
            batalla.botin.madera ? `+${batalla.botin.madera.toLocaleString()} madera` : null,
          ].filter(Boolean).join(' · ');

          return (
            <div key={batalla.id} className={`p-4 rounded-lg border ${config.color}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{config.icono}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-amber-800">{batalla.ciudadObjetivo}</span>
                      <span className="text-amber-500 text-sm">vs {batalla.nombreEnemigo}</span>
                      {batalla.esAgente && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                          IA
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-amber-700 mt-1">{batalla.resultado}</div>
                    <div className="flex gap-3 mt-1 text-xs text-amber-600 flex-wrap">
                      {batalla.heroeUsado && <span>Heroe: {batalla.heroeUsado}</span>}
                      <span className="text-blue-600">Tus bajas: {batalla.bajasPropias}</span>
                      <span className="text-red-600">Enemigas: {batalla.bajasEnemigas}</span>
                      {resumenBotin !== '' && <span className="text-green-600">Botin: {resumenBotin}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded border ${config.color}`}>{config.etiqueta}</span>
                  <div className="text-xs text-amber-500 mt-1">{batalla.hace}</div>
                </div>
              </div>
            </div>
          );
        })}

        {filtradas.length === 0 && (
          <div className="text-center py-8 text-amber-500">
            <Trophy size={32} className="mx-auto mb-2 text-amber-300" />
            <p>No hay batallas que coincidan con el filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conquistas;
