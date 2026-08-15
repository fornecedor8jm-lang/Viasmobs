import React, { useState } from 'react';
import { GameEconomy, RegionInfo, TileLayerType, ActiveTrip } from '../types/game';
import { isSoundEnabled, toggleSound, playSound } from '../utils/audio';
import { 
  DollarSign, 
  TrendingUp, 
  Map, 
  Layers, 
  Play, 
  Pause, 
  FastForward, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Navigation, 
  Award, 
  Compass, 
  Globe, 
  HelpCircle,
  Truck
} from 'lucide-react';

interface EconomyBarProps {
  economy: GameEconomy;
  currentRegion: RegionInfo;
  allRegions: RegionInfo[];
  conqueredCitiesInCurrentRegion: number;
  tileLayer: TileLayerType;
  gameSpeed: number;
  weatherRainActive: boolean;
  activeTrip: ActiveTrip | null;
  onSetTileLayer: (layer: TileLayerType) => void;
  onSetGameSpeed: (speed: number) => void;
  onToggleWeather: () => void;
  onOpenTripPlanner: () => void;
  onOpenRegionsModal: () => void;
  onOpenHelpModal: () => void;
}

export const EconomyBar: React.FC<EconomyBarProps> = ({
  economy,
  currentRegion,
  allRegions,
  conqueredCitiesInCurrentRegion,
  tileLayer,
  gameSpeed,
  weatherRainActive,
  activeTrip,
  onSetTileLayer,
  onSetGameSpeed,
  onToggleWeather,
  onOpenTripPlanner,
  onOpenRegionsModal,
  onOpenHelpModal
}) => {
  const [sound, setSound] = useState(isSoundEnabled());
  const [layerDropdown, setLayerDropdown] = useState(false);

  const totalIncomePerSec = 
    economy.taxRevenuePerSec + 
    economy.tollRevenuePerSec + 
    economy.tradeRevenuePerSec + 
    economy.industryRevenuePerSec;

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSound(newState);
    if (newState) playSound.click();
  };

  return (
    <header className="w-full bg-slate-950/95 border-b border-slate-800 shadow-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-100 backdrop-blur-md z-[480] relative">
      
      {/* Brand & Region Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center text-lg shadow-lg font-bold text-white border border-emerald-400/40">
            🇧🇷
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold font-display tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
              BRASIL VIAS
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span>Fase {currentRegion.phase}: {currentRegion.icon} {currentRegion.name}</span>
            </div>
          </div>
        </div>

        {/* 5-Cities Regional Progression Tracker */}
        <button
          onClick={onOpenRegionsModal}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 transition cursor-pointer text-xs group"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Cidades na Região:</span>
            <span className="font-bold font-mono text-cyan-300">
              {conqueredCitiesInCurrentRegion}/5
            </span>
          </div>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (conqueredCitiesInCurrentRegion / 5) * 100)}%` }}
            />
          </div>
        </button>
      </div>

      {/* Center: Real-Time Economy Hub */}
      <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-1.5 rounded-2xl border border-slate-800 shadow-inner">
        {/* Cash Balance */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">Orçamento</div>
            <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 tracking-tight leading-tight">
              R$ {Math.round(economy.money).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* Revenue Flow per Second */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">Arrecadação / seg</div>
            <div className="text-xs font-bold font-mono text-cyan-300 leading-tight">
              +R$ {totalIncomePerSec.toFixed(1)}/s
            </div>
          </div>
        </div>

        {/* Active Trip Mini Indicator */}
        {activeTrip && (
          <>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-xs font-mono animate-pulse">
              <Truck className="w-3.5 h-3.5" />
              <span>Viagem Ativa ({Math.round(activeTrip.elapsedSeconds)}s / {activeTrip.estimatedTimeSeconds}s)</span>
            </div>
          </>
        )}
      </div>

      {/* Right Controls: Trip Planner, Layer Switcher, Speed & Audio */}
      <div className="flex items-center gap-2">
        {/* Trip Planner CTA */}
        <button
          id="btn-open-trip-planner-hud"
          onClick={onOpenTripPlanner}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Planejar Rota (A ➔ B)</span>
        </button>

        {/* Tile Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setLayerDropdown(!layerDropdown)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
            title="Mudar Camada do Mapa (Satélite, Terreno, Ruas, Dark)"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="capitalize hidden lg:inline">{tileLayer}</span>
          </button>

          {layerDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-[550] space-y-1">
              <button
                onClick={() => { onSetTileLayer('osm'); setLayerDropdown(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${tileLayer === 'osm' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🗺️</span> Ruas Padrão (OSM)
              </button>
              <button
                onClick={() => { onSetTileLayer('satellite'); setLayerDropdown(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${tileLayer === 'satellite' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🛰️</span> Satélite (Esri World)
              </button>
              <button
                onClick={() => { onSetTileLayer('terrain'); setLayerDropdown(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${tileLayer === 'terrain' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🏔️</span> Terreno / Topografia
              </button>
              <button
                onClick={() => { onSetTileLayer('dark'); setLayerDropdown(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${tileLayer === 'dark' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🌃</span> Carto Dark (Tático)
              </button>
            </div>
          )}
        </div>

        {/* Rain Weather Toggle */}
        <button
          onClick={onToggleWeather}
          className={`p-2 rounded-xl border text-xs transition ${
            weatherRainActive
              ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
          title="Alternar Clima Tropical / Chuvas na Amazônia"
        >
          <CloudRain className="w-4 h-4" />
        </button>

        {/* Simulation Speed Control (1x, 2x, 5x, Pause) */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => onSetGameSpeed(0)}
            className={`p-1.5 rounded-lg text-xs transition ${gameSpeed === 0 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Pausar Simulação"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetGameSpeed(1)}
            className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${gameSpeed === 1 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Velocidade 1x"
          >
            1x
          </button>
          <button
            onClick={() => onSetGameSpeed(2)}
            className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${gameSpeed === 2 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Velocidade 2x"
          >
            2x
          </button>
          <button
            onClick={() => onSetGameSpeed(5)}
            className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${gameSpeed === 5 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Velocidade Acelerada 5x"
          >
            5x
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition"
          title="Ligar/Desligar Efeitos Sonoros"
        >
          {sound ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Help / Guide */}
        <button
          onClick={onOpenHelpModal}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition"
          title="Manual do Jogo e Regras"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
