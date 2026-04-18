import React, { useState } from 'react';
import { Bot, Pause, Play, Trash2 } from 'lucide-react';
import type {
  ImperioAgente,
  Raza,
  ModeloIA,
  EstrategiaAgente,
  RelacionAgente,
} from '../types/game';

const AGENTES_MOCK: ImperioAgente[] = [
  {
    id: 'a1',
    nombreImperio: 'Imperio de las Sombras',
    raza: 'orcos',
    modelo: 'claude',
    estrategia: 'agresiva',
    relacion: 'enemigo',
    activo: true,
    ranking: 12,
    turnosUsadosHoy: 41,
    mcpToken: 'tok_a1',
    ultimasAcciones: [
      { timestamp: '2026-04-08T12:34:00Z', descripcion: 'Ataco ciudad Bosque Verde #7 - DERROTA (-320 tropas)', turnosGastados: 8, resultado: 'fallo' },
      { timestamp: '2026-04-08T11:20:00Z', descripcion: 'Construyo Armeria nivel 3 en Oscurheim', turnosGastados: 2, resultado: 'exito' },
      { timestamp: '2026-04-08T10:55:00Z', descripcion: 'Entreno 500 Guerreros Orcos N2 en Oscurheim', turnosGastados: 5, resultado: 'exito' },
    ],
  },
  {
    id: 'a2',
    nombreImperio: 'Reino de Cristal',
    raza: 'elfos',
    modelo: 'gpt-4o',
    estrategia: 'economica',
    relacion: 'aliado',
    activo: true,
    ranking: 5,
    turnosUsadosHoy: 67,
    mcpToken: 'tok_a2',
    ultimasAcciones: [
      { timestamp: '2026-04-08T12:10:00Z', descripcion: 'Publico oferta de comercio: 2.000 madera a 3 oro/unidad', turnosGastados: 1, resultado: 'exito' },
      { timestamp: '2026-04-08T11:00:00Z', descripcion: 'Fundo nueva ciudad en Llanura #44', turnosGastados: 20, resultado: 'exito' },
    ],
  },
];

const NOMBRE_MODELO: Record<ModeloIA, string> = {
  claude: 'Claude',
  'gpt-4o': 'GPT-4o',
  local: 'Modelo Local',
};

const NOMBRE_ESTRATEGIA: Record<EstrategiaAgente, string> = {
  agresiva: 'Agresiva',
  economica: 'Economica',
  defensiva: 'Defensiva',
  equilibrada: 'Equilibrada',
};

const NOMBRE_RAZA: Record<Raza, string> = {
  elfos: 'Elfos',
  elfos_oscuros: 'Elfos Oscuros',
  enanos: 'Enanos',
  humanos: 'Humanos',
  no_muertos: 'No Muertos',
  orcos: 'Orcos',
};

const RELACIONES: RelacionAgente[] = ['enemigo', 'aliado'];
const RAZAS: Raza[] = ['elfos', 'elfos_oscuros', 'enanos', 'humanos', 'no_muertos', 'orcos'];

const crearToken = () => `tok_${Math.random().toString(36).slice(2, 10)}`;

const ImperiosAgente: React.FC = () => {
  const [agentes, setAgentes] = useState<ImperioAgente[]>(AGENTES_MOCK);
  const [mostrandoRazonamiento, setMostrandoRazonamiento] = useState<string | null>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [tokenPreview, setTokenPreview] = useState(crearToken());
  const [nuevoAgente, setNuevoAgente] = useState({
    nombreImperio: '',
    raza: 'elfos' as Raza,
    modelo: 'claude' as ModeloIA,
    estrategia: 'equilibrada' as EstrategiaAgente,
    relacion: 'enemigo' as RelacionAgente,
  });
  const [erroresForm, setErroresForm] = useState<string[]>([]);

  const toggleActivo = (id: string) => {
    setAgentes((prev) => prev.map((agente) => (agente.id === id ? { ...agente, activo: !agente.activo } : agente)));
  };

  const abrirFormulario = () => {
    setMostrandoFormulario(true);
    setErroresForm([]);
    setTokenPreview(crearToken());
  };

  const cerrarFormulario = () => {
    setMostrandoFormulario(false);
    setErroresForm([]);
  };

  const validarYCrear = () => {
    const errores: string[] = [];
    if (nuevoAgente.nombreImperio.trim().length < 2) {
      errores.push('El nombre del imperio debe tener al menos 2 caracteres.');
    }
    if (errores.length > 0) {
      setErroresForm(errores);
      return;
    }

    const creado: ImperioAgente = {
      id: `a_${Date.now()}`,
      nombreImperio: nuevoAgente.nombreImperio.trim(),
      raza: nuevoAgente.raza,
      modelo: nuevoAgente.modelo,
      estrategia: nuevoAgente.estrategia,
      relacion: nuevoAgente.relacion,
      activo: false,
      ranking: 999,
      turnosUsadosHoy: 0,
      ultimasAcciones: [],
      mcpToken: tokenPreview,
    };

    setAgentes((prev) => [...prev, creado]);
    setNuevoAgente({
      nombreImperio: '',
      raza: 'elfos',
      modelo: 'claude',
      estrategia: 'equilibrada',
      relacion: 'enemigo',
    });
    setTokenPreview(crearToken());
    setErroresForm([]);
    setMostrandoFormulario(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Bot className="text-yellow-600" /> Imperios Agente
        </h1>
      </div>

      <p className="text-amber-600 text-sm">
        Configura y gestiona imperios controlados por inteligencia artificial. Cada agente usa el mismo sistema de turnos que los jugadores humanos.
      </p>

      <div className="space-y-4">
        {agentes.map((agente) => (
          <div key={agente.id} className={`rounded-lg border-2 p-5 ${agente.relacion === 'enemigo' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${agente.relacion === 'enemigo' ? 'bg-red-200' : 'bg-blue-200'}`}>
                {agente.relacion === 'enemigo' ? '\u{1F525}' : '\u2728'}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-lg ${agente.relacion === 'enemigo' ? 'text-red-800' : 'text-blue-800'}`}>{agente.nombreImperio}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${agente.relacion === 'enemigo' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
                    {agente.relacion === 'enemigo' ? 'ENEMIGO' : 'ALIADO'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${agente.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {agente.activo ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                <p className="text-sm mt-0.5 opacity-70">
                  Raza: {NOMBRE_RAZA[agente.raza]} · Modelo: {NOMBRE_MODELO[agente.modelo]} · Estrategia: {NOMBRE_ESTRATEGIA[agente.estrategia]}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-amber-800 text-sm"># {agente.ranking} Ranking</div>
                <div className="text-amber-600 text-xs">{agente.turnosUsadosHoy}T usados hoy</div>
              </div>
            </div>

            <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3 text-xs space-y-1.5">
              <div className="font-semibold text-amber-700 mb-1">Ultimas acciones:</div>
              {agente.ultimasAcciones.map((accion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-400 flex-shrink-0">{new Date(accion.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={accion.resultado === 'exito' ? 'text-gray-700' : 'text-red-600'}>{accion.descripcion}</span>
                  <span className={`flex-shrink-0 ml-auto px-1 rounded text-[10px] font-bold ${accion.resultado === 'exito' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    -{accion.turnosGastados}T
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setMostrandoRazonamiento(mostrandoRazonamiento === agente.id ? null : agente.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded text-amber-700 text-sm"
              >
                <Bot size={13} /> Ver razonamiento
              </button>
              <button
                type="button"
                onClick={() => toggleActivo(agente.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
              >
                {agente.activo ? <><Pause size={13} /> Pausar</> : <><Play size={13} /> Reanudar</>}
              </button>
              {agente.relacion === 'enemigo' ? (
                <button type="button" className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                  Proponer alianza
                </button>
              ) : (
                <button type="button" className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  Romper alianza
                </button>
              )}
              <button type="button" className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-red-600 text-sm ml-auto">
                <Trash2 size={13} /> Eliminar
              </button>
            </div>

            {mostrandoRazonamiento === agente.id && (
              <div className="mt-3 bg-gray-900 rounded-lg p-3 text-xs text-green-300 font-mono">
                <div className="text-gray-500 mb-1"># Razonamiento del agente - {agente.nombreImperio}</div>
                <div>Estado: turnos_restantes=59, ranking=#{agente.ranking}, estrategia={agente.estrategia}</div>
                <div className="mt-1">
                  Analisis: con estrategia {agente.estrategia}, priorizo {agente.estrategia === 'agresiva' ? 'ataques a ciudades enemigas debiles' : 'construccion de edificios de produccion'}.
                </div>
                <div className="mt-1 text-gray-400">[El razonamiento real aparecera cuando el servidor MCP este conectado]</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!mostrandoFormulario ? (
        <button
          type="button"
          onClick={abrirFormulario}
          className="w-full border-2 border-dashed border-amber-300 rounded-lg p-8 text-center text-amber-500 hover:bg-amber-50 hover:border-amber-400 transition-colors"
        >
          <Bot size={32} className="mx-auto mb-2 text-amber-400" />
          <p className="font-medium">+ Anadir nuevo Imperio Agente</p>
          <p className="text-sm mt-1">Elige modelo · Define estrategia · Conecta via MCP</p>
        </button>
      ) : (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-purple-800 text-lg flex items-center gap-2">
              <Bot size={18} /> Nuevo Imperio Agente
            </h3>
            <button type="button" onClick={cerrarFormulario} className="text-purple-400 hover:text-purple-700 text-xl">
              x
            </button>
          </div>

          {erroresForm.length > 0 && (
            <div className="bg-red-50 border border-red-300 rounded p-2 text-xs text-red-600 space-y-0.5">
              {erroresForm.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-purple-700 text-sm font-medium block mb-1">Nombre del Imperio *</label>
              <input
                type="text"
                value={nuevoAgente.nombreImperio}
                onChange={(event) => setNuevoAgente((prev) => ({ ...prev, nombreImperio: event.target.value }))}
                placeholder="Ej: Legion del Caos"
                className="w-full border border-purple-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-purple-700 text-sm font-medium block mb-1">Raza</label>
              <select
                value={nuevoAgente.raza}
                onChange={(event) => setNuevoAgente((prev) => ({ ...prev, raza: event.target.value as Raza }))}
                className="w-full border border-purple-300 rounded p-2 text-sm bg-white"
              >
                {RAZAS.map((raza) => (
                  <option key={raza} value={raza}>{NOMBRE_RAZA[raza]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-purple-700 text-sm font-medium block mb-1">Modelo IA</label>
              <select
                value={nuevoAgente.modelo}
                onChange={(event) => setNuevoAgente((prev) => ({ ...prev, modelo: event.target.value as ModeloIA }))}
                className="w-full border border-purple-300 rounded p-2 text-sm bg-white"
              >
                <option value="claude">Claude (Anthropic)</option>
                <option value="gpt-4o">GPT-4o (OpenAI)</option>
                <option value="local">Modelo Local</option>
              </select>
            </div>

            <div>
              <label className="text-purple-700 text-sm font-medium block mb-1">Estrategia</label>
              <select
                value={nuevoAgente.estrategia}
                onChange={(event) => setNuevoAgente((prev) => ({ ...prev, estrategia: event.target.value as EstrategiaAgente }))}
                className="w-full border border-purple-300 rounded p-2 text-sm bg-white"
              >
                <option value="agresiva">Agresiva - prioriza ataques</option>
                <option value="economica">Economica - prioriza produccion</option>
                <option value="defensiva">Defensiva - prioriza defensa</option>
                <option value="equilibrada">Equilibrada - estrategia mixta</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-purple-700 text-sm font-medium block mb-1">Relacion contigo</label>
              <div className="flex gap-2">
                {RELACIONES.map((relacion) => (
                  <button
                    key={relacion}
                    type="button"
                    onClick={() => setNuevoAgente((prev) => ({ ...prev, relacion }))}
                    className={`flex-1 py-2 rounded text-sm font-medium border-2 transition-all ${
                      nuevoAgente.relacion === relacion
                        ? relacion === 'enemigo'
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}
                  >
                    {relacion === 'enemigo' ? 'Enemigo' : 'Aliado'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-purple-100 rounded p-3 text-xs text-purple-700 space-y-1">
            <div className="font-semibold">Token MCP (generado automaticamente)</div>
            <div className="font-mono bg-white rounded px-2 py-1 text-purple-600">{tokenPreview}</div>
            <div>El agente usara este token para autenticarse en el servidor MCP.</div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={cerrarFormulario}
              className="flex-1 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={validarYCrear}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
            >
              <Bot size={14} className="inline mr-1" /> Crear Agente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImperiosAgente;
