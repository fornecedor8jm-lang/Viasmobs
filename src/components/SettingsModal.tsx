// Viasmobs — Modal de Configurações, Salvamento e Acessibilidade

import React, { useState } from 'react';
import { X, Save, RotateCcw, Download, Upload, Volume2, VolumeX, Eye, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { isSoundEnabled, toggleSound } from '../utils/audio';

interface SettingsModalProps {
  onClose: () => void;
  onResetGame: () => void;
  onExportSave: () => void;
  onImportSave: (jsonStr: string) => void;
  onManualSave: () => void;
  onReturnToStartScreen: () => void;
  hasSavedGame: boolean;
  onContinueGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onResetGame,
  onExportSave,
  onImportSave,
  onManualSave,
  onReturnToStartScreen,
  hasSavedGame,
  onContinueGame
}) => {
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [importInput, setImportInput] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleSave = () => {
    onManualSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleImport = () => {
    if (!importInput.trim()) return;
    try {
      onImportSave(importInput.trim());
      onClose();
    } catch {
      alert('Arquivo de save inválido. Verifique o formato JSON.');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-slate-700 shadow-2xl p-6 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">Configurações</h2>
              <p className="text-xs text-indigo-300 font-semibold">Áudio, progresso e jogo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4 text-xs">
          
          {/* Som & Áudio */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundOn ? <Volume2 size={18} className="text-emerald-400" /> : <VolumeX size={18} className="text-slate-500" />}
              <div>
                <b className="text-white text-xs">Efeitos Sonoros</b>
                <p className="text-[10px] text-slate-400">Sons de pavimentação, moedas e buzinas</p>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                soundOn ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {soundOn ? 'Ativado' : 'Mudo'}
            </button>
          </div>

          {/* Jogo */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/25 border border-indigo-500/30 space-y-3">
            <div>
              <b className="text-indigo-200 text-xs">Jogo</b>
              <p className="text-[10px] text-slate-400">Volte ao menu sem perder sua campanha ou comece outra partida.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { onContinueGame(); onClose(); }} className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-45" disabled={!hasSavedGame}>
                Continuar
              </button>
              <button onClick={onReturnToStartScreen} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 font-bold text-xs">
                Menu Inicial
              </button>
              <button onClick={() => setConfirmReset(true)} className="col-span-2 p-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 border border-rose-700/60 text-rose-200 font-bold text-xs">
                Novo Jogo
              </button>
            </div>
            {confirmReset && (
              <div className="space-y-2 rounded-xl bg-rose-950/35 border border-rose-700/50 p-2.5 text-center">
                <p className="text-rose-200 font-bold text-xs">Começar uma campanha nova? O save atual será substituído.</p>
                <div className="flex justify-center gap-2">
                  <button onClick={() => setConfirmReset(false)} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">Cancelar</button>
                  <button onClick={() => { onResetGame(); onClose(); }} className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs">Confirmar Novo Jogo</button>
                </div>
              </div>
            )}
          </div>

          {/* Salvamento Local */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <b className="text-white text-xs">Progresso da Campanha</b>
                <p className="text-[10px] text-slate-400">Salvo automaticamente a cada mudança</p>
              </div>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Save size={14} />
                <span>Salvar Agora</span>
              </button>
            </div>
            {saveSuccess && (
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-[11px] flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={14} />
                <span>Progresso salvo no navegador com sucesso!</span>
              </div>
            )}
          </div>

          {/* Exportar & Importar Save */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExportSave}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex flex-col items-center justify-center gap-1 text-center transition"
            >
              <Download size={16} className="text-sky-400" />
              <b className="text-white">Exportar Save</b>
              <span className="text-[10px] text-slate-400">Baixar backup em JSON</span>
            </button>

            <button
              onClick={() => setShowImport(val => !val)}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex flex-col items-center justify-center gap-1 text-center transition"
            >
              <Upload size={16} className="text-amber-400" />
              <b className="text-white">Importar Save</b>
              <span className="text-[10px] text-slate-400">Restaurar de arquivo</span>
            </button>
          </div>

          {showImport && (
            <div className="p-3 rounded-2xl bg-slate-800 border border-amber-500/40 space-y-2 animate-in fade-in">
              <textarea
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Cole o código JSON do seu save aqui..."
                className="w-full h-20 p-2 text-xs font-mono rounded-xl bg-slate-950 text-slate-200 border border-slate-700 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleImport}
                disabled={!importInput.trim()}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-40"
              >
                Carregar Progresso
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
