import { BossSector } from '../types/game';

export const INITIAL_BOSS_SECTORS: BossSector[] = [
  {
    id: 'boss_sec_1',
    name: 'Setor 1: O Portal da Selva (Marabá ➔ Novo Repartimento)',
    fromName: 'Marabá (PA)',
    toName: 'Novo Repartimento (PA)',
    km: 180,
    hpPercent: 100,
    completed: false,
    challenges: [
      {
        id: 'c1_chuva',
        name: 'Atoleiros de Barro Vermelho & Chuva Amazônica',
        icon: '🌧️',
        resolved: false,
        cost: 25000,
        description: 'Caminhões e ônibus atolam até o eixo na época das chuvas torrenciais.',
        benefit: 'Elimina atoleiros e aumenta velocidade média em +30 km/h.'
      },
      {
        id: 'c1_ponte',
        name: 'Substituição de Pontes de Madeira Provisórias',
        icon: '🌉',
        resolved: false,
        cost: 35000,
        description: 'Pontes de troncos rústicos que quebram com o peso do frete pesado.',
        benefit: 'Pontes de concreto armado pré-moldado instaladas.'
      },
      {
        id: 'c1_asfalto',
        name: 'Pavimentação Asfáltica com Drenagem Profunda',
        icon: '🛣️',
        resolved: false,
        cost: 50000,
        description: 'Camada de asfalto usinado CBUQ resistente à umidade extrema da selva.',
        benefit: 'Reduz o tempo de viagem em 45%.'
      }
    ]
  },
  {
    id: 'boss_sec_2',
    name: 'Setor 2: O Trecho da Usina e Rios Bravios (Repartimento ➔ Altamira)',
    fromName: 'Novo Repartimento (PA)',
    toName: 'Altamira / Belo Monte (PA)',
    km: 270,
    hpPercent: 100,
    completed: false,
    challenges: [
      {
        id: 'c2_balsa',
        name: 'Travessia de Balsa do Rio Pacajá & Rio Xingu',
        icon: '🚢',
        resolved: false,
        cost: 45000,
        description: 'Filas de espera de até 8 horas para atravessar o rio em balsas lentas.',
        benefit: 'Ponte Estaiada Monumental sobre o Rio Xingu.'
      },
      {
        id: 'c2_radar',
        name: 'Base de Monitoramento e Comunicação Satelital Starlink',
        icon: '📡',
        resolved: false,
        cost: 30000,
        description: 'Zona de escuridão total de sinal celular e rádio por centenas de quilômetros.',
        benefit: 'Torres 5G & Alertas meteorológicos em tempo real.'
      },
      {
        id: 'c2_asfalto',
        name: 'Duplicação do Eixo Logístico de Belo Monte',
        icon: '🛣️',
        resolved: false,
        cost: 65000,
        description: 'Pistas duplas para escoamento de insumos das turbinas e alimentos.',
        benefit: 'Capacidade de tráfego triplicada.'
      }
    ]
  },
  {
    id: 'boss_sec_3',
    name: 'Setor 3: O Coração do Pará (Altamira ➔ Medicilândia ➔ Uruará)',
    fromName: 'Altamira (PA)',
    toName: 'Uruará (PA)',
    km: 190,
    hpPercent: 100,
    completed: false,
    challenges: [
      {
        id: 'c3_erosao',
        name: 'Contenção de Encostas e Voçorocas',
        icon: '🚧',
        resolved: false,
        cost: 40000,
        description: 'Crateras gigantes abertas pela força das enxurradas.',
        benefit: 'Muros de gabião e taludes gramados instalados.'
      },
      {
        id: 'c3_gas',
        name: 'Postos de Abastecimento Sustentável & Elétrico',
        icon: '⛽',
        resolved: false,
        cost: 35000,
        description: 'Veículos ficam sem combustível no meio da floresta virgem.',
        benefit: 'Rede de postos com diesel ecológico e recarga rápida.'
      },
      {
        id: 'c3_pav',
        name: 'Asfaltamento Ecológico de Alto Tráfego',
        icon: '🛣️',
        resolved: false,
        cost: 55000,
        description: 'Asfalto com polímero de borracha reciclada resistente a calor.',
        benefit: 'Tempo de viagem reduzido pela metade.'
      }
    ]
  },
  {
    id: 'boss_sec_4',
    name: 'Setor 4: Travessia do Tapajós (Uruará ➔ Rurópolis ➔ Itaituba)',
    fromName: 'Uruará (PA)',
    toName: 'Itaituba (PA)',
    km: 260,
    hpPercent: 100,
    completed: false,
    challenges: [
      {
        id: 'c4_entroncamento',
        name: 'Trevo Monumental BR-230 / BR-163 em Rurópolis',
        icon: '🔄',
        resolved: false,
        cost: 50000,
        description: 'O entroncamento mais importante da Amazônia, hoje um nó de terra e poeira.',
        benefit: 'Viaduto em desnível com rotatória iluminada a LED.'
      },
      {
        id: 'c4_resgate',
        name: 'Bases de Resgate Aéreo e Emergência SAMU / PRF',
        icon: '🚑',
        resolved: false,
        cost: 45000,
        description: 'Atendimento médico rápido para acidentes em áreas isoladas.',
        benefit: 'Helipontos e viaturas 4x4 de resgate rápido.'
      },
      {
        id: 'c4_ponte',
        name: 'Megaponte sobre o Rio Tapajós',
        icon: '🌉',
        resolved: false,
        cost: 80000,
        description: 'Ligação definitiva entre os vales agrícolas e o porto de Miritituba.',
        benefit: 'Fim dos gargalos de caminhões graneleiros.'
      }
    ]
  },
  {
    id: 'boss_sec_5',
    name: 'Setor 5: Rota da Floresta Profunda (Itaituba ➔ Jacareacanga)',
    fromName: 'Itaituba (PA)',
    toName: 'Jacareacanga (PA)',
    km: 390,
    hpPercent: 100,
    completed: false,
    challenges: [
      {
        id: 'c5_pontes_igarapes',
        name: 'Substituição de 38 Pontilhões de Madeira por Galerias',
        icon: '🌉',
        resolved: false,
        cost: 70000,
        description: 'Dezenas de igarapés transbordam no inverno cobrindo a estrada.',
        benefit: 'Galerias de bueiros celulares em concreto usinado.'
      },
      {
        id: 'c5_seguranca',
        name: 'Posto Integrado de Fiscalização e Preservação Ambiental',
        icon: '👮',
        resolved: false,
        cost: 40000,
        description: 'Proteção das reservas indígenas e unidades de conservação.',
        benefit: 'Segurança total para motoristas e respeito à floresta.'
      },
      {
        id: 'c5_asfalto',
        name: 'Pavimentação da Rota de Jacareacanga',
        icon: '🛣️',
        resolved: false,
        cost: 90000,
        description: 'A selva mais densa da Transamazônica finalmente asfaltada.',
        benefit: 'Rota aberta o ano inteiro sem interrupções por chuvas.'
      }
    ]
  },
  {
    id: 'boss_sec_6',
    name: 'Setor 6: O Desafio Final da Amazônia (Jacareacanga ➔ Humaitá ➔ Lábrea)',
    fromName: 'Jacareacanga (PA)',
    toName: 'Lábrea (AM)',
    km: 430,
    hpPercent: 100,
    completed: false,
    challenges: [
      {
        id: 'c6_ponteminas',
        name: 'Grande Ponte sobre o Rio Madeira em Humaitá',
        icon: '🌉',
        resolved: false,
        cost: 95000,
        description: 'Conecta o Amazonas ocidental com Rondônia e Acre.',
        benefit: 'Integração definitiva das três fronteiras da Amazônia.'
      },
      {
        id: 'c6_smart',
        name: 'Corredor Inteligente de Telecomunicação e Energia Solar',
        icon: '⚡',
        resolved: false,
        cost: 60000,
        description: 'Iluminação por painéis solares e radares meteorológicos.',
        benefit: 'Rodovia modelo mundial de infraestrutura verde.'
      },
      {
        id: 'c6_express',
        name: 'Conclusão Monumental da BR-230 até Lábrea',
        icon: '🏆',
        resolved: false,
        cost: 120000,
        description: 'O último metro de asfalto da Transamazônica é inaugurado!',
        benefit: 'TRANSAMAZÔNICA 100% DOMADA! Título de Mestre Nacional de Infraestrutura!'
      }
    ]
  }
];
