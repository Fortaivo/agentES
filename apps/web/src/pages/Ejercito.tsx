// src/pages/Ejercito.tsx
import React, { useState } from 'react';
import { Plus, Shield, Sword, Users } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

interface StackTropas {
  id: string;
  tipo: string;
  nivel: number;
  raza: string;
  cantidad: number;
  ubicacion: string;
  estado: 'defendiendo' | 'entrenando' | 'en_movimiento';
  poder: number;
}

type Agrupacion = 'ubicacion' | 'tipo';

const STACKS_MOCK: StackTropas[] = [
  { id: 's1', tipo: 'Guerreros Elfos', nivel: 1, raza: 'Elfos', cantidad: 1850, ubicacion: 'Rosvo', estado: 'defendiendo', poder: 22200 },
  { id: 's2', tipo: 'Arqueros Elfos', nivel: 2, raza: 'Elfos', cantidad: 1800, ubicacion: 'Rosvo', estado: 'defendiendo', poder: 25200 },
  { id: 's3', tipo: 'Centauros', nivel: 3, raza: 'Elfos', cantidad: 1680, ubicacion: 'Doghell', estado: 'en_movimiento', poder: 30240 },
  { id: 's4', tipo: 'Exploradores Elfos', nivel: 4, raza: 'Elfos', cantidad: 300, ubicacion: 'Doghell', estado: 'entrenando', poder: 6900 },
  { id: 's5', tipo: 'Lanceros Humanos', nivel: 2, raza: 'Humanos', cantidad: 540, ubicacion: 'Fortin del Este', estado: 'defendiendo', poder: 8100 },
];

const ETIQUETA_ESTADO: Record<StackTropas['estado'], string> = {
  defendiendo: 'Defendiendo',
  entrenando: 'Entrenando',
  en_movimiento: 'En movimiento',
};

const COLOR_ESTADO: Record<StackTropas['estado'], string> = {
  defendiendo: 'bg-green-100 text-green-700 border-green-200',
  entrenando: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  en_movimiento: 'bg-blue-100 text-blue-700 border-blue-200',
};

const AGRUPACIONES: Agrupacion[] = ['ubicacion', 'tipo'];

const Ejercito: React.FC = () => {
  const [agrupacion, setAgrupacion] = useState<Agrupacion>('ubicacion');

  const totalTropas = STACKS_MOCK.reduce((suma, stack) => suma + stack.cantidad, 0);
  const poderTotal = STACKS_MOCK.reduce((suma, stack) => suma + stack.poder, 0);
  const ubicacionesActivas = new Set(STACKS_MOCK.map((stack) => stack.ubicacion)).size;

  const grupos = STACKS_MOCK.reduce<Record<string, StackTropas[]>>((acumulado, stack) => {
    const clave = agrupacion === 'ubicacion' ? stack.ubicacion : `${stack.tipo} Nv.${stack.nivel}`;
    acumulado[clave] = [...(acumulado[clave] ?? []), stack];
    return acumulado;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Shield className="text-yellow-600" />
          Mi ejercito
        </h1>
        <button
          type="button"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} />
          Entrenar tropas
          <span className="bg-amber-800 text-amber-200 text-xs px-1.5 py-0.5 rounded">
            {COSTOS_TURNOS.comprarTropas}T
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total tropas', valor: totalTropas.toLocaleString(), icono: <Users size={16} />, color: 'text-amber-800' },
          { label: 'Stacks activos', valor: STACKS_MOCK.length, icono: <Shield size={16} />, color: 'text-blue-700' },
          { label: 'Ubicaciones', valor: ubicacionesActivas, icono: '📍', color: 'text-purple-700' },
          { label: 'Poder total', valor: poderTotal.toLocaleString(), icono: <Sword size={16} />, color: 'text-red-700' },
        ].map((item) => (
          <div key={item.label} className="bg-amber-50 rounded-lg border border-yellow-400 p-4 text-center">
            <div className="text-lg flex justify-center text-amber-700">{item.icono}</div>
            <div className={`text-2xl font-bold ${item.color}`}>{item.valor}</div>
            <div className="text-amber-600 text-sm">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 rounded-lg border border-yellow-400 p-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-bold text-amber-800">Vista del despliegue</h2>
          <p className="text-sm text-amber-600">Agrupa el ejercito por ciudad o por tipo de unidad.</p>
        </div>
        <div className="flex gap-2">
          {AGRUPACIONES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAgrupacion(item)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                agrupacion === item
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {item === 'ubicacion' ? 'Por ubicacion' : 'Por tipo'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(grupos).map(([nombreGrupo, stacks]) => {
          const tropasGrupo = stacks.reduce((suma, stack) => suma + stack.cantidad, 0);
          const poderGrupo = stacks.reduce((suma, stack) => suma + stack.poder, 0);

          return (
            <div key={nombreGrupo} className="bg-amber-50 rounded-lg border border-yellow-400 overflow-hidden">
              <div className="bg-amber-100 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-bold text-amber-800">{nombreGrupo}</h3>
                  <p className="text-xs text-amber-600">
                    {tropasGrupo.toLocaleString()} tropas · {poderGrupo.toLocaleString()} poder
                  </p>
                </div>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                  {stacks.length} formaciones
                </span>
              </div>
              <div className="divide-y divide-yellow-200">
                {stacks.map((stack) => (
                  <div key={stack.id} className="p-4 bg-white flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-amber-800">{stack.tipo}</span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                          Nv.{stack.nivel}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${COLOR_ESTADO[stack.estado]}`}>
                          {ETIQUETA_ESTADO[stack.estado]}
                        </span>
                      </div>
                      <div className="text-sm text-amber-600 mt-1">
                        {stack.raza} · {stack.ubicacion}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <div className="text-amber-600">
                        Cantidad: <span className="font-bold text-amber-800">{stack.cantidad.toLocaleString()}</span>
                      </div>
                      <div className="text-amber-600">
                        Poder: <span className="font-bold text-amber-800">{stack.poder.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ejercito;
