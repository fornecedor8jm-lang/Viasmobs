// Viasmobs — Card Resumido de Cidade (Quick Inspect / Ficha Rápida)

import React from 'react';
import { X, Navigation, Building2, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { City, Road } from '../types/game';

interface QuickCityInspectProps {
  city: City;
  roads: Road[];
  onOpenFullSheet: (city: City) => void;
  onSetPointA: (city: City) => void;
  onSetPointB: (city: City) => void;
  onClose: () => void;
}

export const QuickCityInspect: React.FC<QuickCityInspectProps> = ({
  city,
  roads,
  onOpenFullSheet,
  onSetPointA,
  onSetPointB,
  onClose
}) => {
  const dominatedNbCount = city.neighborhoods.filter(n => n.influencePercent >= 100).length;
  const isFullyDominated = city.dominated || dominatedNbCount === city.neighborhoods.length;

  // Find dirt road connected to this city
  const connectedRoads = roads.filter(r => r.fromCityId === city.id || r.toCityId === city.id);
  const dirtRoad = connectedRoads.find(r => r.type === 'terra');

  let mainBottleneck = 'Fluxo normal de veículos.';
  if (dirtRoad) {
    mainBottleneck = `Trecho de terra na ${dirtRoad.name} limita velocidade.`;
  } else if (city.security.score < 50) {
    mainBottleneck = 'Índice de segurança baixo requer mais policiamento.';
  } else if (city.influence < 60) {
    mainBottleneck = 'Bairros periféricos precisam de desenvolvimento.';
  }

  return (
    <div className="absolute top-20 right-3 sm:right-4 z-[495] w-72 rounded-3xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl p-4 text-slate-100 animate-in fade-in slide-in-from-right-3 duration-200">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">📍</span>
            <h3 className="text-sm font-black font-display text-white">{city.name}</h3>
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-amber-400 font-mono font-bold">
              {city.state}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{city.landmark}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="mt-3 space-y-2 text-xs">
        
        {/* Influence & Domination */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div>
            <span className="text-[10px] text-slate-400">Domínio / Bairros</span>
            <div className="font-bold text-white text-[11px]">
              {Math.round(city.influence)}% ({dominatedNbCount}/{city.neighborhoods.length} dominados)
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isFullyDominated ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
          }`}>
            {isFullyDominated ? '👑 100%' : 'Em Expansão'}
          </span>
        </div>

        {/* Revenue */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <DollarSign size={13} />
            <span className="text-[10px] text-slate-300">Arrecadação:</span>
          </div>
          <span className="font-mono font-bold text-emerald-400 text-xs">
            +R$ {city.taxRevenuePerHour.toLocaleString('pt-BR')}/h
          </span>
        </div>

        {/* Bottleneck note */}
        <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[10px] text-amber-300 flex items-start gap-1.5">
          <AlertTriangle size={12} className="shrink-0 mt-0.5 text-amber-400" />
          <span><b>Diagnóstico:</b> {mainBottleneck}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-1.5">
          <button
            onClick={() => onOpenFullSheet(city)}
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition"
          >
            <Building2 size={13} />
            <span>Gerenciar Bairros & Segurança</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSetPointA(city)}
              className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px] text-center"
            >
              🅰️ Definir Origem
            </button>
            <button
              onClick={() => onSetPointB(city)}
              className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px] text-center"
            >
              🅱️ Definir Destino
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
