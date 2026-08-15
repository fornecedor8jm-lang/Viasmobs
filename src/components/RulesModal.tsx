// Viasmobs — regras curtas, consultáveis a qualquer momento e escritas para a primeira partida.

import { CircleDollarSign, FlagTriangleRight, Route, ShieldCheck, X } from 'lucide-react';

interface RulesModalProps {
  currentRegionName: string;
  citiesRequired: number;
  onClose: () => void;
}

const rules = [
  { icon: Route, title: 'Viagens', text: 'Você só viaja entre cidades desbloqueadas que tenham uma rota conectando as duas. Cada chegada paga um frete e aumenta a influência no destino.' },
  { icon: CircleDollarSign, title: 'Orçamento', text: 'O saldo nunca fica negativo. Impostos, comércio, indústria, pedágios e fretes formam sua renda para novas obras.' },
  { icon: ShieldCheck, title: 'Obras', text: 'Asfalto, reparos, atalhos e pontes melhoram o fluxo. Pedágios criam renda contínua, mas cada obra exige investimento.' },
  { icon: FlagTriangleRight, title: 'Expansão', text: 'Para abrir a próxima região, eleve a influência de cidades da fase atual. Uma cidade conta quando chega a 70% de influência ou é dominada.' },
];

export function RulesModal({ currentRegionName, citiesRequired, onClose }: RulesModalProps) {
  return (
    <div className="tutorial-backdrop" role="dialog" aria-modal="true" aria-labelledby="rules-title">
      <section className="rules-card">
        <button className="tutorial-close" type="button" onClick={onClose} aria-label="Fechar regras"><X size={19} /></button>
        <p className="tutorial-step">REGRAS DO JOGO</p>
        <h2 id="rules-title">Como a mobilidade cresce</h2>
        <p className="rules-intro">Você administra uma rede de cidades. Decida, invista e conecte sem deixar o orçamento quebrar.</p>
        <div className="rules-list">
          {rules.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span><Icon size={17} /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
        <div className="region-rule">Meta atual: conquiste <b>{citiesRequired} cidades</b> em <b>{currentRegionName}</b> para liberar a próxima região.</div>
      </section>
    </div>
  );
}
