// Viasmobs — tutorial em ações: o jogador sai do texto diretamente para a primeira obra e o primeiro bairro.

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, CircleDollarSign, Construction, X } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
  onStartPaving: () => void;
  onStartNeighborhood: () => void;
  initialStep?: number;
}

const steps = [
  {
    icon: <Construction size={26} />,
    label: 'PASSO 1 DE 3',
    title: 'Asfalte seu primeiro trecho.',
    text: 'Vamos melhorar a ligação Macapá–Porto Grande. A obra custa dinheiro, mas reduz atrasos e deixa a sua rede mais forte.',
    action: 'pave' as const,
    actionLabel: 'Abrir primeira obra',
  },
  {
    icon: <CircleDollarSign size={26} />,
    label: 'PASSO 2 DE 3',
    title: 'Use receita para continuar construindo.',
    text: 'Cidades abertas geram impostos. Viagens completadas pagam frete. Mais tarde, pedágios e bairros desenvolvidos também aumentam sua entrada de dinheiro.',
  },
  {
    icon: <Building2 size={26} />,
    label: 'PASSO 3 DE 3',
    title: 'Domine um bairro para crescer.',
    text: 'Abra Macapá, entre em Bairros e clique em Desenvolver. Cada melhoria sobe a influência; um bairro é dominado ao chegar em 100%.',
    action: 'neighborhood' as const,
    actionLabel: 'Abrir bairros de Macapá',
  },
];

export function TutorialModal({ onClose, onStartPaving, onStartNeighborhood, initialStep = 0 }: TutorialModalProps) {
  const [step, setStep] = useState(initialStep);
  const current = steps[step];

  const runAction = () => {
    onClose();
    if (current.action === 'pave') onStartPaving();
    if (current.action === 'neighborhood') onStartNeighborhood();
  };

  return (
    <div className="tutorial-backdrop" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section className="tutorial-card">
        <button className="tutorial-close" type="button" onClick={onClose} aria-label="Fechar tutorial"><X size={19} /></button>
        <div className="tutorial-icon">{current.icon}</div>
        <p className="tutorial-step">{current.label}</p>
        <h2 id="tutorial-title">{current.title}</h2>
        <p className="tutorial-text">{current.text}</p>
        <div className="tutorial-dots" aria-label={`Etapa ${step + 1} de ${steps.length}`}>
          {steps.map((_, index) => <span className={index === step ? 'active' : ''} key={index} />)}
        </div>
        <footer className="tutorial-actions">
          <button type="button" className="tutorial-back" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft size={17} /> Voltar</button>
          {current.action ? (
            <button type="button" className="tutorial-start" onClick={runAction}>{current.actionLabel} <ArrowRight size={17} /></button>
          ) : (
            <button type="button" className="tutorial-next" onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>Continuar <ArrowRight size={17} /></button>
          )}
        </footer>
      </section>
    </div>
  );
}
