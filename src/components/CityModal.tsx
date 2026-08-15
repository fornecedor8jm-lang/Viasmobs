import React, { useState } from 'react';
import { City, Neighborhood } from '../types/game';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  ShieldCheck, 
  Car, 
  HeartPulse, 
  Bus, 
  Hammer, 
  TrendingUp, 
  Award, 
  Camera, 
  Radio, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface CityModalProps {
  city: City;
  playerMoney: number;
  onClose: () => void;
  onUpgradeNeighborhood: (cityId: string, neighborhoodId: string, upgradeName: string, cost: number, influenceGain: number) => void;
  onUpgradeSecurity: (cityId: string, securityType: 'station' | 'patrol' | 'camera' | 'prf', cost: number) => void;
  onSetPointA: (city: City) => void;
  onSetPointB: (city: City) => void;
  onOpenTripPlanner: () => void;
}

const NEIGHBORHOOD_UPGRADES_CATALOG = [
  {
    id: 'asfalto_interno',
    name: 'Pavimentação & Asfalto CBUQ',
    cost: 12000,
    influenceGain: 15,
    icon: '🛣️',
    description: 'Recapeamento de ruas vicinais e eliminação de buracos.',
    indicatorBonus: { infrastructure: 18, traffic: -10, transport: 12 }
  },
  {
    id: 'corredor_onibus',
    name: 'Corredor BRT & Ônibus Elétrico',
    cost: 18000,
    influenceGain: 20,
    icon: '🚌',
    description: 'Faixas exclusivas de transporte coletivo rápido e integrado.',
    indicatorBonus: { transport: 25, traffic: -15, development: 12 }
  },
  {
    id: 'iluminacao_led',
    name: 'Iluminação Pública LED & Câmeras',
    cost: 8500,
    influenceGain: 12,
    icon: '💡',
    description: 'Vias iluminadas e conectadas ao centro de monitoramento urbano.',
    indicatorBonus: { security: 15, infrastructure: 10 }
  },
  {
    id: 'saude_upa',
    name: 'Posto de Saúde & UPA 24 Horas',
    cost: 22000,
    influenceGain: 22,
    icon: '🏥',
    description: 'Atendimento médico de urgência para a população do bairro.',
    indicatorBonus: { health: 30, development: 15 }
  },
  {
    id: 'polo_comercial',
    name: 'Polo Comercial e Logístico',
    cost: 28000,
    influenceGain: 25,
    icon: '🏭',
    description: 'Incentivos fiscais para abertura de armazéns e indústrias.',
    indicatorBonus: { development: 28, traffic: 10 }
  }
];

export const CityModal: React.FC<CityModalProps> = ({
  city,
  playerMoney,
  onClose,
  onUpgradeNeighborhood,
  onUpgradeSecurity,
  onSetPointA,
  onSetPointB,
  onOpenTripPlanner
}) => {
  const [activeTab, setActiveTab] = useState<'bairros' | 'seguranca' | 'geral'>('bairros');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>(city.neighborhoods[0] || null);

  const handleApplyNeighborhoodUpgrade = (upgrade: typeof NEIGHBORHOOD_UPGRADES_CATALOG[0]) => {
    if (playerMoney < upgrade.cost) return;
    playSound.pave();

    const willDominate = selectedNeighborhood.influencePercent + upgrade.influenceGain >= 100;
    if (willDominate) {
      playSound.dominate();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    onUpgradeNeighborhood(city.id, selectedNeighborhood.id, upgrade.name, upgrade.cost, upgrade.influenceGain);
  };

  const handleBuySecurity = (type: 'station' | 'patrol' | 'camera' | 'prf', cost: number) => {
    if (playerMoney < cost) return;
    playSound.siren();
    onUpgradeSecurity(city.id, type, cost);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner">
              {city.dominated ? '👑' : city.isStartingCity ? '🚩' : '🏙️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-white tracking-wide">{city.name}</h2>
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold">
                  {city.state} &bull; {city.region}
                </span>
                {city.dominated && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Cidade Dominada (100%)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{city.landmark}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-close-city-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Route Buttons Bar */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Arrecadação: <b className="text-emerald-400">R$ {city.taxRevenuePerHour.toLocaleString('pt-BR')}/h</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Segurança: <b className="text-blue-400">{city.security.score}%</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Domínio: <b className="text-amber-400">{Math.round(city.influence)}%</b></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-set-a"
              onClick={() => {
                onSetPointA(city);
                playSound.click();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition flex items-center gap-1 shadow"
            >
              <span>🅰️ Definir Origem</span>
            </button>
            <button
              id="btn-modal-set-b"
              onClick={() => {
                onSetPointB(city);
                playSound.click();
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white transition flex items-center gap-1 shadow"
            >
              <span>🅱️ Definir Destino</span>
            </button>
            <button
              id="btn-modal-open-trip"
              onClick={() => {
                onOpenTripPlanner();
                playSound.click();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition flex items-center gap-1 shadow"
            >
              <span>🚗 Planejar Rota</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6">
          <button
            onClick={() => setActiveTab('bairros')}
            className={`py-3 px-4 text-xs font-bold font-display border-b-2 transition flex items-center gap-2 ${
              activeTab === 'bairros'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Domínio dos Bairros ({city.neighborhoods.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`py-3 px-4 text-xs font-bold font-display border-b-2 transition flex items-center gap-2 ${
              activeTab === 'seguranca'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Segurança & Policiamento</span>
          </button>
          <button
            onClick={() => setActiveTab('geral')}
            className={`py-3 px-4 text-xs font-bold font-display border-b-2 transition flex items-center gap-2 ${
              activeTab === 'geral'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Perfil da Cidade</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'bairros' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Neighborhoods List (Left) */}
              <div className="md:col-span-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Bairros da Cidade
                </h3>
                {city.neighborhoods.map((nb) => {
                  const isSelected = selectedNeighborhood?.id === nb.id;
                  return (
                    <button
                      key={nb.id}
                      onClick={() => setSelectedNeighborhood(nb)}
                      className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md ring-1 ring-cyan-500'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{nb.name}</span>
                        {nb.dominated ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            👑 100%
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-cyan-400 font-bold">
                            {nb.influencePercent}%
                          </span>
                        )}
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            nb.dominated ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, nb.influencePercent)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Neighborhood Details (Right) */}
              {selectedNeighborhood && (
                <div className="md:col-span-8 space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/60">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white font-display">
                          {selectedNeighborhood.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {selectedNeighborhood.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Eleve a influência a 100% para dominar e integrar o bairro à rede administrativa.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-cyan-400">
                        {selectedNeighborhood.influencePercent}%
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {selectedNeighborhood.dominated ? '🏆 Bairro Dominado' : 'Influência'}
                      </span>
                    </div>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1"><Hammer className="w-3 h-3 text-amber-400" /> Infra</span>
                        <b className="text-white">{selectedNeighborhood.indicators.infrastructure}%</b>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${selectedNeighborhood.indicators.infrastructure}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1"><Car className="w-3 h-3 text-cyan-400" /> Fluidez Trânsito</span>
                        <b className="text-white">{100 - selectedNeighborhood.indicators.traffic}%</b>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${100 - selectedNeighborhood.indicators.traffic}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-blue-400" /> Segurança</span>
                        <b className="text-white">{selectedNeighborhood.indicators.security}%</b>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${selectedNeighborhood.indicators.security}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1"><HeartPulse className="w-3 h-3 text-rose-400" /> Saúde</span>
                        <b className="text-white">{selectedNeighborhood.indicators.health}%</b>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400" style={{ width: `${selectedNeighborhood.indicators.health}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1"><Bus className="w-3 h-3 text-emerald-400" /> Transporte</span>
                        <b className="text-white">{selectedNeighborhood.indicators.transport}%</b>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${selectedNeighborhood.indicators.transport}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-purple-400" /> Desenv.</span>
                        <b className="text-white">{selectedNeighborhood.indicators.development}%</b>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400" style={{ width: `${selectedNeighborhood.indicators.development}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Neighborhood Upgrades Available */}
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔨</span> Investimentos Urbanos & Expansão de Influência
                    </h5>
                    <div className="space-y-2">
                      {NEIGHBORHOOD_UPGRADES_CATALOG.map((upg) => {
                        const canAfford = playerMoney >= upg.cost;
                        const alreadyApplied = selectedNeighborhood.upgrades?.includes(upg.name);

                        return (
                          <div
                            key={upg.id}
                            className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 flex items-center justify-between gap-3 hover:border-slate-600 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{upg.icon}</span>
                              <div>
                                <div className="font-semibold text-xs text-white flex items-center gap-2">
                                  <span>{upg.name}</span>
                                  <span className="text-[10px] text-emerald-400 font-bold font-mono">
                                    +{upg.influenceGain}% Influência
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">{upg.description}</p>
                              </div>
                            </div>

                            <button
                              disabled={!canAfford || selectedNeighborhood.dominated}
                              onClick={() => handleApplyNeighborhoodUpgrade(upg)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition shadow ${
                                selectedNeighborhood.dominated
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : canAfford
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                              }`}
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>{upg.cost.toLocaleString('pt-BR')}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-blue-300 font-display flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Sistema de Segurança Municipal & Rodoviária
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Aumente a presença policial para reduzir assaltos a caminhões de carga, coibir acidentes e acelerar o desenvolvimento de todos os bairros da cidade.
                  </p>
                </div>
                <div className="text-right bg-slate-950/80 px-4 py-2 rounded-xl border border-blue-500/40">
                  <div className="text-2xl font-bold font-mono text-blue-400">{city.security.score}%</div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Índice Geral de Segurança</span>
                </div>
              </div>

              {/* Security Upgrade Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delegacia */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-900/40 text-blue-400 text-xl border border-blue-700/50">
                      🏢
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">Delegacia & Distrito Policial</h5>
                      <p className="text-xs text-slate-400">Atuais: <b className="text-white">{city.security.policeStations}</b> unidades</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-emerald-400 font-semibold">+8% Segurança geral</span>
                    <button
                      onClick={() => handleBuySecurity('station', 25000)}
                      disabled={playerMoney < 25000}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        playerMoney >= 25000
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      R$ 25.000
                    </button>
                  </div>
                </div>

                {/* Viaturas de Ronda */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-900/40 text-cyan-400 text-xl border border-cyan-700/50">
                      🚓
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">Viaturas de Patrulhamento</h5>
                      <p className="text-xs text-slate-400">Frota: <b className="text-white">{city.security.patrolCars}</b> viaturas ativas</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-emerald-400 font-semibold">+4% Segurança por viatura</span>
                    <button
                      onClick={() => handleBuySecurity('patrol', 15000)}
                      disabled={playerMoney < 15000}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        playerMoney >= 15000
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      R$ 15.000
                    </button>
                  </div>
                </div>

                {/* Câmeras e Radares Inteligentes */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-900/40 text-purple-400 text-xl border border-purple-700/50">
                      📹
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">Muralha Digital & Câmeras OCR</h5>
                      <p className="text-xs text-slate-400">Instaladas: <b className="text-white">{city.security.cameras}</b> pontos</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-emerald-400 font-semibold">+3% Fluidez & Segurança</span>
                    <button
                      onClick={() => handleBuySecurity('camera', 10000)}
                      disabled={playerMoney < 10000}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        playerMoney >= 10000
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      R$ 10.000
                    </button>
                  </div>
                </div>

                {/* Posto Integrado PRF */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-900/40 text-amber-400 text-xl border border-amber-700/50">
                      🛡️
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">Posto da Polícia Rodoviária Federal (PRF)</h5>
                      <p className="text-xs text-slate-400">Bases: <b className="text-white">{city.security.prfBases}</b> postos de fiscalização</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-emerald-400 font-semibold">+10% Proteção nas Rodovias</span>
                    <button
                      onClick={() => handleBuySecurity('prf', 35000)}
                      disabled={playerMoney < 35000}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        playerMoney >= 35000
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      R$ 35.000
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'geral' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <h4 className="font-bold text-sm text-white mb-1">Sobre {city.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{city.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">População</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {city.population.toLocaleString('pt-BR')} hab.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Arrecadação / Hora</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                    R$ {city.taxRevenuePerHour.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Região</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">
                    {city.region}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Status</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    {city.dominated ? '👑 Dominada' : `${Math.round(city.influence)}% Conquistada`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
