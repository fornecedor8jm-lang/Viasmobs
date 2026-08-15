import React, { useState } from 'react';
import { BossSector } from '../types/game';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Skull, 
  Flame, 
  ShieldAlert, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  X,
  Hammer
} from 'lucide-react';

interface BossBarProps {
  bossSectors: BossSector[];
  playerMoney: number;
  onResolveChallenge: (sectorId: string, challengeId: string, cost: number) => void;
  onCloseModal?: () => void;
}

export const BossBar: React.FC<BossBarProps> = ({
  bossSectors,
  playerMoney,
  onResolveChallenge,
  onCloseModal
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedSector, setSelectedSector] = useState<BossSector>(bossSectors[0]);

  // Calculate overall Boss HP
  const totalChallenges = bossSectors.reduce((acc, s) => acc + s.challenges.length, 0);
  const resolvedChallenges = bossSectors.reduce(
    (acc, s) => acc + s.challenges.filter(c => c.resolved).length,
    0
  );
  
  const bossHpPercent = Math.max(0, Math.round(100 - (resolvedChallenges / totalChallenges) * 100));
  const isBossDefeated = bossHpPercent === 0;

  const handleResolve = (sectorId: string, challengeId: string, cost: number) => {
    if (playerMoney < cost) return;
    playSound.bossHit();

    // Check if this hit defeats the boss
    if (resolvedChallenges + 1 >= totalChallenges) {
      playSound.dominate();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 }
      });
    }

    onResolveChallenge(sectorId, challengeId, cost);
  };

  return (
    <>
      {/* Persistent Top Boss Bar */}
      <div className="w-full bg-gradient-to-r from-red-950 via-slate-950 to-amber-950 border-b border-red-800/80 shadow-2xl px-4 py-2 text-slate-100 flex items-center justify-between gap-4 z-[450] relative">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-red-900/60 border border-red-500/60 flex items-center justify-center text-lg shadow-inner">
            {isBossDefeated ? '🏆' : '👑'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm font-display text-red-200 tracking-wide flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                CHEFÃO DA INFRAESTRUTURA: TRANSAMAZÔNICA (BR-230)
              </span>
              {isBossDefeated && (
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 animate-bounce">
                  ✨ 100% DOMADA!
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {isBossDefeated 
                ? 'Parabéns! A maior rodovia de selva do planeta foi totalmente pavimentada e integrada!' 
                : 'Elimine atoleiros, construa pontes e asfalte os 6 setores para domar o lendário chefão.'}
            </p>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-red-400 font-bold flex items-center gap-1">
              <span>❤️ HP CHEFÃO:</span>
              <span className="text-white">{bossHpPercent}%</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              {resolvedChallenges}/{totalChallenges} Desafios Vencidos
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full border border-red-950 overflow-hidden shadow-inner p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBossDefeated
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-emerald-500/50'
                  : 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 shadow-red-500/50'
              }`}
              style={{ width: `${Math.max(4, bossHpPercent)}%` }}
            />
          </div>
        </div>

        {/* Action button */}
        <button
          id="btn-open-boss-sectors"
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/80 border border-red-500/60 text-xs font-bold text-red-200 transition shrink-0 flex items-center gap-1.5 shadow"
        >
          <span>⚔️ Enfrentar Setores</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Modal */}
      {expanded && (
        <div className="fixed inset-0 z-[550] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-red-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-500/60 flex items-center justify-center text-2xl shadow-inner">
                  🛣️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-display text-white">Desafio Especial: Rodovia Transamazônica</h2>
                    <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 text-xs font-mono font-bold">
                      BR-230 &bull; 4.000+ KM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    A Transamazônica é o chefão de engenharia do Brasil. Supere chuvas, atoleiros e rios amazônicos.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExpanded(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Boss Progress Banner */}
            <div className="px-6 py-3 bg-red-950/40 border-b border-red-900/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold text-red-300 flex items-center gap-1.5 font-mono">
                  <span>❤️ BARRA DO CHEFÃO:</span>
                  <span className="text-white text-base">{bossHpPercent}%</span>
                </div>
                <div className="w-48 h-2.5 bg-slate-950 rounded-full border border-red-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
                    style={{ width: `${bossHpPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-300 font-mono">
                {isBossDefeated ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Trophy className="w-4 h-4" /> 🏆 TRANSAMAZÔNICA 100% CONCLUÍDA!
                  </span>
                ) : (
                  <span>Meta: Reduzir para 0% através de obras públicas</span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Sectors Navigation (Left) */}
              <div className="md:col-span-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Setores da Transamazônica
                </h3>

                {bossSectors.map((sector, index) => {
                  const isSelected = selectedSector?.id === sector.id;
                  const secResolved = sector.challenges.filter(c => c.resolved).length;
                  const secComplete = secResolved === sector.challenges.length;

                  return (
                    <button
                      key={sector.id}
                      onClick={() => setSelectedSector(sector)}
                      className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-red-950/50 border-red-500/80 shadow-md ring-1 ring-red-500'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white line-clamp-1">
                          {sector.name}
                        </span>
                        {secComplete ? (
                          <span className="text-emerald-400 font-bold text-xs">✅ 100%</span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-400">
                            {secResolved}/{sector.challenges.length}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {sector.km} km &bull; {sector.fromName} ➔ {sector.toName}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Sector Details & Challenges (Right) */}
              {selectedSector && (
                <div className="md:col-span-8 space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/60">
                  <div className="border-b border-slate-700 pb-3">
                    <h4 className="text-base font-bold text-white font-display">
                      {selectedSector.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Extensão: <b className="text-white">{selectedSector.km} km</b> &bull; Trecho crítico entre {selectedSector.fromName} e {selectedSector.toName}.
                    </p>
                  </div>

                  {/* Challenges List */}
                  <div className="space-y-3 pt-1">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔨</span> Obras & Desafios para Libertação do Trecho
                    </h5>

                    {selectedSector.challenges.map((ch) => {
                      const canAfford = playerMoney >= ch.cost;

                      return (
                        <div
                          key={ch.id}
                          className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            ch.resolved
                              ? 'bg-emerald-950/30 border-emerald-500/40'
                              : 'bg-slate-900/80 border-slate-700/70'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{ch.icon}</span>
                            <div className="space-y-1">
                              <div className="font-bold text-xs text-white flex items-center gap-2">
                                <span>{ch.name}</span>
                                {ch.resolved && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 text-[10px]">
                                    Concluído
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400">{ch.description}</p>
                              <div className="text-[10px] text-emerald-400 font-semibold font-mono">
                                💡 Benefício: {ch.benefit}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {ch.resolved ? (
                              <span className="px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Desafio Superado
                              </span>
                            ) : (
                              <button
                                onClick={() => handleResolve(selectedSector.id, ch.id, ch.cost)}
                                disabled={!canAfford}
                                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow flex items-center gap-1.5 ${
                                  canAfford
                                    ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                                }`}
                              >
                                <Hammer className="w-3.5 h-3.5" />
                                <span>R$ {ch.cost.toLocaleString('pt-BR')}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
