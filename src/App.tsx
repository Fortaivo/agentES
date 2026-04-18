import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Heroes from './pages/Heroes';
import Cities from './pages/Cities';
import Troops from './pages/Troops';
import Combat from './pages/Combat';
import Rankings from './pages/Rankings';
import Profile from './pages/Profile';
import Trade from './pages/Trade';
import FundarCiudad from './pages/FundarCiudad';
import Atacar from './pages/Atacar';
import MapaMundial from './pages/MapaMundial';
import Clanes from './pages/Clanes';
import Espionaje from './pages/Espionaje';
import Politica from './pages/Politica';
import Prision from './pages/Prision';
import Monturas from './pages/Monturas';
import Quests from './pages/Quests';
import Carromato from './pages/Carromato';
import ImperiosAgente from './pages/ImperiosAgente';
import Rubies from './pages/Rubies';
import Ejercito from './pages/Ejercito';
import Alianzas from './pages/Alianzas';
import Conquistas from './pages/Conquistas';
import Sidebar, { type PaginaId } from './components/Sidebar';
import ResourceBar from './components/ResourceBar';
import type { Recursos } from './types/game';

const RECURSOS_MOCK: Recursos = {
  oro: 4200,
  comida: 3900,
  madera: 1800,
  piedra: 642,
  hierro: 819,
  mana: 50,
  plata: 1200,
  herramientas: 300,
  armas: 150,
  bloques: 200,
  tablas: 180,
  cristal: 40,
  reliquias: 12,
  joyeria: 8,
  karma: 5,
  mithril: 3,
  gemas: 29,
  agua: 1019,
};

const PRODUCCION_DIARIA_MOCK: Partial<Recursos> = {
  oro: 500,
  comida: 200,
  madera: 100,
  piedra: 50,
  hierro: 30,
};

const CIUDADES_MOCK = [
  { id: 'c1', nombre: 'Rosvo' },
  { id: 'c2', nombre: 'Doghell' },
];

const HEROES_MOCK = [
  { id: 'h1', nombre: 'Doghell N1', nivel: 1 },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paginaActual, setPaginaActual] = useState<PaginaId>('dashboard');

  const renderPagina = () => {
    switch (paginaActual) {
      case 'dashboard': return <Dashboard />;
      case 'heroes': return <Heroes />;
      case 'cities': return <Cities />;
      case 'fundar-ciudad': return <FundarCiudad />;
      case 'tropas': return <Troops />;
      case 'atacar': return <Atacar />;
      case 'combat': return <Combat />;
      case 'rankings': return <Rankings />;
      case 'comercio': return <Trade />;
      case 'profile': return <Profile />;
      case 'mapa': return <MapaMundial />;
      case 'clanes': return <Clanes />;
      case 'espionaje': return <Espionaje />;
      case 'politica': return <Politica />;
      case 'prision': return <Prision />;
      case 'monturas': return <Monturas />;
      case 'quests': return <Quests />;
      case 'carromato': return <Carromato />;
      case 'imperios-agente': return <ImperiosAgente />;
      case 'rubies': return <Rubies />;
      case 'ejercito': return <Ejercito />;
      case 'alianzas': return <Alianzas />;
      case 'conquistas': return <Conquistas />;
      default: return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex">
      <Sidebar
        paginaActual={paginaActual}
        onCambiarPagina={setPaginaActual}
        nombreImperio="Tierras Doradas"
        ciudades={CIUDADES_MOCK}
        heroes={HEROES_MOCK}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ResourceBar
          recursos={RECURSOS_MOCK}
          produccionDiaria={PRODUCCION_DIARIA_MOCK}
          turnos={73}
          turnosGastadosHoy={27}
          diaTemporada={12}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderPagina()}
        </main>
      </div>
    </div>
  );
};

export default App;
