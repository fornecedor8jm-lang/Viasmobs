import React from 'react';
import { X, BookOpen, Compass, Hammer, ShieldCheck, Zap, Trophy, Flame } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[550] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner">
              📖
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Manual do Jogo — Brasil Vias</h2>
              <p className="text-xs text-slate-400">Guia de infraestrutura, gestão rodoviária e expansão nacional.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 font-display flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" /> 1. O Conceito & Ponto de Partida no Amapá
            </h3>
            <p>
              O mapa não é apenas cenário — ele é a mecânica do jogo! Você inicia no estado do <b>Amapá</b> (Macapá, Santana, Porto Grande, Oiapoque, Laranjal do Jari). Sua missão é pavimentar estradas, conectar municípios, otimizar viagens e dominar bairros até unificar a infraestrutura do Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-amber-400" /> 2. Asfaltamento & Obras
              </h4>
              <p>
                Clique nas rodovias no mapa para asfaltar pistas de terra (CBUQ), recuperar buracos, duplicar vias e transformar em Vias Expressas Inteligentes. Estradas melhores aumentam a velocidade máxima e reduzem o tempo de viagem.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-yellow-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" /> 3. Sistema de Atalhos
              </h4>
              <p>
                Construa contornos viários, viadutos e pontes para criar atalhos diretos. Um atalho reduz entre <b>30% a 55%</b> do tempo de percurso dos veículos, acelerando a economia.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" /> 4. Domínio dos Bairros (0% ➔ 100%)
              </h4>
              <p>
                Abra as cidades para investir em bairros (Centro, Zonas Norte/Sul, Distritos Industriais). Ao atingir 100% de influência, o bairro é <b>DOMINADO</b> e gera arrecadação máxima de impostos e bônus contínuos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-blue-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> 5. Segurança & Policiamento
              </h4>
              <p>
                Instale Delegacias, viaturas de ronda, câmeras inteligentes OCR e postos da PRF para elevar o índice de segurança das cidades, destravando novos investimentos comerciais.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-slate-950 border border-red-800/60 space-y-2">
            <h4 className="font-bold text-xs text-red-300 flex items-center gap-1.5 font-display">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" /> 6. O Grande Chefão — Transamazônica (BR-230)
            </h4>
            <p>
              A Transamazônica possui uma barra de vida (100% ➔ 0%). Supere atoleiros, chuvas amazônicas, substitua pontes de madeira e pavimente os 6 setores para conquistar o título de <b>Mestre Nacional de Infraestrutura</b>!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
