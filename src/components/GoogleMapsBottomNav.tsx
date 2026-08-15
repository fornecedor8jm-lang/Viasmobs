import React from 'react';
import { 
  Map, 
  Navigation, 
  Hammer, 
  Flame, 
  Globe2 
} from 'lucide-react';

interface GoogleMapsBottomNavProps {
  activeTab: 'explore' | 'routes' | 'pave' | 'boss' | 'regions';
  dirtRoadsCount: number;
  onTabChange: (tab: 'explore' | 'routes' | 'pave' | 'boss' | 'regions') => void;
}

export const GoogleMapsBottomNav: React.FC<GoogleMapsBottomNavProps> = ({
  activeTab,
  dirtRoadsCount,
  onTabChange
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around shadow-2xl safe-area-bottom">
      
      {/* 🗺️ Explorar */}
      <button
        id="nav-tab-explore"
        onClick={() => onTabChange('explore')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
          activeTab === 'explore'
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Map className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span>Explorar</span>
      </button>

      {/* 🧭 Rotas / Como Chegar */}
      <button
        id="nav-tab-routes"
        onClick={() => onTabChange('routes')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
          activeTab === 'routes'
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Navigation className={`w-5 h-5 ${activeTab === 'routes' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span>Rotas</span>
      </button>

      {/* 🛠️ Asfaltar (with badge) */}
      <button
        id="nav-tab-pave"
        onClick={() => onTabChange('pave')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition relative ${
          activeTab === 'pave'
            ? 'text-amber-500 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Hammer className={`w-5 h-5 ${activeTab === 'pave' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {dirtRoadsCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-amber-500 text-slate-950 font-mono font-black text-[9px] flex items-center justify-center">
              {dirtRoadsCount}
            </span>
          )}
        </div>
        <span>Asfaltar</span>
      </button>

      {/* 👑 Chefão Transamazônica */}
      <button
        id="nav-tab-boss"
        onClick={() => onTabChange('boss')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
          activeTab === 'boss'
            ? 'text-red-500 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Flame className={`w-5 h-5 ${activeTab === 'boss' ? 'stroke-[2.5] text-red-500' : 'stroke-2'}`} />
        <span>Chefão</span>
      </button>

      {/* 🇧🇷 Regiões */}
      <button
        id="nav-tab-regions"
        onClick={() => onTabChange('regions')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
          activeTab === 'regions'
            ? 'text-purple-600 dark:text-purple-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Globe2 className={`w-5 h-5 ${activeTab === 'regions' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span>Regiões</span>
      </button>
    </nav>
  );
};
