import React, { useState } from 'react';
import { City, Road, ActiveTrip } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  calculateGoogleMapsMetrics, 
  findRouteBetweenCities, 
  RouteCalculationResult 
} from '../utils/routeMetrics';
import { 
  ArrowLeft, 
  ArrowUpDown, 
  Car, 
  Truck, 
  Bus, 
  Bike, 
  Play, 
  Hammer, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp,
  MapPin,
  X
} from 'lucide-react';

interface GoogleMapsDirectionsProps {
  cities: City[];
  roads: Road[];
  pointA: City | null;
  pointB: City | null;
  activeTrip: ActiveTrip | null;
  playerMoney: number;
  onSelectPointA: (city: City) => void;
  onSelectPointB: (city: City) => void;
  onSwapPoints: () => void;
  onStartTrip: (origin: City, dest: City, pathRoads: Road[], totalKm: number, durationSec: number, reward: number) => void;
  onPaveRoad: (roadId: string, cost: number) => void;
  onClose: () => void;
}

export const GoogleMapsDirections: React.FC<GoogleMapsDirectionsProps> = ({
  cities,
  roads,
  pointA,
  pointB,
  activeTrip,
  playerMoney,
  onSelectPointA,
  onSelectPointB,
  onSwapPoints,
  onStartTrip,
  onPaveRoad,
  onClose
}) => {
  const [vehicleType, setVehicleType] = useState<'carro' | 'caminhao' | 'onibus' | 'moto'>('carro');

  // Compute Route
  const routeRoads = pointA && pointB && pointA.id !== pointB.id 
    ? findRouteBetweenCities(pointA, pointB, roads) 
    : [];

  const metrics: RouteCalculationResult = calculateGoogleMapsMetrics(routeRoads, vehicleType);

  // Find dirt road on this route if any
  const firstDirtRoad = routeRoads.find(r => r.type === 'terra');
  const dirtPaveCost = firstDirtRoad ? Math.round(firstDirtRoad.realKm * 250) : 0;

  const handleStart = () => {
    if (!pointA || !pointB || routeRoads.length === 0 || !!activeTrip) return;
    playSound.travelStart();
    onStartTrip(
      pointA, 
      pointB, 
      routeRoads, 
      metrics.totalKm, 
      metrics.gameDurationSeconds, 
      metrics.cargoRewardMoney
    );
  };

  const handlePaveInline = (road: Road) => {
    const cost = Math.round(road.realKm * 250);
    if (playerMoney < cost) return;
    playSound.pave();
    onPaveRoad(road.id, cost);
  };

  return (
    <div className="absolute top-3 left-3 right-3 sm:left-4 sm:w-[420px] max-h-[92vh] z-[520] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-3 duration-200">
      
      {/* Google Maps Directions Top Bar */}
      <div className="p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold font-display">Como Chegar & Rotas</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Origin & Destination Inputs with Swap button */}
        <div className="flex items-center gap-2">
          {/* Inputs Column */}
          <div className="flex-1 space-y-2">
            {/* Ponto A (Origem) */}
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
              <select
                value={pointA?.id || ''}
                onChange={(e) => {
                  const city = cities.find(c => c.id === e.target.value);
                  if (city) onSelectPointA(city);
                }}
                className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="" className="text-slate-900">Selecione ponto de partida (A)...</option>
                {cities.filter(c => c.unlocked).map(c => (
                  <option key={c.id} value={c.id} className="text-slate-900">
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Ponto B (Destino) */}
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0"></span>
              <select
                value={pointB?.id || ''}
                onChange={(e) => {
                  const city = cities.find(c => c.id === e.target.value);
                  if (city) onSelectPointB(city);
                }}
                className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="" className="text-slate-900">Selecione o destino (B)...</option>
                {cities.filter(c => c.unlocked && c.id !== pointA?.id).map(c => (
                  <option key={c.id} value={c.id} className="text-slate-900">
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button (⇅) & Auto Suggest */}
          <div className="flex items-center gap-1">
            <button
              onClick={onSwapPoints}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95 shadow-sm"
              title="Inverter Origem e Destino"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                // Find pair of unlocked cities with highest freight or shortest distance
                const unlocked = cities.filter(c => c.unlocked);
                if (unlocked.length >= 2) {
                  const orig = unlocked[0];
                  const dest = unlocked[1];
                  onSelectPointA(orig);
                  onSelectPointB(dest);
                  playSound.click();
                }
              }}
              className="px-2.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow transition"
              title="Sugerir rota ideal"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden sm:inline">Melhor Rota</span>
            </button>
          </div>
        </div>

        {/* Transport Modes Tabs */}
        <div className="flex items-center justify-around pt-1 border-t border-white/15">
          <button
            onClick={() => setVehicleType('carro')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
              vehicleType === 'carro' ? 'bg-white text-blue-700 shadow-md font-bold' : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Carro</span>
          </button>

          <button
            onClick={() => setVehicleType('caminhao')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
              vehicleType === 'caminhao' ? 'bg-white text-blue-700 shadow-md font-bold' : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Caminhão</span>
          </button>

          <button
            onClick={() => setVehicleType('onibus')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
              vehicleType === 'onibus' ? 'bg-white text-blue-700 shadow-md font-bold' : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Ônibus</span>
          </button>

          <button
            onClick={() => setVehicleType('moto')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
              vehicleType === 'moto' ? 'bg-white text-blue-700 shadow-md font-bold' : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Rápido</span>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
        
        {/* If route found */}
        {pointA && pointB && routeRoads.length > 0 ? (
          <>
              {/* Resumo de tempo e rota */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                    {metrics.formattedRealTime}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    ({metrics.totalKm} km)
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  metrics.trafficStatus === 'Livre' 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                    : metrics.trafficStatus === 'Moderado'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                }`}>
                  {metrics.trafficStatus === 'Livre' ? '🟢 Trânsito Livre' : metrics.trafficStatus === 'Moderado' ? '🟡 Trânsito Moderado' : '🔴 Trânsito Lento'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Via {routeRoads.map(r => r.name).join(' &bull; ')}. Rota calculada pela central Viasmobs.
              </p>

              {/* Game Scaled Time & Cargo Reward Strip */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Simulador: <b>{metrics.gameDurationSeconds} segundos</b></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Frete: +R$ {metrics.cargoRewardMoney.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Ação direta para melhorar a via antes da viagem */}
            {metrics.hasDirtSections && firstDirtRoad && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-600/70 space-y-2.5 shadow-md">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🪵</span>
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                      Trecho de Terra Detectado ({firstDirtRoad.name})
                    </h4>
                    <p className="text-[11px] text-amber-800 dark:text-amber-200 mt-0.5">
                      Pista não pavimentada atrasa esta rota em <b>+{metrics.timeLostOnDirtMinutes} minutos</b> e causa risco de atoleiro.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-amber-200 dark:border-amber-800/80">
                  <span className="text-[11px] font-mono text-amber-900 dark:text-amber-300">
                    Custo CBUQ: <b>R$ {dirtPaveCost.toLocaleString('pt-BR')}</b>
                  </span>

                  <button
                    onClick={() => handlePaveInline(firstDirtRoad)}
                    disabled={playerMoney < dirtPaveCost}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition ${
                      playerMoney >= dirtPaveCost
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    <span>Asfaltar Rodovia Agora</span>
                  </button>
                </div>
              </div>
            )}

            {/* Turn-by-Turn Leg Steps Preview */}
            <div className="space-y-1.5">
              <h5 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                Passo a passo do trajeto ({routeRoads.length} trecho{routeRoads.length > 1 ? 's' : ''})
              </h5>
              <div className="space-y-1">
                {routeRoads.map((road, i) => (
                  <div key={road.id} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{road.name}</span>
                        <span className="text-slate-400 text-[10px] ml-1.5">
                          ({road.type === 'terra' ? '🪵 Terra' : '🛣️ Asfalto'} &bull; Máx {road.maxSpeedKmH} km/h)
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-slate-500">{road.realKm} km</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ação principal para iniciar a viagem */}
            <button
              id="btn-start-google-nav"
              onClick={handleStart}
              disabled={!!activeTrip}
              className={`w-full py-3.5 rounded-2xl font-bold font-display text-sm flex items-center justify-center gap-2 text-white shadow-xl transition active:scale-[0.98] ${
                activeTrip
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 cursor-pointer shadow-emerald-500/25'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{activeTrip ? 'Navegação em Andamento...' : 'Iniciar Navegação em Tempo Real'}</span>
            </button>
          </>
        ) : pointA && pointB ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
            <p>
              Nenhuma rodovia conectada encontrada entre <b>{pointA.name}</b> e <b>{pointB.name}</b>. Desbloqueie cidades intermediárias para completar o trajeto!
            </p>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <MapPin className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
            <p className="text-xs">Selecione uma cidade de origem e uma de destino para calcular a métrica de viagem do Google Maps.</p>
          </div>
        )}
      </div>
    </div>
  );
};
