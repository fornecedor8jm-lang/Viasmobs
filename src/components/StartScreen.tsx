/** Design Viasmobs: painel tático escuro, acento âmbar e foco total nas duas ações de entrada. */
import { CircleDollarSign, Play, Route, Save } from 'lucide-react';

interface StartScreenProps {
  hasSavedGame: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

export function StartScreen({ hasSavedGame, onNewGame, onContinue }: StartScreenProps) {
  return (
    <section className="start-screen" aria-label="Tela inicial do Viasmobs">
      <div className="start-screen__panel">
        <div className="start-screen__brand">
          <span className="start-screen__mark"><Route size={28} strokeWidth={2.7} /></span>
          <div>
            <p>VIAS DE MOBILIDADE</p>
            <h1>VIASMOBS</h1>
          </div>
        </div>

        <div className="start-screen__intro">
          <span><CircleDollarSign size={15} /> CAMPANHA DO NORTE</span>
          <h2>Planeje rotas. Conecte cidades. Transforme a mobilidade.</h2>
          <p>O jogo salva o progresso automaticamente neste aparelho.</p>
        </div>

        <div className="start-screen__actions">
          <button type="button" className="start-screen__new-game" onClick={onNewGame}>
            <Play size={18} fill="currentColor" />
            <span><strong>Novo Jogo</strong><small>Começar uma nova campanha</small></span>
          </button>
          <button
            type="button"
            className="start-screen__continue"
            onClick={onContinue}
            disabled={!hasSavedGame}
            title={hasSavedGame ? 'Continuar campanha salva' : 'Ainda não existe uma campanha salva neste aparelho'}
          >
            <Save size={18} />
            <span><strong>Continuar</strong><small>{hasSavedGame ? 'Retomar o último progresso salvo' : 'Nenhuma campanha salva ainda'}</small></span>
          </button>
        </div>

        <p className="start-screen__save-note"><Save size={13} /> Salvamento automático local</p>
      </div>
    </section>
  );
}
