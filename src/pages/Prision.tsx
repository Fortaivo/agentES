// src/pages/Prision.tsx
import React, { useState } from 'react';
import { AlertTriangle, DollarSign, Lock, UserPlus } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

interface HeroeCautivo {
  id: string;
  nombre: string;
  clase: string;
  nivel: number;
  imperio: string;
  capturadoEn: string;
  rescate: number;
  diasCautivo: number;
}

interface MiHeroeCapturado {
  id: string;
  nombre: string;
  clase: string;
  nivel: number;
  captor: string;
  rescatePedido: number;
  diasCautivo: number;
}

const CAUTIVOS_MOCK: HeroeCautivo[] = [
  {
    id: 'c1',
    nombre: 'Jasbra N3',
    clase: 'Mago',
    nivel: 3,
    imperio: 'Montanas Grises',
    capturadoEn: 'Batalla de Pico Frio',
    rescate: 50000,
    diasCautivo: 2,
  },
  {
    id: 'c2',
    nombre: 'Thorn N2',
    clase: 'Guerrero',
    nivel: 2,
    imperio: 'Costa del Sur',
    capturadoEn: 'Asedio de Puerto Brumoso',
    rescate: 25000,
    diasCautivo: 5,
  },
];

const MIS_CAPTURADOS_MOCK: MiHeroeCapturado[] = [];

const Prision: React.FC = () => {
  const [cautivos, setCautivos] = useState<HeroeCautivo[]>(CAUTIVOS_MOCK);
  const [rescateEditando, setRescateEditando] = useState<string | null>(null);
  const [nuevoRescate, setNuevoRescate] = useState('');
  const [reclutando, setReclutando] = useState<string | null>(null);

  const actualizarRescate = (id: string) => {
    const valor = parseInt(nuevoRescate, 10);
    if (Number.isNaN(valor) || valor < 0) {
      return;
    }

    setCautivos((previo) => previo.map((cautivo) => (
      cautivo.id === id ? { ...cautivo, rescate: valor } : cautivo
    )));
    setRescateEditando(null);
    setNuevoRescate('');
  };

  const reclutar = (id: string) => {
    setReclutando(id);
    window.setTimeout(() => {
      setCautivos((previo) => previo.filter((cautivo) => cautivo.id !== id));
      setReclutando(null);
    }, 1000);
  };

  const liberar = (id: string) => {
    setCautivos((previo) => previo.filter((cautivo) => cautivo.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
        <Lock className="text-yellow-600" />
        Prision
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Prisioneros', valor: cautivos.length, icono: '🔒' },
          {
            label: 'Rescate total',
            valor: `${cautivos.reduce((suma, cautivo) => suma + cautivo.rescate, 0).toLocaleString()} oro`,
            icono: '💰',
          },
          { label: 'Tus cautivos', valor: MIS_CAPTURADOS_MOCK.length, icono: '⚠️' },
        ].map((item) => (
          <div key={item.label} className="bg-amber-50 rounded-lg border border-yellow-400 p-4 text-center">
            <div className="text-2xl">{item.icono}</div>
            <div className="text-xl font-bold text-amber-800">{item.valor}</div>
            <div className="text-xs text-amber-600">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-5 rounded-lg border-2 border-yellow-600">
          <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
            <Lock size={16} />
            Heroes capturados ({cautivos.length})
          </h2>
          <div className="space-y-3">
            {cautivos.length === 0 && (
              <p className="text-center text-amber-600 py-4">No tienes prisioneros.</p>
            )}

            {cautivos.map((cautivo) => (
              <div key={cautivo.id} className="bg-amber-50 rounded-lg border border-yellow-400 p-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-bold text-amber-800">{cautivo.nombre}</div>
                    <div className="text-xs text-amber-600">
                      {cautivo.clase} Nv.{cautivo.nivel} · {cautivo.imperio}
                    </div>
                    <div className="text-xs text-amber-500 mt-0.5">
                      Capturado en: {cautivo.capturadoEn} · hace {cautivo.diasCautivo}d
                    </div>
                  </div>
                  <div className="text-right">
                    {rescateEditando === cautivo.id ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          value={nuevoRescate}
                          onChange={(event) => setNuevoRescate(event.target.value)}
                          className="w-24 border border-yellow-400 rounded px-2 py-1 text-xs text-amber-800"
                          placeholder="oro..."
                        />
                        <button
                          type="button"
                          onClick={() => actualizarRescate(cautivo.id)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRescateEditando(null);
                            setNuevoRescate('');
                          }}
                          className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setRescateEditando(cautivo.id);
                          setNuevoRescate(String(cautivo.rescate));
                        }}
                        className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
                      >
                        <DollarSign size={12} />
                        {cautivo.rescate.toLocaleString()} oro
                        <span className="text-amber-400">(editar)</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => reclutar(cautivo.id)}
                    disabled={reclutando === cautivo.id}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-1.5 rounded text-sm flex items-center justify-center gap-1"
                  >
                    <UserPlus size={12} />
                    {reclutando === cautivo.id ? 'Reclutando...' : 'Reclutar'}
                    <span className="bg-purple-700 text-purple-200 text-xs px-1 rounded">
                      {COSTOS_TURNOS.reclutarHeroeCapturado}T
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => liberar(cautivo.id)}
                    className="flex-1 bg-white hover:bg-amber-50 border border-yellow-400 text-amber-700 py-1.5 rounded text-sm"
                  >
                    Liberar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg border border-yellow-400 p-5">
          <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-600" />
            Tus heroes cautivos
          </h2>
          {MIS_CAPTURADOS_MOCK.length === 0 ? (
            <div className="text-center py-8 text-amber-600">
              <Lock size={32} className="mx-auto mb-2 text-amber-300" />
              <p>Ninguno de tus heroes esta capturado.</p>
              <p className="text-xs text-amber-500 mt-1">Si un heroe cae en batalla, aparecera aqui.</p>
            </div>
          ) : (
            MIS_CAPTURADOS_MOCK.map((heroe) => (
              <div key={heroe.id} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                <div className="font-bold text-red-800">{heroe.nombre}</div>
                <div className="text-xs text-red-600">
                  {heroe.clase} Nv.{heroe.nivel} · Captor: {heroe.captor}
                </div>
                <div className="text-xs text-red-500 mt-1">
                  Rescate pedido: {heroe.rescatePedido.toLocaleString()} oro
                </div>
                <button
                  type="button"
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm"
                >
                  Pagar rescate ({heroe.rescatePedido.toLocaleString()} oro)
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Prision;
