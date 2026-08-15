import React from 'react';
import { Road, Shortcut, RoadType } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Hammer, 
  Car, 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  Wrench, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Navigation,
  Sparkles
} from 'lucide-react';

interface RoadUpgradeModalProps {
  road: Road;
  playerMoney: number;
  onClose: () => void;
  onPaveRoad: (roadId: string, targetType: RoadType, cost: number) => void;
  onRepairRoad: (roadId: string, cost: number) => void;
  onBuildToll: (roadId: string, cost: number, fee: number) => void;
  onBuildShortcut: (roadId: string, shortcutId: string, cost: number) => void;
  onInstallBridges: (roadId: string, cost: number) => void;
}

export const RoadUpgradeModal: React.FC<RoadUpgradeModalProps> = ({
  road,
  playerMoney,
  onClose,
  onPaveRoad,
  onRepairRoad,
  onBuildToll,
  onBuildShortcut,
  onInstallBridges
}) => {
  const getNextPaveUpgrade = () => {
    if (road.type === 'terra') {
      return {
        targetType: 'asfalto_simples' as RoadType,
        name: 'Asfaltar Estrada (CBUQ Usinado)',
        cost: Math.round(road.realKm * 250),
        speedBonus: '+35 km/h',
        description: 'Elimina atoleiros e poeira, transformando em pista asfáltica padrão federal.'
      };
    }
    if (road.type === 'asfalto_simples') {
      return {
        targetType: 'duplicada' as RoadType,
        name: 'Duplicar Pista (2 Faixas por Sentido)',
        cost: Math.round(road.realKm * 480),
        speedBonus: '+20 km/h',
        description: 'Canteiro central, acostamento pavimentado e redução drástica de congestionamentos.'
      };
    }
    if (road.type === 'duplicada') {
      return {
        targetType: 'via_expressa' as RoadType,
        name: 'Transformar em Via Expressa Inteligente',
        cost: Math.round(road.realKm * 750),
        speedBonus: '+20 km/h (Até 120 km/h)',
        description: 'Viadutos em todos os cruzamentos, monitoramento por câmeras e iluminação solar.'
      };
    }
    return null;
  };

  const nextPave = getNextPaveUpgrade();
  const repairCost = Math.round((100 - road.condition) * road.realKm * 1.5);
  const tollCost = 35000;
  const bridgeUpgradeCost = 45000;

  const handlePave = () => {
    if (!nextPave || playerMoney < nextPave.cost) return;
    playSound.pave();
    onPaveRoad(road.id, nextPave.targetType, nextPave.cost);
  };

  const handleRepair = () => {
    if (playerMoney < repairCost || road.condition >= 98) return;
    playSound.pave();
    onRepairRoad(road.id, repairCost);
  };

  const handleToll = () => {
    if (road.hasToll || playerMoney < tollCost) return;
    playSound.coin();
    onBuildToll(road.id, tollCost, 12.50);
  };

  const handleBridges = () => {
    if (playerMoney < bridgeUpgradeCost) return;
    playSound.pave();
    onInstallBridges(road.id, bridgeUpgradeCost);
  };

  const handleShortcut = (sc: Shortcut) => {
    if (sc.built || playerMoney < sc.cost) return;
    playSound.pave();
    playSound.dominate();
    onBuildShortcut(road.id, sc.id, sc.cost);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
              🛣️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-white">{road.name}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                  road.type === 'terra' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                  road.type === 'asfalto_simples' ? 'bg-slate-800 text-slate-300 border border-slate-600' :
                  road.type === 'duplicada' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {road.type === 'terra' ? '🪵 Terra' : road.type === 'asfalto_simples' ? '🛣️ Asfalto Simples' : road.type === 'duplicada' ? '🛣️ Pista Dupla' : '⚡ Via Expressa'}
                </span>
                {road.isTransamazonicaSector && (
                  <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 text-xs font-bold animate-pulse">
                    🔥 Setor Chefão
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Extensão: <b className="text-white">{road.realKm} km</b> &bull; V. Máxima: <b className="text-cyan-300">{road.maxSpeedKmH} km/h</b>
              </p>
            </div>
          </div>

          <button
            id="btn-close-road-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics strip */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400">Condição do Pavimento</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5 flex items-center justify-between">
              <span>{road.condition}%</span>
              <span className="text-xs font-normal text-slate-400">{road.condition < 50 ? '⚠️ Buracos' : '✅ Bom'}</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400">Nível de Trânsito</div>
            <div className="text-base font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
              <span>{road.trafficLevel === 'Livre' ? '🟢' : road.trafficLevel === 'Moderado' ? '🟡' : road.trafficLevel === 'Intenso' ? '🟠' : '🔴'}</span>
              <span>{road.trafficLevel}</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400">Pontes / Travessias</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">
              {road.bridgesCount} pontes
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400">Pedágio Rodoviário</div>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
              {road.hasToll ? `R$ ${road.tollFee.toFixed(2)}/veíc` : 'Sem Pedágio'}
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Paving / Upgrade Option */}
          {nextPave && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 border border-cyan-500/40 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white font-display">{nextPave.name}</h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-lg">{nextPave.description}</p>
                  <div className="text-xs text-emerald-400 font-semibold font-mono pt-1">
                    Ganho de velocidade: {nextPave.speedBonus} &bull; Reduz tempo de viagem
                  </div>
                </div>

                <button
                  id="btn-pave-road-confirm"
                  onClick={handlePave}
                  disabled={playerMoney < nextPave.cost}
                  className={`px-5 py-3 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition shadow-xl ${
                    playerMoney >= nextPave.cost
                      ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Hammer className="w-4 h-4" />
                  <span>R$ {nextPave.cost.toLocaleString('pt-BR')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Secondary Infrastructure Actions Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-cyan-400" /> Obras de Manutenção & Infraestrutura
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tapa-Buraco / Manutenção */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span>🕳️</span> Operação Tapa-Buraco
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1">Restaura a condição da pista para 100%.</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono text-slate-300">R$ {repairCost.toLocaleString('pt-BR')}</span>
                  <button
                    onClick={handleRepair}
                    disabled={playerMoney < repairCost || road.condition >= 98}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                      road.condition >= 98
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : playerMoney >= repairCost
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {road.condition >= 98 ? 'Perfeito' : 'Recuperar'}
                  </button>
                </div>
              </div>

              {/* Praça de Pedágio */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span>💳</span> Praça de Pedágio
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1">Arrecadação automática sobre comboios e veículos.</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono text-slate-300">R$ {tollCost.toLocaleString('pt-BR')}</span>
                  <button
                    onClick={handleToll}
                    disabled={road.hasToll || playerMoney < tollCost}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                      road.hasToll
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : playerMoney >= tollCost
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {road.hasToll ? 'Instalado' : 'Construir'}
                  </button>
                </div>
              </div>

              {/* Pontes de Concreto */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span>🌉</span> Pontes de Concreto
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1">Substitui balsas e pontilhões rústicos de madeira.</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono text-slate-300">R$ {bridgeUpgradeCost.toLocaleString('pt-BR')}</span>
                  <button
                    onClick={handleBridges}
                    disabled={playerMoney < bridgeUpgradeCost}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                      playerMoney >= bridgeUpgradeCost
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Instalar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shortcuts Section (SISTEMA DE ATALHOS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Sistema de Atalhos & Contornos Viários
              </h4>
              <span className="text-xs text-slate-400">
                Economiza tempo nas viagens entre cidades
              </span>
            </div>

            {road.shortcuts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                Nenhum atalho geográfico adicional necessário para este trecho.
              </div>
            ) : (
              <div className="space-y-2">
                {road.shortcuts.map(sc => {
                  const canAfford = playerMoney >= sc.cost;
                  return (
                    <div
                      key={sc.id}
                      className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        sc.built
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-slate-900/80 border-slate-700/70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{sc.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                            ⚡ -{sc.timeSavingsPercent}% Tempo de Viagem
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-md">{sc.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {sc.built ? (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Atalho Ativo
                          </span>
                        ) : (
                          <button
                            onClick={() => handleShortcut(sc)}
                            disabled={!canAfford}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow ${
                              canAfford
                                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            }`}
                          >
                            Construir R$ {sc.cost.toLocaleString('pt-BR')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
