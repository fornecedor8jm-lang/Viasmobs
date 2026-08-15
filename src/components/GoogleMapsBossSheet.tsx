import React from 'react';
import { BossSector } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Flame, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Award, 
  Zap, 
  TrendingUp 
} from 'lucide-react';

interface GoogleMapsBossSheetProps {
  bossSectors: BossSector[];
  playerMoney: number;
  onResolveChallenge: (sectorId: string, challengeId: string, cost: number) => void;
  onClose: () => void;
}

export const GoogleMapsBossSheet: React.FC<GoogleMapsBossSheetProps> = ({
  bossSectors,
  playerMoney,
  onResolveChallenge,
  onClose
}) => {
  const totalHp = bossSectors.reduce((acc, s) => acc + s.hpPercent, 0) / bossSectors.length;
  const conqueredCount = bossSectors.filter(s => s.completed).length;

  return (
    <div className="absolute bottom-16 sm:bottom-4 left-3 right-3 sm:left-4 sm:w-[440px] max-h-[85vh] z-[520] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-base shadow">
            🔥
          </div>
          <div>
            <h2 className="text-base font-black font-display text-white flex items-center gap-1.5">
              <span>Chefão: BR-230 Transamazônica</span>
            </h2>
            <p className="text-[11px] font-semibold text-rose-100">
              Desafio Supremo: Pavimente 4.000 km de selva amazônica
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

      {/* Overall Boss Health Bar */}
      <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Resistência do Barro da Amazônia:</span>
          </span>
          <span className="font-mono font-bold text-red-600 dark:text-red-400">
            {Math.round(totalHp)}% HP ({conqueredCount}/4 Setores Vencidos)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${totalHp}%` }}
          />
        </div>
      </div>

      {/* Sectors List */}
      <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
        {bossSectors.map((sector, idx) => (
          <div 
            key={sector.id}
            className={`p-3.5 rounded-2xl border transition ${
              sector.completed 
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60' 
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Setor {idx + 1} &bull; {sector.km} km</span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{sector.name}</h4>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                sector.completed 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
              }`}>
                {sector.completed ? '👑 CONQUISTADO' : `${sector.hpPercent}% HP`}
              </span>
            </div>

            {/* Challenges in sector */}
            <div className="space-y-1.5 mt-2">
              {sector.challenges.map(ch => (
                <div 
                  key={ch.id}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span>{ch.icon}</span>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{ch.name}</div>
                      <div className="text-[10px] text-slate-500">{ch.benefit}</div>
                    </div>
                  </div>

                  {ch.resolved ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolvido
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (playerMoney >= ch.cost) {
                          playSound.pave();
                          onResolveChallenge(sector.id, ch.id, ch.cost);
                        }
                      }}
                      disabled={playerMoney < ch.cost}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] shadow transition ${
                        playerMoney >= ch.cost 
                          ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      R$ {ch.cost.toLocaleString('pt-BR')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
