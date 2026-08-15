import React, { useState } from 'react';
import { City, Neighborhood, Road } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  X, 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Award, 
  CheckCircle2,
  ChevronRight,
  Users,
  Compass,
  ShieldAlert,
  Siren,
  Wrench
} from 'lucide-react';
import { allDefenseMissionObjectivesComplete, allRecoveryObjectivesComplete, getCityCrisisLevel, getDefenseMissionObjectives, getLeadRival, getRecoveryObjectives } from '../utils/cityPolitics';

interface GoogleMapsCitySheetProps {
  city: City;
  roads: Road[];
  playerMoney: number;
  onClose: () => void;
  onSetPointA: (city: City) => void;
  onSetPointB: (city: City) => void;
  onUpgradeNeighborhood: (cityId: string, neighborhoodId: string, cost: number) => void;
  onUpgradeSecurity: (cityId: string, upgradeType: 'station' | 'patrol' | 'camera' | 'prf', cost: number) => void;
  onReclaimAdministration: (cityId: string) => void;
  onStartPoliticalMission: (cityId: string) => void;
  onCompletePoliticalMission: (cityId: string) => void;
  politicalMissionActive: boolean;
  politicalMissionCompleted: boolean;
  initialTab?: 'overview' | 'neighborhoods' | 'security' | 'population';
}

export const GoogleMapsCitySheet: React.FC<GoogleMapsCitySheetProps> = ({
  city,
  roads,
  playerMoney,
  onClose,
  onSetPointA,
  onSetPointB,
  onUpgradeNeighborhood,
  onUpgradeSecurity,
  onReclaimAdministration,
  onStartPoliticalMission,
  onCompletePoliticalMission,
  politicalMissionActive,
  politicalMissionCompleted,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'neighborhoods' | 'security' | 'population'>(initialTab);

  const neighborhoodUpgradeCost = 15000;
  const securityUpgradeCost = 25000;
  const crisisLevel = getCityCrisisLevel(city);
  const leadRival = getLeadRival(city);
  const recoveryObjectives = getRecoveryObjectives(city, roads);
  const defenseObjectives = getDefenseMissionObjectives(city, roads);
  const defenseObjectivesDone = Object.values(defenseObjectives).filter(Boolean).length;
  const administrationTaken = crisisLevel === 'taken';
  const approval = city.politics?.approval ?? 60;
  const populationMood = approval >= 80
    ? { label: 'Muito satisfeita', detail: 'A população apoia obras e reduz a força dos rivais.', color: 'emerald' }
    : approval >= 60
      ? { label: 'Satisfeita', detail: 'A administração segue estável, mas precisa de manutenção.', color: 'emerald' }
      : approval >= 50
        ? { label: 'Atenta', detail: 'Há apoio, porém vias e bairros precisam de atenção.', color: 'blue' }
        : approval >= 30
          ? { label: 'Insatisfeita', detail: 'O rival começou a ganhar espaço na cidade.', color: 'amber' }
          : { label: administrationTaken ? 'Administração tomada' : 'Revoltada', detail: administrationTaken ? 'O rival assumiu o controle da cidade.' : 'O golpe pode acontecer se a cidade continuar abandonada.', color: 'rose' };

  return (
    <div className="absolute bottom-16 sm:bottom-4 left-3 right-3 sm:left-4 sm:w-[440px] max-h-[85vh] z-[520] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Header with City Photo Header / Map place banner */}
      <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <h2 className="text-lg font-black font-display tracking-tight text-white">
                {city.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
                {city.state}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100 mt-1">
              <span>{city.region} &bull; {city.landmark}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Maps Place Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
          <button
            onClick={() => onSetPointA(city)}
            className="py-2 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
          >
            <span>🅰️</span> Partir Daqui (Origem)
          </button>

          <button
            onClick={() => onSetPointB(city)}
            className="py-2 px-3 rounded-2xl bg-white hover:bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Como Chegar (Destino)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[10px] sm:text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 flex-1 text-center transition border-b-2 ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('neighborhoods')}
          className={`py-2.5 flex-1 text-center transition border-b-2 ${
            activeTab === 'neighborhoods' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Bairros ({city.neighborhoods.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-2.5 text-center transition border-b-2 ${
            activeTab === 'security' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Segurança
        </button>
        <button
          onClick={() => setActiveTab('population')}
          className={`py-2.5 text-center transition border-b-2 ${
            activeTab === 'population' ? 'border-rose-600 text-rose-600 dark:text-rose-400' : 'border-transparent text-slate-500'
          }`}
        >
          População
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 overflow-y-auto space-y-3 text-xs">
        
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              "{city.description}"
            </p>

            <button type="button" onClick={() => setActiveTab('population')} className={`w-full p-3 rounded-2xl border text-left transition ${administrationTaken ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700' : crisisLevel === 'critical' || crisisLevel === 'alert' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700' : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'}`}>
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2"><ShieldAlert className={administrationTaken ? 'w-4 h-4 text-rose-500' : crisisLevel === 'stable' ? 'w-4 h-4 text-emerald-500' : 'w-4 h-4 text-amber-500'} /><span className="font-black text-slate-800 dark:text-slate-100">{administrationTaken ? 'Cidade tomada' : 'Ver humor e risco de golpe'}</span></span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300">Aba População →</span>
              </span>
            </button>

            {/* City Key Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>População</span>
                </div>
                <div className="text-base font-black font-mono text-slate-800 dark:text-slate-100">
                  {city.population.toLocaleString('pt-BR')} hab.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className={`flex items-center gap-1.5 font-bold mb-1 ${administrationTaken ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{administrationTaken ? 'Receita Bloqueada' : 'Imposto / Hora'}</span>
                </div>
                <div className={`text-base font-black font-mono ${administrationTaken ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {administrationTaken ? 'R$ 0/h' : `+R$ ${city.taxRevenuePerHour.toLocaleString('pt-BR')}/h`}
                </div>
              </div>
            </div>

            {/* Domination progress */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-200">Domínio da Cidade:</span>
                <span className="font-mono font-bold text-amber-500">{Math.round(city.influence)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${city.influence}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Melhore a infraestrutura dos bairros na aba Bairros para alcançar 100% de domínio e liberar bônus de arrecadação.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'neighborhoods' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wider">
                  Bairros Estratégicos ({city.neighborhoods.filter(n => n.influencePercent >= 100).length}/{city.neighborhoods.length} Dominados)
                </span>
                <p className="text-[10px] text-amber-500 font-semibold">
                  Domine 100% de cada bairro para turbinar a arrecadação da cidade!
                </p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono">
                Custo: R$ {neighborhoodUpgradeCost.toLocaleString('pt-BR')}
              </span>
            </div>

            {city.neighborhoods.map(nb => {
              const isDominated = nb.influencePercent >= 100;
              const remainingToDominate = Math.max(0, 100 - nb.influencePercent);

              return (
                <div
                  key={nb.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isDominated
                      ? 'bg-emerald-500/10 border-emerald-500/40 dark:bg-emerald-950/30'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-100">{nb.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                          {nb.type}
                        </span>
                      </div>

                      {/* Explicit Domination Status Rule */}
                      <div className="mt-1 font-mono text-[11px]">
                        {isDominated ? (
                          <span className="text-emerald-500 font-black flex items-center gap-1">
                            👑 100% Dominado &bull; Bônus de receita ativo!
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold">
                            {nb.influencePercent}% de influência &mdash; <b className="text-slate-700 dark:text-slate-200">faltam {remainingToDominate}%</b> para dominar
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (playerMoney >= neighborhoodUpgradeCost && !isDominated) {
                          playSound.coin();
                          onUpgradeNeighborhood(city.id, nb.id, neighborhoodUpgradeCost);
                        }
                      }}
                      disabled={playerMoney < neighborhoodUpgradeCost || isDominated}
                      className={`px-3 py-2 rounded-xl font-black text-xs shadow transition active:scale-95 shrink-0 ${
                        isDominated
                          ? 'bg-emerald-500 text-slate-950 cursor-default'
                          : playerMoney >= neighborhoodUpgradeCost
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isDominated ? '👑 Dominado' : 'Desenvolver'}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDominated
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, nb.influencePercent)}%` }}
                    />
                  </div>

                  {/* Explicit Rewards Information */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>🎁 Recompensa: +R$ 3.500/h impostos &bull; +Indústria</span>
                    <span>Infraestrutura: <b>{nb.indicators.infrastructure}%</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Índice de Segurança Pública: {city.security.score}%</span>
              </div>
              <p className="text-[11px] text-blue-800 dark:text-blue-300">
                Uma cidade segura atrai frotas de caminhões e reduz roubos de carga nas rodovias.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">Base da PRF Rodoviária</div>
                  <div className="text-[10px] text-slate-500">Patrulhamento ostensivo na BR</div>
                </div>
                <button
                  onClick={() => {
                    if (playerMoney >= securityUpgradeCost) {
                      playSound.coin();
                      onUpgradeSecurity(city.id, 'prf', securityUpgradeCost);
                    }
                  }}
                  disabled={playerMoney < securityUpgradeCost}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                >
                  Instalar (R$ 25k)
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">Câmeras & Muralha Digital</div>
                  <div className="text-[10px] text-slate-500">Monitoramento 24h por IA</div>
                </div>
                <button
                  onClick={() => {
                    if (playerMoney >= 18000) {
                      playSound.coin();
                      onUpgradeSecurity(city.id, 'camera', 18000);
                    }
                  }}
                  disabled={playerMoney < 18000}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                >
                  Instalar (R$ 18k)
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'population' && (
          <div className="space-y-3">
            <div className={`p-3.5 rounded-2xl border ${
              populationMood.color === 'rose' ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700'
                : populationMood.color === 'amber' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
                  : populationMood.color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-700'
                    : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  {administrationTaken ? <Siren className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" /> : <Users className={`w-5 h-5 shrink-0 mt-0.5 ${populationMood.color === 'amber' ? 'text-amber-500' : populationMood.color === 'rose' ? 'text-rose-500' : 'text-emerald-500'}`} />}
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-100">Humor: {populationMood.label}</h3>
                    <p className="mt-0.5 text-[10px] text-slate-600 dark:text-slate-300">{populationMood.detail}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg font-mono font-black text-xs ${administrationTaken ? 'bg-rose-500 text-white' : 'bg-white/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-100'}`}>{approval}%</span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300"><span>Apoio à administração</span><span>{approval}%</span></div>
                <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><div className={`h-full rounded-full ${populationMood.color === 'rose' ? 'bg-rose-500' : populationMood.color === 'amber' ? 'bg-amber-500' : populationMood.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${approval}%` }} /></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-slate-800 dark:text-slate-100">Rival em destaque</p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{leadRival ? `${leadRival.name} explora problemas de ${leadRival.focus}.` : 'Nenhum rival identificado.'}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-mono font-black text-xs">{leadRival?.support ?? 0}% rival</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" style={{ width: `${leadRival?.support ?? 0}%` }} /></div>
            </div>

            {!politicalMissionActive && !politicalMissionCompleted && (
              <button
                type="button"
                onClick={() => onStartPoliticalMission(city.id)}
                className={`w-full py-3 rounded-xl font-black text-xs shadow transition active:scale-[.98] ${administrationTaken ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white'}`}
              >
                {administrationTaken ? 'Iniciar Missão de Reconquista' : 'Iniciar Missão do Golpe'}
              </button>
            )}

            {politicalMissionCompleted && !administrationTaken && (
              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-center font-black text-xs">
                <CheckCircle2 className="inline w-4 h-4 mr-1.5 -mt-0.5" /> Missão concluída: cidade defendida.
              </div>
            )}

            {politicalMissionActive && !administrationTaken && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/45 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-rose-300 text-xs">Missão do Golpe em andamento</p>
                    <p className="mt-0.5 text-[10px] text-slate-300">Complete os quatro objetivos antes que o rival tome a cidade.</p>
                  </div>
                  <span className="rounded-lg bg-rose-500/15 px-2 py-1 text-[10px] font-black text-rose-200">{defenseObjectivesDone}/4</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all" style={{ width: `${defenseObjectivesDone * 25}%` }} /></div>
                <div className="grid gap-1.5 text-[10px] text-slate-200">
                  <span className={defenseObjectives.routeReady ? 'text-emerald-400' : ''}><Wrench className="inline w-3.5 h-3.5 mr-1" />{defenseObjectives.routeReady ? 'Concluído' : 'Pendente'}: rota confiável até a cidade</span>
                  <span className={defenseObjectives.neighborhoodReady ? 'text-emerald-400' : ''}><Building2 className="inline w-3.5 h-3.5 mr-1" />{defenseObjectives.neighborhoodReady ? 'Concluído' : 'Pendente'}: bairro com 75% de influência</span>
                  <span className={defenseObjectives.securityReady ? 'text-emerald-400' : ''}><ShieldCheck className="inline w-3.5 h-3.5 mr-1" />{defenseObjectives.securityReady ? 'Concluído' : 'Pendente'}: segurança acima de 60%</span>
                  <span className={defenseObjectives.approvalReady ? 'text-emerald-400' : ''}><Users className="inline w-3.5 h-3.5 mr-1" />{defenseObjectives.approvalReady ? 'Concluído' : 'Pendente'}: apoio popular acima de 60%</span>
                </div>
                <button type="button" disabled={!allDefenseMissionObjectivesComplete(defenseObjectives)} onClick={() => onCompletePoliticalMission(city.id)} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed">Concluir Missão · Receber R$ 22.000</button>
              </div>
            )}

            {administrationTaken && (
              <div className="p-3.5 rounded-2xl bg-rose-950/15 border border-rose-500/40 space-y-2">
                <p className="font-black text-[11px] text-rose-700 dark:text-rose-300">Reconquiste a administração cumprindo os três compromissos.</p>
                <div className="grid gap-1.5 text-[10px] text-slate-700 dark:text-slate-200">
                  <span className={recoveryObjectives.routeReady ? 'text-emerald-600 dark:text-emerald-400' : ''}><Wrench className="inline w-3.5 h-3.5 mr-1" />{recoveryObjectives.routeReady ? 'Concluído' : 'Pendente'}: rota confiável</span>
                  <span className={recoveryObjectives.neighborhoodReady ? 'text-emerald-600 dark:text-emerald-400' : ''}><Building2 className="inline w-3.5 h-3.5 mr-1" />{recoveryObjectives.neighborhoodReady ? 'Concluído' : 'Pendente'}: bairro com 75% de influência</span>
                  <span className={recoveryObjectives.securityReady ? 'text-emerald-600 dark:text-emerald-400' : ''}><ShieldCheck className="inline w-3.5 h-3.5 mr-1" />{recoveryObjectives.securityReady ? 'Concluído' : 'Pendente'}: segurança acima de 60%</span>
                </div>
                <button type="button" disabled={!allRecoveryObjectivesComplete(recoveryObjectives)} onClick={() => onReclaimAdministration(city.id)} className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed">Recuperar Administração</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
