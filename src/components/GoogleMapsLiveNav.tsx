import React from 'react';
import { ActiveTrip, City, Road } from '../types/game';
import { formatMinutesToGoogleMaps } from '../utils/routeMetrics';
import { 
  Navigation, 
  ArrowUp, 
  ArrowUpRight, 
  X, 
  Volume2, 
  Compass, 
  Clock, 
  Sparkles,
  Gauge
} from 'lucide-react';

interface GoogleMapsLiveNavProps {
  activeTrip: ActiveTrip;
  originCity?: City;
  destinationCity?: City;
  onCancelTrip: () => void;
}

export const GoogleMapsLiveNav: React.FC<GoogleMapsLiveNavProps> = ({
  activeTrip,
  originCity,
  destinationCity,
  onCancelTrip
}) => {
  const percent = Math.min(100, Math.round(activeTrip.progress * 100));
  const remainingKm = Math.max(0, Math.round(activeTrip.totalKm * (1 - activeTrip.progress)));
  const remainingSecs = Math.max(0, Math.round((activeTrip.durationSeconds * (1 - activeTrip.progress))));
  const simulatedRealMins = Math.round(remainingKm / 1.1);

  return (
    <div className="pointer-events-none fixed inset-0 z-[600] flex flex-col justify-between p-3 sm:p-4">
      {/* Top Google Maps Navigation Banner (Iconic Green Banner) */}
      <div className="pointer-events-auto self-center w-full max-w-md bg-emerald-700 dark:bg-emerald-800 text-white rounded-3xl shadow-2xl p-4 flex items-center justify-between border-2 border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-300">
        
        <div className="flex items-center gap-3.5">
          {/* Big White Maneuver Arrow */}
          <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-400/50 flex items-center justify-center text-white shadow-inner shrink-0">
            {percent < 50 ? (
              <ArrowUp className="w-7 h-7 text-emerald-200 animate-pulse" />
            ) : (
              <ArrowUpRight className="w-7 h-7 text-emerald-200 animate-pulse" />
            )}
          </div>

          {/* Turn-by-Turn Instruction */}
          <div>
            <div className="text-xl font-black font-display tracking-tight flex items-baseline gap-1.5">
              <span>{remainingKm} km</span>
              <span className="text-xs font-normal text-emerald-200">
                (em {remainingSecs}s)
              </span>
            </div>
            <div className="text-xs font-semibold text-emerald-100 line-clamp-1">
              Rumo a {destinationCity?.name || 'Destino'} via Rodovia Principal
            </div>
          </div>
        </div>

        {/* Speed limit pill */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-white text-slate-900 border-2 border-red-600 flex items-center justify-center font-black text-xs font-mono shadow">
            80
          </div>
          <span className="text-[9px] text-emerald-200 font-bold mt-0.5">km/h</span>
        </div>
      </div>

      {/* Floating Speedometer badge on mid-left */}
      <div className="pointer-events-auto self-start mt-auto mb-20 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-700 text-white shadow-2xl flex items-center gap-2">
        <Gauge className="w-5 h-5 text-emerald-400" />
        <div>
          <div className="text-xs font-mono font-bold text-emerald-400 leading-none">
            {Math.round(75 + (activeTrip.progress * 15))} <span className="text-[10px] text-slate-400">km/h</span>
          </div>
          <div className="text-[9px] text-slate-400">Velocidade Atual</div>
        </div>
      </div>

      {/* Bottom Google Maps Navigation HUD */}
      <div className="pointer-events-auto self-center w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Progress Bar */}
        <div className="relative w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                {formatMinutesToGoogleMaps(simulatedRealMins)}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {remainingKm} km restantes
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <span>Recompensa Frete:</span>
              <b className="text-emerald-600 dark:text-emerald-400">+R$ {activeTrip.rewardMoney.toLocaleString('pt-BR')}</b>
            </div>
          </div>

          {/* Close / Cancel Trip Button */}
          <button
            onClick={onCancelTrip}
            className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-200 transition flex items-center justify-center shadow-sm"
            title="Encerrar Navegação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
