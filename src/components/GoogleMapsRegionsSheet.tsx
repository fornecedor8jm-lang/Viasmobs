import React from 'react';
import { RegionInfo, City } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Globe2, 
  X, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  DollarSign 
} from 'lucide-react';

interface GoogleMapsRegionsSheetProps {
  regions: RegionInfo[];
  cities: City[];
  currentRegion: RegionInfo;
  onUnlockRegion: (regionId: string) => void;
  onClose: () => void;
}

export const GoogleMapsRegionsSheet: React.FC<GoogleMapsRegionsSheetProps> = ({
  regions,
  cities,
  currentRegion,
  onUnlockRegion,
  onClose
}) => {
  return (
    <div className="absolute bottom-16 sm:bottom-4 left-3 right-3 sm:left-4 sm:w-[440px] max-h-[85vh] z-[520] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-base shadow">
            🇧🇷
          </div>
          <div>
            <h2 className="text-base font-black font-display text-white">
              Expansão Territorial (5 Fases)
            </h2>
            <p className="text-[11px] font-semibold text-purple-100">
              Conecte o Brasil de Norte a Sul
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Regions List */}
      <div className="p-4 overflow-y-auto space-y-3 text-xs">
        {regions.map((region) => {
          const regionCities = cities.filter(c => c.region === region.id);
          const isNextRegion = region.phase === currentRegion.phase + 1;
          const progressionCities = isNextRegion ? cities.filter(c => c.region === currentRegion.id) : regionCities;
          const conqueredCities = progressionCities.filter(c => c.influence >= 70 || c.dominated).length;
          const requiredCities = isNextRegion ? currentRegion.citiesRequiredToUnlockNext : region.citiesRequiredToUnlockNext;
          const canUnlock = !region.unlocked && isNextRegion && conqueredCities >= requiredCities;

          return (
            <div
              key={region.id}
              className={`p-3.5 rounded-2xl border transition ${
                region.unlocked
                  ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/60'
                  : 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{region.icon}</span>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Fase {region.phase}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {region.name}
                    </h4>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  region.unlocked 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {region.unlocked ? '🔓 Desbloqueada' : '🔒 Bloqueada'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2">
                {region.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
                <span className="text-slate-500">
                  {isNextRegion ? `Progresso em ${currentRegion.name}: ` : 'Cidades Conquistadas: '}<b>{conqueredCities}/{requiredCities}</b>
                </span>

                {!region.unlocked && (
                  <button
                    onClick={() => {
                      if (canUnlock) {
                        playSound.dominate();
                        onUnlockRegion(region.id);
                      }
                    }}
                    disabled={!canUnlock}
                    className={`px-3 py-1 rounded-xl font-bold text-xs shadow transition flex items-center gap-1 ${
                      canUnlock
                        ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer animate-pulse'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Desbloquear Fase</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
