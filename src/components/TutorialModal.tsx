// Viasmobs — tutorial curto, contextual e acionável para a primeira partida.

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CircleDollarSign, Construction, Route, X } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
  onOpenFirstRoute: () => void;
}

const steps = [
  {
    icon: <Route size={26} />,
    label: 'PASSO 1 DE 3',
    title: 'Escolha uma ligação para movimentar sua rede.',
    text: 'Comece planejando uma viagem entre Macapá e Santana. Viagens completadas rendem dinheiro e aumentam a influência no destino.',
  },
  {
    icon: <CircleDollarSign size={26} />,
    label: 'PASSO 2 DE 3',
    title: 'A cidade trabalha enquanto você planeja.',
    text: 'Você recebe impostos das cidades abertas, comércio por cidade conectada, indústria após desenvolver bairros e receita de pedágios.',
  },
  {
    icon: <Construction size={26} />,
    label: 'PASSO 3 DE 3',
    title: 'Invista onde o atraso custa mais.',
    text: 'Obras melhoram a estrada, reduzem o tempo de viagem e ajudam a abrir novas regiões. Nunca gaste tudo: mantenha saldo para a próxima ligação.',
  },
];

export function TutorialModal({ onClose, onOpenFirstRoute }: TutorialModalProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const finish = (openRoute = false) => {
    onClose();
    if (openRoute) onOpenFirstRoute();
  };

  return (
    <div className="tutorial-backdrop" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section className="tutorial-card">
        <button className="tutorial-close" type="button" onClick={() => finish()} aria-label="Fechar tutorial"><X size={19} /></button>
        <div className="tutorial-icon">{current.icon}</div>
        <p className="tutorial-step">{current.label}</p>
        <h2 id="tutorial-title">{current.title}</h2>
        <p className="tutorial-text">{current.text}</p>
        <div className="tutorial-dots" aria-label={`Etapa ${step + 1} de ${steps.length}`}>
          {steps.map((_, index) => <span className={index === step ? 'active' : ''} key={index} />)}
        </div>
        <footer className="tutorial-actions">
          <button type="button" className="tutorial-back" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft size={17} /> Voltar</button>
          {isLast ? (
            <button type="button" className="tutorial-start" onClick={() => finish(true)}>Planejar primeira rota <ArrowRight size={17} /></button>
          ) : (
            <button type="button" className="tutorial-next" onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>Continuar <ArrowRight size={17} /></button>
          )}
        </footer>
      </section>
    </div>
  );
}
