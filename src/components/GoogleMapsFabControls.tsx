import React, { useState } from 'react';
import { TileLayerType } from '../types/game';
import { 
  Compass, 
  Layers, 
  Crosshair, 
  Play, 
  Pause, 
  FastForward, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Map, 
  Maximize2 
} from 'lucide-react';

interface GoogleMapsFabControlsProps {
  tileLayer: TileLayerType;
  gameSpeed: number;
  soundMuted: boolean;
  onChangeTileLayer: (layer: TileLayerType) => void;
  onCycleGameSpeed: () => void;
  onToggleSound: () => void;
  onFocusRegion: (focusType: 'amapa' | 'transam' | 'brasil') => void;
  onOpenHelp: () => void;
}

export const GoogleMapsFabControls: React.FC<GoogleMapsFabControlsProps> = ({
  tileLayer,
  gameSpeed,
  soundMuted,
  onChangeTileLayer,
  onCycleGameSpeed,
  onToggleSound,
  onFocusRegion,
  onOpenHelp
}) => {
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  return (
    <div className="absolute right-3 top-20 sm:top-24 z-[480] flex flex-col items-center gap-2.5 pointer-events-auto">
      
      {/* 🧭 Compass (Orient to North) */}
      <button
        id="fab-compass-north"
        onClick={() => onFocusRegion('amapa')}
        className="w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 flex items-center justify-center transition active:scale-95"
        title="Orientar ao Norte / Centro Amapá"
      >
        <Compass className="w-5 h-5 text-rose-500" />
      </button>

      {/* 🗺️ Layers Toggle */}
      <div className="relative">
        <button
          id="fab-layers-toggle"
          onClick={() => setShowLayersMenu(!showLayersMenu)}
          className={`w-11 h-11 rounded-full shadow-xl border flex items-center justify-center transition active:scale-95 ${
            showLayersMenu
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
          }`}
          title="Tipos de Mapa & Camadas"
        >
          <Layers className="w-5 h-5" />
        </button>

        {showLayersMenu && (
          <div className="absolute right-14 top-0 w-44 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 text-xs animate-in fade-in duration-150">
            <div className="font-bold text-[10px] text-slate-400 px-2 py-1 uppercase">Camadas do Mapa</div>
            <button
              onClick={() => { onChangeTileLayer('osm'); setShowLayersMenu(false); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl font-semibold transition flex items-center gap-2 ${
                tileLayer === 'osm' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🗺️</span> Padrão (Vias)
            </button>
            <button
              onClick={() => { onChangeTileLayer('satellite'); setShowLayersMenu(false); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl font-semibold transition flex items-center gap-2 ${
                tileLayer === 'satellite' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🛰️</span> Satélite Real
            </button>
            <button
              onClick={() => { onChangeTileLayer('terrain'); setShowLayersMenu(false); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl font-semibold transition flex items-center gap-2 ${
                tileLayer === 'terrain' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⛰️</span> Relevo & Topografia
            </button>
            <button
              onClick={() => { onChangeTileLayer('dark'); setShowLayersMenu(false); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl font-semibold transition flex items-center gap-2 ${
                tileLayer === 'dark' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🌙</span> Modo Noturno
            </button>
          </div>
        )}
      </div>

      {/* 🎯 GPS Locate Center Button */}
      <button
        id="fab-gps-locate"
        onClick={() => onFocusRegion('amapa')}
        className="w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center transition active:scale-95"
        title="Minha Localização / Polo Amapá"
      >
        <Crosshair className="w-5 h-5" />
      </button>

      {/* ⚡ Game Speed Modifier */}
      <button
        id="fab-game-speed"
        onClick={onCycleGameSpeed}
        className="w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center font-mono font-bold text-xs transition active:scale-95"
        title={`Velocidade do Jogo: ${gameSpeed === 0 ? 'Pausado' : `${gameSpeed}x`}`}
      >
        {gameSpeed === 0 ? (
          <Pause className="w-4 h-4 text-amber-500 fill-amber-500" />
        ) : gameSpeed === 1 ? (
          <span>1x</span>
        ) : gameSpeed === 2 ? (
          <span className="text-emerald-500">2x</span>
        ) : (
          <span className="text-purple-500">5x</span>
        )}
      </button>

      {/* 🔊 Audio Toggle */}
      <button
        id="fab-sound-toggle"
        onClick={onToggleSound}
        className="w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition active:scale-95"
        title={soundMuted ? 'Desmutar Som' : 'Mutar Som'}
      >
        {soundMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
      </button>

      {/* ❓ Help Guide */}
      <button
        id="fab-help-guide"
        onClick={onOpenHelp}
        className="w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 flex items-center justify-center transition active:scale-95"
        title="Manual e Guia do Jogo"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
