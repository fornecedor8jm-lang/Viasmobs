import React, { useState } from 'react';
import { Road, RoadType, Shortcut } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Hammer, 
  Wrench, 
  Zap, 
  DollarSign, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Navigation,
  Sparkles,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface GoogleMapsPaveSheetProps {
  roads: Road[];
  playerMoney: number;
  selectedRoad: Road | null;
  onSelectRoad: (road: Road) => void;
  onPaveRoad: (roadId: string, targetType: RoadType, cost: number) => void;
  onRepairRoad: (roadId: string, cost: number) => void;
  onBuildToll: (roadId: string, cost: number, fee: number) => void;
  onBuildShortcut: (roadId: string, shortcutId: string, cost: number) => void;
  onInstallBridges: (roadId: string, cost: number) => void;
  onClose: () => void;
}

export const GoogleMapsPaveSheet: React.FC<GoogleMapsPaveSheetProps> = ({
  roads,
  playerMoney,
  selectedRoad,
  onSelectRoad,
  onPaveRoad,
  onRepairRoad,
  onBuildToll,
  onBuildShortcut,
  onInstallBridges,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | 'dirt' | 'paved' | 'damaged'>('dirt');

  const filteredRoads = roads.filter(r => {
    if (filter === 'dirt') return r.type === 'terra';
    if (filter === 'paved') return r.type !== 'terra';
    if (filter === 'damaged') return r.condition < 70;
    return true;
  });

  const activeRoad = selectedRoad || filteredRoads[0] || roads[0];

  const getPaveInfo = (road: Road) => {
    if (road.type === 'terra') {
      return {
        targetType: 'asfalto_simples' as RoadType,
        name: 'Asfaltar com CBUQ Usinado',
        badge: '🪵 Terra ➔ 🛣️ Asfalto',
        cost: Math.round(road.realKm * 250),
        speedGain: '+35 km/h',
        timeSavedEst: Math.round((road.realKm / 40 - road.realKm / 80) * 60),
        desc: 'Elimina atoleiros e poeira, transformando em asfalto liso federal.'
      };
    }
    if (road.type === 'asfalto_simples') {
      return {
        targetType: 'duplicada' as RoadType,
        name: 'Duplicar Pista (2 Faixas)',
        badge: '🛣️ Simples ➔ 🛣️ Duplicada',
        cost: Math.round(road.realKm * 480),
        speedGain: '+20 km/h',
        timeSavedEst: Math.round((road.realKm / 75 - road.realKm / 95) * 60),
        desc: 'Canteiro central e acostamento pavimentado, eliminando trânsito.'
      };
    }
    if (road.type === 'duplicada') {
      return {
        targetType: 'via_expressa' as RoadType,
        name: 'Via Expressa Inteligente',
        badge: '🛣️ Duplicada ➔ ⚡ Expressa',
        cost: Math.round(road.realKm * 750),
        speedGain: '+25 km/h (120 km/h)',
        timeSavedEst: Math.round((road.realKm / 95 - road.realKm / 120) * 60),
        desc: 'Viadutos em todos os cruzamentos e monitoramento por câmeras.'
      };
    }
    return null;
  };

  const currentPaveInfo = activeRoad ? getPaveInfo(activeRoad) : null;
  const repairCost = activeRoad ? Math.round((100 - activeRoad.condition) * activeRoad.realKm * 1.5) : 0;
  const tollCost = 35000;
  const bridgeCost = 45000;

  return (
    <div className="absolute bottom-16 sm:bottom-4 left-3 right-3 sm:left-4 sm:w-[440px] max-h-[85vh] z-[520] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-base shadow">
            🛠️
          </div>
          <div>
            <h2 className="text-base font-black font-display text-slate-950">
              Obras & Pavimentação
            </h2>
            <p className="text-[11px] font-semibold text-amber-950">
              Melhore rodovias para reduzir o tempo das viagens da sua rede
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-black/10 transition text-slate-950"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
            filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Todas ({roads.length})
        </button>
        <button
          onClick={() => setFilter('dirt')}
          className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap flex items-center gap-1 ${
            filter === 'dirt' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <span>🪵 Terra</span>
          <span className="font-mono">({roads.filter(r => r.type === 'terra').length})</span>
        </button>
        <button
          onClick={() => setFilter('damaged')}
          className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap flex items-center gap-1 ${
            filter === 'damaged' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <span>🚧 Com Buracos</span>
          <span className="font-mono">({roads.filter(r => r.condition < 70).length})</span>
        </button>
        <button
          onClick={() => setFilter('paved')}
          className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
            filter === 'paved' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          🛣️ Asfaltadas
        </button>
      </div>

      {/* Horizontal Road Selector Carousel */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
        {filteredRoads.map(road => {
          const isSelected = activeRoad?.id === road.id;
          const isDirt = road.type === 'terra';
          return (
            <button
              key={road.id}
              onClick={() => onSelectRoad(road)}
              className={`p-2 rounded-2xl text-left shrink-0 transition border flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-500 ring-2 ring-amber-400'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{isDirt ? '🪵' : '🛣️'}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{road.name}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                <span>{road.realKm} km</span>
                <span className="font-mono">{road.condition}% cond.</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Road Inspection & Upgrade Actions */}
      {activeRoad && (
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          {/* Road Identity Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 font-display">
                  {activeRoad.name}
                </h3>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeRoad.type === 'terra'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {activeRoad.type === 'terra' ? '🪵 Não Pavimentada (Terra/Barro)' : activeRoad.type === 'duplicada' ? '🛣️ Pista Duplicada' : activeRoad.type === 'via_expressa' ? '⚡ Via Expressa Inteligente' : '🛣️ Asfalto Usinado CBUQ'}
                </span>
              </div>

              <div className="text-right">
                <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {activeRoad.maxSpeedKmH} km/h
                </div>
                <div className="text-[10px] text-slate-400">Velocidade Máx.</div>
              </div>
            </div>

            {/* Condition bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Condição do Asfalto:</span>
                <b className={`font-mono ${activeRoad.condition > 75 ? 'text-emerald-500' : activeRoad.condition > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {Math.round(activeRoad.condition)}% {activeRoad.condition < 60 ? '(Buracos)' : '(Conservado)'}
                </b>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    activeRoad.condition > 75 ? 'bg-emerald-500' : activeRoad.condition > 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${activeRoad.condition}%` }}
                />
              </div>
            </div>
          </div>

          {/* MAIN PAVING ACTION (Opção para Asfaltar) */}
          {currentPaveInfo ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-400 dark:border-amber-600/80 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                    <Hammer className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-black text-amber-900 dark:text-amber-200 text-xs">
                      {currentPaveInfo.name}
                    </h4>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                      {currentPaveInfo.badge}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-1 rounded-lg bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-mono font-black text-xs">
                  {currentPaveInfo.speedGain}
                </span>
              </div>

              <p className="text-[11px] text-amber-800 dark:text-amber-200">
                {currentPaveInfo.desc}
              </p>

              {/* Time saved tag */}
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-300 dark:border-emerald-700/60">
                <Clock className="w-3.5 h-3.5" />
                <span>Economia de tempo estimada: <b>-{currentPaveInfo.timeSavedEst} minutos por viagem!</b></span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-200 dark:border-amber-800">
                <div>
                  <div className="text-[10px] text-slate-500">Investimento Total:</div>
                  <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                    R$ {currentPaveInfo.cost.toLocaleString('pt-BR')}
                  </div>
                </div>

                <button
                  id="btn-confirm-pave-road"
                  onClick={() => {
                    if (playerMoney >= currentPaveInfo.cost) {
                      playSound.pave();
                      onPaveRoad(activeRoad.id, currentPaveInfo.targetType, currentPaveInfo.cost);
                    }
                  }}
                  disabled={playerMoney < currentPaveInfo.cost}
                  className={`px-4 py-2.5 rounded-2xl font-bold font-display text-xs flex items-center gap-2 shadow-lg transition active:scale-95 ${
                    playerMoney >= currentPaveInfo.cost
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Hammer className="w-4 h-4" />
                  <span>Asfaltar Rodovia</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Rodovia no nível máximo de pavimentação (Via Expressa Inteligente).</span>
            </div>
          )}

          {/* Secondary Actions: Repairs, Toll, Bridges, Shortcuts */}
          <div className="space-y-2">
            <h5 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
              Manutenção & Melhorias Adicionais
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Tapa-buraco */}
              <button
                onClick={() => {
                  if (playerMoney >= repairCost && activeRoad.condition < 98) {
                    playSound.pave();
                    onRepairRoad(activeRoad.id, repairCost);
                  }
                }}
                disabled={playerMoney < repairCost || activeRoad.condition >= 98}
                className={`p-3 rounded-2xl text-left border flex items-center justify-between transition ${
                  activeRoad.condition < 98 && playerMoney >= repairCost
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700/60 hover:bg-blue-100'
                    : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div>
                  <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Recapear Asfalto</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Restaura 100% de condição</div>
                </div>
                <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                  {activeRoad.condition >= 98 ? 'Perfeito' : `R$ ${repairCost.toLocaleString('pt-BR')}`}
                </span>
              </button>

              {/* Pedágio */}
              <button
                onClick={() => {
                  if (!activeRoad.hasToll && playerMoney >= tollCost) {
                    playSound.coin();
                    onBuildToll(activeRoad.id, tollCost, 12.50);
                  }
                }}
                disabled={activeRoad.hasToll || playerMoney < tollCost}
                className={`p-3 rounded-2xl text-left border flex items-center justify-between transition ${
                  !activeRoad.hasToll && playerMoney >= tollCost
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100'
                    : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Praça de Pedágio</span>
                  </div>
                  <div className="text-[10px] text-slate-500">+R$ 12,50/veículo</div>
                </div>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  {activeRoad.hasToll ? 'Instalado' : `R$ ${tollCost.toLocaleString('pt-BR')}`}
                </span>
              </button>
            </div>

            {/* Shortcuts on this road */}
            {activeRoad.shortcuts.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <h6 className="font-bold text-[11px] text-slate-500">Atalhos Disponíveis:</h6>
                {activeRoad.shortcuts.map(sc => (
                  <div key={sc.id} className="p-2.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-amber-900 dark:text-amber-200">{sc.name}</div>
                      <div className="text-[10px] text-slate-500">Economiza -{sc.timeSavingsPercent}% do tempo</div>
                    </div>
                    {sc.built ? (
                      <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Construído
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (playerMoney >= sc.cost) {
                            playSound.pave();
                            onBuildShortcut(activeRoad.id, sc.id, sc.cost);
                          }
                        }}
                        disabled={playerMoney < sc.cost}
                        className={`px-3 py-1 rounded-xl font-bold text-[11px] shadow transition ${
                          playerMoney >= sc.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            : 'bg-slate-300 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        Construir (R$ {sc.cost.toLocaleString('pt-BR')})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
