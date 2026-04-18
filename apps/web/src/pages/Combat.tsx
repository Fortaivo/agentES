import React from 'react';
import { Sword, Shield, Trophy, Target } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const TurnoBadge: React.FC<{ costo: number }> = ({ costo }) => (
  <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded ml-1">{costo}T</span>
);

const Combat: React.FC = () => {
  const battleResult = {
    winner: 'Doghell N3',
    loser: 'Jembre',
    rounds: [
      {
        round: 1,
        actions: [
          {
            attacker: 'Las tropas Orcos en jabalinas N3',
            defender: 'El héroe Doghell N3',
            damage: 29,
            description: 'Atacan al héroe Doghell N3 y le causan 7 puntos de vida',
            attackerTroops: 'Orcos en jabalinas N3',
            defenderTroops: 'El héroe Doghell N3',
            attackerLoss: 0,
            defenderLoss: 0
          },
          {
            attacker: 'El héroe Doghell N3',
            defender: '5 Orcos en jabalinas N3',
            damage: 28,
            description: 'Ataca a 5 Orcos en jabalinas N3 (4 muertos)',
            attackerTroops: 'El héroe Doghell N3',
            defenderTroops: 'Orcos en jabalinas N3',
            attackerLoss: 0,
            defenderLoss: 4
          }
        ]
      },
      {
        round: 2,
        actions: [
          {
            attacker: '1 Centauros N3',
            defender: '5 Guerreros humanos N1',
            damage: 26,
            description: 'Ataca a 5 Guerreros humanos N1 (3 muertos)',
            attackerTroops: '1 Centauros N3',
            defenderTroops: 'Guerreros humanos N1',
            attackerLoss: 0,
            defenderLoss: 3
          },
          {
            attacker: '154 Guerreros humanos N1',
            defender: '3 Centauros N3',
            damage: 17,
            description: 'Atacan a 3 Centauros N3 (-17 muertos)',
            attackerTroops: '154 Guerreros humanos N1',
            defenderTroops: '3 Centauros N3',
            attackerLoss: 0,
            defenderLoss: 0
          }
        ]
      },
      // Más rounds...
    ],
    finalStats: {
      attacker: {
        name: 'Doghell N3',
        troopsLeft: [
          { name: 'N1 Guerreros elfos', quantity: 39, percentage: 6 },
          { name: 'N2 Arqueros elfos', quantity: 220, percentage: 88 }
        ]
      },
      defender: {
        name: 'Jembre',
        troopsLeft: [
          { name: 'N1 Guerreros humanos', quantity: 252, percentage: 51 },
          { name: 'N2 Lanceros humanos', quantity: 90, percentage: 86 }
        ]
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Sword className="text-yellow-600" />
          Resultado de Combate
        </h1>
        <p className="text-amber-700 mt-2">Análisis detallado de la batalla</p>
      </div>

      {/* Battle Overview */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                <Sword className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-800">{battleResult.winner}</h3>
              <p className="text-blue-600 text-sm">76</p>
              <p className="text-blue-600 text-xs">Niveles en el ejército: 300</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-amber-800 mb-2">VS</div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                ¡HAS GANADO!
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-red-800">{battleResult.loser}</h3>
              <p className="text-red-600 text-sm">171</p>
              <p className="text-red-600 text-xs">Niveles en el ejército: 400</p>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex justify-center gap-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-400 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-green-800 font-semibold">Victoria</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-400 text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-yellow-800 font-semibold">Oro obtenido</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-400 text-center">
            <div className="text-2xl mb-2">💎</div>
            <p className="text-blue-800 font-semibold">Experiencia</p>
          </div>
        </div>
      </div>

      {/* Battle Rounds */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h2 className="text-2xl font-bold text-amber-800 mb-6">Desarrollo de la Batalla</h2>
        
        <div className="space-y-6">
          {battleResult.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="border-2 border-yellow-400 rounded-lg p-4 bg-amber-50">
              <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Target className="text-yellow-600" />
                Round {round.round}
              </h3>
              
              <div className="space-y-3">
                {round.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="bg-white p-4 rounded border border-yellow-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Sword className="text-white" size={16} />
                          </div>
                          <span className="font-semibold text-blue-800">{action.attackerTroops}</span>
                        </div>
                        <ArrowRight className="text-gray-400" size={20} />
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <Shield className="text-white" size={16} />
                          </div>
                          <span className="font-semibold text-red-800">{action.defenderTroops}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                          {action.damage} daño
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{action.description}</p>
                    {(action.attackerLoss > 0 || action.defenderLoss > 0) && (
                      <div className="mt-2 flex gap-4 text-sm">
                        {action.attackerLoss > 0 && (
                          <span className="text-blue-600">Atacante pierde: {action.attackerLoss}</span>
                        )}
                        {action.defenderLoss > 0 && (
                          <span className="text-red-600">Defensor pierde: {action.defenderLoss}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Battle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-500">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Trophy className="text-blue-600" />
            {battleResult.finalStats.attacker.name} (Ganador)
          </h3>
          <div className="space-y-3">
            {battleResult.finalStats.attacker.troopsLeft.map((troop, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-blue-700">{troop.name}</span>
                <div className="text-right">
                  <span className="font-bold text-blue-800">{troop.quantity}</span>
                  <span className="text-blue-600 text-sm ml-2">({troop.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-b from-red-100 to-red-200 p-6 rounded-lg border-2 border-red-500">
          <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <Shield className="text-red-600" />
            {battleResult.finalStats.defender.name} (Derrotado)
          </h3>
          <div className="space-y-3">
            {battleResult.finalStats.defender.troopsLeft.map((troop, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-red-700">{troop.name}</span>
                <div className="text-right">
                  <span className="font-bold text-red-800">{troop.quantity}</span>
                  <span className="text-red-600 text-sm ml-2">({troop.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h3 className="text-xl font-bold text-amber-800 mb-4">Acciones Disponibles</h3>
        <div className="flex gap-4 flex-wrap">
          <button type="button" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Volver al mapa
          </button>
          <button type="button" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center">
            Atacar (misma región) <TurnoBadge costo={COSTOS_TURNOS.ataqueRegionalMismaRegion} />
          </button>
          <button type="button" className="bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors inline-flex items-center">
            Atacar (adyacente) <TurnoBadge costo={COSTOS_TURNOS.ataqueRegionalAdyacente} />
          </button>
          <button type="button" className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors inline-flex items-center">
            Asedio <TurnoBadge costo={COSTOS_TURNOS.asedio} />
          </button>
          <button type="button" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Ver historial
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for arrow
const ArrowRight: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Combat;