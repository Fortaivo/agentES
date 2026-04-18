// src/pages/Alianzas.tsx
import React, { useState } from 'react';
import { Filter, Shield, Sword, TrendingUp, Users2 } from 'lucide-react';

type TipoEvento = 'alianza_formada' | 'guerra_declarada' | 'paz' | 'traicion' | 'clan_creado';
type FiltroEvento = 'todos' | TipoEvento;

interface EventoDiplomatico {
  id: string;
  tipo: TipoEvento;
  texto: string;
  hace: string;
  clan1: string;
  clan2?: string;
  impactoRanking?: number;
}

const EVENTOS_MOCK: EventoDiplomatico[] = [
  {
    id: 'e1',
    tipo: 'alianza_formada',
    texto: '[LGB] Los Guardianes del Bosque han formado alianza con [RC] Reino de Cristal',
    hace: 'Hace 2 dias',
    clan1: 'LGB',
    clan2: 'RC',
    impactoRanking: 0,
  },
  {
    id: 'e2',
    tipo: 'guerra_declarada',
    texto: '[IS] Imperio de las Sombras ha declarado guerra a [LGB] Los Guardianes del Bosque',
    hace: 'Hace 3 dias',
    clan1: 'IS',
    clan2: 'LGB',
    impactoRanking: -50,
  },
  {
    id: 'e3',
    tipo: 'paz',
    texto: '[MG] Montanas Grises y [LC] Las Cataratas han firmado la paz',
    hace: 'Hace 5 dias',
    clan1: 'MG',
    clan2: 'LC',
    impactoRanking: 20,
  },
  {
    id: 'e4',
    tipo: 'clan_creado',
    texto: '[NE] Nueva Elite ha sido fundado por DragonLord',
    hace: 'Hace 6 dias',
    clan1: 'NE',
  },
  {
    id: 'e5',
    tipo: 'traicion',
    texto: '[MG] Montanas Grises ha expulsado a Valle Olvidado del clan',
    hace: 'Hace 7 dias',
    clan1: 'MG',
    impactoRanking: -10,
  },
  {
    id: 'e6',
    tipo: 'alianza_formada',
    texto: '[MG] Montanas Grises y [NE] Nueva Elite han sellado una alianza militar',
    hace: 'Hace 8 dias',
    clan1: 'MG',
    clan2: 'NE',
    impactoRanking: 0,
  },
  {
    id: 'e7',
    tipo: 'guerra_declarada',
    texto: '[RC] Reino de Cristal ha declarado guerra a [IS] Imperio de las Sombras',
    hace: 'Hace 10 dias',
    clan1: 'RC',
    clan2: 'IS',
    impactoRanking: -80,
  },
];

const CONFIG_TIPO: Record<TipoEvento, { icono: string; color: string; label: string }> = {
  alianza_formada: { icono: '🤝', color: 'bg-blue-50 border-blue-200', label: 'Alianza' },
  guerra_declarada: { icono: '⚔️', color: 'bg-red-50 border-red-200', label: 'Guerra' },
  paz: { icono: '☮️', color: 'bg-green-50 border-green-200', label: 'Paz' },
  traicion: { icono: '🗡️', color: 'bg-orange-50 border-orange-200', label: 'Traicion' },
  clan_creado: { icono: '🏰', color: 'bg-purple-50 border-purple-200', label: 'Clan nuevo' },
};

const ESTADO_DIPLOMATICO = [
  {
    clan: 'Los Guardianes del Bosque',
    acronimo: 'LGB',
    estado: 'Aliado',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    puntos: 45230,
  },
  {
    clan: 'Imperio de las Sombras',
    acronimo: 'IS',
    estado: 'En guerra',
    color: 'text-red-700 bg-red-50 border-red-200',
    puntos: 38900,
  },
  {
    clan: 'Montanas Grises',
    acronimo: 'MG',
    estado: 'Neutral',
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    puntos: 29100,
  },
  {
    clan: 'Nueva Elite',
    acronimo: 'NE',
    estado: 'Neutral',
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    puntos: 12500,
  },
];

const RESUMEN_GLOBAL = [
  { label: 'Alianzas activas', valor: 3, icono: <Users2 size={16} />, color: 'text-blue-700' },
  { label: 'Guerras en curso', valor: 2, icono: <Sword size={16} />, color: 'text-red-700' },
  { label: 'Clanes activos', valor: 12, icono: '🏰', color: 'text-purple-700' },
  { label: 'Paces firmadas', valor: 1, icono: <TrendingUp size={16} />, color: 'text-green-700' },
];

const FILTROS: FiltroEvento[] = ['todos', 'alianza_formada', 'guerra_declarada', 'paz', 'traicion'];

const Alianzas: React.FC = () => {
  const [filtro, setFiltro] = useState<FiltroEvento>('todos');

  const eventosFiltrados = filtro === 'todos'
    ? EVENTOS_MOCK
    : EVENTOS_MOCK.filter((evento) => evento.tipo === filtro);

  const conteoTipos = EVENTOS_MOCK.reduce((acumulado, evento) => {
    acumulado[evento.tipo] = (acumulado[evento.tipo] ?? 0) + 1;
    return acumulado;
  }, {} as Record<TipoEvento, number>);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Users2 className="text-yellow-600" />
        Ultimas alianzas y diplomacia
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RESUMEN_GLOBAL.map((item) => (
          <div key={item.label} className="bg-amber-50 rounded-lg border border-yellow-400 p-3 text-center">
            <div className="text-lg flex justify-center text-amber-700">{item.icono}</div>
            <div className={`text-xl font-bold mt-1 ${item.color}`}>{item.valor}</div>
            <div className="text-xs text-amber-600 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-amber-500" />
            {FILTROS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFiltro(item)}
                className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                  filtro === item
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {item === 'todos' ? `Todos (${EVENTOS_MOCK.length})` : null}
                {item === 'alianza_formada' ? `🤝 Alianzas (${conteoTipos.alianza_formada ?? 0})` : null}
                {item === 'guerra_declarada' ? `⚔️ Guerras (${conteoTipos.guerra_declarada ?? 0})` : null}
                {item === 'paz' ? `☮️ Paces (${conteoTipos.paz ?? 0})` : null}
                {item === 'traicion' ? `🗡️ Traiciones (${conteoTipos.traicion ?? 0})` : null}
              </button>
            ))}
          </div>

          {eventosFiltrados.map((evento) => {
            const config = CONFIG_TIPO[evento.tipo];

            return (
              <div key={evento.id} className={`p-4 rounded-lg border ${config.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{config.icono}</span>
                  <div className="flex-1">
                    <p className="text-amber-800 text-sm">{evento.texto}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <p className="text-amber-500 text-xs">{evento.hace}</p>
                      <span className={`text-xs px-2 py-0.5 rounded border ${config.color}`}>{config.label}</span>
                      {evento.impactoRanking !== undefined && evento.impactoRanking !== 0 && (
                        <span
                          className={`text-xs font-medium ${
                            evento.impactoRanking > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {evento.impactoRanking > 0 ? '+' : ''}
                          {evento.impactoRanking} pts ranking
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-amber-800 text-lg flex items-center gap-2">
            <Shield size={16} />
            Tu diplomacia
          </h2>
          {ESTADO_DIPLOMATICO.map((item) => (
            <div key={item.acronimo} className={`p-3 rounded-lg border ${item.color}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-sm">[{item.acronimo}]</span>
                  <span className="text-xs text-amber-600 ml-1 block">{item.clan}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold">{item.estado}</div>
                  <div className="text-xs opacity-70">{item.puntos.toLocaleString()} pts</div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-amber-50 rounded-lg border border-yellow-400 p-3 text-xs text-amber-600 text-center">
            Gestiona la diplomacia avanzada desde la pagina de Clanes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alianzas;
