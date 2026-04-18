import React, { useState } from 'react';
import { User, Settings, Crown, Trophy } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const TurnoBadge: React.FC<{ costo: number }> = ({ costo }) => (
  <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded ml-1">{costo}T</span>
);

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const playerData = {
    username: 'TuUsuario',
    empire: 'Tierras Doradas',
    race: 'Elfos',
    level: 25,
    experience: 15750,
    maxExperience: 20000,
    joinDate: '15 de Marzo, 2023',
    country: '🇪🇸 España',
    rank: 47,
    totalPlayers: 1247,
    achievements: [
      { id: 1, name: 'Primer Imperio', description: 'Fundaste tu primera ciudad', earned: true, date: '15 Mar 2023' },
      { id: 2, name: 'Conquistador', description: 'Gana 10 batallas', earned: true, date: '20 Mar 2023' },
      { id: 3, name: 'Comerciante', description: 'Completa 50 transacciones', earned: true, date: '2 Abr 2023' },
      { id: 4, name: 'Arquitecto', description: 'Construye 25 edificios', earned: true, date: '10 Abr 2023' },
      { id: 5, name: 'Estratega', description: 'Alcanza el top 100', earned: false, date: '' },
      { id: 6, name: 'Emperador', description: 'Alcanza el top 10', earned: false, date: '' }
    ],
    statistics: {
      battlesWon: 127,
      battlesLost: 43,
      citiesBuilt: 3,
      heroesRecruited: 8,
      totalGoldEarned: 2450000,
      daysPlayed: 87,
      tradingProfit: 145000
    }
  };

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: User },
    { id: 'achievements', name: 'Logros', icon: Trophy },
    { id: 'statistics', name: 'Estadísticas', icon: Crown },
    { id: 'settings', name: 'Configuración', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <User className="text-yellow-600" />
          Perfil del Jugador
        </h1>
        <p className="text-amber-700 mt-2">Información de tu cuenta y progreso</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex flex-wrap gap-4 justify-center">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold ${
                  activeTab === tab.id
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-amber-50 text-amber-800 hover:bg-yellow-100 border border-yellow-400'
                }`}
              >
                <Icon size={20} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Información Básica</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-800 rounded-full flex items-center justify-center">
                    <Crown className="text-amber-200" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-800">{playerData.username}</h2>
                    <p className="text-amber-600">Emperador de {playerData.empire}</p>
                    <p className="text-amber-600">Raza: {playerData.race}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-3 rounded border border-yellow-400">
                    <p className="text-amber-600 text-sm">Nivel</p>
                    <p className="text-xl font-bold text-amber-800">{playerData.level}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded border border-yellow-400">
                    <p className="text-amber-600 text-sm">Ranking</p>
                    <p className="text-xl font-bold text-amber-800">#{playerData.rank}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded border border-yellow-400">
                    <p className="text-amber-600 text-sm">País</p>
                    <p className="text-lg text-amber-800">{playerData.country}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded border border-yellow-400">
                    <p className="text-amber-600 text-sm">Registro</p>
                    <p className="text-sm text-amber-800">{playerData.joinDate}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-800">Experiencia</span>
                    <span className="text-amber-700">{playerData.experience.toLocaleString()} / {playerData.maxExperience.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(playerData.experience / playerData.maxExperience) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-amber-600 text-sm mt-1">
                    {playerData.maxExperience - playerData.experience} XP para nivel {playerData.level + 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Estadísticas Rápidas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded border border-green-400 text-center">
                  <div className="text-2xl font-bold text-green-800">{playerData.statistics.battlesWon}</div>
                  <div className="text-green-600 text-sm">Batallas Ganadas</div>
                </div>
                <div className="bg-red-50 p-4 rounded border border-red-400 text-center">
                  <div className="text-2xl font-bold text-red-800">{playerData.statistics.battlesLost}</div>
                  <div className="text-red-600 text-sm">Batallas Perdidas</div>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-400 text-center">
                  <div className="text-2xl font-bold text-blue-800">{playerData.statistics.citiesBuilt}</div>
                  <div className="text-blue-600 text-sm">Ciudades</div>
                </div>
                <div className="bg-purple-50 p-4 rounded border border-purple-400 text-center">
                  <div className="text-2xl font-bold text-purple-800">{playerData.statistics.heroesRecruited}</div>
                  <div className="text-purple-600 text-sm">Héroes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
          <h3 className="text-xl font-bold text-amber-800 mb-6">Logros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerData.achievements.map(achievement => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                achievement.earned 
                  ? 'bg-yellow-50 border-yellow-400' 
                  : 'bg-gray-50 border-gray-300 opacity-60'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}>
                    <Trophy className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${achievement.earned ? 'text-amber-800' : 'text-gray-600'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${achievement.earned ? 'text-amber-600' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <p className="text-xs text-green-600 mt-1">
                        Obtenido el {achievement.date}
                      </p>
                    )}
                  </div>
                  {achievement.earned && (
                    <div className="text-green-500 font-bold">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'statistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-green-100 to-green-200 p-6 rounded-lg border-2 border-green-500">
              <h4 className="text-lg font-bold text-green-800 mb-2">Ratio de Victorias</h4>
              <div className="text-3xl font-bold text-green-700">
                {Math.round((playerData.statistics.battlesWon / (playerData.statistics.battlesWon + playerData.statistics.battlesLost)) * 100)}%
              </div>
              <p className="text-green-600 text-sm">
                {playerData.statistics.battlesWon} ganadas de {playerData.statistics.battlesWon + playerData.statistics.battlesLost} totales
              </p>
            </div>

            <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-500">
              <h4 className="text-lg font-bold text-blue-800 mb-2">Oro Total Ganado</h4>
              <div className="text-2xl font-bold text-blue-700">
                {(playerData.statistics.totalGoldEarned / 1000000).toFixed(1)}M 💰
              </div>
              <p className="text-blue-600 text-sm">
                {playerData.statistics.totalGoldEarned.toLocaleString()} oro total
              </p>
            </div>

            <div className="bg-gradient-to-b from-purple-100 to-purple-200 p-6 rounded-lg border-2 border-purple-500">
              <h4 className="text-lg font-bold text-purple-800 mb-2">Días Jugados</h4>
              <div className="text-3xl font-bold text-purple-700">{playerData.statistics.daysPlayed}</div>
              <p className="text-purple-600 text-sm">
                Desde {playerData.joinDate}
              </p>
            </div>

            <div className="bg-gradient-to-b from-yellow-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-500">
              <h4 className="text-lg font-bold text-yellow-800 mb-2">Ganancia Comercial</h4>
              <div className="text-2xl font-bold text-yellow-700">
                {playerData.statistics.tradingProfit.toLocaleString()} 💰
              </div>
              <p className="text-yellow-600 text-sm">Por transacciones</p>
            </div>

            <div className="bg-gradient-to-b from-orange-100 to-orange-200 p-6 rounded-lg border-2 border-orange-500">
              <h4 className="text-lg font-bold text-orange-800 mb-2">Promedio Diario</h4>
              <div className="text-2xl font-bold text-orange-700">
                {Math.round(playerData.statistics.totalGoldEarned / playerData.statistics.daysPlayed).toLocaleString()}
              </div>
              <p className="text-orange-600 text-sm">Oro por día</p>
            </div>

            <div className="bg-gradient-to-b from-red-100 to-red-200 p-6 rounded-lg border-2 border-red-500">
              <h4 className="text-lg font-bold text-red-800 mb-2">Progreso Global</h4>
              <div className="text-2xl font-bold text-red-700">
                Top {Math.round((playerData.rank / playerData.totalPlayers) * 100)}%
              </div>
              <p className="text-red-600 text-sm">
                #{playerData.rank} de {playerData.totalPlayers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
            <h3 className="text-xl font-bold text-amber-800 mb-4">Configuración de Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">Email</label>
                  <input 
                    type="email" 
                    value="usuario@email.com" 
                    className="w-full p-3 border border-yellow-400 rounded bg-amber-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    value={playerData.username}
                    className="w-full p-3 border border-yellow-400 rounded bg-amber-50"
                  />
                </div>
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">País</label>
                  <select className="w-full p-3 border border-yellow-400 rounded bg-amber-50">
                    <option>🇪🇸 España</option>
                    <option>🇫🇷 Francia</option>
                    <option>🇩🇪 Alemania</option>
                    <option>🇮🇹 Italia</option>
                    <option>🇬🇧 Reino Unido</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-amber-800 mb-2">Notificaciones</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-amber-800">Ataques enemigos</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-amber-800">Construcciones completadas</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-amber-800">Ofertas de comercio</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-amber-800">Subidas de nivel</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-4 flex-wrap">
              <button type="button" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center">
                Guardar Cambios <TurnoBadge costo={COSTOS_TURNOS.politica} />
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;