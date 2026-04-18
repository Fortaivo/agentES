import React, { useState } from 'react';
import { Building, Plus, Users } from 'lucide-react';
import type { Ciudad, Edificio, TipoEdificio } from '../types/game';
import { COSTOS_TURNOS, NOMBRES_EDIFICIOS } from '../types/game';

const CIUDADES_MOCK: Ciudad[] = [
  {
    id: 'c1',
    nombre: 'Rosvo',
    tipoTerreno: 'Bosque',
    poblacion: 34492,
    felicidad: 100,
    moral: 100,
    corrupcion: 0,
    higiene: 44,
    religion: 77,
    cultura: 71,
    coordX: 523,
    coordY: 12,
    impuestos: 19,
    limiteTropas: 10000,
    edificios: [
      { id: 'e1', tipo: 'castillo', nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e2', tipo: 'muralla', nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e3', tipo: 'armeria', nivel: 2, nivelMaximo: 10, enConstruccion: false },
      { id: 'e4', tipo: 'foso', nivel: 1, nivelMaximo: 10, enConstruccion: true, construccionTerminaEn: new Date(Date.now() + 3600000).toISOString() },
      { id: 'e5', tipo: 'cuartel', nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e6', tipo: 'mina_oro', nivel: 3, nivelMaximo: 10, enConstruccion: false },
      { id: 'e7', tipo: 'torre_magica', nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e8', tipo: 'universidad', nivel: 2, nivelMaximo: 10, enConstruccion: false },
    ],
    tropas: { N1_Guerreros_elfos: 850, N2_Arqueros_elfos: 400, N3_Centauros: 250, N4_Exploradores_elfos: 50 },
    produccionDiaria: { oro: 34492, comida: 177, madera: 482 },
    consumoDiario: { comida: 229, agua: 225 },
  },
  {
    id: 'c2',
    nombre: 'Doghell',
    tipoTerreno: 'Llanura',
    poblacion: 12000,
    felicidad: 88,
    moral: 95,
    corrupcion: 5,
    higiene: 60,
    religion: 55,
    cultura: 40,
    coordX: 310,
    coordY: 85,
    impuestos: 15,
    limiteTropas: 8000,
    edificios: [
      { id: 'e9', tipo: 'castillo', nivel: 1, nivelMaximo: 10, enConstruccion: false },
      { id: 'e10', tipo: 'cultivos', nivel: 2, nivelMaximo: 10, enConstruccion: false },
      { id: 'e11', tipo: 'mercado', nivel: 1, nivelMaximo: 10, enConstruccion: false },
    ],
    tropas: { N1_Guerreros_elfos: 300, N2_Arqueros_elfos: 240 },
    produccionDiaria: { oro: 12000, comida: 350, madera: 120 },
    consumoDiario: { comida: 180, agua: 100 },
  },
];

const EFECTOS_EDIFICIO: Partial<Record<TipoEdificio, {
  efecto: string;
  costoNivel: { oro: number; madera?: number; piedra?: number };
}>> = {
  castillo: { efecto: 'Genera mas tropas cada dia.', costoNivel: { oro: 1000, madera: 200 } },
  muralla: { efecto: 'Aumenta la defensa general de la ciudad.', costoNivel: { oro: 800, piedra: 300 } },
  armeria: { efecto: 'Aumenta el dano de la milicia al defender.', costoNivel: { oro: 900, madera: 150 } },
  foso: { efecto: 'Mejora la iniciativa defensiva y el control del terreno.', costoNivel: { oro: 700, madera: 100 } },
  cuartel: { efecto: 'Reduce corrupcion y aumenta el limite de tropas.', costoNivel: { oro: 1200, piedra: 200 } },
  mina_oro: { efecto: 'Aumenta la produccion de oro.', costoNivel: { oro: 500, madera: 100 } },
  torre_magica: { efecto: 'Aumenta cultura y produccion de mana.', costoNivel: { oro: 1500, piedra: 400 } },
  universidad: { efecto: 'Aumenta cultura e investigacion.', costoNivel: { oro: 2000, madera: 500 } },
};

const Cities: React.FC = () => {
  const [ciudadId, setCiudadId] = useState<string>('c1');
  const [edificioDetalle, setEdificioDetalle] = useState<Edificio | null>(null);
  const ciudadActual = CIUDADES_MOCK.find((ciudad) => ciudad.id === ciudadId) ?? CIUDADES_MOCK[0];

  const totalTropas = Object.values(ciudadActual.tropas).reduce((acumulado, cantidad) => acumulado + cantidad, 0);
  const porcentajeTropas = Math.round((totalTropas / ciudadActual.limiteTropas) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
            <Building className="text-yellow-600" />
            Ciudades
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {CIUDADES_MOCK.map((ciudad) => (
              <button
                key={ciudad.id}
                type="button"
                onClick={() => {
                  setCiudadId(ciudad.id);
                  setEdificioDetalle(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2 ${
                  ciudad.id === ciudadId
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-50 text-amber-700 border-yellow-300 hover:border-yellow-500'
                }`}
              >
                Ciudad {ciudad.nombre}
              </button>
            ))}
          </div>
          <button type="button" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
            + Fundar ciudad
            <span className="bg-amber-800 text-amber-200 text-xs px-1.5 py-0.5 rounded ml-1">{COSTOS_TURNOS.fundarCiudad}T</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
          <h2 className="text-xl font-bold text-amber-800 mb-1">{ciudadActual.nombre} #{ciudadActual.coordX}</h2>
          <p className="text-amber-600 text-sm mb-4">
            Terreno: {ciudadActual.tipoTerreno} · Impuestos: {ciudadActual.impuestos}%
          </p>

          <div className="space-y-3">
            {[
              { label: 'Felicidad', val: ciudadActual.felicidad, color: 'bg-green-500' },
              { label: 'Moral', val: ciudadActual.moral, color: 'bg-blue-500' },
              { label: 'Higiene', val: ciudadActual.higiene, color: 'bg-teal-500' },
              { label: 'Religion', val: ciudadActual.religion, color: 'bg-purple-500' },
              { label: 'Cultura', val: ciudadActual.cultura, color: 'bg-pink-500' },
              { label: 'Corrupcion', val: ciudadActual.corrupcion, color: 'bg-red-500' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-700">{label}</span>
                  <span className="font-semibold text-amber-800">{val}%</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div className={`${color} h-2 rounded-full`} style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-yellow-400">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700 flex items-center gap-1">
                <Users size={14} />
                Poblacion
              </span>
              <span className="font-bold text-amber-800">{ciudadActual.poblacion.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-amber-700">Tropas</span>
              <span className="font-bold text-amber-800">
                {totalTropas.toLocaleString()} / {ciudadActual.limiteTropas.toLocaleString()} ({porcentajeTropas}%)
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-amber-50 p-5 rounded-lg border border-yellow-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-amber-800 text-lg">Edificios ({ciudadActual.edificios.length})</h3>
            <button type="button" className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-sm">
              <Plus size={14} />
              Construir
              <span className="bg-amber-800 text-amber-200 text-xs px-1 rounded ml-1">{COSTOS_TURNOS.construirEdificio}T</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ciudadActual.edificios.map((edificio) => (
              <div
                key={edificio.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                  edificio.enConstruccion
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-white border-gray-200 hover:border-yellow-300'
                }`}
                onClick={() => setEdificioDetalle(edificio)}
              >
                <div>
                  <span className="font-medium text-amber-800">{NOMBRES_EDIFICIOS[edificio.tipo]}</span>
                  {edificio.enConstruccion && (
                    <span className="text-yellow-600 text-xs ml-2">
                      ⚙️ En construccion...
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: edificio.nivelMaximo }).map((_, index) => (
                      <div key={index} className={`w-3 h-3 rounded-sm ${index < edificio.nivel ? 'bg-amber-500' : 'bg-amber-100'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-amber-600">Nv {edificio.nivel}</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEdificioDetalle(edificio);
                    }}
                    className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-1 rounded"
                  >
                    Mejorar <span className="bg-amber-300 text-amber-800 px-1 rounded">{COSTOS_TURNOS.construirEdificio}T</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {edificioDetalle && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEdificioDetalle(null)}
        >
          <div
            className="bg-white rounded-xl border-2 border-yellow-500 p-6 max-w-md w-full shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-amber-800">{NOMBRES_EDIFICIOS[edificioDetalle.tipo]}</h3>
              <button
                type="button"
                onClick={() => setEdificioDetalle(null)}
                className="text-amber-400 hover:text-amber-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {Array.from({ length: edificioDetalle.nivelMaximo }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-3 rounded ${index < edificioDetalle.nivel ? 'bg-amber-500' : 'bg-amber-100'}`}
                />
              ))}
            </div>
            <p className="text-sm text-amber-600 mb-1">
              Nivel {edificioDetalle.nivel} / {edificioDetalle.nivelMaximo}
            </p>

            {EFECTOS_EDIFICIO[edificioDetalle.tipo] ? (
              <div className="bg-amber-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-amber-800 mb-1">Efecto</p>
                <p className="text-sm text-amber-700">{EFECTOS_EDIFICIO[edificioDetalle.tipo]?.efecto}</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
                Este edificio ya esta integrado en la ciudad, pero su efecto detallado llegara con el backend.
              </div>
            )}

            {edificioDetalle.enConstruccion ? (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-700 flex items-center gap-2 mb-4">
                <span>⚙️ En construccion...</span>
                {edificioDetalle.construccionTerminaEn && (
                  <span className="text-xs">
                    Termina: {new Date(edificioDetalle.construccionTerminaEn).toLocaleTimeString('es-ES')}
                  </span>
                )}
              </div>
            ) : edificioDetalle.nivel < edificioDetalle.nivelMaximo ? (
              <div className="space-y-3">
                {EFECTOS_EDIFICIO[edificioDetalle.tipo] && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-700 mb-1">
                      Coste para nivel {edificioDetalle.nivel + 1}:
                    </p>
                    <div className="flex gap-3 text-gray-600 flex-wrap">
                      <span>🪙 {EFECTOS_EDIFICIO[edificioDetalle.tipo]?.costoNivel.oro.toLocaleString()} oro</span>
                      {EFECTOS_EDIFICIO[edificioDetalle.tipo]?.costoNivel.madera && (
                        <span>🪵 {EFECTOS_EDIFICIO[edificioDetalle.tipo]?.costoNivel.madera} madera</span>
                      )}
                      {EFECTOS_EDIFICIO[edificioDetalle.tipo]?.costoNivel.piedra && (
                        <span>🪨 {EFECTOS_EDIFICIO[edificioDetalle.tipo]?.costoNivel.piedra} piedra</span>
                      )}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  Mejorar a nivel {edificioDetalle.nivel + 1}
                  <span className="bg-amber-700 text-amber-200 text-xs px-1.5 py-0.5 rounded">
                    {COSTOS_TURNOS.construirEdificio}T
                  </span>
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-700 text-center">
                Nivel maximo alcanzado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cities;
