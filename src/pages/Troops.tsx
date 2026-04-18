import React, { useState } from 'react';
import { Users, ArrowRight, Shield, Sword } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const TurnoBadge: React.FC<{ costo: number }> = ({ costo }) => (
  <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded ml-1">{costo}T</span>
);

type TroopUnitKey = 'N1 Guerreros elfos' | 'N2 Arqueros elfos' | 'N3 Centauros' | 'N4 Exploradores elfos';

const EMPTY_MOVEMENTS: Record<TroopUnitKey, number> = {
  'N1 Guerreros elfos': 0,
  'N2 Arqueros elfos': 0,
  'N3 Centauros': 0,
  'N4 Exploradores elfos': 0,
};

const Troops: React.FC = () => {
  const [sourceLocation, setSourceLocation] = useState('rosvo');
  const [targetLocation, setTargetLocation] = useState('doghell');
  const [troopMovements, setTroopMovements] = useState<Record<TroopUnitKey, number>>({ ...EMPTY_MOVEMENTS });

  const locations = [
    {
      id: 'rosvo',
      name: 'Rosvo',
      type: 'city',
      troops: 2060,
      limit: 10000,
      terrain: 'Bosque',
      units: {
        'N1 Guerreros elfos': { available: 850, moving: 0, bonus: '+1000 +100 +10 +1' },
        'N2 Arqueros elfos': { available: 400, moving: 0, bonus: '+1000 +100 +10 +1' },
        'N3 Centauros': { available: 250, moving: 0, bonus: '+1000 +100 +10 +1' },
        'N4 Exploradores elfos': { available: 50, moving: 0, bonus: '+1000 +100 +10 +1' }
      }
    },
    {
      id: 'doghell',
      name: 'Doghell',
      type: 'hero',
      troops: 540,
      limit: 12000,
      terrain: 'Tierra',
      units: {
        'N1 Guerreros elfos': { available: 850, moving: 0, bonus: '+1000 +100 +10 +1' },
        'N2 Arqueros elfos': { available: 400, moving: 0, bonus: '+1000 +100 +10 +1' },
        'N3 Centauros': { available: 250, moving: 0, bonus: '+1000 +100 +10 +1' },
        'N4 Exploradores elfos': { available: 50, moving: 0, bonus: '+1000 +100 +10 +1' }
      }
    }
  ];

  const sourceLocationData = locations.find(loc => loc.id === sourceLocation);
  const targetLocationData = locations.find(loc => loc.id === targetLocation);

  const handleTroopChange = (unitType: TroopUnitKey, value: number) => {
    setTroopMovements(prev => ({
      ...prev,
      [unitType]: Math.max(0, value)
    }));
  };

  const moveAllToTarget = () => {
    if (!sourceLocationData) return;
    setTroopMovements(prev => {
      const next = { ...prev };
      (Object.keys(next) as TroopUnitKey[]).forEach(k => {
        next[k] = sourceLocationData.units[k].available;
      });
      return next;
    });
  };

  const moveAllToSource = () => {
    setTroopMovements({ ...EMPTY_MOVEMENTS });
  };

  const totalMoving = Object.values(troopMovements).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Users className="text-yellow-600" />
          Mover Tropas
        </h1>
        <p className="text-amber-700 mt-2">Gestiona el movimiento estratégico de tus fuerzas</p>
      </div>

      {/* Location Selection */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <label className="block text-amber-800 font-semibold mb-2">Desde</label>
            <select 
              value={sourceLocation}
              onChange={(e) => setSourceLocation(e.target.value)}
              className="p-3 border-2 border-yellow-600 rounded bg-amber-50 text-amber-800 font-semibold min-w-48"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name} - Tropas: {location.troops} - Límite: {location.limit} ({location.terrain})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight size={32} className="text-yellow-600" />
          </div>

          <div className="text-center">
            <label className="block text-amber-800 font-semibold mb-2">Hacia</label>
            <select 
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="p-3 border-2 border-yellow-600 rounded bg-amber-50 text-amber-800 font-semibold min-w-48"
            >
              {locations.filter(loc => loc.id !== sourceLocation).map(location => (
                <option key={location.id} value={location.id}>
                  {location.name} - Tropas: {location.troops} - Límite: {location.limit} ({location.terrain})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Troop Movement Interface */}
      {sourceLocationData && targetLocationData && (
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-yellow-600">
                  <th className="text-left text-amber-800 p-3">Unidad</th>
                  <th className="text-center text-amber-800 p-3">Bonificaciones</th>
                  <th className="text-center text-amber-800 p-3">Disponible en {sourceLocationData.name}</th>
                  <th className="text-center text-amber-800 p-3">% Capacidad</th>
                  <th className="text-center text-amber-800 p-3">Mover a {targetLocationData.name}</th>
                  <th className="text-center text-amber-800 p-3">% Final</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(sourceLocationData.units) as TroopUnitKey[]).map(unitType => {
                  const data = sourceLocationData.units[unitType];
                  const movingAmount = troopMovements[unitType] || 0;
                  const remainingInSource = data.available - movingAmount;
                  const currentCapacityPercentage = Math.round((remainingInSource / sourceLocationData.limit) * 100);
                  const finalCapacityPercentage = Math.round(((targetLocationData.troops + totalMoving) / targetLocationData.limit) * 100);

                  return (
                    <tr key={unitType} className="border-b border-yellow-400">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
                            {unitType.includes('Guerreros') && <Sword className="text-amber-200" size={16} />}
                            {unitType.includes('Arqueros') && <Shield className="text-amber-200" size={16} />}
                            {unitType.includes('Centauros') && <Users className="text-amber-200" size={16} />}
                            {unitType.includes('Exploradores') && <Users className="text-amber-200" size={16} />}
                          </div>
                          <span className="text-amber-800 font-semibold">{unitType}</span>
                        </div>
                      </td>
                      <td className="text-center p-3 text-green-600 font-semibold">{data.bonus}</td>
                      <td className="text-center p-3 text-amber-800 font-bold">{remainingInSource}</td>
                      <td className="text-center p-3">
                        <span className={`font-semibold ${currentCapacityPercentage > 80 ? 'text-red-600' : currentCapacityPercentage > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {currentCapacityPercentage}%
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <input
                          type="number"
                          value={movingAmount}
                          onChange={(e) => handleTroopChange(unitType, parseInt(e.target.value) || 0)}
                          max={data.available}
                          min={0}
                          className="w-20 p-2 border border-yellow-600 rounded bg-amber-50 text-center"
                        />
                      </td>
                      <td className="text-center p-3">
                        <span className={`font-semibold ${finalCapacityPercentage > 80 ? 'text-red-600' : finalCapacityPercentage > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {finalCapacityPercentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={moveAllToTarget}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ArrowRight size={16} />
                Mover todo a {targetLocationData.name}
              </button>
              <button
                onClick={moveAllToSource}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reiniciar formación
              </button>
            </div>

            <div className="text-center">
              <p className="text-amber-800">
                <strong>Total niveles:</strong> {sourceLocationData.troops - totalMoving}
              </p>
              <p className="text-amber-800">
                <strong>Límite:</strong> {sourceLocationData.limit.toLocaleString()}
              </p>
              <p className="text-amber-700">
                Potencial óptimo según 🌿 y 💧: 3.870
              </p>
            </div>

            <div className="text-center">
              <p className="text-amber-800">
                <strong>Total niveles:</strong> {targetLocationData.troops + totalMoving}
              </p>
              <p className="text-amber-800">
                <strong>Límite:</strong> {targetLocationData.limit.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button 
              type="button"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-bold text-lg inline-flex items-center justify-center gap-1 flex-wrap"
              disabled={totalMoving === 0}
            >
              Efectuar movimiento <TurnoBadge costo={1} />
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-green-100 to-green-200 p-6 rounded-lg border-2 border-green-500">
          <h3 className="text-lg font-bold text-green-800 mb-3">Acciones Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
              Ver todas las tropas
            </button>
            <button type="button" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
              Distribuir automáticamente
            </button>
            <button type="button" className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition-colors flex items-center justify-center gap-1">
              Entrenar tropas <TurnoBadge costo={COSTOS_TURNOS.comprarTropas} />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-500">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Información</h3>
          <p className="text-blue-700 text-sm">
            Los movimientos de tropas consumen turnos. Planifica cuidadosamente tus estrategias antes de mover grandes cantidades.
          </p>
        </div>

        <div className="bg-gradient-to-b from-purple-100 to-purple-200 p-6 rounded-lg border-2 border-purple-500">
          <h3 className="text-lg font-bold text-purple-800 mb-3">Estadísticas</h3>
          <p className="text-purple-700 text-sm">
            <strong>Total de tropas:</strong> {locations.reduce((sum, loc) => sum + loc.troops, 0).toLocaleString()}
          </p>
          <p className="text-purple-700 text-sm">
            <strong>Capacidad total:</strong> {locations.reduce((sum, loc) => sum + loc.limit, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Troops;