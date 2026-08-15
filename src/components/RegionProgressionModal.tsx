import React from 'react';
import { RegionInfo, City } from '../types/game';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  X, 
  MapPin, 
  ArrowRight,
  Trophy
} from 'lucide-react';

interface RegionProgressionModalProps {
  regions: RegionInfo[];
  cities: City[];
  currentRegion: RegionInfo;
  onUnlockRegion: (regionId: string) => void;
  onClose: () => void;
}

export const RegionProgressionModal: React.FC<RegionProgressionModalProps> = ({
  regions,
  cities,
  currentRegion,
  onUnlockRegion,
  onClose
}) => {
  const getCitiesConqueredInRegion = (regionId: string) => {
    return cities.filter(c => c.region === regionId && (c.influence >= 70 || c.dominated)).length;
  };

  const handleUnlock = (region: RegionInfo) => {
    playSound.dominate();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 }
    });
    onUnlockRegion(region.id);
  };

  return (
    <div className="fixed inset-0 z-[550] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner">
              🇧🇷
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Progressão Regional & Regra das 5 Cidades</h2>
              <p className="text-xs text-slate-400">Conecte e desenvolva cidades para expandir a malha rodoviária por todo o território nacional.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule Banner */}
        <div className="px-6 py-3 bg-cyan-950/40 border-b border-cyan-800/50 flex items-center gap-3 text-xs text-cyan-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <b>REGRA DAS 5 CIDADES:</b> Para desbloquear uma nova região geográfica do Brasil, desenvolva pelo menos <b>5 cidades com influência ≥ 70%</b> na região atual.
          </span>
        </div>

        {/* Regions Progression List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {regions.map((region, index) => {
            const conqueredCount = getCitiesConqueredInRegion(region.id);
            const prevRegion = index > 0 ? regions[index - 1] : null;
            const prevRegionConquered = prevRegion ? getCitiesConqueredInRegion(prevRegion.id) : 5;
            const canUnlock = !region.unlocked && prevRegionConquered >= 5;

            return (
              <div
                key={region.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  region.unlocked
                    ? 'bg-slate-900/80 border-slate-700/80'
                    : canUnlock
                    ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                    region.unlocked ? 'bg-cyan-950 border-cyan-700' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {region.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                        Fase {region.phase}
                      </span>
                      <h3 className="text-base font-bold font-display text-white">{region.name}</h3>
                      {region.unlocked && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Liberada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{region.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  {/* Progress counter */}
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-300">
                      Cidades desenvolvidas: <b className="text-cyan-400">{conqueredCount}/5</b>
                    </div>
                    <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                        style={{ width: `${Math.min(100, (conqueredCount / 5) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Unlock button or status */}
                  {region.unlocked ? (
                    <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Ativa
                    </div>
                  ) : canUnlock ? (
                    <button
                      onClick={() => handleUnlock(region)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 font-bold text-xs text-white transition shadow-lg flex items-center gap-1.5 animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Desbloquear Região</span>
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Bloqueada
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
