import React, { useState } from 'react';
import { Sword, ChevronRight, AlertTriangle } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

type Paso = 'objetivo' | 'heroe' | 'confirmar' | 'resultado';

interface ObjetivoAtaque {
  id: string;
  nombreImperio: string;
  nombreCiudad: string;
  region: 'misma_region' | 'adyacente';
  tropasAproximadas: string;
  nivelDefensa: 'baja' | 'media' | 'alta';
  raza: string;
  ultimaActividad: string;
  esAgente: boolean;
}

interface HeroeDisponible {
  id: string;
  nombre: string;
  nivel: number;
  clase: string;
  tropas: number;
  ubicacion: string;
  motivado: boolean;
}

const OBJETIVOS_MOCK: ObjetivoAtaque[] = [
  {
    id: 'o1',
    nombreImperio: 'Imperio de las Sombras',
    nombreCiudad: 'Oscurheim',
    region: 'misma_region',
    tropasAproximadas: '2.100-2.500',
    nivelDefensa: 'media',
    raza: 'Orcos',
    ultimaActividad: 'Hace 2h',
    esAgente: true,
  },
  {
    id: 'o2',
    nombreImperio: 'Montanas Grises',
    nombreCiudad: 'Fortaleza Enana',
    region: 'adyacente',
    tropasAproximadas: '4.000+',
    nivelDefensa: 'alta',
    raza: 'Enanos',
    ultimaActividad: 'Hace 30min',
    esAgente: false,
  },
  {
    id: 'o3',
    nombreImperio: 'Valle Olvidado',
    nombreCiudad: 'Aldea Perdida',
    region: 'misma_region',
    tropasAproximadas: '300-600',
    nivelDefensa: 'baja',
    raza: 'Humanos',
    ultimaActividad: 'Hace 1 dia',
    esAgente: false,
  },
];

const HEROES_MOCK: HeroeDisponible[] = [
  { id: 'h1', nombre: 'Doghell N1', nivel: 1, clase: 'Ladron', tropas: 850, ubicacion: 'Bosque Verde #16', motivado: true },
];

const COLOR_DEFENSA: Record<ObjetivoAtaque['nivelDefensa'], string> = {
  baja: 'bg-green-100 text-green-700 border-green-300',
  media: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  alta: 'bg-red-100 text-red-700 border-red-300',
};

const LABEL_DEFENSA: Record<ObjetivoAtaque['nivelDefensa'], string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};

const PASOS: { id: Paso; label: string }[] = [
  { id: 'objetivo', label: 'Objetivo' },
  { id: 'heroe', label: 'Heroe' },
  { id: 'confirmar', label: 'Confirmar' },
  { id: 'resultado', label: 'Resultado' },
];

const Atacar: React.FC = () => {
  const [paso, setPaso] = useState<Paso>('objetivo');
  const [objetivo, setObjetivo] = useState<ObjetivoAtaque | null>(null);
  const [heroe, setHeroe] = useState<HeroeDisponible | null>(null);
  const [atacando, setAtacando] = useState(false);
  const [resultado, setResultado] = useState<'victoria' | 'derrota' | null>(null);

  const costeTurnos = objetivo?.region === 'adyacente'
    ? COSTOS_TURNOS.ataqueRegionalAdyacente
    : COSTOS_TURNOS.ataqueRegionalMismaRegion;

  const pasoActual = PASOS.findIndex((item) => item.id === paso);

  const lanzarAtaque = async () => {
    setAtacando(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
    setResultado(Math.random() > 0.4 ? 'victoria' : 'derrota');
    setAtacando(false);
    setPaso('resultado');
  };

  const reiniciar = () => {
    setPaso('objetivo');
    setObjetivo(null);
    setHeroe(null);
    setResultado(null);
    setAtacando(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-100 to-orange-200 p-6 rounded-lg border-2 border-red-400">
        <h1 className="text-3xl font-bold text-red-800 flex items-center gap-3">
          <Sword className="text-red-600" /> Atacar
        </h1>
        <p className="text-red-700 mt-1">Elige tu objetivo, asigna un heroe y lanza el ataque.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {PASOS.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              index < pasoActual
                ? 'bg-green-100 text-green-700'
                : index === pasoActual
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-400'
            }`}>
              {index < pasoActual ? '✓' : `${index + 1}.`} {item.label}
            </div>
            {index < PASOS.length - 1 && <ChevronRight size={14} className="text-amber-400" />}
          </React.Fragment>
        ))}
      </div>

      {paso === 'objetivo' && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-amber-800">Elige tu objetivo</h2>
          {OBJETIVOS_MOCK.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setObjetivo(item);
                setPaso('heroe');
              }}
              className="w-full text-left p-4 bg-amber-50 rounded-lg border-2 border-yellow-300 hover:border-yellow-500 hover:bg-amber-100 transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-lg">{'\u2694\uFE0F'}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-amber-800">{item.nombreCiudad}</span>
                      <span className="text-amber-600 text-sm">— {item.nombreImperio}</span>
                      {item.esAgente && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">IA</span>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-amber-600 flex-wrap">
                      <span>Raza: {item.raza}</span>
                      <span>Tropas: ~{item.tropasAproximadas}</span>
                      <span>Ultima actividad: {item.ultimaActividad}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${COLOR_DEFENSA[item.nivelDefensa]}`}>
                    {LABEL_DEFENSA[item.nivelDefensa]} defensa
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.region === 'misma_region'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.region === 'misma_region' ? `${COSTOS_TURNOS.ataqueRegionalMismaRegion}T` : `${COSTOS_TURNOS.ataqueRegionalAdyacente}T`}
                  </span>
                  <ChevronRight size={16} className="text-amber-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {paso === 'heroe' && objetivo && (
        <div className="space-y-4">
          <button type="button" onClick={() => setPaso('objetivo')} className="text-amber-600 hover:text-amber-800 text-sm">
            ← Volver
          </button>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700 flex items-start gap-2">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <div>Atacando <strong>{objetivo.nombreCiudad}</strong> ({objetivo.nombreImperio}). Defensa estimada: {LABEL_DEFENSA[objetivo.nivelDefensa]}.</div>
          </div>
          <h2 className="text-lg font-bold text-amber-800">Elige el heroe que liderara el ataque</h2>
          {HEROES_MOCK.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setHeroe(item);
                setPaso('confirmar');
              }}
              className="w-full text-left p-4 bg-amber-50 rounded-lg border-2 border-yellow-300 hover:border-yellow-500 hover:bg-amber-100 transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-bold text-amber-800">{item.nombre}</div>
                  <div className="text-sm text-amber-600">{item.clase} · Nivel {item.nivel}</div>
                  <div className="text-xs text-amber-500 mt-1">
                    Tropas: {item.tropas.toLocaleString()} · Ubicacion: {item.ubicacion}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${item.motivado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {item.motivado ? 'Listo' : 'No disponible'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {paso === 'confirmar' && objetivo && heroe && (
        <div className="max-w-xl mx-auto bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600 space-y-4">
          <h2 className="text-2xl font-bold text-amber-800 text-center">Confirmar ataque</h2>
          <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-700 space-y-2">
            <div>Objetivo: <strong>{objetivo.nombreCiudad}</strong> de {objetivo.nombreImperio}</div>
            <div>Heroe lider: <strong>{heroe.nombre}</strong> ({heroe.clase})</div>
            <div>Tropas aproximadas enemigas: <strong>{objetivo.tropasAproximadas}</strong></div>
            <div>Coste de ataque: <strong className="text-red-700">{costeTurnos}T</strong></div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            El combate puede terminar en victoria o derrota. Las bajas y el botin se calculan al resolver el ataque.
          </div>
          <button
            type="button"
            onClick={lanzarAtaque}
            disabled={atacando}
            className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              atacando ? 'bg-amber-400 cursor-wait' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
            }`}
          >
            {atacando ? (
              <><span className="animate-spin">{'\u2694\uFE0F'}</span> Atacando...</>
            ) : (
              <><Sword size={18} /> Atacar <span className="bg-red-700 text-red-200 text-sm px-2 py-0.5 rounded">{costeTurnos}T</span></>
            )}
          </button>
        </div>
      )}

      {paso === 'resultado' && objetivo && heroe && resultado && (
        <div className="max-w-lg mx-auto text-center space-y-4">
          <div className={`p-8 rounded-lg border-2 ${resultado === 'victoria' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
            <div className="text-6xl mb-4">{resultado === 'victoria' ? '\u{1F3C6}' : '\u{1F480}'}</div>
            <h2 className={`text-3xl font-bold mb-2 ${resultado === 'victoria' ? 'text-green-800' : 'text-red-800'}`}>
              {resultado === 'victoria' ? 'Victoria' : 'Derrota'}
            </h2>
            <p className={`text-sm ${resultado === 'victoria' ? 'text-green-600' : 'text-red-600'}`}>
              {resultado === 'victoria'
                ? `Has conquistado ${objetivo.nombreCiudad}. Botin obtenido: +1.200 oro, +300 comida`
                : `Tu ejercito fue repelido en ${objetivo.nombreCiudad}. Bajas: ~320 tropas`}
            </p>
            <p className="text-amber-600 text-xs mt-2">Coste: {costeTurnos} turnos gastados</p>
          </div>
          <button
            type="button"
            onClick={reiniciar}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
          >
            Nuevo ataque
          </button>
        </div>
      )}
    </div>
  );
};

export default Atacar;
