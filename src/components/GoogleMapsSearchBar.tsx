import React, { useState } from 'react';
import { City, Road, GameEconomy, RegionInfo } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Search, 
  X, 
  MapPin, 
  Navigation, 
  Hammer, 
  Flame, 
  Layers, 
  CloudRain, 
  Sparkles, 
  DollarSign, 
  Compass, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface GoogleMapsSearchBarProps {
  cities: City[];
  roads: Road[];
  economy: GameEconomy;
  currentRegion: RegionInfo;
  dirtRoadsCount: number;
  weatherRainActive: boolean;
  activeTab: 'explore' | 'routes' | 'pave' | 'boss' | 'regions';
  onSelectCity: (city: City) => void;
  onSelectRoad: (road: Road) => void;
  onOpenRoutes: () => void;
  onOpenPaveSheet: () => void;
  onOpenBoss: () => void;
  onOpenRegions: () => void;
  onToggleWeather: () => void;
  onOpenLayersModal?: () => void;
}

export const GoogleMapsSearchBar: React.FC<GoogleMapsSearchBarProps> = ({
  cities,
  roads,
  economy,
  currentRegion,
  dirtRoadsCount,
  weatherRainActive,
  activeTab,
  onSelectCity,
  onSelectRoad,
  onOpenRoutes,
  onOpenPaveSheet,
  onOpenBoss,
  onOpenRegions,
  onToggleWeather
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);

  const totalIncomePerSec = 
    economy.taxRevenuePerSec + 
    economy.tollRevenuePerSec + 
    economy.tradeRevenuePerSec + 
    economy.industryRevenuePerSec;

  // Filter cities and roads based on search
  const filteredCities = searchQuery.trim() === '' 
    ? [] 
    : cities.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const filteredRoads = searchQuery.trim() === '' 
    ? [] 
    : roads.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-[420px] z-[480] flex flex-col gap-2 pointer-events-auto">
      {/* Floating Google Maps Search Bar */}
      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center px-3.5 py-2.5 transition-all">
        
        {/* Google / Maps Icon */}
        <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
          🗺️
        </div>

        {/* Input Field */}
        <input
          id="google-maps-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Pesquisar cidades, rodovias, BR-156..."
          className="flex-1 bg-transparent px-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
        />

        {/* Clear Button or Wallet Pill */}
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowWalletDetails(!showWalletDetails)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold shadow-sm transition hover:scale-105"
            title="Clique para ver detalhes do orçamento"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>R$ {Math.round(economy.money).toLocaleString('pt-BR')}</span>
          </button>
        )}
      </div>

      {/* Wallet Details Popup if clicked */}
      {showWalletDetails && (
        <div className="p-3 bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-100">Balanço de Infraestrutura</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              +R$ {totalIncomePerSec.toFixed(1)}/s
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div>🏙️ Impostos Cidades: <b>R$ {(economy.taxRevenuePerSec * 3600).toFixed(0)}/h</b></div>
            <div>💳 Arrecadação Pedágios: <b>R$ {(economy.tollRevenuePerSec * 3600).toFixed(0)}/h</b></div>
            <div>🛣️ Asfalto Pavimentado: <b>{economy.roadsPavedKm} km</b></div>
            <div>🚛 Viagens Concluídas: <b>{economy.tripsCompleted}</b></div>
          </div>
        </div>
      )}

      {/* Search Autocomplete Results */}
      {isFocused && (filteredCities.length > 0 || filteredRoads.length > 0) && (
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto p-2 space-y-1 animate-in fade-in duration-150">
          {filteredCities.map(city => (
            <button
              key={city.id}
              onClick={() => {
                onSelectCity(city);
                setSearchQuery('');
                setIsFocused(false);
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">📍</span>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">{city.name} - {city.state}</div>
                  <div className="text-[10px] text-slate-500">{city.landmark} &bull; Domínio: {Math.round(city.influence)}%</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}

          {filteredRoads.map(road => (
            <button
              key={road.id}
              onClick={() => {
                onSelectRoad(road);
                setSearchQuery('');
                setIsFocused(false);
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">🛣️</span>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">{road.name}</div>
                  <div className="text-[10px] text-slate-500">{road.realKm} km &bull; {road.type === 'terra' ? '🪵 Terra' : '🛣️ Pavimentada'}</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      )}

      {/* Google Maps Horizontal Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs font-semibold">
        
        {/* Chip 1: Asfaltar Pistas (Alert badge if dirt roads exist) */}
        <button
          id="chip-pave-roads"
          onClick={onOpenPaveSheet}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md backdrop-blur-md whitespace-nowrap transition border ${
            activeTab === 'pave' || dirtRoadsCount > 0
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 font-bold'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }`}
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>Asfaltar Pistas</span>
          {dirtRoadsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono font-bold">
              {dirtRoadsCount}
            </span>
          )}
        </button>

        {/* Chip 2: Rotas / Como Chegar */}
        <button
          id="chip-routes-planner"
          onClick={onOpenRoutes}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md backdrop-blur-md whitespace-nowrap transition border ${
            activeTab === 'routes'
              ? 'bg-blue-600 text-white border-blue-400 font-bold'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>Rotas (A ➔ B)</span>
        </button>

        {/* Chip 3: Chefão Transamazônica */}
        <button
          id="chip-boss-transamazonica"
          onClick={onOpenBoss}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md backdrop-blur-md whitespace-nowrap transition border ${
            activeTab === 'boss'
              ? 'bg-red-600 text-white border-red-400 font-bold'
              : 'bg-white/90 dark:bg-slate-900/90 text-red-600 dark:text-red-400 border-slate-200 dark:border-slate-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>Chefão BR-230</span>
        </button>

        {/* Chip 4: Fases Regionais */}
        <button
          id="chip-regions"
          onClick={onOpenRegions}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md backdrop-blur-md whitespace-nowrap transition"
        >
          <span>{currentRegion.icon}</span>
          <span>Fase {currentRegion.phase}: {currentRegion.name}</span>
        </button>

        {/* Chip 5: Clima Tropical */}
        <button
          id="chip-weather-toggle"
          onClick={onToggleWeather}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full shadow-md backdrop-blur-md whitespace-nowrap transition border ${
            weatherRainActive
              ? 'bg-cyan-600 text-white border-cyan-400'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>{weatherRainActive ? 'Chuva Ativa' : 'Clima'}</span>
        </button>
      </div>
    </div>
  );
};
