// Viasmobs — Legenda do Mapa e Símbolos Visuais de Mobilidade

import React from 'react';
import { X, Layers, Route, Shield, Navigation, CloudRain, Trophy, MapPin, Hammer, AlertTriangle } from 'lucide-react';

interface MapLegendModalProps {
  onClose: () => void;
}

export const MapLegendModal: React.FC<MapLegendModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-amber-500/40 shadow-2xl p-6 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow">
              🗺️
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">Legenda do Mapa</h2>
              <p className="text-xs text-amber-400 font-semibold">Identificação rápida das rodovias, cidades e tráfego</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Legend Content */}
        <div className="mt-5 space-y-6 text-xs">
          
          {/* Rodovias */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Route size={14} className="text-amber-400" />
              Tipos de Rodovias & Pavimentação
            </h3>
            <div className="grid gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-2 rounded bg-amber-500 border border-dashed border-amber-300"></div>
                  <div>
                    <b className="text-amber-300">Linha Laranja Tracejada</b>
                    <p className="text-[11px] text-slate-400">Estrada de Terra / Não Pavimentada (Max 45 km/h, risco de atoleiro na chuva)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">Lenta</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-sky-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-2 rounded bg-sky-400"></div>
                  <div>
                    <b className="text-sky-300">Linha Azul / Ciano</b>
                    <p className="text-[11px] text-slate-400">Asfalto CBUQ Simples ou Duplicado (80–100 km/h, tráfego fluido)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[10px]">Padrão</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-2.5 rounded bg-emerald-500 shadow-sm shadow-emerald-400"></div>
                  <div>
                    <b className="text-emerald-300">Linha Verde Esmeralda / Rota Ativa</b>
                    <p className="text-[11px] text-slate-400">Via Expressa Inteligente ou Rota com Viagem em Andamento (120 km/h)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">Expressa</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-rose-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-2 rounded bg-rose-500"></div>
                  <div>
                    <b className="text-rose-400">BR-230 Transamazônica (Setor Desafio)</b>
                    <p className="text-[11px] text-slate-400">Trecho crítico com lama, pontes precárias e desafios de engenharia</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">Chefão</span>
              </div>
            </div>
          </div>

          {/* Cidades e Marcadores */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <MapPin size={14} className="text-amber-400" />
              Pins & Status de Cidades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                <span className="text-base">🚩</span>
                <div>
                  <b className="text-emerald-400">Cidade Sede (Macapá)</b>
                  <p className="text-[10px] text-slate-400">Ponto de partida da malha</p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                <span className="text-base">📍</span>
                <div>
                  <b className="text-blue-400">Cidade Desbloqueada</b>
                  <p className="text-[10px] text-slate-400">Gera impostos urbanos</p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                <span className="text-base">👑</span>
                <div>
                  <b className="text-amber-400">Cidade Dominada (100%)</b>
                  <p className="text-[10px] text-slate-400">Bônus máximo de receita</p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                <span className="text-base">🔒</span>
                <div>
                  <b className="text-slate-400">Cidade Bloqueada</b>
                  <p className="text-[10px] text-slate-400">Requer desbloqueio regional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Veículos */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Navigation size={14} className="text-amber-400" />
              Tráfego & Frotas em Tempo Real
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-amber-500/20">
                <div className="text-xl mb-1">🚛</div>
                <b className="text-amber-300 text-[11px]">Caminhão Carga</b>
                <p className="text-[9px] text-slate-400 mt-0.5">Paga frete de mercadorias</p>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-indigo-500/20">
                <div className="text-xl mb-1">🚌</div>
                <b className="text-indigo-300 text-[11px]">Ônibus Viagem</b>
                <p className="text-[9px] text-slate-400 mt-0.5">Transporte de passageiros</p>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-blue-500/20">
                <div className="text-xl mb-1">🚗</div>
                <b className="text-blue-300 text-[11px]">Carro Particular</b>
                <p className="text-[9px] text-slate-400 mt-0.5">Paga pedágio por viagem</p>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-cyan-500/20">
                <div className="text-xl mb-1">🚓</div>
                <b className="text-cyan-300 text-[11px]">Viatura PRF</b>
                <p className="text-[9px] text-slate-400 mt-0.5">Segurança & escolta</p>
              </div>
            </div>
          </div>

          {/* Clima e Impacto */}
          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-start gap-3">
            <CloudRain size={20} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <b className="text-cyan-300">Efeito de Clima & Chuva Tropical</b>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Durante temporais na Amazônia, estradas de terra perdem <b>-40% de velocidade</b> por lamaçal. Asfalte com CBUQ para manter velocidade máxima constante o ano todo!
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
          >
            Entendido, Voltar ao Jogo
          </button>
        </div>

      </div>
    </div>
  );
};
