import React, { useState } from 'react';
import { Building, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

type TipoTerreno = 'bosque' | 'llanura' | 'montana' | 'costa' | 'desierto' | 'pantano';

interface Region {
  id: string;
  nombre: string;
  tipoTerreno: TipoTerreno;
  bonusProduccion: string;
  ocupada: boolean;
  coordX: number;
  coordY: number;
}

const BONUS_TERRENO: Record<TipoTerreno, { icono: string; descripcion: string; produccion: string }> = {
  bosque: { icono: '\u{1F332}', descripcion: 'Bosque', produccion: '+30% madera, -10% comida' },
  llanura: { icono: '\u{1F33E}', descripcion: 'Llanura', produccion: '+25% comida, +10% poblacion' },
  montana: { icono: '\u26F0\uFE0F', descripcion: 'Montana', produccion: '+40% hierro y piedra, -20% comida' },
  costa: { icono: '\u{1F30A}', descripcion: 'Costa', produccion: '+20% comercio, +15% comida' },
  desierto: { icono: '\u{1F3DC}\uFE0F', descripcion: 'Desierto', produccion: '+50% oro, -30% comida, -20% poblacion' },
  pantano: { icono: '\u{1F33F}', descripcion: 'Pantano', produccion: '+35% mana, -15% felicidad' },
};

const REGIONES_MOCK: Region[] = [
  { id: 'r1', nombre: 'Valle del Sol', tipoTerreno: 'llanura', bonusProduccion: '+25% comida', ocupada: false, coordX: 45, coordY: 30 },
  { id: 'r2', nombre: 'Bosque Profundo', tipoTerreno: 'bosque', bonusProduccion: '+30% madera', ocupada: false, coordX: 62, coordY: 45 },
  { id: 'r3', nombre: 'Pico del Aguila', tipoTerreno: 'montana', bonusProduccion: '+40% hierro', ocupada: true, coordX: 78, coordY: 20 },
  { id: 'r4', nombre: 'Bahia Esmeralda', tipoTerreno: 'costa', bonusProduccion: '+20% comercio', ocupada: false, coordX: 20, coordY: 65 },
  { id: 'r5', nombre: 'Arenas Doradas', tipoTerreno: 'desierto', bonusProduccion: '+50% oro', ocupada: false, coordX: 55, coordY: 70 },
  { id: 'r6', nombre: 'Marismas del Mana', tipoTerreno: 'pantano', bonusProduccion: '+35% mana', ocupada: false, coordX: 30, coordY: 50 },
];

const RECURSOS_NECESARIOS = { oro: 200000, madera: 5000, piedra: 3000 };

const FundarCiudad: React.FC = () => {
  const [regionSeleccionada, setRegionSeleccionada] = useState<Region | null>(null);
  const [nombreCiudad, setNombreCiudad] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const [fundada, setFundada] = useState(false);
  const [error, setError] = useState('');

  const puedeConfirmar = regionSeleccionada !== null && nombreCiudad.trim().length >= 2;

  const handleFundar = () => {
    if (!puedeConfirmar) {
      return;
    }
    if (nombreCiudad.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    setError('');
    setFundada(true);
  };

  const reiniciar = () => {
    setFundada(false);
    setRegionSeleccionada(null);
    setNombreCiudad('');
    setConfirmando(false);
    setError('');
  };

  if (fundada && regionSeleccionada) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4 text-center">
        <CheckCircle size={64} className="text-green-500" />
        <h2 className="text-2xl font-bold text-amber-800">Ciudad fundada</h2>
        <p className="text-amber-600">
          <strong>{nombreCiudad}</strong> ha sido establecida en {regionSeleccionada.nombre}.
        </p>
        <p className="text-amber-500 text-sm">
          Coste: {COSTOS_TURNOS.fundarCiudad} turnos · {RECURSOS_NECESARIOS.oro.toLocaleString()} oro ·{' '}
          {RECURSOS_NECESARIOS.madera.toLocaleString()} madera · {RECURSOS_NECESARIOS.piedra.toLocaleString()} piedra
        </p>
        <button
          type="button"
          onClick={reiniciar}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Fundar otra ciudad
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
              <Building className="text-yellow-600" /> Fundar Nueva Ciudad
            </h1>
            <p className="text-amber-600 mt-1">Elige una region libre y nombra tu nueva ciudad.</p>
          </div>
          <div className="bg-amber-50 border border-yellow-400 rounded-lg p-3 text-sm space-y-1">
            <div className="font-bold text-amber-800 flex items-center gap-1">
              Coste: <span className="text-red-600">{COSTOS_TURNOS.fundarCiudad}T</span>
            </div>
            <div className="text-amber-600">Oro: {RECURSOS_NECESARIOS.oro.toLocaleString()}</div>
            <div className="text-amber-600">Madera: {RECURSOS_NECESARIOS.madera.toLocaleString()}</div>
            <div className="text-amber-600">Piedra: {RECURSOS_NECESARIOS.piedra.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {!confirmando ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-bold text-amber-800">1. Elige una region</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REGIONES_MOCK.map((region) => {
                const terreno = BONUS_TERRENO[region.tipoTerreno];
                const seleccionada = regionSeleccionada?.id === region.id;

                return (
                  <button
                    key={region.id}
                    type="button"
                    disabled={region.ocupada}
                    onClick={() => setRegionSeleccionada(region)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      region.ocupada
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300'
                        : seleccionada
                          ? 'border-yellow-500 bg-yellow-50 shadow-md'
                          : 'border-yellow-300 bg-amber-50 hover:border-yellow-400 hover:bg-amber-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{terreno.icono}</span>
                      <div>
                        <div className="font-bold text-amber-800">{region.nombre}</div>
                        <div className="text-xs text-amber-500">{terreno.descripcion}</div>
                      </div>
                      {region.ocupada && (
                        <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Ocupada</span>
                      )}
                      {seleccionada && <CheckCircle size={18} className="ml-auto text-yellow-600" />}
                    </div>
                    <div className="text-xs text-green-700 font-medium">{region.bonusProduccion}</div>
                    <div className="text-xs text-amber-500 mt-1">Coord: {region.coordX}, {region.coordY}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-amber-800">2. Nombre de la ciudad</h2>
            <div>
              <input
                type="text"
                value={nombreCiudad}
                onChange={(event) => setNombreCiudad(event.target.value)}
                placeholder="Ej: Puerto Dorado"
                maxLength={30}
                className="w-full border-2 border-yellow-400 rounded-lg p-3 text-amber-800 bg-amber-50 placeholder-amber-300 focus:outline-none focus:border-yellow-600"
              />
              <p className="text-amber-500 text-xs mt-1">{nombreCiudad.length}/30 caracteres</p>
              {error && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {error}
                </p>
              )}
            </div>

            {regionSeleccionada && (
              <div className="bg-amber-50 border border-yellow-400 rounded-lg p-4">
                <h3 className="font-bold text-amber-800 mb-2">Resumen</h3>
                <div className="text-sm space-y-1 text-amber-700">
                  <div>Region: <strong>{regionSeleccionada.nombre}</strong></div>
                  <div>Terreno: {BONUS_TERRENO[regionSeleccionada.tipoTerreno].descripcion}</div>
                  <div>Bonus: {BONUS_TERRENO[regionSeleccionada.tipoTerreno].produccion}</div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!puedeConfirmar}
              onClick={() => setConfirmando(true)}
              className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                puedeConfirmar
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  : 'bg-amber-200 text-amber-400 cursor-not-allowed'
              }`}
            >
              <MapPin size={16} />
              Continuar
              <span className={`text-xs px-1.5 py-0.5 rounded ${puedeConfirmar ? 'bg-amber-700 text-amber-200' : 'bg-amber-300 text-amber-500'}`}>
                {COSTOS_TURNOS.fundarCiudad}T
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-gradient-to-b from-amber-100 to-yellow-200 p-8 rounded-lg border-2 border-yellow-600 text-center space-y-4">
          <Building size={48} className="text-amber-600 mx-auto" />
          <h2 className="text-2xl font-bold text-amber-800">Confirmar fundacion</h2>
          <div className="bg-amber-50 rounded-lg p-4 text-left space-y-2 text-sm text-amber-700">
            <div>Ciudad: <strong className="text-amber-900">{nombreCiudad}</strong></div>
            <div>Region: <strong>{regionSeleccionada?.nombre}</strong></div>
            <div>Terreno: {regionSeleccionada ? BONUS_TERRENO[regionSeleccionada.tipoTerreno].descripcion : ''}</div>
            <div className="pt-2 border-t border-yellow-300 font-semibold text-red-700">
              Coste: {COSTOS_TURNOS.fundarCiudad}T · {RECURSOS_NECESARIOS.oro.toLocaleString()} oro ·{' '}
              {RECURSOS_NECESARIOS.madera.toLocaleString()} madera · {RECURSOS_NECESARIOS.piedra.toLocaleString()} piedra
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="flex-1 bg-white border border-yellow-400 text-amber-700 py-2.5 rounded-lg font-semibold hover:bg-amber-50"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleFundar}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-bold"
            >
              Fundar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundarCiudad;
