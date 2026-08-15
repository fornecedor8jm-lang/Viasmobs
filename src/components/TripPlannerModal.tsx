import React, { useState } from 'react';
import { City, Road, ActiveTrip } from '../types/game';
import { playSound } from '../utils/audio';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Car, 
  Truck, 
  Bus, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Play, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface TripPlannerModalProps {
  cities: City[];
  roads: Road[];
  pointA: City | null;
  pointB: City | null;
  activeTrip: ActiveTrip | null;
  onSelectPointA: (city: City) => void;
  onSelectPointB: (city: City) => void;
  onStartTrip: (origin: City, dest: City, pathRoads: Road[], totalKm: number, durationSec: number, reward: number) => void;
  onClose: () => void;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  cities,
  roads,
  pointA,
  pointB,
  activeTrip,
  onSelectPointA,
  onSelectPointB,
  onStartTrip,
  onClose
}) => {
  const [vehicleType, setVehicleType] = useState<'carro' | 'caminhao' | 'onibus'>('caminhao');

  // Simple Graph BFS to find route between A and B
  const findRoute = (startCity: City, endCity: City): Road[] => {
    const queue: { cityId: string; path: Road[] }[] = [{ cityId: startCity.id, path: [] }];
    const visited = new Set<string>([startCity.id]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.cityId === endCity.id) {
        return current.path;
      }

      // Find connecting roads
      const adjacentRoads = roads.filter(
        r => r.fromCityId === current.cityId || r.toCityId === current.cityId
      );

      for (const road of adjacentRoads) {
        const nextCityId = road.fromCityId === current.cityId ? road.toCityId : road.fromCityId;
        if (!visited.has(nextCityId)) {
          visited.add(nextCityId);
          queue.push({
            cityId: nextCityId,
            path: [...current.path, road]
          });
        }
      }
    }

    return [];
  };

  const calculatedRoads = pointA && pointB && pointA.id !== pointB.id ? findRoute(pointA, pointB) : [];
  
  const totalKm = calculatedRoads.reduce((acc, r) => acc + r.realKm, 0);

  // Scaled time calculation (e.g. 500 km = ~6h real time = ~18 seconds in scaled simulation)
  // Adjusted by road condition, traffic, shortcuts
  const baseSpeedAvg = calculatedRoads.length > 0 
    ? calculatedRoads.reduce((acc, r) => acc + r.maxSpeedKmH * (r.condition / 100), 0) / calculatedRoads.length
    : 60;

  const trafficMultiplier = calculatedRoads.some(r => r.trafficLevel === 'Congestionado')
    ? 1.5
    : calculatedRoads.some(r => r.trafficLevel === 'Intenso')
    ? 1.25
    : calculatedRoads.some(r => r.trafficLevel === 'Moderado')
    ? 1.1
    : 1.0;

  // Real estimated hours
  const realHours = totalKm > 0 ? (totalKm / Math.max(20, baseSpeedAvg)) * trafficMultiplier : 0;
  // Scaled seconds for the game (1 real hour ≈ 3.5 game seconds)
  const gameDurationSec = Math.max(8, Math.round(realHours * 3.5));

  // Economic reward for completing trip
  const cargoReward = Math.round(totalKm * 45 + (vehicleType === 'caminhao' ? 5000 : vehicleType === 'onibus' ? 3500 : 2000));

  const handleStart = () => {
    if (!pointA || !pointB || calculatedRoads.length === 0) return;
    playSound.travelStart();
    onStartTrip(pointA, pointB, calculatedRoads, totalKm, gameDurationSec, cargoReward);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner">
              🧭
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Planejador de Rotas & Viagens</h2>
              <p className="text-xs text-slate-400">Escolha Origem (Ponto A) e Destino (Ponto B) para despachar veículos.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Origin / Dest Selector */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Ponto A */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/40 space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🅰️</span> Ponto A (Origem)
              </label>
              <select
                id="select-point-a"
                value={pointA?.id || ''}
                onChange={(e) => {
                  const city = cities.find(c => c.id === e.target.value);
                  if (city) onSelectPointA(city);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Selecione a cidade de partida...</option>
                {cities.filter(c => c.unlocked).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state}) - {c.region}
                  </option>
                ))}
              </select>
            </div>

            {/* Ponto B */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/40 space-y-2">
              <label className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🅱️</span> Ponto B (Destino)
              </label>
              <select
                id="select-point-b"
                value={pointB?.id || ''}
                onChange={(e) => {
                  const city = cities.find(c => c.id === e.target.value);
                  if (city) onSelectPointB(city);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-rose-500"
              >
                <option value="">Selecione o destino da rota...</option>
                {cities.filter(c => c.unlocked && c.id !== pointA?.id).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state}) - {c.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Selecione o Tipo de Frota / Transporte
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setVehicleType('caminhao')}
                className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${
                  vehicleType === 'caminhao'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl">🚛</span>
                <span className="text-xs font-bold">Caminhão Bitrem</span>
                <span className="text-[10px] text-emerald-400 font-mono">+Alta Rentabilidade</span>
              </button>

              <button
                onClick={() => setVehicleType('onibus')}
                className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${
                  vehicleType === 'onibus'
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl">🚌</span>
                <span className="text-xs font-bold">Ônibus Interestadual</span>
                <span className="text-[10px] text-cyan-400 font-mono">+Integração Urbana</span>
              </button>

              <button
                onClick={() => setVehicleType('carro')}
                className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${
                  vehicleType === 'carro'
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl">🚗</span>
                <span className="text-xs font-bold">Veículo Rápido</span>
                <span className="text-[10px] text-yellow-400 font-mono">+Menor Tempo</span>
              </button>
            </div>
          </div>

          {/* Route Calculation Result */}
          {pointA && pointB && calculatedRoads.length > 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-cyan-300">
                    {pointA.name} ➔ {pointB.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {calculatedRoads.length} trecho(s)
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400">Distância Real: </span>
                  <b className="text-white text-sm">{totalKm} km</b>
                </div>
              </div>

              {/* Scaled Time vs Real Time comparison */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Tempo Real Est.</div>
                  <div className="font-bold text-amber-300 mt-1">{realHours.toFixed(1)} Horas</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Tempo no Jogo</div>
                  <div className="font-bold text-emerald-400 mt-1">⏱️ {gameDurationSec} Segundos</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Recompensa Frete</div>
                  <div className="font-bold text-emerald-300 font-mono mt-1">
                    R$ {cargoReward.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* Legs list */}
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {calculatedRoads.map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-900/60 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-mono">{i + 1}.</span>
                      <span className="font-medium text-slate-200">{r.name}</span>
                    </span>
                    <span className="font-mono text-slate-400">
                      {r.realKm} km &bull; {r.type} &bull; {r.trafficLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : pointA && pointB ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Nenhuma rota conectada diretamente encontrada entre {pointA.name} e {pointB.name}. Conecte mais cidades intermediárias para desbloquear o trajeto!
              </span>
            </div>
          ) : null}

          {/* Start button */}
          <button
            id="btn-dispatch-trip"
            onClick={handleStart}
            disabled={!pointA || !pointB || calculatedRoads.length === 0 || !!activeTrip}
            className={`w-full py-3.5 rounded-xl font-bold font-display text-sm flex items-center justify-center gap-2 transition shadow-xl ${
              !pointA || !pointB || calculatedRoads.length === 0 || !!activeTrip
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white cursor-pointer'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>
              {activeTrip ? 'Viagem em Andamento no Momento...' : 'Iniciar Viagem & Despachar Frota'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
