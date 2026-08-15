// Viasmobs — Card Permanente de Missão Guiada e Conquistas Secundárias

import React, { useState } from 'react';
import { 
  FlagTriangleRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Construction, 
  Building2, 
  Trophy, 
  Gift, 
  Route, 
  DollarSign,
  Compass
} from 'lucide-react';
import { City, Road, GameEconomy, RegionInfo } from '../types/game';
import { playSound } from '../utils/audio';

export interface MiniQuest {
  id: string;
  title: string;
  current: number;
  target: number;
  rewardMoney: number;
  claimed: boolean;
  unit?: string;
  icon: string;
}

interface PermanentMissionCardProps {
  cities: City[];
  roads: Road[];
  economy: GameEconomy;
  currentRegion: RegionInfo;
  firstWorkComplete: boolean;
  onExecutePavingMission: () => void;
  onExecuteNeighborhoodMission: () => void;
  onOpenRoutes: () => void;
  onOpenRegions: () => void;
  onClaimQuestReward: (questId: string, reward: number) => void;
  claimedQuestIds: string[];
}

export const PermanentMissionCard: React.FC<PermanentMissionCardProps> = ({
  cities,
  roads,
  economy,
  currentRegion,
  firstWorkComplete,
  onExecutePavingMission,
  onExecuteNeighborhoodMission,
  onOpenRoutes,
  onOpenRegions,
  onClaimQuestReward,
  claimedQuestIds
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

  // Check state of main objectives
  const macapaPortoGrande = roads.find(r => r.id === 'road_macapa_portogrande');
  const isPavingDone = macapaPortoGrande ? macapaPortoGrande.type !== 'terra' : false;

  const macapa = cities.find(c => c.id === 'macapa');
  const macapaDominadoCount = macapa ? macapa.neighborhoods.filter(n => n.influencePercent >= 100).length : 0;
  const isNeighborhoodDone = macapaDominadoCount > 0;

  const unlockedCitiesCount = cities.filter(c => c.unlocked).length;
  const dominatedCitiesCount = cities.filter(c => c.dominated || c.influence >= 95).length;
  const targetRegionCities = currentRegion.citiesRequiredToUnlockNext || 5;

  // Active step calculation
  let activeStepNumber = 1;
  let activeStepTitle = '1/2: Asfalte o trecho Macapá–Porto Grande (BR-156)';
  let activeStepDesc = 'Transforme a estrada de terra em asfalto para elevar o limite de 45 para 80 km/h.';
  let activeAction = onExecutePavingMission;
  let activeActionLabel = 'Asfaltar Trecho Alvo';
  let activeActionIcon = <Construction size={15} />;

  if (isPavingDone && !isNeighborhoodDone) {
    activeStepNumber = 2;
    activeStepTitle = '2/2: Desenvolva um bairro em Macapá';
    activeStepDesc = 'Invista nas melhorias de Macapá até atingir 100% de domínio em um bairro.';
    activeAction = onExecuteNeighborhoodMission;
    activeActionLabel = 'Abrir Bairros de Macapá';
    activeActionIcon = <Building2 size={15} />;
  } else if (isPavingDone && isNeighborhoodDone) {
    activeStepNumber = 3;
    activeStepTitle = `Expansão Regional: Conquiste ${targetRegionCities} cidades no ${currentRegion.name}`;
    activeStepDesc = `Progresso: ${dominatedCitiesCount} de ${targetRegionCities} cidades dominadas. Planeje viagens e aumente a influência!`;
    activeAction = onOpenRoutes;
    activeActionLabel = 'Planejar Viagens & Rotas';
    activeActionIcon = <Route size={15} />;
  }

  // Secondary Quests
  const quests: MiniQuest[] = [
    {
      id: 'quest_trips_3',
      title: 'Conclua 3 Viagens Intermunicipais',
      current: economy.tripsCompleted,
      target: 3,
      rewardMoney: 18000,
      claimed: claimedQuestIds.includes('quest_trips_3'),
      unit: 'viagens',
      icon: '🚚'
    },
    {
      id: 'quest_pave_100',
      title: 'Pavimente 100 km de Rodovias',
      current: Math.min(100, Math.round(economy.roadsPavedKm)),
      target: 100,
      rewardMoney: 25000,
      claimed: claimedQuestIds.includes('quest_pave_100'),
      unit: 'km',
      icon: '🛣️'
    },
    {
      id: 'quest_toll_1',
      title: 'Instale 1 Praça de Pedágio',
      current: roads.filter(r => r.hasToll).length,
      target: 1,
      rewardMoney: 20000,
      claimed: claimedQuestIds.includes('quest_toll_1'),
      unit: 'pedágios',
      icon: '💰'
    },
    {
      id: 'quest_dominate_1',
      title: 'Domine 1 Bairro a 100%',
      current: cities.reduce((acc, c) => acc + c.neighborhoods.filter(n => n.influencePercent >= 100).length, 0),
      target: 1,
      rewardMoney: 30000,
      claimed: claimedQuestIds.includes('quest_dominate_1'),
      unit: 'bairros',
      icon: '👑'
    }
  ];

  const unclaimedReadyCount = quests.filter(q => q.current >= q.target && !q.claimed).length;

  return (
    <div className="fixed top-20 sm:top-20 left-3 sm:left-4 z-[490] max-w-[calc(100vw-24px)] sm:max-w-sm">
      
      {/* Collapsed Chip */}
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-amber-500/60 shadow-xl text-xs font-bold text-slate-100 hover:bg-slate-800 transition"
        >
          <div className="w-5 h-5 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            <FlagTriangleRight size={13} />
          </div>
          <span className="text-amber-300 font-display">Missão: {activeStepTitle.split(':')[0]}</span>
          {unclaimedReadyCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          )}
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      ) : (
        /* Full Mission Widget */
        <div className="rounded-3xl bg-slate-900/95 backdrop-blur-md border-2 border-amber-500/50 shadow-2xl overflow-hidden text-slate-100 animate-in fade-in slide-in-from-left-2 duration-200">
          
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                <FlagTriangleRight size={14} />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-amber-400">
                  MISSÃO PRINCIPAL &bull; FASE {currentRegion.phase}
                </span>
                <h3 className="text-xs font-black font-display text-white line-clamp-1">
                  {currentRegion.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowQuests(val => !val)}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
                  showQuests 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Ver Metas e Conquistas"
              >
                <Trophy size={12} />
                <span>Metas</span>
                {unclaimedReadyCount > 0 && (
                  <span className="px-1 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-black text-[9px]">
                    {unclaimedReadyCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCollapsed(true)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                title="Recolher"
              >
                <ChevronUp size={15} />
              </button>
            </div>
          </div>

          {/* Body: Active Objective */}
          {!showQuests ? (
            <div className="p-3.5 space-y-2.5 text-xs">
              <div>
                <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400 animate-pulse" />
                  <span>{activeStepTitle}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {activeStepDesc}
                </p>
              </div>

              {/* Regional progression mini meter */}
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Progresso de Cidades Dominadas:</span>
                  <b className="text-emerald-400 font-mono">{dominatedCitiesCount}/{targetRegionCities} cidades</b>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (dominatedCitiesCount / targetRegionCities) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Instant Execution CTA */}
              <button
                onClick={() => {
                  playSound.click();
                  activeAction();
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs font-display flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95 animate-pulse"
              >
                {activeActionIcon}
                <span>{activeActionLabel}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            /* Quests List */
            <div className="p-3 space-y-2 max-h-56 overflow-y-auto text-xs">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Metas & Recompensas</span>
                <span className="text-[10px] text-amber-400 font-bold">R$ Bônus</span>
              </div>

              {quests.map(quest => {
                const isComplete = quest.current >= quest.target;
                return (
                  <div
                    key={quest.id}
                    className={`p-2 rounded-2xl border flex items-center justify-between gap-2 transition ${
                      quest.claimed
                        ? 'bg-slate-800/30 border-slate-800 text-slate-500 opacity-60'
                        : isComplete
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-100'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <span>{quest.icon}</span>
                        <span className="line-clamp-1">{quest.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Progresso: <b>{quest.current}/{quest.target} {quest.unit}</b></span>
                        <span className="text-emerald-400 font-mono font-bold">+R$ {quest.rewardMoney.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    {quest.claimed ? (
                      <span className="px-2 py-1 rounded-xl bg-slate-800 text-slate-400 text-[10px] font-bold">
                        Resgatado
                      </span>
                    ) : isComplete ? (
                      <button
                        onClick={() => {
                          playSound.coin();
                          onClaimQuestReward(quest.id, quest.rewardMoney);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] shadow transition active:scale-95 animate-bounce"
                      >
                        Resgatar!
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {Math.round((quest.current / quest.target) * 100)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
