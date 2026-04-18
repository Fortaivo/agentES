import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Recursos } from '../types/game';

interface ResourceBarProps {
  recursos: Recursos;
  produccionDiaria?: Partial<Recursos>;
  turnos: number;
  turnosGastadosHoy: number;
  diaTemporada: number;
}

const RECURSOS_PRINCIPALES: { key: keyof Recursos; emoji: string; abrev: string }[] = [
  { key: 'oro', emoji: '\u{1FA99}', abrev: 'Oro' },
  { key: 'comida', emoji: '\u{1F33E}', abrev: 'Comida' },
  { key: 'madera', emoji: '\u{1FAB5}', abrev: 'Madera' },
  { key: 'piedra', emoji: '\u{1FAA8}', abrev: 'Piedra' },
  { key: 'hierro', emoji: '\u2699\uFE0F', abrev: 'Hierro' },
  { key: 'gemas', emoji: '\u{1F48E}', abrev: 'Gemas' },
];

const RECURSOS_SECUNDARIOS: { key: keyof Recursos; emoji: string; abrev: string }[] = [
  { key: 'plata', emoji: '\u{1F948}', abrev: 'Plata' },
  { key: 'mana', emoji: '\u2728', abrev: 'Mana' },
  { key: 'herramientas', emoji: '\u{1F527}', abrev: 'Herram.' },
  { key: 'armas', emoji: '\u2694\uFE0F', abrev: 'Armas' },
  { key: 'bloques', emoji: '\u{1F9F1}', abrev: 'Bloques' },
  { key: 'tablas', emoji: '\u{1FA9A}', abrev: 'Tablas' },
  { key: 'cristal', emoji: '\u{1F52E}', abrev: 'Cristal' },
  { key: 'reliquias', emoji: '\u{1F4FF}', abrev: 'Reliq.' },
  { key: 'joyeria', emoji: '\u{1F48D}', abrev: 'Joyeria' },
  { key: 'karma', emoji: '\u262F\uFE0F', abrev: 'Karma' },
  { key: 'mithril', emoji: '\u{1F31F}', abrev: 'Mithril' },
  { key: 'agua', emoji: '\u{1F4A7}', abrev: 'Agua' },
];

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function useContadorReset() {
  const [texto, setTexto] = useState('');

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date();
      const reset = new Date(ahora);
      reset.setUTCHours(22, 0, 0, 0);
      if (reset <= ahora) {
        reset.setUTCDate(reset.getUTCDate() + 1);
      }
      const diff = reset.getTime() - ahora.getTime();
      const horas = Math.floor(diff / 3600000);
      const minutos = Math.floor((diff % 3600000) / 60000);
      setTexto(`${horas}h ${minutos}m`);
    };

    calcular();
    const timer = window.setInterval(calcular, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return texto;
}

const ResourceBar: React.FC<ResourceBarProps> = ({
  recursos,
  produccionDiaria,
  turnos,
  turnosGastadosHoy,
  diaTemporada,
}) => {
  const [expandido, setExpandido] = useState(false);
  const resetEn = useContadorReset();

  return (
    <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-b-2 border-yellow-600">
      <div className="flex items-center gap-1 px-4 py-2 flex-wrap">
        {RECURSOS_PRINCIPALES.map(({ key, emoji, abrev }) => (
          <div key={key} className="flex items-center gap-1 bg-amber-950 rounded px-2 py-1 min-w-[78px]">
            <span className="text-sm">{emoji}</span>
            <div>
              <div className="text-yellow-200 text-xs font-bold leading-none">{formatNum(recursos[key])}</div>
              <div className="text-amber-500 text-[10px] leading-none flex items-center gap-0.5">
                {abrev}
                {produccionDiaria?.[key] ? (
                  <span className="text-green-400">+{formatNum(produccionDiaria[key] ?? 0)}</span>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-1 text-amber-400 hover:text-yellow-200 transition-colors px-2 py-1 text-xs"
        >
          {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expandido ? 'Menos' : '+12'}
        </button>

        <div className="flex-1" />

        <div className="text-amber-400 text-xs mr-3">
          Dia <span className="text-yellow-200 font-bold">{diaTemporada}</span>/60
        </div>

        <div className="flex items-center gap-2 bg-amber-950 border border-yellow-600 rounded-lg px-3 py-1">
          <Clock size={14} className="text-yellow-400" />
          <div>
            <div className="text-yellow-200 text-sm font-bold leading-none">
              {'\u23F3'} {turnos}
            </div>
            <div className="text-amber-500 text-[10px] leading-none">
              -{turnosGastadosHoy} hoy · reset {resetEn}
            </div>
          </div>
        </div>
      </div>

      {expandido && (
        <div className="flex flex-wrap gap-1 px-4 pb-2">
          {RECURSOS_SECUNDARIOS.map(({ key, emoji, abrev }) => (
            <div key={key} className="flex items-center gap-1 bg-amber-950 rounded px-2 py-1 min-w-[78px]">
              <span className="text-sm">{emoji}</span>
              <div>
                <div className="text-yellow-200 text-xs font-bold leading-none">{formatNum(recursos[key])}</div>
                <div className="text-amber-500 text-[10px] leading-none flex items-center gap-0.5">
                  {abrev}
                  {produccionDiaria?.[key] ? (
                    <span className="text-green-400">+{formatNum(produccionDiaria[key] ?? 0)}</span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceBar;
