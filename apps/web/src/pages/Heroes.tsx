// src/pages/Heroes.tsx
import React, { useState } from 'react';
import { ChevronRight, Compass, Heart, Move, Scroll, Shield, Star, Sword, Wind, Zap } from 'lucide-react';
import type { Heroe } from '../types/game';
import { COSTOS_TURNOS } from '../types/game';

const HEROES_MOCK: Heroe[] = [
  {
    id: 'h2', nombre: 'Arel N6', clase: 'guerrero', raza: 'elfos',
    nivel: 6, experiencia: 4850, experienciaSiguienteNivel: 7200,
    ubicacionTipo: 'ciudad', ubicacionId: 'c1', ubicacionNombre: 'Rosvo',
    protegido: false, tieneMontura: true, capturado: false,
    stats: { ataque: 48, defensa: 35, dano: 31, vida: 85, velocidad: 16, moral: 22 },
    puntosDesarrollo: 2, habilidades: ['Golpe de guerra', 'Grito de mando'],
  },
  {
    id: 'h1', nombre: 'Doghell N1', clase: 'ladron', raza: 'elfos',
    nivel: 1, experiencia: 100, experienciaSiguienteNivel: 600,
    ubicacionTipo: 'campo', ubicacionId: 'r16', ubicacionNombre: 'Bosque Verde #16',
    protegido: true, tieneMontura: false, capturado: false,
    stats: { ataque: 10, defensa: 10, dano: 7, vida: 19, velocidad: 8, moral: 8 },
    puntosDesarrollo: 0, habilidades: [],
  },
];

const NOMBRE_CLASE: Record<string, string> = {
  guerrero: 'Guerrero',
  ladron: 'Ladron',
  sacerdote: 'Sacerdote',
  mago: 'Mago',
};

const NOMBRE_RAZA: Record<string, string> = {
  elfos: 'Elfos',
  elfos_oscuros: 'Elfos Oscuros',
  enanos: 'Enanos',
  humanos: 'Humanos',
  no_muertos: 'No Muertos',
  orcos: 'Orcos',
};

const TROPAS_LIDERADAS_MOCK: Record<string, number> = {
  h2: 6800,
  h1: 850,
};

function calcularMotivacion(heroe: Heroe, tropasLideradas: number): {
  motivado: boolean;
  tropasMinimas: number;
  porcentaje: number;
} {
  if (heroe.nivel < 5) {
    return { motivado: true, tropasMinimas: 0, porcentaje: 100 };
  }

  const factor = heroe.raza === 'orcos' ? 0.5 : 1;
  const tropasMinimas = Math.floor(1500 * heroe.nivel * factor);
  const motivado = tropasLideradas >= tropasMinimas;
  const porcentaje = Math.min(100, Math.round((tropasLideradas / tropasMinimas) * 100));

  return { motivado, tropasMinimas, porcentaje };
}

const TurnoBadge: React.FC<{ costo: number }> = ({ costo }) => (
  <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded ml-1">{costo}T</span>
);

const Heroes: React.FC = () => {
  const [heroeSeleccionado, setHeroeSeleccionado] = useState<Heroe | null>(HEROES_MOCK[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Sword className="text-yellow-600" />
          Heroes
        </h1>
        <button type="button" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
          + Contratar heroe <TurnoBadge costo={COSTOS_TURNOS.comprarHeroe} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {HEROES_MOCK.map((heroe) => (
            <button
              type="button"
              key={heroe.id}
              onClick={() => setHeroeSeleccionado(heroe)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                heroeSeleccionado?.id === heroe.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-yellow-300 bg-amber-50 hover:border-yellow-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <Sword size={20} className="text-amber-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-800">{heroe.nombre}</h3>
                  <p className="text-amber-600 text-xs">{NOMBRE_CLASE[heroe.clase]} · {NOMBRE_RAZA[heroe.raza]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-amber-600">Nivel {heroe.nivel}</span>
                    <div className="flex-1 bg-amber-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${(heroe.experiencia / heroe.experienciaSiguienteNivel) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-amber-400" />
              </div>
            </button>
          ))}
        </div>

        {heroeSeleccionado && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-amber-300 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sword size={36} className="text-amber-700" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-amber-800">{heroeSeleccionado.nombre}</h2>
                  <p className="text-amber-600">{NOMBRE_CLASE[heroeSeleccionado.clase]} · {NOMBRE_RAZA[heroeSeleccionado.raza]}</p>
                  <p className="text-amber-600 text-sm mt-1">📍 {heroeSeleccionado.ubicacionNombre}</p>
                  <div className="flex gap-2 mt-2">
                    {heroeSeleccionado.protegido && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                        🛡️ Protegido
                      </span>
                    )}
                    {heroeSeleccionado.capturado && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                        🔒 Capturado
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-600 text-sm">Nivel {heroeSeleccionado.nivel}</div>
                  <div className="text-amber-500 text-xs">{heroeSeleccionado.experiencia} / {heroeSeleccionado.experienciaSiguienteNivel} XP</div>
                  <div className="w-24 bg-amber-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(heroeSeleccionado.experiencia / heroeSeleccionado.experienciaSiguienteNivel) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-yellow-400">
              <h3 className="font-bold text-amber-800 mb-3">Caracteristicas</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Ataque', valor: heroeSeleccionado.stats.ataque, icon: Sword, color: 'text-red-600' },
                  { label: 'Defensa', valor: heroeSeleccionado.stats.defensa, icon: Shield, color: 'text-blue-600' },
                  { label: 'Dano', valor: heroeSeleccionado.stats.dano, icon: Zap, color: 'text-orange-600' },
                  { label: 'Vida', valor: heroeSeleccionado.stats.vida, icon: Heart, color: 'text-red-500' },
                  { label: 'Velocidad', valor: heroeSeleccionado.stats.velocidad, icon: Wind, color: 'text-green-600' },
                  { label: 'Moral', valor: heroeSeleccionado.stats.moral, icon: Star, color: 'text-yellow-600' },
                ].map(({ label, valor, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-2 p-2 bg-white rounded border border-yellow-200">
                    <Icon size={16} className={color} />
                    <div>
                      <div className="text-xs text-amber-600">{label}</div>
                      <div className="font-bold text-amber-800">{valor}</div>
                    </div>
                  </div>
                ))}
              </div>
              {heroeSeleccionado.puntosDesarrollo > 0 && (
                <p className="text-amber-700 text-sm mt-3 font-semibold">
                  ✨ {heroeSeleccionado.puntosDesarrollo} puntos de desarrollo disponibles
                </p>
              )}
            </div>

            {heroeSeleccionado.nivel >= 5 && (() => {
              const tropasLideradas = TROPAS_LIDERADAS_MOCK[heroeSeleccionado.id] ?? 0;
              const motivacion = calcularMotivacion(heroeSeleccionado, tropasLideradas);

              return (
                <div
                  className={`p-4 rounded-lg border ${
                    motivacion.motivado ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                  }`}
                >
                  <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                    {motivacion.motivado ? '✅' : '⚠️'} Motivacion del heroe
                  </h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between gap-3">
                      <span className="text-amber-700">Tropas lideradas:</span>
                      <span className="font-bold text-right">
                        {tropasLideradas.toLocaleString()} / {motivacion.tropasMinimas.toLocaleString()} minimas
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${motivacion.motivado ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${motivacion.porcentaje}%` }}
                      />
                    </div>
                    {!motivacion.motivado && (
                      <p className="text-red-600 text-xs">
                        Sin motivacion: -60% ataques, -50% dano y sin habilidades especiales.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="bg-amber-50 p-4 rounded-lg border border-yellow-400">
              <h3 className="font-bold text-amber-800 mb-3">Acciones</h3>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Move size={16} />
                  Mover tropas <TurnoBadge costo={COSTOS_TURNOS.moverTropas} />
                </button>
                <button type="button" className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Compass size={16} />
                  Aventura <TurnoBadge costo={COSTOS_TURNOS.aventura} />
                </button>
                <button type="button" className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Scroll size={16} />
                  Realizar quest <TurnoBadge costo={COSTOS_TURNOS.completarQuest} />
                </button>
                <button type="button" className="flex items-center gap-2 p-3 bg-amber-100 hover:bg-amber-200 rounded-lg border border-yellow-400 text-amber-800 text-sm transition-all">
                  <Move size={16} />
                  Mover heroe <TurnoBadge costo={COSTOS_TURNOS.moverHeroe} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heroes;
