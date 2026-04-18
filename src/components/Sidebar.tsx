import React, { useState } from 'react';
import {
  Crown, Sword, Building, Users, Shield, Trophy, ShoppingCart,
  User, Map, Users2, Eye, Scale, Lock, Footprints, Scroll, Truck,
  Bot, Gem, ChevronDown, ChevronRight, LogOut,
} from 'lucide-react';

export type PaginaId =
  | 'dashboard' | 'ejercito' | 'alianzas' | 'conquistas'
  | 'heroes' | 'tropas' | 'atacar' | 'monturas' | 'espionaje'
  | 'politica' | 'comercio' | 'carromato' | 'prision'
  | 'clanes' | 'cities' | 'fundar-ciudad'
  | 'mapa' | 'rankings' | 'combat' | 'quests'
  | 'imperios-agente' | 'profile' | 'rubies';

interface SidebarProps {
  paginaActual: PaginaId;
  onCambiarPagina: (pagina: PaginaId) => void;
  nombreImperio: string;
  ciudades: { id: string; nombre: string }[];
  heroes: { id: string; nombre: string; nivel: number }[];
}

interface ItemNav {
  id: PaginaId;
  label: string;
  icon: React.ElementType;
  insignia?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  paginaActual, onCambiarPagina, nombreImperio, ciudades, heroes,
}) => {
  const [ciudadesExpandido, setCiudadesExpandido] = useState(true);
  const [heroesExpandido, setHeroesExpandido] = useState(true);

  const btnClase = (id: PaginaId) =>
    `w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all ${
      paginaActual === id
        ? 'bg-yellow-600 text-white font-semibold shadow'
        : 'text-amber-300 hover:bg-amber-700 hover:text-white'
    }`;

  const seccion = (titulo: string) => (
    <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1">
      {titulo}
    </div>
  );

  const item = (nav: ItemNav) => {
    const Icon = nav.icon;
    return (
      <button key={nav.id} type="button" className={btnClase(nav.id)} onClick={() => onCambiarPagina(nav.id)}>
        <Icon size={15} />
        <span className="flex-1 text-left">{nav.label}</span>
        {nav.insignia && (
          <span className="bg-amber-900 text-amber-400 text-[10px] px-1.5 rounded">{nav.insignia}</span>
        )}
      </button>
    );
  };

  return (
    <div className="w-56 bg-gradient-to-b from-amber-900 to-stone-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-4 border-b border-amber-700">
        <h2 className="text-base font-bold text-yellow-200 text-center">EMPIRE STRIKE</h2>
        <p className="text-amber-400 text-center text-xs mt-0.5 truncate">{nombreImperio}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4 text-sm">
        {seccion('Info')}
        {item({ id: 'dashboard', label: 'Mi Imperio', icon: Crown })}
        {item({ id: 'ejercito', label: 'Mi Ejercito', icon: Shield })}
        {item({ id: 'alianzas', label: 'Ultimas Alianzas', icon: Users2 })}
        {item({ id: 'conquistas', label: 'Conquistas', icon: Trophy })}
        {item({ id: 'mapa', label: 'Mapa Mundial', icon: Map })}

        {seccion('Acciones')}
        {item({ id: 'heroes', label: 'Mover Heroes', icon: Sword, insignia: '2T' })}
        {item({ id: 'tropas', label: 'Mover Tropas', icon: Users, insignia: '1T' })}
        {item({ id: 'atacar', label: 'Atacar', icon: Sword, insignia: '8T' })}
        {item({ id: 'monturas', label: 'Monturas', icon: Footprints, insignia: '5T' })}
        {item({ id: 'espionaje', label: 'Espionaje', icon: Eye, insignia: '4T' })}
        {item({ id: 'politica', label: 'Politica', icon: Scale, insignia: '2T' })}
        {item({ id: 'comercio', label: 'Comercio', icon: ShoppingCart, insignia: '1T' })}
        {item({ id: 'carromato', label: 'Carromato', icon: Truck, insignia: '1T' })}
        {item({ id: 'prision', label: 'Prision', icon: Lock })}

        {seccion('Clanes')}
        {item({ id: 'clanes', label: 'Mi Clan', icon: Users2 })}

        {seccion('Ciudades')}
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 text-amber-400 hover:text-yellow-200 text-xs uppercase font-bold tracking-wide"
          onClick={() => setCiudadesExpandido(!ciudadesExpandido)}
        >
          {ciudadesExpandido ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Mis ciudades
        </button>
        {ciudadesExpandido && ciudades.map((ciudad) => (
          <button
            key={ciudad.id}
            type="button"
            className={btnClase('cities')}
            onClick={() => onCambiarPagina('cities')}
          >
            <Building size={13} />
            <span className="flex-1 text-left text-xs truncate">{ciudad.nombre}</span>
          </button>
        ))}
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 text-amber-400 hover:text-yellow-200 text-xs"
          onClick={() => onCambiarPagina('fundar-ciudad')}
        >
          <span className="text-lg leading-none">+</span>
          <span>Fundar ciudad</span>
          <span className="ml-auto bg-amber-900 text-amber-400 text-[10px] px-1.5 rounded">20T</span>
        </button>

        {seccion('Heroes')}
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 text-amber-400 hover:text-yellow-200 text-xs uppercase font-bold tracking-wide"
          onClick={() => setHeroesExpandido(!heroesExpandido)}
        >
          {heroesExpandido ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Mis heroes
        </button>
        {heroesExpandido && heroes.map((heroe) => (
          <button
            key={heroe.id}
            type="button"
            className={btnClase('heroes')}
            onClick={() => onCambiarPagina('heroes')}
          >
            <Sword size={13} />
            <span className="flex-1 text-left text-xs truncate">{heroe.nombre}</span>
            <span className="text-amber-500 text-[10px]">N{heroe.nivel}</span>
          </button>
        ))}

        {seccion('Extra')}
        {item({ id: 'quests', label: 'Quests', icon: Scroll, insignia: '5T' })}
        {item({ id: 'combat', label: 'Combate', icon: Shield })}
        {item({ id: 'rankings', label: 'Rankings', icon: Trophy })}
        {item({ id: 'imperios-agente', label: 'Imperios Agente', icon: Bot })}
        {item({ id: 'profile', label: 'Perfil', icon: User })}
        {item({ id: 'rubies', label: 'Rubies', icon: Gem })}
      </nav>

      <div className="border-t border-amber-700 p-3">
        <button type="button" className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-amber-400 hover:bg-red-900 hover:text-white text-sm transition-all">
          <LogOut size={15} />
          Salir
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
