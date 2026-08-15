import { City, RegionInfo } from '../types/game';

export const REGIONS_DATA: RegionInfo[] = [
  {
    id: 'NORTE',
    name: 'Norte (Amapá & Amazônia)',
    phase: 1,
    icon: '🌳',
    description: 'Início da jornada pelo Amapá e grandes rotas da floresta amazônica.',
    unlocked: true,
    citiesRequiredToUnlockNext: 5,
    color: 'emerald'
  },
  {
    id: 'NORDESTE',
    name: 'Nordeste',
    phase: 2,
    icon: '🏜️',
    description: 'Litoral exuberante e conexões do sertão e pólos industriais.',
    unlocked: false,
    citiesRequiredToUnlockNext: 5,
    color: 'amber'
  },
  {
    id: 'CENTRO-OESTE',
    name: 'Centro-Oeste',
    phase: 3,
    icon: '🌾',
    description: 'O coração do agronegócio e a capital federal Brasília.',
    unlocked: false,
    citiesRequiredToUnlockNext: 5,
    color: 'yellow'
  },
  {
    id: 'SUDESTE',
    name: 'Sudeste',
    phase: 4,
    icon: '🏙️',
    description: 'As maiores metrópoles, rodovias mais movimentadas e polos econômicos.',
    unlocked: false,
    citiesRequiredToUnlockNext: 5,
    color: 'blue'
  },
  {
    id: 'SUL',
    name: 'Sul',
    phase: 5,
    icon: '🌲',
    description: 'Pólo logístico com rotas de serra e conexões com o Mercosul.',
    unlocked: false,
    citiesRequiredToUnlockNext: 5,
    color: 'indigo'
  }
];

export const INITIAL_CITIES: City[] = [
  // ================= AMAPÁ & NORTE =================
  {
    id: 'macapa',
    name: 'Macapá',
    state: 'AP',
    region: 'NORTE',
    lat: 0.0355,
    lng: -51.0705,
    population: 522000,
    isStartingCity: true,
    unlocked: true,
    dominated: false,
    influence: 45,
    taxRevenuePerHour: 18000,
    landmark: 'Fortaleza de São José & Marco Zero do Equador',
    description: 'Capital do Amapá cortada pela Linha do Equador, ponto de partida da BR-156.',
    security: { policeStations: 3, patrolCars: 8, cameras: 24, prfBases: 1, score: 62 },
    neighborhoods: [
      {
        id: 'macapa-centro',
        name: 'Centro Histórico & Orla',
        type: 'Centro',
        influencePercent: 65,
        dominated: false,
        indicators: { infrastructure: 60, traffic: 45, security: 70, health: 65, transport: 60, development: 70 },
        upgrades: ['Asfalto CBUQ', 'Câmeras de Monitoramento']
      },
      {
        id: 'macapa-norte',
        name: 'Zona Norte (Pacoval / Jardim)',
        type: 'Zona Norte',
        influencePercent: 40,
        dominated: false,
        indicators: { infrastructure: 40, traffic: 30, security: 50, health: 45, transport: 40, development: 45 },
        upgrades: []
      },
      {
        id: 'macapa-sul',
        name: 'Zona Sul (Zerão / Beirol)',
        type: 'Zona Sul',
        influencePercent: 50,
        dominated: false,
        indicators: { infrastructure: 55, traffic: 40, security: 55, health: 50, transport: 50, development: 55 },
        upgrades: ['Iluminação LED']
      },
      {
        id: 'macapa-porto',
        name: 'Distrito Portuário do Amapá',
        type: 'Distrito Industrial',
        influencePercent: 35,
        dominated: false,
        indicators: { infrastructure: 45, traffic: 60, security: 40, health: 35, transport: 50, development: 60 },
        upgrades: []
      },
      {
        id: 'macapa-rural',
        name: 'Curiaú & Zona Quilombola',
        type: 'Zona Rural',
        influencePercent: 35,
        dominated: false,
        indicators: { infrastructure: 30, traffic: 15, security: 60, health: 40, transport: 25, development: 30 },
        upgrades: []
      }
    ]
  },
  {
    id: 'santana',
    name: 'Santana',
    state: 'AP',
    region: 'NORTE',
    lat: -0.0578,
    lng: -51.1817,
    population: 124000,
    unlocked: true,
    dominated: false,
    influence: 40,
    taxRevenuePerHour: 11000,
    landmark: 'Porto de Santana & Terminal Fluvial do Amazonas',
    description: 'Segunda maior cidade do Amapá e principal porto graneleiro e minerário.',
    security: { policeStations: 2, patrolCars: 5, cameras: 12, prfBases: 1, score: 55 },
    neighborhoods: [
      {
        id: 'santana-centro',
        name: 'Centro Comercial',
        type: 'Centro',
        influencePercent: 50,
        dominated: false,
        indicators: { infrastructure: 50, traffic: 40, security: 55, health: 50, transport: 50, development: 55 },
        upgrades: []
      },
      {
        id: 'santana-porto',
        name: 'Porto e Terminal Hidroviário',
        type: 'Orla / Porto',
        influencePercent: 45,
        dominated: false,
        indicators: { infrastructure: 60, traffic: 55, security: 50, health: 45, transport: 65, development: 60 },
        upgrades: []
      },
      {
        id: 'santana-norte',
        name: 'Área Portuária & Ilha de Santana',
        type: 'Zona Norte',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 30, traffic: 20, security: 45, health: 35, transport: 30, development: 35 },
        upgrades: []
      }
    ]
  },
  {
    id: 'porto_grande',
    name: 'Porto Grande',
    state: 'AP',
    region: 'NORTE',
    lat: 0.7125,
    lng: -51.4131,
    population: 23000,
    unlocked: true,
    dominated: false,
    influence: 30,
    taxRevenuePerHour: 5500,
    landmark: 'Balneário do Rio Araguari',
    description: 'Polo agrícola do Amapá e entroncamento crucial da BR-156 e BR-210.',
    security: { policeStations: 1, patrolCars: 3, cameras: 6, prfBases: 1, score: 48 },
    neighborhoods: [
      {
        id: 'pg-centro',
        name: 'Centro & Balneário',
        type: 'Centro',
        influencePercent: 40,
        dominated: false,
        indicators: { infrastructure: 45, traffic: 25, security: 50, health: 45, transport: 40, development: 45 },
        upgrades: []
      },
      {
        id: 'pg-agro',
        name: 'Distrito Agroflorestal',
        type: 'Distrito Industrial',
        influencePercent: 20,
        dominated: false,
        indicators: { infrastructure: 35, traffic: 30, security: 40, health: 30, transport: 35, development: 40 },
        upgrades: []
      }
    ]
  },
  {
    id: 'laranjal_do_jari',
    name: 'Laranjal do Jari',
    state: 'AP',
    region: 'NORTE',
    lat: -0.8425,
    lng: -52.5158,
    population: 52000,
    unlocked: true,
    dominated: false,
    influence: 30,
    taxRevenuePerHour: 7500,
    landmark: 'Cachoeira de Santo Antônio & Vale do Jari',
    description: 'Extremo sul do Amapá, divisa com o Pará através do majestoso Rio Jari.',
    security: { policeStations: 1, patrolCars: 4, cameras: 8, prfBases: 0, score: 45 },
    neighborhoods: [
      {
        id: 'ldj-centro',
        name: 'Centro da Passarela',
        type: 'Centro',
        influencePercent: 35,
        dominated: false,
        indicators: { infrastructure: 35, traffic: 35, security: 40, health: 40, transport: 35, development: 40 },
        upgrades: []
      },
      {
        id: 'ldj-fluvial',
        name: 'Orla do Rio Jari',
        type: 'Orla / Porto',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 30, traffic: 40, security: 35, health: 30, transport: 45, development: 35 },
        upgrades: []
      }
    ]
  },
  {
    id: 'oiapoque',
    name: 'Oiapoque',
    state: 'AP',
    region: 'NORTE',
    lat: 3.8436,
    lng: -51.8344,
    population: 29000,
    unlocked: true,
    dominated: false,
    influence: 25,
    taxRevenuePerHour: 8000,
    landmark: 'Ponte Binacional Brasil-Guiana Francesa',
    description: 'Extremo norte do Brasil. Fim lendário da BR-156 e fronteira com a Europa (Guiana Francesa).',
    security: { policeStations: 2, patrolCars: 4, cameras: 10, prfBases: 1, score: 58 },
    neighborhoods: [
      {
        id: 'oia-fronteira',
        name: 'Vila Fronteiriça & Aduana',
        type: 'Centro',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 40, traffic: 30, security: 60, health: 45, transport: 40, development: 50 },
        upgrades: []
      },
      {
        id: 'oia-porto',
        name: 'Orla Internacional do Oiapoque',
        type: 'Orla / Porto',
        influencePercent: 20,
        dominated: false,
        indicators: { infrastructure: 30, traffic: 25, security: 50, health: 35, transport: 35, development: 40 },
        upgrades: []
      }
    ]
  },
  {
    id: 'belem',
    name: 'Belém',
    state: 'PA',
    region: 'NORTE',
    lat: -1.4558,
    lng: -48.4902,
    population: 1303000,
    unlocked: true,
    dominated: false,
    influence: 40,
    taxRevenuePerHour: 34000,
    landmark: 'Mercado Ver-o-Peso & Basílica de Nazaré',
    description: 'Metrópole da Amazônia Oriental e início da lendária Rodovia Belém-Brasília (BR-010).',
    security: { policeStations: 8, patrolCars: 20, cameras: 70, prfBases: 3, score: 60 },
    neighborhoods: [
      {
        id: 'belem-centro',
        name: 'Centro Histórico & Nazaré',
        type: 'Centro',
        influencePercent: 55,
        dominated: false,
        indicators: { infrastructure: 65, traffic: 60, security: 65, health: 70, transport: 65, development: 70 },
        upgrades: []
      },
      {
        id: 'belem-porto',
        name: 'Zona Portuária do Guamá',
        type: 'Orla / Porto',
        influencePercent: 35,
        dominated: false,
        indicators: { infrastructure: 45, traffic: 55, security: 45, health: 40, transport: 55, development: 50 },
        upgrades: []
      },
      {
        id: 'belem-icoaraci',
        name: 'Distrito Industrial de Icoaraci',
        type: 'Distrito Industrial',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 50, traffic: 50, security: 50, health: 45, transport: 50, development: 60 },
        upgrades: []
      }
    ]
  },
  {
    id: 'santarem',
    name: 'Santarém',
    state: 'PA',
    region: 'NORTE',
    lat: -2.4431,
    lng: -54.7083,
    population: 308000,
    unlocked: true,
    dominated: false,
    influence: 35,
    taxRevenuePerHour: 16000,
    landmark: 'Encontro das Águas Tapajós e Amazonas & Alter do Chão',
    description: 'Pérola do Tapajós, entroncamento da BR-163 e rota fluvial do Rio Amazonas.',
    security: { policeStations: 3, patrolCars: 8, cameras: 22, prfBases: 1, score: 58 },
    neighborhoods: [
      {
        id: 'stm-centro',
        name: 'Centro & Orla Fluvial',
        type: 'Centro',
        influencePercent: 45,
        dominated: false,
        indicators: { infrastructure: 55, traffic: 40, security: 60, health: 55, transport: 50, development: 60 },
        upgrades: []
      },
      {
        id: 'stm-porto',
        name: 'Porto Graneleiro da Cargill',
        type: 'Distrito Industrial',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 50, traffic: 55, security: 50, health: 40, transport: 60, development: 55 },
        upgrades: []
      }
    ]
  },
  {
    id: 'manaus',
    name: 'Manaus',
    state: 'AM',
    region: 'NORTE',
    lat: -3.1190,
    lng: -60.0217,
    population: 2063000,
    unlocked: true,
    dominated: false,
    influence: 38,
    taxRevenuePerHour: 42000,
    landmark: 'Teatro Amazonas & Polo Industrial de Manaus',
    description: 'Coração da Amazônia Ocidental, polo tecnológico e portuário de padrão mundial.',
    security: { policeStations: 10, patrolCars: 25, cameras: 90, prfBases: 2, score: 65 },
    neighborhoods: [
      {
        id: 'manaus-centro',
        name: 'Centro Histórico & Adrianópolis',
        type: 'Centro',
        influencePercent: 60,
        dominated: false,
        indicators: { infrastructure: 70, traffic: 65, security: 65, health: 70, transport: 60, development: 75 },
        upgrades: []
      },
      {
        id: 'manaus-pim',
        name: 'Distrito Industrial (PIM)',
        type: 'Distrito Industrial',
        influencePercent: 40,
        dominated: false,
        indicators: { infrastructure: 60, traffic: 70, security: 60, health: 50, transport: 65, development: 80 },
        upgrades: []
      },
      {
        id: 'manaus-ponta-negra',
        name: 'Ponta Negra & Orla do Rio Negro',
        type: 'Zona Sul',
        influencePercent: 50,
        dominated: false,
        indicators: { infrastructure: 75, traffic: 45, security: 70, health: 65, transport: 60, development: 70 },
        upgrades: []
      }
    ]
  },
  {
    id: 'maraba',
    name: 'Marabá',
    state: 'PA',
    region: 'NORTE',
    lat: -5.3686,
    lng: -49.1178,
    population: 283000,
    unlocked: true,
    dominated: false,
    influence: 30,
    taxRevenuePerHour: 14000,
    landmark: 'Encontro dos Rios Tocantins e Itacaiúnas & Portal da Transamazônica',
    description: 'Hub de mineração do Carajás e marco zero inicial da BR-230 Transamazônica.',
    security: { policeStations: 3, patrolCars: 7, cameras: 20, prfBases: 2, score: 52 },
    neighborhoods: [
      {
        id: 'maraba-maraba-pioneira',
        name: 'Marabá Pioneira',
        type: 'Centro',
        influencePercent: 40,
        dominated: false,
        indicators: { infrastructure: 45, traffic: 40, security: 50, health: 45, transport: 40, development: 50 },
        upgrades: []
      },
      {
        id: 'maraba-nova-maraba',
        name: 'Nova Marabá & Distrito Logístico',
        type: 'Distrito Industrial',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 50, traffic: 50, security: 55, health: 50, transport: 50, development: 60 },
        upgrades: []
      }
    ]
  },
  {
    id: 'altamira',
    name: 'Altamira',
    state: 'PA',
    region: 'NORTE',
    lat: -3.2033,
    lng: -52.2064,
    population: 126000,
    unlocked: true,
    dominated: false,
    influence: 25,
    taxRevenuePerHour: 9500,
    landmark: 'Usina Hidrelétrica de Belo Monte & Rio Xingu',
    description: 'Maior município em extensão territorial do Brasil, ponto crítico da Transamazônica.',
    security: { policeStations: 2, patrolCars: 5, cameras: 14, prfBases: 1, score: 50 },
    neighborhoods: [
      {
        id: 'alt-centro',
        name: 'Centro & Orla do Xingu',
        type: 'Centro',
        influencePercent: 35,
        dominated: false,
        indicators: { infrastructure: 45, traffic: 35, security: 50, health: 45, transport: 40, development: 50 },
        upgrades: []
      }
    ]
  },

  // ================= NORDESTE =================
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    state: 'CE',
    region: 'NORDESTE',
    lat: -3.7327,
    lng: -38.5270,
    population: 2686000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 38000,
    landmark: 'Praia do Futuro & Hub de Cabos Submarinos',
    description: 'Metrópole cearense com moderna malha viária litorânea e portuária.',
    security: { policeStations: 9, patrolCars: 22, cameras: 85, prfBases: 2, score: 62 },
    neighborhoods: [
      {
        id: 'for-aldeota',
        name: 'Aldeota / Meireles',
        type: 'Centro',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 75, traffic: 65, security: 65, health: 75, transport: 70, development: 80 },
        upgrades: []
      },
      {
        id: 'for-porto',
        name: 'Porto do Mucuripe / Pecém',
        type: 'Orla / Porto',
        influencePercent: 20,
        dominated: false,
        indicators: { infrastructure: 65, traffic: 55, security: 60, health: 50, transport: 65, development: 70 },
        upgrades: []
      }
    ]
  },
  {
    id: 'recife',
    name: 'Recife',
    state: 'PE',
    region: 'NORDESTE',
    lat: -8.0539,
    lng: -34.8811,
    population: 1653000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 36000,
    landmark: 'Porto Digital & Pontes do Recife Antigo',
    description: 'Veneza Brasileira, centro tecnológico e logístico do Nordeste.',
    security: { policeStations: 8, patrolCars: 20, cameras: 80, prfBases: 2, score: 60 },
    neighborhoods: [
      {
        id: 'rec-digital',
        name: 'Recife Antigo / Porto Digital',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 70, traffic: 65, security: 65, health: 70, transport: 65, development: 80 },
        upgrades: []
      },
      {
        id: 'rec-suape',
        name: 'Complexo Industrial de Suape',
        type: 'Distrito Industrial',
        influencePercent: 20,
        dominated: false,
        indicators: { infrastructure: 75, traffic: 60, security: 70, health: 55, transport: 70, development: 85 },
        upgrades: []
      }
    ]
  },
  {
    id: 'salvador',
    name: 'Salvador',
    state: 'BA',
    region: 'NORDESTE',
    lat: -12.9777,
    lng: -38.5016,
    population: 2417000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 35000,
    landmark: 'Pelourinho & Elevador Lacerda',
    description: 'Primeira capital do Brasil, polo de turismo, cultura e logística automotiva.',
    security: { policeStations: 9, patrolCars: 22, cameras: 80, prfBases: 2, score: 60 },
    neighborhoods: [
      {
        id: 'ssa-barra',
        name: 'Barra / Pelourinho',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 70, traffic: 65, security: 60, health: 65, transport: 65, development: 70 },
        upgrades: []
      },
      {
        id: 'ssa-camacari',
        name: 'Polo Industrial de Camaçari',
        type: 'Distrito Industrial',
        influencePercent: 15,
        dominated: false,
        indicators: { infrastructure: 75, traffic: 60, security: 65, health: 55, transport: 70, development: 80 },
        upgrades: []
      }
    ]
  },
  {
    id: 'sao_luis',
    name: 'São Luís',
    state: 'MA',
    region: 'NORDESTE',
    lat: -2.5307,
    lng: -44.3068,
    population: 1108000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 22000,
    landmark: 'Porto do Itaqui & Casario de Azulejos',
    description: 'Ilha do amor com um dos portos mais profundos e eficientes do mundo.',
    security: { policeStations: 5, patrolCars: 14, cameras: 45, prfBases: 1, score: 58 },
    neighborhoods: [
      {
        id: 'slz-centro',
        name: 'Centro Histórico & Renascença',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 60, traffic: 50, security: 58, health: 60, transport: 55, development: 65 },
        upgrades: []
      }
    ]
  },
  {
    id: 'natal',
    name: 'Natal',
    state: 'RN',
    region: 'NORDESTE',
    lat: -5.7945,
    lng: -35.2110,
    population: 890000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 19000,
    landmark: 'Ponte Newton Navarro & Forte dos Reis Magos',
    description: 'Esquina do continente e polo de energia eólica e turismo solar.',
    security: { policeStations: 4, patrolCars: 12, cameras: 40, prfBases: 1, score: 60 },
    neighborhoods: [
      {
        id: 'nat-tirol',
        name: 'Tirol / Petrópolis',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 65, traffic: 45, security: 62, health: 65, transport: 60, development: 65 },
        upgrades: []
      }
    ]
  },

  // ================= CENTRO-OESTE =================
  {
    id: 'brasilia',
    name: 'Brasília',
    state: 'DF',
    region: 'CENTRO-OESTE',
    lat: -15.7975,
    lng: -47.8919,
    population: 3055000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 55000,
    landmark: 'Plano Piloto & Ponte JK',
    description: 'Capital Federal planejada em formato de avião com amplos eixos rodoviários.',
    security: { policeStations: 12, patrolCars: 35, cameras: 120, prfBases: 4, score: 75 },
    neighborhoods: [
      {
        id: 'bsb-eixo',
        name: 'Asa Sul / Asa Norte (Plano Piloto)',
        type: 'Centro',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 88, traffic: 55, security: 78, health: 80, transport: 80, development: 85 },
        upgrades: []
      },
      {
        id: 'bsb-taguatinga',
        name: 'Taguatinga & Águas Claras',
        type: 'Zona Oeste',
        influencePercent: 20,
        dominated: false,
        indicators: { infrastructure: 72, traffic: 68, security: 65, health: 70, transport: 72, development: 75 },
        upgrades: []
      }
    ]
  },
  {
    id: 'goiania',
    name: 'Goiânia',
    state: 'GO',
    region: 'CENTRO-OESTE',
    lat: -16.6869,
    lng: -49.2648,
    population: 1555000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 32000,
    landmark: 'Praça Cívica & Viaduto da Moda',
    description: 'Capital mais verde do país e hub logístico central do agronegócio.',
    security: { policeStations: 7, patrolCars: 18, cameras: 65, prfBases: 2, score: 64 },
    neighborhoods: [
      {
        id: 'gyn-bueno',
        name: 'Setor Bueno / Marista',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 75, traffic: 60, security: 65, health: 72, transport: 68, development: 75 },
        upgrades: []
      }
    ]
  },
  {
    id: 'cuiaba',
    name: 'Cuiabá',
    state: 'MT',
    region: 'CENTRO-OESTE',
    lat: -15.6014,
    lng: -56.0979,
    population: 623000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 24000,
    landmark: 'Centro Geodésico da América do Sul & Pantanal',
    description: 'Portal de saída da produção de grãos pela BR-163 rumo aos portos do Norte.',
    security: { policeStations: 4, patrolCars: 12, cameras: 45, prfBases: 2, score: 60 },
    neighborhoods: [
      {
        id: 'cgb-centro',
        name: 'Centro Político e Administrativo',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 68, traffic: 52, security: 62, health: 65, transport: 60, development: 70 },
        upgrades: []
      }
    ]
  },
  {
    id: 'campo_grande',
    name: 'Campo Grande',
    state: 'MS',
    region: 'CENTRO-OESTE',
    lat: -20.4697,
    lng: -54.6201,
    population: 916000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 23000,
    landmark: 'Parque das Nações Indígenas & Rota Bioceânica',
    description: 'Cidade Morena e futuro ponto estratégico da Rota Bioceânica rumo ao Oceano Pacífico.',
    security: { policeStations: 5, patrolCars: 14, cameras: 50, prfBases: 2, score: 65 },
    neighborhoods: [
      {
        id: 'cgr-afonso-pena',
        name: 'Avenida Afonso Pena & Centro',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 72, traffic: 45, security: 68, health: 68, transport: 65, development: 70 },
        upgrades: []
      }
    ]
  },
  {
    id: 'palmas',
    name: 'Palmas',
    state: 'TO',
    region: 'CENTRO-OESTE',
    lat: -10.1844,
    lng: -48.3336,
    population: 313000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 15000,
    landmark: 'Praça dos Girassóis & Ponte da Amizade',
    description: 'Mais jovem capital do Brasil, planejada estrategicamente no centro geográfico do país.',
    security: { policeStations: 3, patrolCars: 8, cameras: 30, prfBases: 1, score: 62 },
    neighborhoods: [
      {
        id: 'pmw-plano',
        name: 'Plano Diretor Sul/Norte',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 70, traffic: 30, security: 65, health: 65, transport: 60, development: 65 },
        upgrades: []
      }
    ]
  },

  // ================= SUDESTE =================
  {
    id: 'sao_paulo',
    name: 'São Paulo',
    state: 'SP',
    region: 'SUDESTE',
    lat: -23.5505,
    lng: -46.6333,
    population: 12396000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 95000,
    landmark: 'Avenida Paulista & Rodoanel Mário Covas',
    description: 'Maior centro financeiro da América Latina com o mais complexo sistema viário do continente.',
    security: { policeStations: 25, patrolCars: 80, cameras: 400, prfBases: 5, score: 72 },
    neighborhoods: [
      {
        id: 'sp-paulista',
        name: 'Paulista / Faria Lima / Jardins',
        type: 'Centro',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 92, traffic: 85, security: 75, health: 85, transport: 88, development: 95 },
        upgrades: []
      },
      {
        id: 'sp-rodoanel',
        name: 'Trecho Rodoanel Oeste / Leste',
        type: 'Distrito Industrial',
        influencePercent: 20,
        dominated: false,
        indicators: { infrastructure: 85, traffic: 75, security: 70, health: 65, transport: 85, development: 88 },
        upgrades: []
      }
    ]
  },
  {
    id: 'rio_de_janeiro',
    name: 'Rio de Janeiro',
    state: 'RJ',
    region: 'SUDESTE',
    lat: -22.9068,
    lng: -43.1729,
    population: 6775000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 68000,
    landmark: 'Cristo Redentor & Ponte Rio-Niterói',
    description: 'Cidade Maravilhosa, polo turístico e de petróleo e gás do pré-sal.',
    security: { policeStations: 18, patrolCars: 50, cameras: 220, prfBases: 4, score: 62 },
    neighborhoods: [
      {
        id: 'rio-copa',
        name: 'Zona Sul (Copacabana / Ipanema)',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 82, traffic: 75, security: 65, health: 75, transport: 78, development: 85 },
        upgrades: []
      },
      {
        id: 'rio-porto',
        name: 'Porto Maravilha & Arco Metropolitano',
        type: 'Orla / Porto',
        influencePercent: 20,
        dominated: false,
        indicators: { infrastructure: 80, traffic: 70, security: 65, health: 70, transport: 80, development: 80 },
        upgrades: []
      }
    ]
  },
  {
    id: 'belo_horizonte',
    name: 'Belo Horizonte',
    state: 'MG',
    region: 'SUDESTE',
    lat: -19.9167,
    lng: -43.9345,
    population: 2530000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 45000,
    landmark: 'Complexo da Pampulha & Anel Rodoviário',
    description: 'Capital mineira, entroncamento de escoamento mineral e metalúrgico.',
    security: { policeStations: 10, patrolCars: 28, cameras: 110, prfBases: 3, score: 68 },
    neighborhoods: [
      {
        id: 'bh-savassi',
        name: 'Savassi / Lourdes',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 80, traffic: 70, security: 72, health: 78, transport: 75, development: 80 },
        upgrades: []
      }
    ]
  },
  {
    id: 'vitoria',
    name: 'Vitória',
    state: 'ES',
    region: 'SUDESTE',
    lat: -20.3155,
    lng: -40.3128,
    population: 369000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 26000,
    landmark: 'Terceira Ponte & Complexo Portuário de Tubarão',
    description: 'Ilha capital com imensa movimentação portuária de minério e café.',
    security: { policeStations: 4, patrolCars: 12, cameras: 50, prfBases: 2, score: 70 },
    neighborhoods: [
      {
        id: 'vix-praia',
        name: 'Praia do Canto & Enseada',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 82, traffic: 55, security: 75, health: 78, transport: 70, development: 80 },
        upgrades: []
      }
    ]
  },
  {
    id: 'campinas',
    name: 'Campinas',
    state: 'SP',
    region: 'SUDESTE',
    lat: -22.9056,
    lng: -47.0608,
    population: 1223000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 39000,
    landmark: 'Aeroporto de Viracopos & Complexo Anhanguera-Bandeirantes',
    description: 'Vale do Silício brasileiro e maior entroncamento rodoviário do interior paulista.',
    security: { policeStations: 6, patrolCars: 18, cameras: 75, prfBases: 2, score: 70 },
    neighborhoods: [
      {
        id: 'cps-cambui',
        name: 'Cambuí / Barão Geraldo',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 85, traffic: 65, security: 72, health: 80, transport: 78, development: 85 },
        upgrades: []
      }
    ]
  },

  // ================= SUL =================
  {
    id: 'curitiba',
    name: 'Curitiba',
    state: 'PR',
    region: 'SUL',
    lat: -25.4284,
    lng: -49.2733,
    population: 1963000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 48000,
    landmark: 'Jardim Botânico & Canaletas de BRT',
    description: 'Referência mundial em planejamento urbano e transporte coletivo expresso.',
    security: { policeStations: 9, patrolCars: 25, cameras: 110, prfBases: 3, score: 76 },
    neighborhoods: [
      {
        id: 'cwb-batel',
        name: 'Batel / Centro Cívico',
        type: 'Centro',
        influencePercent: 30,
        dominated: false,
        indicators: { infrastructure: 88, traffic: 45, security: 78, health: 82, transport: 90, development: 88 },
        upgrades: []
      }
    ]
  },
  {
    id: 'florianopolis',
    name: 'Florianópolis',
    state: 'SC',
    region: 'SUL',
    lat: -27.5954,
    lng: -48.5480,
    population: 537000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 28000,
    landmark: 'Ponte Hercílio Luz & Lagoa da Conceição',
    description: 'Ilha do Silício, turismo internacional e altíssimo índice de qualidade de vida.',
    security: { policeStations: 5, patrolCars: 14, cameras: 60, prfBases: 2, score: 78 },
    neighborhoods: [
      {
        id: 'fln-centro',
        name: 'Centro & Beira-Mar Norte',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 84, traffic: 65, security: 80, health: 80, transport: 72, development: 82 },
        upgrades: []
      }
    ]
  },
  {
    id: 'porto_alegre',
    name: 'Porto Alegre',
    state: 'RS',
    region: 'SUL',
    lat: -30.0346,
    lng: -51.2177,
    population: 1492000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 42000,
    landmark: 'Orla do Guaíba & Ponte Móvel do Guaíba',
    description: 'Capital dos gaúchos, centro logístico da BR-290 e ligação com a Bacia do Prata.',
    security: { policeStations: 8, patrolCars: 22, cameras: 90, prfBases: 3, score: 70 },
    neighborhoods: [
      {
        id: 'poa-moinhos',
        name: 'Moinhos de Vento & Centro Histórico',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 80, traffic: 60, security: 70, health: 78, transport: 75, development: 80 },
        upgrades: []
      }
    ]
  },
  {
    id: 'foz_do_iguacu',
    name: 'Foz do Iguaçu',
    state: 'PR',
    region: 'SUL',
    lat: -25.5469,
    lng: -54.5882,
    population: 285000,
    unlocked: false,
    dominated: false,
    influence: 20,
    taxRevenuePerHour: 22000,
    landmark: 'Cataratas do Iguaçu & Usina de Itaipu',
    description: 'Tríplice Fronteira (Brasil-Paraguai-Argentina) e maravilha natural do mundo.',
    security: { policeStations: 4, patrolCars: 12, cameras: 50, prfBases: 2, score: 72 },
    neighborhoods: [
      {
        id: 'foz-fronteira',
        name: 'Ponte da Amizade & Centro',
        type: 'Centro',
        influencePercent: 25,
        dominated: false,
        indicators: { infrastructure: 78, traffic: 55, security: 75, health: 72, transport: 70, development: 80 },
        upgrades: []
      }
    ]
  }
];
