import React, { useState } from 'react';
import { City, Neighborhood } from '../types/game';
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
  Star,
  Users,
  Compass
} from 'lucide-react';

interface GoogleMapsCitySheetProps {
  city: City;
  playerMoney: number;
  onClose: () => void;
  onSetPointA: (city: City) => void;
  onSetPointB: (city: City) => void;
  onUpgradeNeighborhood: (cityId: string, neighborhoodId: string, cost: number) => void;
  onUpgradeSecurity: (cityId: string, upgradeType: 'station' | 'patrol' | 'camera' | 'prf', cost: number) => void;
  initialTab?: 'overview' | 'neighborhoods' | 'security';
}

export const GoogleMapsCitySheet: React.FC<GoogleMapsCitySheetProps> = ({
  city,
  playerMoney,
  onClose,
  onSetPointA,
  onSetPointB,
  onUpgradeNeighborhood,
  onUpgradeSecurity,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'neighborhoods' | 'security'>(initialTab);

  const neighborhoodUpgradeCost = 15000;
  const securityUpgradeCost = 25000;

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
              <div className="flex items-center text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span className="font-bold ml-0.5">4.9</span>
              </div>
              <span>&bull;</span>
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
      <div className="flex items-center justify-around border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold">
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
          className={`py-2.5 flex-1 text-center transition border-b-2 ${
            activeTab === 'security' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500'
          }`}
        >
          Segurança ({city.security.score}%)
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 overflow-y-auto space-y-3 text-xs">
        
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              "{city.description}"
            </p>

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
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Imposto / Hora</span>
                </div>
                <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                  +R$ {city.taxRevenuePerHour.toLocaleString('pt-BR')}/h
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
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1">
              <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                Bairros Estratégicos
              </span>
              <span className="text-[10px] text-slate-400">
                Custo: R$ {neighborhoodUpgradeCost.toLocaleString('pt-BR')}
              </span>
            </div>

            {city.neighborhoods.map(nb => (
              <div
                key={nb.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{nb.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                      {nb.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>Infra: <b>{nb.indicators.infrastructure}%</b></span>
                    <span>Influência: <b>{nb.influencePercent}%</b></span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (playerMoney >= neighborhoodUpgradeCost && nb.influencePercent < 100) {
                      playSound.coin();
                      onUpgradeNeighborhood(city.id, nb.id, neighborhoodUpgradeCost);
                    }
                  }}
                  disabled={playerMoney < neighborhoodUpgradeCost || nb.influencePercent >= 100}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow transition ${
                    nb.influencePercent >= 100
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : playerMoney >= neighborhoodUpgradeCost
                      ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {nb.influencePercent >= 100 ? '✅ 100%' : 'Desenvolver'}
                </button>
              </div>
            ))}
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
      </div>
    </div>
  );
};
