// Viasmobs — Modal de Conclusão e Feedback Completo de Obra

import React from 'react';
import { X, CheckCircle2, ArrowRight, Gauge, Clock, TrendingUp, Sparkles, Hammer } from 'lucide-react';
import { Road } from '../types/game';

export interface WorkFeedbackData {
  roadName: string;
  actionType: 'paved' | 'repaired' | 'duplicated' | 'express' | 'toll';
  conditionBefore: number;
  conditionAfter: number;
  speedBefore: number;
  speedAfter: number;
  timeSavedMinutes: number;
  newRevenueBonus: string;
}

interface WorkFeedbackModalProps {
  data: WorkFeedbackData | null;
  onClose: () => void;
}

export const WorkFeedbackModal: React.FC<WorkFeedbackModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/60 shadow-2xl p-6 text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Confetti / Celebration Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-xl shadow-emerald-500/30 mb-3 animate-bounce">
            🎉
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
            OBRA CONCLUÍDA COM SUCESSO!
          </span>
          <h2 className="text-xl font-black font-display text-white mt-1">
            {data.roadName}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs">
            A infraestrutura viária foi atualizada. Os veículos trafegam com mais velocidade e geram mais receita!
          </p>
        </div>

        {/* Before / After Comparison Grid */}
        <div className="mt-5 space-y-3 text-xs">
          
          {/* Condição do Asfalto */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 font-bold mb-1.5">
              <span className="flex items-center gap-1.5">
                <Hammer size={14} className="text-amber-400" /> Condição Estrutural da Via
              </span>
              <span className="text-emerald-400 font-mono font-black text-xs">
                +{Math.round(data.conditionAfter - data.conditionBefore)}%
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">{Math.round(data.conditionBefore)}%</span>
              <ArrowRight size={14} className="text-emerald-400" />
              <span className="text-emerald-300 font-bold text-sm">{Math.round(data.conditionAfter)}% (100% Liso)</span>
            </div>
          </div>

          {/* Velocidade Máxima */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 font-bold mb-1.5">
              <span className="flex items-center gap-1.5">
                <Gauge size={14} className="text-sky-400" /> Velocidade Máxima Permitida
              </span>
              <span className="text-sky-400 font-mono font-black text-xs">
                +{data.speedAfter - data.speedBefore} km/h
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">{data.speedBefore} km/h</span>
              <ArrowRight size={14} className="text-sky-400" />
              <span className="text-sky-300 font-bold text-sm">{data.speedAfter} km/h</span>
            </div>
          </div>

          {/* Economia de Tempo & Nova Renda */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="flex items-center gap-1 text-emerald-400 font-bold mb-1">
                <Clock size={14} />
                <span>Tempo Poupado</span>
              </div>
              <div className="text-sm font-black font-mono text-emerald-300">
                -{data.timeSavedMinutes} min
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">por viagem na rota</div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30">
              <div className="flex items-center gap-1 text-amber-400 font-bold mb-1">
                <TrendingUp size={14} />
                <span>Nova Receita</span>
              </div>
              <div className="text-sm font-black font-mono text-amber-300">
                {data.newRevenueBonus}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">fretes & pedágios</div>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-black text-xs font-display shadow-lg shadow-emerald-500/25 transition active:scale-95"
          >
            Continuar Gerenciando Rodovias
          </button>
        </div>

      </div>
    </div>
  );
};
