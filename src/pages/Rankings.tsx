import React, { useState } from 'react';
import { Trophy, Crown, Sword, Building, TrendingUp, Medal } from 'lucide-react';

const Rankings: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', name: 'General', icon: Crown },
    { id: 'military', name: 'Militar', icon: Sword },
    { id: 'economic', name: 'Económico', icon: Building },
    { id: 'heroes', name: 'Héroes', icon: Medal }
  ];

  const rankings = {
    general: [
      { position: 1, empire: 'Imperio Dorado', player: 'DragonLord', points: 15432, country: '🇪🇸', race: 'Elfos', trend: 'up' },
      { position: 2, empire: 'Reino del Norte', player: 'IceKing', points: 14567, country: '🇫🇷', race: 'Humanos', trend: 'up' },
      { position: 3, empire: 'Fortaleza Élfica', player: 'ElvenMaster', points: 13892, country: '🇩🇪', race: 'Elfos', trend: 'down' },
      { position: 4, empire: 'Clan Orco', player: 'Waaagh', points: 13245, country: '🇮🇹', race: 'Orcos', trend: 'up' },
      { position: 5, empire: 'Guardia Enana', player: 'Hammerfall', points: 12890, country: '🇬🇧', race: 'Enanos', trend: 'same' },
      { position: 47, empire: 'Tierras Doradas', player: 'TuUsuario', points: 8750, country: '🇪🇸', race: 'Elfos', trend: 'up', isPlayer: true }
    ],
    military: [
      { position: 1, empire: 'Legión de Acero', player: 'WarMaster', points: 89432, country: '🇺🇸', race: 'Humanos', trend: 'up' },
      { position: 2, empire: 'Horda Salvaje', player: 'BloodAxe', points: 87650, country: '🇷🇺', race: 'Orcos', trend: 'up' },
      { position: 3, empire: 'Guardia Real', player: 'KnightCorp', points: 85234, country: '🇫🇷', race: 'Humanos', trend: 'down' },
      { position: 4, empire: 'Arqueros Élficos', player: 'Bowmaster', points: 83456, country: '🇨🇦', race: 'Elfos', trend: 'up' },
      { position: 5, empire: 'Martillos de Guerra', player: 'IronBeard', points: 82890, country: '🇳🇴', race: 'Enanos', trend: 'same' }
    ],
    economic: [
      { position: 1, empire: 'Mercaderes Dorados', player: 'GoldRush', points: 234567, country: '🇯🇵', race: 'Gnomos', trend: 'up' },
      { position: 2, empire: 'Banco Central', player: 'CoinMaster', points: 221345, country: '🇨🇭', race: 'Enanos', trend: 'up' },
      { position: 3, empire: 'Comercio Imperial', player: 'TradeKing', points: 198765, country: '🇳🇱', race: 'Humanos', trend: 'down' },
      { position: 4, empire: 'Rutas de Seda', player: 'SilkTrader', points: 187432, country: '🇨🇳', race: 'Elfos', trend: 'up' },
      { position: 5, empire: 'Gremio Artesano', player: 'CraftMaster', points: 175890, country: '🇩🇪', race: 'Enanos', trend: 'same' }
    ],
    heroes: [
      { position: 1, empire: 'Leyenda Viviente', player: 'HeroSlayer', points: 9876, country: '🇰🇷', race: 'Elfos Oscuros', trend: 'up' },
      { position: 2, empire: 'Campeón del Reino', player: 'Champion', points: 9234, country: '🇧🇷', race: 'Humanos', trend: 'up' },
      { position: 3, empire: 'Maestro de Espadas', player: 'BladeWalker', points: 8890, country: '🇯🇵', race: 'Elfos', trend: 'down' },
      { position: 4, empire: 'Señor de la Guerra', player: 'Warlord', points: 8567, country: '🇺🇸', race: 'Orcos', trend: 'up' },
      { position: 5, empire: 'Paladín Sagrado', player: 'Paladin', points: 8234, country: '🇫🇷', race: 'Humanos', trend: 'same' }
    ]
  };

  const currentRankings = rankings[selectedCategory as keyof typeof rankings];
  const CurrentIcon = categories.find(cat => cat.id === selectedCategory)?.icon || Crown;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'down':
        return <TrendingUp size={16} className="text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getRaceColor = (race: string) => {
    const colors: { [key: string]: string } = {
      'Elfos': 'text-green-600',
      'Humanos': 'text-blue-600',
      'Orcos': 'text-red-600',
      'Enanos': 'text-orange-600',
      'Elfos Oscuros': 'text-purple-600',
      'Gnomos': 'text-yellow-600'
    };
    return colors[race] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <Trophy className="text-yellow-600" />
          Rankings Imperiales
        </h1>
        <p className="text-amber-700 mt-2">Clasificación mundial de los imperios más poderosos</p>
      </div>

      <div className="bg-amber-100 border border-yellow-400 rounded-lg p-3 flex flex-wrap items-center gap-3 mb-4">
        <span className="text-2xl" aria-hidden>{'\u23F3'}</span>
        <div>
          <span className="font-bold text-amber-800">Temporada en curso</span>
          <span className="text-amber-600 text-sm ml-2">Día 12 de 60 — quedan 48 días</span>
        </div>
        <div className="flex-1 min-w-[200px]" />
        <div className="text-amber-600 text-sm">Fin de temporada: premia a los top 10 de cada categoría</div>
      </div>

      {/* Category Selector */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold ${
                  selectedCategory === category.id
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-amber-50 text-amber-800 hover:bg-yellow-100 border border-yellow-400'
                }`}
              >
                <Icon size={20} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex items-center gap-3 mb-6">
          <CurrentIcon className="text-yellow-600" size={28} />
          <h2 className="text-2xl font-bold text-amber-800">
            Ranking {categories.find(cat => cat.id === selectedCategory)?.name}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-yellow-600">
                <th className="text-left text-amber-800 p-3 font-bold">Posición</th>
                <th className="text-left text-amber-800 p-3 font-bold">Imperio</th>
                <th className="text-left text-amber-800 p-3 font-bold">Jugador</th>
                <th className="text-center text-amber-800 p-3 font-bold">Puntos</th>
                <th className="text-center text-amber-800 p-3 font-bold">País</th>
                <th className="text-center text-amber-800 p-3 font-bold">Raza</th>
                <th className="text-center text-amber-800 p-3 font-bold">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {currentRankings.map((entry, index) => {
                const isPlayer = 'isPlayer' in entry && entry.isPlayer === true;
                return (
                <tr 
                  key={index} 
                  className={`border-b border-yellow-400 transition-colors ${
                    isPlayer 
                      ? 'bg-blue-100 border-blue-400' 
                      : index % 2 === 0 
                        ? 'bg-amber-50' 
                        : 'bg-yellow-50'
                  } hover:bg-yellow-100`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {entry.position <= 3 && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.position === 1 ? 'bg-yellow-400' :
                          entry.position === 2 ? 'bg-gray-400' :
                          'bg-orange-400'
                        }`}>
                          <Trophy className="text-white" size={16} />
                        </div>
                      )}
                      <span className={`font-bold ${
                        entry.position <= 3 ? 'text-xl' : 'text-lg'
                      } ${isPlayer ? 'text-blue-800' : 'text-amber-800'}`}>
                        #{entry.position}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${isPlayer ? 'text-blue-800' : 'text-amber-800'}`}>
                      {entry.empire}
                    </span>
                    {isPlayer && (
                      <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">TÚ</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`${isPlayer ? 'text-blue-700' : 'text-amber-700'}`}>
                      {entry.player}
                    </span>
                  </td>
                  <td className="text-center p-3">
                    <span className={`font-bold ${isPlayer ? 'text-blue-800' : 'text-amber-800'}`}>
                      {entry.points.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center p-3 text-2xl">{entry.country}</td>
                  <td className="text-center p-3">
                    <span className={`font-semibold ${getRaceColor(entry.race)}`}>
                      {entry.race}
                    </span>
                  </td>
                  <td className="text-center p-3">
                    {getTrendIcon(entry.trend)}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-green-100 to-green-200 p-6 rounded-lg border-2 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-800">Tu Posición</h3>
              <p className="text-3xl font-bold text-green-700">#47</p>
              <p className="text-green-600 text-sm">de 1,247 imperios</p>
            </div>
            <Crown className="text-green-600" size={48} />
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-800">Siguiente Objetivo</h3>
              <p className="text-2xl font-bold text-blue-700">#35</p>
              <p className="text-blue-600 text-sm">-1,250 puntos</p>
            </div>
            <TrendingUp className="text-blue-600" size={48} />
          </div>
        </div>

        <div className="bg-gradient-to-b from-purple-100 to-purple-200 p-6 rounded-lg border-2 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-800">Progreso Semanal</h3>
              <p className="text-2xl font-bold text-purple-700">+5</p>
              <p className="text-purple-600 text-sm">posiciones ganadas</p>
            </div>
            <Medal className="text-purple-600" size={48} />
          </div>
        </div>
      </div>

      {/* Seasonal Information */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h3 className="text-xl font-bold text-amber-800 mb-4">Información de Temporada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Premios de Temporada</h4>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>🏆 Top 1: Corona Imperial + 10,000 💎</li>
              <li>🥈 Top 10: Título Noble + 5,000 💎</li>
              <li>🥉 Top 100: Insignia de Honor + 1,000 💎</li>
              <li>🎖️ Top 500: Reconocimiento + 500 💎</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Tiempo Restante</h4>
            <div className="text-2xl font-bold text-amber-800">23 días 14:32:15</div>
            <p className="text-amber-700 text-sm">hasta el final de la temporada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;