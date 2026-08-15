import { Road } from '../types/game';

export const INITIAL_ROADS: Road[] = [
  // =================== AMAPÁ NETWORK (FASE 1 START) ===================
  {
    id: 'road_macapa_santana',
    name: 'BR-156 / AP-010 (Macapá ➔ Santana)',
    fromCityId: 'macapa',
    toCityId: 'santana',
    realKm: 25,
    type: 'duplicada',
    condition: 90,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 2,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 90,
    shortcuts: [
      {
        id: 'sc_macapa_santana_orla',
        name: 'Via Expressa da Orla do Rio Amazonas',
        cost: 15000,
        timeSavingsPercent: 40,
        built: false,
        description: 'Conexão direta pela orla desviando dos semáforos centrais.',
        coordinates: [[0.0355, -51.0705], [-0.0150, -51.1200], [-0.0578, -51.1817]]
      }
    ],
    coordinates: [
      [0.0355, -51.0705],
      [0.0120, -51.1150],
      [-0.0320, -51.1550],
      [-0.0578, -51.1817]
    ]
  },
  {
    id: 'road_macapa_portogrande',
    name: 'BR-156 Trecho Sul-Centro (Macapá ➔ Porto Grande)',
    fromCityId: 'macapa',
    toCityId: 'porto_grande',
    realKm: 105,
    type: 'terra',
    condition: 35,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 4,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 45,
    shortcuts: [
      {
        id: 'sc_macapa_portogrande_duplicacao',
        name: 'Contorno Viário de Matapi',
        cost: 28000,
        timeSavingsPercent: 30,
        built: false,
        description: 'Nova ponte estaiada sobre o Rio Matapi eliminando curvas perigosas.',
        coordinates: [[0.0355, -51.0705], [0.3500, -51.2500], [0.7125, -51.4131]]
      }
    ],
    coordinates: [
      [0.0355, -51.0705],
      [0.2200, -51.1900],
      [0.4500, -51.3200],
      [0.7125, -51.4131]
    ]
  },
  {
    id: 'road_portogrande_oiapoque',
    name: 'BR-156 Trecho Norte (Porto Grande ➔ Oiapoque)',
    fromCityId: 'porto_grande',
    toCityId: 'oiapoque',
    realKm: 480,
    type: 'terra',
    condition: 35, // Trecho lendário de terra do Amapá
    trafficLevel: 'Intenso',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 14,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 45,
    shortcuts: [
      {
        id: 'sc_oiapoque_asfalto_federal',
        name: 'Asfaltamento Completo do Parque do Tumucumaque',
        cost: 65000,
        timeSavingsPercent: 55,
        built: false,
        description: 'Transforma o lendário trecho de lama em rodovia pavimentada classe A.',
        coordinates: [[0.7125, -51.4131], [2.2000, -51.6000], [3.8436, -51.8344]]
      }
    ],
    coordinates: [
      [0.7125, -51.4131],
      [1.5000, -50.9000], // Tartarugalzinho
      [2.3000, -50.9500], // Amapá / Calçoene
      [3.1000, -51.4000],
      [3.8436, -51.8344]  // Oiapoque
    ]
  },
  {
    id: 'road_macapa_laranjal',
    name: 'BR-156 Sul / AP-010 (Macapá ➔ Laranjal do Jari)',
    fromCityId: 'macapa',
    toCityId: 'laranjal_do_jari',
    realKm: 275,
    type: 'terra',
    condition: 40,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 8,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 50,
    shortcuts: [
      {
        id: 'sc_jari_ponte',
        name: 'Megaponte Rio Jari & Pavimentação Ecológica',
        cost: 45000,
        timeSavingsPercent: 45,
        built: false,
        description: 'Elimina travessias de balsa e conecta o Amapá direto ao Vale do Jari.',
        coordinates: [[0.0355, -51.0705], [-0.4000, -51.8000], [-0.8425, -52.5158]]
      }
    ],
    coordinates: [
      [0.0355, -51.0705],
      [-0.1000, -51.3000], // Mazagão
      [-0.4500, -51.9000],
      [-0.8425, -52.5158]  // Laranjal do Jari
    ]
  },

  // =================== NORTE INTERCONEXÕES ===================
  {
    id: 'road_macapa_belem_fluvial',
    name: 'Hidrovia & Rodovia Fluvial (Macapá ➔ Belém)',
    fromCityId: 'macapa',
    toCityId: 'belem',
    realKm: 330,
    type: 'asfalto_simples',
    condition: 85,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 6,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 70,
    shortcuts: [
      {
        id: 'sc_balsa_expressa_marajo',
        name: 'Catamarã Expresso Ilha do Marajó',
        cost: 38000,
        timeSavingsPercent: 40,
        built: false,
        description: 'Linha de alta velocidade cruzando o Estuário do Rio Amazonas.',
        coordinates: [[0.0355, -51.0705], [-0.7000, -49.8000], [-1.4558, -48.4902]]
      }
    ],
    coordinates: [
      [0.0355, -51.0705],
      [-0.3000, -50.5000],
      [-0.9000, -49.3000],
      [-1.4558, -48.4902]
    ]
  },
  {
    id: 'road_belem_maraba',
    name: 'PA-150 / BR-222 (Belém ➔ Marabá)',
    fromCityId: 'belem',
    toCityId: 'maraba',
    realKm: 510,
    type: 'asfalto_simples',
    condition: 65,
    trafficLevel: 'Intenso',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 12,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 80,
    shortcuts: [
      {
        id: 'sc_duplicacao_pa150',
        name: 'Duplicação do Corredor de Carajás',
        cost: 55000,
        timeSavingsPercent: 35,
        built: false,
        description: 'Duplicação das pistas para caminhões de minério e escoamento.',
        coordinates: [[-1.4558, -48.4902], [-3.4000, -48.8000], [-5.3686, -49.1178]]
      }
    ],
    coordinates: [
      [-1.4558, -48.4902],
      [-2.5000, -48.6000], // Moju / Tailândia
      [-3.8000, -48.8000], // Jacundá
      [-5.3686, -49.1178]  // Marabá
    ]
  },
  {
    id: 'road_maraba_altamira',
    name: 'BR-230 Transamazônica Setor 1-2 (Marabá ➔ Altamira)',
    fromCityId: 'maraba',
    toCityId: 'altamira',
    realKm: 450,
    type: 'terra',
    condition: 30, // Transamazonica Boss Sector
    trafficLevel: 'Congestionado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 22,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 40,
    isTransamazonicaSector: true,
    bossSectorId: 'boss_sec_1',
    shortcuts: [
      {
        id: 'sc_transam_altamira_fast',
        name: 'Arco Norte Transamazônico',
        cost: 75000,
        timeSavingsPercent: 50,
        built: false,
        description: 'Pavimentação definitiva com viadutos em Novo Repartimento e Pacajá.',
        coordinates: [[-5.3686, -49.1178], [-4.2000, -50.6000], [-3.2033, -52.2064]]
      }
    ],
    coordinates: [
      [-5.3686, -49.1178],
      [-4.2500, -49.9500], // Novo Repartimento
      [-3.8300, -50.6300], // Pacajá
      [-3.5000, -51.5000], // Anapu
      [-3.2033, -52.2064]  // Altamira
    ]
  },
  {
    id: 'road_altamira_santarem',
    name: 'BR-230 / BR-163 (Altamira ➔ Santarém)',
    fromCityId: 'altamira',
    toCityId: 'santarem',
    realKm: 490,
    type: 'terra',
    condition: 40,
    trafficLevel: 'Intenso',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 18,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 50,
    isTransamazonicaSector: true,
    bossSectorId: 'boss_sec_3',
    shortcuts: [
      {
        id: 'sc_ruropolis_shortcut',
        name: 'Bypass Expresso de Rurópolis',
        cost: 60000,
        timeSavingsPercent: 35,
        built: false,
        description: 'Corta 90 km de desvios e liga a bacia do Tapajós direto ao porto.',
        coordinates: [[-3.2033, -52.2064], [-3.0000, -53.5000], [-2.4431, -54.7083]]
      }
    ],
    coordinates: [
      [-3.2033, -52.2064],
      [-3.4500, -52.8500], // Brasil Novo
      [-3.7000, -53.7500], // Medicilândia / Uruará
      [-4.0000, -54.9000], // Rurópolis
      [-2.4431, -54.7083]  // Santarém
    ]
  },
  {
    id: 'road_santarem_manaus',
    name: 'Hidrovia Expressa Rio Amazonas (Santarém ➔ Manaus)',
    fromCityId: 'santarem',
    toCityId: 'manaus',
    realKm: 600,
    type: 'asfalto_simples',
    condition: 90,
    trafficLevel: 'Livre',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 5,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 85,
    shortcuts: [
      {
        id: 'sc_aerovia_manaus',
        name: 'Ponte Aérea & Hidroaviões de Carga',
        cost: 85000,
        timeSavingsPercent: 60,
        built: false,
        description: 'Transporte de alta densidade ligando os polos industriais do Amazonas.',
        coordinates: [[-2.4431, -54.7083], [-2.7000, -57.5000], [-3.1190, -60.0217]]
      }
    ],
    coordinates: [
      [-2.4431, -54.7083],
      [-2.4000, -56.7000], // Parintins
      [-2.7000, -58.4000], // Itacoatiara
      [-3.1190, -60.0217]  // Manaus
    ]
  },

  {
    id: 'road_manaus_manacapuru',
    name: 'AM-070 / Rodovia Manoel Urbano (Manaus ➔ Manacapuru)',
    fromCityId: 'manaus',
    toCityId: 'manacapuru',
    realKm: 93,
    type: 'asfalto_simples',
    condition: 78,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 3,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 80,
    shortcuts: [
      {
        id: 'sc_polo_solimoes',
        name: 'Corredor Logístico do Solimões',
        cost: 24000,
        timeSavingsPercent: 25,
        built: false,
        description: 'Melhora os acessos ao polo urbano e reduz o tempo entre Manaus e Manacapuru.',
        coordinates: [[-3.1190, -60.0217], [-3.2200, -60.2900], [-3.29972, -60.62056]]
      }
    ],
    coordinates: [
      [-3.1190, -60.0217],
      [-3.1800, -60.2000],
      [-3.2500, -60.4100],
      [-3.29972, -60.62056]
    ]
  },

  // =================== NORDESTE ROTAS ===================
  {
    id: 'road_belem_saoluis',
    name: 'BR-316 / BR-135 (Belém ➔ São Luís)',
    fromCityId: 'belem',
    toCityId: 'sao_luis',
    realKm: 580,
    type: 'asfalto_simples',
    condition: 75,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 8,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 80,
    shortcuts: [],
    coordinates: [
      [-1.4558, -48.4902],
      [-1.3000, -47.1000], // Capanema
      [-1.9000, -45.5000], // Santa Inês
      [-2.5307, -44.3068]  // São Luís
    ]
  },
  {
    id: 'road_saoluis_fortaleza',
    name: 'BR-402 / Rota das Emoções (São Luís ➔ Fortaleza)',
    fromCityId: 'sao_luis',
    toCityId: 'fortaleza',
    realKm: 650,
    type: 'asfalto_simples',
    condition: 78,
    trafficLevel: 'Livre',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 9,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 85,
    shortcuts: [],
    coordinates: [
      [-2.5307, -44.3068],
      [-2.7500, -42.8000], // Barreirinhas / Lençóis
      [-2.9000, -41.7500], // Parnaíba
      [-3.6000, -40.3000], // Sobral
      [-3.7327, -38.5270]  // Fortaleza
    ]
  },
  {
    id: 'road_fortaleza_natal',
    name: 'BR-304 / BR-116 (Fortaleza ➔ Natal)',
    fromCityId: 'fortaleza',
    toCityId: 'natal',
    realKm: 520,
    type: 'duplicada',
    condition: 88,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 6,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-3.7327, -38.5270],
      [-4.5000, -37.7500], // Russas / Aracati
      [-5.1800, -37.3400], // Mossoró
      [-5.7945, -35.2110]  // Natal
    ]
  },
  {
    id: 'road_natal_recife',
    name: 'BR-101 Nordeste (Natal ➔ Recife)',
    fromCityId: 'natal',
    toCityId: 'recife',
    realKm: 290,
    type: 'duplicada',
    condition: 92,
    trafficLevel: 'Intenso',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 10,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-5.7945, -35.2110],
      [-7.1150, -34.8631], // João Pessoa
      [-8.0539, -34.8811]  // Recife
    ]
  },
  {
    id: 'road_recife_salvador',
    name: 'BR-101 Litoral Sul (Recife ➔ Salvador)',
    fromCityId: 'recife',
    toCityId: 'salvador',
    realKm: 800,
    type: 'duplicada',
    condition: 85,
    trafficLevel: 'Intenso',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 15,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 95,
    shortcuts: [],
    coordinates: [
      [-8.0539, -34.8811],
      [-9.6658, -35.7350], // Maceió
      [-10.9472, -37.0731], // Aracaju
      [-12.2667, -38.9667], // Feira de Santana
      [-12.9777, -38.5016]  // Salvador
    ]
  },

  // =================== CENTRO-OESTE ROTAS ===================
  {
    id: 'road_maraba_palmas',
    name: 'BR-153 Rodovia Belém-Brasília (Marabá ➔ Palmas)',
    fromCityId: 'maraba',
    toCityId: 'palmas',
    realKm: 580,
    type: 'asfalto_simples',
    condition: 75,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 8,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 85,
    shortcuts: [],
    coordinates: [
      [-5.3686, -49.1178],
      [-6.5000, -48.5000], // Araguaína
      [-8.3000, -48.2000], // Guaraí
      [-10.1844, -48.3336]  // Palmas
    ]
  },
  {
    id: 'road_palmas_brasilia',
    name: 'BR-010 / BR-153 (Palmas ➔ Brasília)',
    fromCityId: 'palmas',
    toCityId: 'brasilia',
    realKm: 820,
    type: 'duplicada',
    condition: 85,
    trafficLevel: 'Moderado',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 10,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-10.1844, -48.3336],
      [-11.7200, -49.0600], // Gurupi
      [-13.8000, -49.0000], // Porangatu
      [-15.7975, -47.8919]  // Brasília
    ]
  },
  {
    id: 'road_brasilia_goiania',
    name: 'BR-060 Eixo Central (Brasília ➔ Goiânia)',
    fromCityId: 'brasilia',
    toCityId: 'goiania',
    realKm: 210,
    type: 'via_expressa',
    condition: 95,
    trafficLevel: 'Intenso',
    hasToll: true,
    tollFee: 8.5,
    tollRevenuePerHour: 4500,
    bridgesCount: 4,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 110,
    shortcuts: [],
    coordinates: [
      [-15.7975, -47.8919],
      [-16.3200, -48.9500], // Anápolis
      [-16.6869, -49.2648]  // Goiânia
    ]
  },
  {
    id: 'road_goiania_cuiaba',
    name: 'BR-070 / BR-364 Rota dos Grãos (Goiânia ➔ Cuiabá)',
    fromCityId: 'goiania',
    toCityId: 'cuiaba',
    realKm: 900,
    type: 'duplicada',
    condition: 82,
    trafficLevel: 'Intenso',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 14,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 95,
    shortcuts: [],
    coordinates: [
      [-16.6869, -49.2648],
      [-16.2000, -52.2000], // Barra do Garças
      [-16.4500, -54.6000], // Rondonópolis
      [-15.6014, -56.0979]  // Cuiabá
    ]
  },
  {
    id: 'road_cuiaba_campogrande',
    name: 'BR-163 Pantaneira (Cuiabá ➔ Campo Grande)',
    fromCityId: 'cuiaba',
    toCityId: 'campo_grande',
    realKm: 690,
    type: 'duplicada',
    condition: 88,
    trafficLevel: 'Moderado',
    hasToll: true,
    tollFee: 11.2,
    tollRevenuePerHour: 3200,
    bridgesCount: 12,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-15.6014, -56.0979],
      [-16.4500, -54.6000], // Rondonópolis
      [-18.5000, -54.7000], // Coxim
      [-20.4697, -54.6201]  // Campo Grande
    ]
  },

  // =================== SUDESTE ROTAS ===================
  {
    id: 'road_brasilia_bh',
    name: 'BR-040 (Brasília ➔ Belo Horizonte)',
    fromCityId: 'brasilia',
    toCityId: 'belo_horizonte',
    realKm: 740,
    type: 'duplicada',
    condition: 85,
    trafficLevel: 'Intenso',
    hasToll: true,
    tollFee: 14.5,
    tollRevenuePerHour: 4800,
    bridgesCount: 14,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-15.7975, -47.8919],
      [-17.2000, -46.8000], // Paracatu
      [-18.7000, -45.2000], // Três Marias
      [-19.9167, -43.9345]  // Belo Horizonte
    ]
  },
  {
    id: 'road_bh_vitoria',
    name: 'BR-262 / BR-381 Rota do Café e Aço (Belo Horizonte ➔ Vitória)',
    fromCityId: 'belo_horizonte',
    toCityId: 'vitoria',
    realKm: 520,
    type: 'asfalto_simples',
    condition: 75,
    trafficLevel: 'Intenso',
    hasToll: false,
    tollFee: 0,
    tollRevenuePerHour: 0,
    bridgesCount: 11,
    hasOverpass: false,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 80,
    shortcuts: [],
    coordinates: [
      [-19.9167, -43.9345],
      [-19.5000, -42.5000], // Ipatinga / Vale do Aço
      [-20.2000, -41.2000], // Venda Nova do Imigrante
      [-20.3155, -40.3128]  // Vitória
    ]
  },
  {
    id: 'road_bh_rio',
    name: 'BR-040 Sul (Belo Horizonte ➔ Rio de Janeiro)',
    fromCityId: 'belo_horizonte',
    toCityId: 'rio_de_janeiro',
    realKm: 440,
    type: 'duplicada',
    condition: 90,
    trafficLevel: 'Intenso',
    hasToll: true,
    tollFee: 16.0,
    tollRevenuePerHour: 6200,
    bridgesCount: 16,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-19.9167, -43.9345],
      [-20.8000, -43.8000], // Conselheiro Lafaiete
      [-21.7500, -43.3500], // Juiz de Fora
      [-22.5000, -43.2000], // Petrópolis
      [-22.9068, -43.1729]  // Rio de Janeiro
    ]
  },
  {
    id: 'road_rio_sp',
    name: 'BR-116 Rodovia Presidente Dutra (Rio de Janeiro ➔ São Paulo)',
    fromCityId: 'rio_de_janeiro',
    toCityId: 'sao_paulo',
    realKm: 430,
    type: 'via_expressa',
    condition: 98,
    trafficLevel: 'Congestionado',
    hasToll: true,
    tollFee: 21.0,
    tollRevenuePerHour: 12500,
    bridgesCount: 28,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 110,
    shortcuts: [
      {
        id: 'sc_dutra_express',
        name: 'Novo Contorno da Serra das Araras',
        cost: 95000,
        timeSavingsPercent: 35,
        built: false,
        description: 'Túneis de 4 pistas eliminando o gargalo mais lento da Dutra.',
        coordinates: [[-22.9068, -43.1729], [-22.6000, -44.5000], [-23.5505, -46.6333]]
      }
    ],
    coordinates: [
      [-22.9068, -43.1729],
      [-22.5000, -44.1000], // Volta Redonda / Resende
      [-22.8000, -45.2000], // Guaratinguetá / Taubaté
      [-23.2000, -45.9000], // São José dos Campos
      [-23.5505, -46.6333]  // São Paulo
    ]
  },
  {
    id: 'road_sp_campinas',
    name: 'SP-348 Rodovia dos Bandeirantes (São Paulo ➔ Campinas)',
    fromCityId: 'sao_paulo',
    toCityId: 'campinas',
    realKm: 95,
    type: 'via_expressa',
    condition: 100,
    trafficLevel: 'Intenso',
    hasToll: true,
    tollFee: 12.8,
    tollRevenuePerHour: 9800,
    bridgesCount: 12,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 120,
    shortcuts: [],
    coordinates: [
      [-23.5505, -46.6333],
      [-23.2000, -46.9000], // Jundiaí
      [-22.9056, -47.0608]  // Campinas
    ]
  },

  // =================== SUL ROTAS ===================
  {
    id: 'road_sp_curitiba',
    name: 'BR-116 Rodovia Régis Bittencourt (São Paulo ➔ Curitiba)',
    fromCityId: 'sao_paulo',
    toCityId: 'curitiba',
    realKm: 410,
    type: 'duplicada',
    condition: 92,
    trafficLevel: 'Intenso',
    hasToll: true,
    tollFee: 18.0,
    tollRevenuePerHour: 7500,
    bridgesCount: 20,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-23.5505, -46.6333],
      [-24.3000, -47.4000], // Registro / Vale do Ribeira
      [-24.7000, -48.4000], // Serra do Cafezal
      [-25.4284, -49.2733]  // Curitiba
    ]
  },
  {
    id: 'road_curitiba_foz',
    name: 'BR-277 Rodovia das Cataratas (Curitiba ➔ Foz do Iguaçu)',
    fromCityId: 'curitiba',
    toCityId: 'foz_do_iguacu',
    realKm: 640,
    type: 'duplicada',
    condition: 90,
    trafficLevel: 'Moderado',
    hasToll: true,
    tollFee: 16.5,
    tollRevenuePerHour: 5100,
    bridgesCount: 16,
    hasOverpass: true,
    hasSmartTrafficLights: false,
    maxSpeedKmH: 100,
    shortcuts: [],
    coordinates: [
      [-25.4284, -49.2733],
      [-25.4000, -51.5000], // Guarapuava
      [-24.9500, -53.4500], // Cascavel
      [-25.5469, -54.5882]  // Foz do Iguaçu
    ]
  },
  {
    id: 'road_curitiba_florianopolis',
    name: 'BR-101 Sul (Curitiba ➔ Florianópolis)',
    fromCityId: 'curitiba',
    toCityId: 'florianopolis',
    realKm: 300,
    type: 'via_expressa',
    condition: 94,
    trafficLevel: 'Intenso',
    hasToll: true,
    tollFee: 14.0,
    tollRevenuePerHour: 6400,
    bridgesCount: 14,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 110,
    shortcuts: [],
    coordinates: [
      [-25.4284, -49.2733],
      [-26.3000, -48.8500], // Joinville
      [-26.9000, -48.6500], // Itajaí / Balneário Camboriú
      [-27.5954, -48.5480]  // Florianópolis
    ]
  },
  {
    id: 'road_florianopolis_poa',
    name: 'BR-101 / BR-290 (Florianópolis ➔ Porto Alegre)',
    fromCityId: 'florianopolis',
    toCityId: 'porto_alegre',
    realKm: 460,
    type: 'via_expressa',
    condition: 92,
    trafficLevel: 'Moderado',
    hasToll: true,
    tollFee: 17.5,
    tollRevenuePerHour: 5800,
    bridgesCount: 18,
    hasOverpass: true,
    hasSmartTrafficLights: true,
    maxSpeedKmH: 110,
    shortcuts: [],
    coordinates: [
      [-27.5954, -48.5480],
      [-28.5000, -48.8000], // Laguna (Ponte Anita Garibaldi)
      [-29.3000, -49.7000], // Torres / Osório
      [-30.0346, -51.2177]  // Porto Alegre
    ]
  }
];
