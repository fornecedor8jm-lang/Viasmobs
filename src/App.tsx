// Viasmobs — mapa como foco; apenas saldo, objetivo, rotas e obras ficam visíveis de início.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ActiveTrip, ActiveVehicle, BossSector, City, GameEconomy, RegionInfo, Road, RoadType, TileLayerType } from './types/game';
import { INITIAL_CITIES, REGIONS_DATA } from './data/brazilCities';
import { INITIAL_ROADS } from './data/brazilRoads';
import { INITIAL_BOSS_SECTORS } from './data/transamazonicaBoss';
import { GameMap } from './components/GameMap';
import { GoogleMapsDirections } from './components/GoogleMapsDirections';
import { GoogleMapsLiveNav } from './components/GoogleMapsLiveNav';
import { GoogleMapsPaveSheet } from './components/GoogleMapsPaveSheet';
import { GoogleMapsCitySheet } from './components/GoogleMapsCitySheet';
import { GoogleMapsBossSheet } from './components/GoogleMapsBossSheet';
import { GoogleMapsRegionsSheet } from './components/GoogleMapsRegionsSheet';
import { RulesModal } from './components/RulesModal';
import { TutorialModal } from './components/TutorialModal';
import { ViasmobsHUD, RoadFilterType } from './components/ViasmobsHUD';
import { MapLegendModal } from './components/MapLegendModal';
import { SettingsModal } from './components/SettingsModal';
import { WorkFeedbackModal, WorkFeedbackData } from './components/WorkFeedbackModal';
import { playSound } from './utils/audio';

const STORAGE_KEY = 'viasmobs_game_state_v2';
const LEGACY_STORAGE_KEY = 'brasil_vias_game_state_v1';
const DATA_MIGRATION_KEY = 'viasmobs_data_migration_v3';

type ActiveTab = 'explore' | 'routes' | 'pave' | 'boss' | 'regions';

function loadSavedState<T>(suffix: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${suffix}`) ?? localStorage.getItem(`${LEGACY_STORAGE_KEY}_${suffix}`);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    localStorage.removeItem(`${STORAGE_KEY}_${suffix}`);
    localStorage.removeItem(`${LEGACY_STORAGE_KEY}_${suffix}`);
    return fallback;
  }
}

function getInterpolatedCoord(coordinates: [number, number][], progress: number): [number, number] {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) return [0, 0];
  const validCoords = coordinates.filter(
    (c) => Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1])
  );
  if (validCoords.length === 0) return [0, 0];
  if (validCoords.length === 1) return [validCoords[0][0], validCoords[0][1]];

  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const scaledIndex = Math.min(validCoords.length - 1, Math.max(0, safeProgress * (validCoords.length - 1)));
  const index = Math.floor(scaledIndex);
  const next = Math.min(validCoords.length - 1, index + 1);
  const localProgress = scaledIndex - index;
  const pointA = validCoords[index];
  const pointB = validCoords[next];
  if (!pointA || !pointB) return [validCoords[0][0], validCoords[0][1]];

  const lat = pointA[0] + (pointB[0] - pointA[0]) * localProgress;
  const lng = pointA[1] + (pointB[1] - pointA[1]) * localProgress;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return [validCoords[0][0], validCoords[0][1]];
  }
  return [lat, lng];
}

export default function App() {
  const [cities, setCities] = useState<City[]>(() => loadSavedState('cities', INITIAL_CITIES));
  const [roads, setRoads] = useState<Road[]>(() => loadSavedState('roads', INITIAL_ROADS));
  const [bossSectors, setBossSectors] = useState<BossSector[]>(() => loadSavedState('boss', INITIAL_BOSS_SECTORS));
  const [regions, setRegions] = useState<RegionInfo[]>(() => loadSavedState('regions', REGIONS_DATA));
  const [economy, setEconomy] = useState<GameEconomy>(() => loadSavedState('economy', {
    money: 65000,
    taxRevenuePerSec: 0,
    tollRevenuePerSec: 0,
    tradeRevenuePerSec: 0,
    industryRevenuePerSec: 0,
    totalEarned: 65000,
    totalInvested: 0,
    tripsCompleted: 0,
    roadsPavedKm: 25,
  }));
  const [vehicles, setVehicles] = useState<ActiveVehicle[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);
  const [pointA, setPointA] = useState<City | null>(() => cities.find((city) => city.id === 'macapa') ?? null);
  const [pointB, setPointB] = useState<City | null>(() => cities.find((city) => city.id === 'santana') ?? null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(() => !localStorage.getItem('viasmobs_tutorial_seen_v2'));
  const [tutorialStep, setTutorialStep] = useState(0);
  const [firstWorkComplete, setFirstWorkComplete] = useState(() => localStorage.getItem('viasmobs_first_work_complete_v1') === 'true');
  const [rulesOpen, setRulesOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workFeedbackData, setWorkFeedbackData] = useState<WorkFeedbackData | null>(null);
  const [pendingTutorialStep, setPendingTutorialStep] = useState<number | null>(null);
  const [roadFilter, setRoadFilter] = useState<RoadFilterType>('all');
  const [weatherRainActive, setWeatherRainActive] = useState(false);
  const [claimedQuestIds, setClaimedQuestIds] = useState<string[]>(() => loadSavedState('claimed_quests', []));
  const [citySheetTab, setCitySheetTab] = useState<'overview' | 'neighborhoods' | 'security'>('overview');
  const economyRef = useRef(economy);
  const [tileLayer, setTileLayer] = useState<TileLayerType>('terrain');

  const currentRegion = useMemo(() => {
    const unlockedRegions = regions.filter((region) => region.unlocked);
    return unlockedRegions.sort((a, b) => b.phase - a.phase)[0] ?? regions[0];
  }, [regions]);

  // Determine Mission Target road / city for pulsing highlight
  const targetMacapaPortoGrande = roads.find(r => r.id === 'road_macapa_portogrande');
  const isTargetPaved = targetMacapaPortoGrande ? targetMacapaPortoGrande.type !== 'terra' : false;
  const macapaCity = cities.find(c => c.id === 'macapa');
  const isMacapaDominated = macapaCity ? macapaCity.neighborhoods.some(n => n.influencePercent >= 100) : false;

  let missionTargetRoadId: string | null = null;
  let missionTargetCityId: string | null = null;

  if (!isTargetPaved) {
    missionTargetRoadId = 'road_macapa_portogrande';
  } else if (!isMacapaDominated) {
    missionTargetCityId = 'macapa';
  }

  useEffect(() => {
    economyRef.current = economy;
  }, [economy]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cities`, JSON.stringify(cities));
    localStorage.setItem(`${STORAGE_KEY}_roads`, JSON.stringify(roads));
    localStorage.setItem(`${STORAGE_KEY}_boss`, JSON.stringify(bossSectors));
    localStorage.setItem(`${STORAGE_KEY}_regions`, JSON.stringify(regions));
    localStorage.setItem(`${STORAGE_KEY}_economy`, JSON.stringify(economy));
    localStorage.setItem(`${STORAGE_KEY}_claimed_quests`, JSON.stringify(claimedQuestIds));
  }, [bossSectors, cities, economy, regions, roads, claimedQuestIds]);

  useEffect(() => {
    if (localStorage.getItem(DATA_MIGRATION_KEY)) return;
    const manacapuru = INITIAL_CITIES.find((city) => city.id === 'manacapuru');
    const manacapuruRoad = INITIAL_ROADS.find((road) => road.id === 'road_manaus_manacapuru');
    const firstWorkRoad = INITIAL_ROADS.find((road) => road.id === 'road_macapa_portogrande');

    if (manacapuru) {
      setCities((previous) => previous.some((city) => city.id === manacapuru.id) ? previous : [...previous, manacapuru]);
    }
    setRoads((previous) => {
      let next = previous.some((road) => road.id === manacapuruRoad?.id) || !manacapuruRoad ? previous : [...previous, manacapuruRoad];
      if (firstWorkRoad && economyRef.current.roadsPavedKm <= 25) {
        next = next.map((road) => road.id === firstWorkRoad.id ? firstWorkRoad : road);
      }
      return next;
    });
    localStorage.setItem(DATA_MIGRATION_KEY, 'true');
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const availableRoads = roads.filter((road) => {
      const origin = cities.find((city) => city.id === road.fromCityId);
      const destination = cities.find((city) => city.id === road.toCityId);
      return origin?.unlocked && destination?.unlocked && Array.isArray(road.coordinates) && road.coordinates.length > 0;
    });
    const vehicleTypes: ActiveVehicle['type'][] = ['caminhao_carga', 'carro', 'onibus_viagem', 'viatura_prf'];
    setVehicles(availableRoads.slice(0, 5).map((road, index) => {
      const firstCoord = road.coordinates.find(c => Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1])) || [0.0355, -51.0705];
      return {
        id: `ambient_${road.id}`,
        type: vehicleTypes[index % vehicleTypes.length],
        name: index % 2 === 0 ? `Comboio regional ${index + 1}` : `Linha intermunicipal ${index + 1}`,
        fromCityId: road.fromCityId,
        toCityId: road.toCityId,
        roadId: road.id,
        progress: (index * 0.18) % 1,
        speed: Math.max(0.003, (road.maxSpeedKmH || 60) / 22000),
        currentCoord: [firstCoord[0], firstCoord[1]],
        cargoValue: Math.round((road.realKm || 50) * 22),
      };
    }));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const unlockedCities = cities.filter((city) => city.unlocked);
      const taxes = unlockedCities.reduce((sum, city) => sum + city.taxRevenuePerHour * (city.dominated ? 1.35 : 1 + city.influence / 200), 0) / 3600;
      const tolls = roads.filter((road) => road.hasToll).reduce((sum, road) => sum + road.tollRevenuePerHour, 0) / 3600;
      const trade = unlockedCities.length * 2.8;
      const industry = unlockedCities.filter((city) => city.influence >= 50).length * 4.2;
      const earned = (taxes + tolls + trade + industry) * 0.2;

      setEconomy((previous) => ({
        ...previous,
        money: previous.money + earned,
        totalEarned: previous.totalEarned + earned,
        taxRevenuePerSec: taxes,
        tollRevenuePerSec: tolls,
        tradeRevenuePerSec: trade,
        industryRevenuePerSec: industry,
      }));

      setVehicles((previous) => previous.map((vehicle) => {
        const road = roads.find((item) => item.id === vehicle.roadId);
        if (!road || !Array.isArray(road.coordinates) || road.coordinates.length === 0) return vehicle;
        const spd = Number.isFinite(vehicle.speed) ? vehicle.speed : 0.003;
        const curProg = Number.isFinite(vehicle.progress) ? vehicle.progress : 0;
        const progress = (curProg + spd * 0.2) % 1;
        return { ...vehicle, progress, currentCoord: getInterpolatedCoord(road.coordinates, progress) };
      }));

      setActiveTrip((trip) => {
        if (!trip) return null;
        const elapsedSeconds = trip.elapsedSeconds + 0.2;
        const progress = Math.min(1, elapsedSeconds / trip.estimatedTimeSeconds);
        if (progress < 1) return { ...trip, elapsedSeconds, progress };

        setEconomy((previous) => ({ ...previous, money: previous.money + trip.rewardMoney, totalEarned: previous.totalEarned + trip.rewardMoney, tripsCompleted: previous.tripsCompleted + 1 }));
        setCities((previous) => previous.map((city) => city.id === trip.destCityId
          ? { ...city, influence: Math.min(100, city.influence + 6), dominated: city.influence + 6 >= 100 }
          : city));
        setVehicles((previous) => previous.filter((vehicle) => !vehicle.isPlayerTrip));
        setNotice(`Viagem concluída. Você recebeu R$ ${trip.rewardMoney.toLocaleString('pt-BR')} e fortaleceu a cidade de destino.`);
        playSound.coin();
        return null;
      });
    }, 200);

    return () => window.clearInterval(timer);
  }, [cities, roads]);

  const spendMoney = useCallback((cost: number) => {
    if (!Number.isFinite(cost) || cost <= 0) {
      setNotice('O custo desta ação é inválido. Escolha outra obra.');
      return false;
    }
    if (economyRef.current.money < cost) {
      const missing = Math.ceil(cost - economyRef.current.money).toLocaleString('pt-BR');
      setNotice(`Saldo insuficiente. Você precisa de R$ ${missing} a mais.`);
      return false;
    }
    setEconomy((previous) => ({ ...previous, money: previous.money - cost, totalInvested: previous.totalInvested + cost }));
    return true;
  }, []);

  const handleUpgradeNeighborhood = useCallback((cityId: string, neighborhoodId: string, cost: number) => {
    if (!spendMoney(cost)) return;
    playSound.build();
    setCities((previous) => previous.map((city) => {
      if (city.id !== cityId) return city;
      const neighborhoods = city.neighborhoods.map((neighborhood) => neighborhood.id === neighborhoodId
        ? { ...neighborhood, influencePercent: Math.min(100, neighborhood.influencePercent + 25), dominated: neighborhood.influencePercent + 25 >= 100 }
        : neighborhood);
      const influence = neighborhoods.reduce((sum, neighborhood) => sum + neighborhood.influencePercent, 0) / neighborhoods.length;
      return { ...city, neighborhoods, influence, dominated: neighborhoods.every((neighborhood) => neighborhood.dominated) };
    }));
    setSelectedCity((city) => city?.id === cityId ? { ...city, influence: Math.min(100, city.influence + 8) } : city);
    if (cityId === 'macapa') {
      setNotice('Tutorial concluído: você desenvolveu um bairro. Continue até 100% para dominá-lo por completo.');
    } else {
      setNotice('Bairro desenvolvido. Mais influência aumenta indústria e libera novas regiões.');
    }
  }, [spendMoney]);

  const handleUpgradeSecurity = useCallback((cityId: string, type: 'station' | 'patrol' | 'camera' | 'prf', cost: number) => {
    if (!spendMoney(cost)) return;
    playSound.build();
    setCities((previous) => previous.map((city) => {
      if (city.id !== cityId) return city;
      const security = { ...city.security };
      if (type === 'station') security.policeStations += 1;
      if (type === 'patrol') security.patrolCars += 1;
      if (type === 'camera') security.cameras += 5;
      if (type === 'prf') security.prfBases += 1;
      security.score = Math.min(100, Math.round(security.policeStations * 6 + security.patrolCars * 4 + security.cameras * 1.5 + security.prfBases * 10 + 30));
      return { ...city, security };
    }));
    setNotice('Segurança melhorada. Uma rede segura aumenta a qualidade da mobilidade.');
  }, [spendMoney]);

  const handlePaveRoad = useCallback((roadId: string, targetType: RoadType, cost: number) => {
    const roadBefore = roads.find(r => r.id === roadId);
    if (!spendMoney(cost)) return;

    const speed = targetType === 'via_expressa' ? 120 : targetType === 'duplicada' ? 100 : 80;
    const conditionBefore = roadBefore?.condition || 30;
    const speedBefore = roadBefore?.maxSpeedKmH || 45;
    const realKm = roadBefore?.realKm || 100;
    const timeSavedMin = Math.max(5, Math.round((realKm / speedBefore - realKm / speed) * 60));

    setRoads((previous) => previous.map((road) => road.id === roadId
      ? { ...road, type: targetType, condition: 100, maxSpeedKmH: speed, trafficLevel: targetType === 'via_expressa' ? 'Livre' : 'Moderado' }
      : road));
    setEconomy((previous) => ({ ...previous, roadsPavedKm: previous.roadsPavedKm + Math.round(realKm) }));
    setSelectedRoad((road) => road?.id === roadId ? { ...road, type: targetType, condition: 100, maxSpeedKmH: speed } : road);
    
    playSound.build();

    // Trigger complete work feedback modal
    setWorkFeedbackData({
      roadName: roadBefore?.name || 'Rodovia Pavimentada',
      actionType: targetType === 'duplicada' ? 'duplicated' : targetType === 'via_expressa' ? 'express' : 'paved',
      conditionBefore,
      conditionAfter: 100,
      speedBefore,
      speedAfter: speed,
      timeSavedMinutes: timeSavedMin,
      newRevenueBonus: `+R$ ${Math.round(realKm * 25).toLocaleString('pt-BR')}`
    });

    if (roadId === 'road_macapa_portogrande' && !firstWorkComplete) {
      setFirstWorkComplete(true);
      localStorage.setItem('viasmobs_first_work_complete_v1', 'true');
      setPendingTutorialStep(2);
      setNotice('Primeira obra concluída! Objetivo atualizado para desenvolver bairros em Macapá.');
    } else {
      setNotice('Obra concluída. A rota está mais rápida e o fluxo melhorou.');
    }
  }, [firstWorkComplete, roads, spendMoney]);

  const handleRepairRoad = useCallback((roadId: string, cost: number) => {
    const roadBefore = roads.find(r => r.id === roadId);
    if (!spendMoney(cost)) return;
    playSound.build();
    setRoads((previous) => previous.map((road) => road.id === roadId ? { ...road, condition: 100 } : road));
    setSelectedRoad((road) => road?.id === roadId ? { ...road, condition: 100 } : road);
    setWorkFeedbackData({
      roadName: roadBefore?.name || 'Rodovia Recuperada',
      actionType: 'repaired',
      conditionBefore: roadBefore?.condition || 40,
      conditionAfter: 100,
      speedBefore: roadBefore?.maxSpeedKmH || 50,
      speedAfter: roadBefore?.maxSpeedKmH || 80,
      timeSavedMinutes: 12,
      newRevenueBonus: '+R$ 4.500'
    });
    setNotice('Manutenção concluída. A via voltou a operar com 100% de qualidade.');
  }, [roads, spendMoney]);

  const handleBuildToll = useCallback((roadId: string, cost: number, fee: number) => {
    const road = roads.find((item) => item.id === roadId);
    if (road?.hasToll) return setNotice('Esta rodovia já possui pedágio ativo.');
    if (!spendMoney(cost)) return;
    playSound.coin();
    setRoads((previous) => previous.map((item) => item.id === roadId ? { ...item, hasToll: true, tollFee: fee, tollRevenuePerHour: Math.round(item.realKm * 18) } : item));
    setNotice('Pedágio instalado. Esta rodovia agora gera receita contínua.');
  }, [roads, spendMoney]);

  const handleBuildShortcut = useCallback((roadId: string, shortcutId: string, cost: number) => {
    const road = roads.find((item) => item.id === roadId);
    if (road?.shortcuts.find((shortcut) => shortcut.id === shortcutId)?.built) return setNotice('Este atalho já está em operação.');
    if (!spendMoney(cost)) return;
    playSound.build();
    setRoads((previous) => previous.map((item) => item.id === roadId
      ? { ...item, shortcuts: item.shortcuts.map((shortcut) => shortcut.id === shortcutId ? { ...shortcut, built: true } : shortcut), maxSpeedKmH: item.maxSpeedKmH + 15 }
      : item));
    setNotice('Atalho construído. Você reduziu o tempo da rota e ampliou sua rede.');
  }, [roads, spendMoney]);

  const handleInstallBridges = useCallback((roadId: string, cost: number) => {
    if (!spendMoney(cost)) return;
    playSound.build();
    setRoads((previous) => previous.map((road) => road.id === roadId ? { ...road, bridgesCount: road.bridgesCount + 2, condition: Math.min(100, road.condition + 15) } : road));
    setNotice('Pontes instaladas. A ligação agora é mais confiável.');
  }, [spendMoney]);

  const handleResolveBossChallenge = useCallback((sectorId: string, challengeId: string, cost: number) => {
    if (!spendMoney(cost)) return;
    playSound.build();
    setBossSectors((previous) => previous.map((sector) => {
      if (sector.id !== sectorId) return sector;
      const challenges = sector.challenges.map((challenge) => challenge.id === challengeId ? { ...challenge, resolved: true } : challenge);
      const resolved = challenges.filter((challenge) => challenge.resolved).length;
      return { ...sector, challenges, hpPercent: Math.round(100 - (resolved / challenges.length) * 100), completed: resolved === challenges.length };
    }));
    setNotice('Etapa da BR-230 resolvida. A Transamazônica está mais perto de ser concluída.');
  }, [spendMoney]);

  const handleUnlockRegion = useCallback((regionId: string) => {
    const target = regions.find((region) => region.id === regionId);
    const conquered = cities.filter((city) => city.region === currentRegion.id && (city.dominated || city.influence >= 70)).length;
    if (!target || target.phase !== currentRegion.phase + 1 || conquered < currentRegion.citiesRequiredToUnlockNext) {
      setNotice(`Regra de expansão: conquiste ${currentRegion.citiesRequiredToUnlockNext} cidades em ${currentRegion.name}.`);
      return;
    }
    playSound.fanfare();
    setRegions((previous) => previous.map((region) => region.id === regionId ? { ...region, unlocked: true } : region));
    setCities((previous) => previous.map((city) => city.region === regionId ? { ...city, unlocked: true } : city));
    setNotice(`${target.name} foi desbloqueada. Novas cidades começaram a gerar receita.`);
  }, [cities, currentRegion, regions]);

  const handleStartTrip = useCallback((origin: City, destination: City, pathRoads: Road[], totalKm: number, durationSec: number, rewardMoney: number) => {
    if (activeTrip || pathRoads.length === 0 || durationSec <= 0) {
      setNotice('Selecione duas cidades conectadas para iniciar uma viagem.');
      return;
    }
    playSound.horn();
    const trip: ActiveTrip = {
      id: `trip_${Date.now()}`,
      originCityId: origin.id,
      destCityId: destination.id,
      pathRoadIds: pathRoads.map((road) => road.id),
      currentRoadIndex: 0,
      progressOnCurrentRoad: 0,
      totalKm,
      estimatedTimeSeconds: durationSec,
      elapsedSeconds: 0,
      status: 'traveling',
      rewardMoney,
    };
    setActiveTrip(trip);
    setActiveTab('explore');
    setVehicles((previous) => [{
      id: `player_${Date.now()}`,
      type: 'caminhao_carga',
      name: `Comboio ${origin.name} → ${destination.name}`,
      fromCityId: origin.id,
      toCityId: destination.id,
      roadId: pathRoads[0].id,
      progress: 0,
      speed: 1 / durationSec,
      currentCoord: [origin.lat, origin.lng],
      cargoValue: rewardMoney,
      isPlayerTrip: true,
    }, ...previous.filter((vehicle) => !vehicle.isPlayerTrip)]);
    setNotice(`Viagem iniciada. Ao chegar em ${destination.name}, você recebe a recompensa da rota.`);
  }, [activeTrip]);

  const handleClaimQuestReward = (questId: string, reward: number) => {
    setClaimedQuestIds(prev => [...prev, questId]);
    setEconomy(prev => ({
      ...prev,
      money: prev.money + reward,
      totalEarned: prev.totalEarned + reward
    }));
    setNotice(`Parabéns! Recompensa de R$ ${reward.toLocaleString('pt-BR')} resgatada.`);
  };

  const handleResetGame = () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_KEY) || key.startsWith(LEGACY_STORAGE_KEY) || key.startsWith('viasmobs_'))
      .forEach((key) => localStorage.removeItem(key));
    setCities(INITIAL_CITIES);
    setRoads(INITIAL_ROADS);
    setBossSectors(INITIAL_BOSS_SECTORS);
    setRegions(REGIONS_DATA);
    setEconomy({
      money: 65000,
      taxRevenuePerSec: 0,
      tollRevenuePerSec: 0,
      tradeRevenuePerSec: 0,
      industryRevenuePerSec: 0,
      totalEarned: 65000,
      totalInvested: 0,
      tripsCompleted: 0,
      roadsPavedKm: 25,
    });
    setClaimedQuestIds([]);
    setFirstWorkComplete(false);
    setTutorialStep(0);
    setTutorialOpen(true);
    setNotice('Campanha reiniciada. Bem-vindo de volta ao Amapá!');
  };

  const handleExportSave = () => {
    const saveData = {
      version: 2,
      cities,
      roads,
      bossSectors,
      regions,
      economy,
      claimedQuestIds
    };
    const jsonStr = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viasmobs_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice('Arquivo de save exportado para o seu computador.');
  };

  const handleImportSave = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data.cities) || !Array.isArray(data.roads) || !data.economy) {
        setNotice('Arquivo de save inválido. Escolha um save do Viasmobs.');
        return;
      }
      setCities(data.cities);
      setRoads(data.roads);
      if (Array.isArray(data.bossSectors)) setBossSectors(data.bossSectors);
      if (Array.isArray(data.regions)) setRegions(data.regions);
      setEconomy(data.economy);
      if (Array.isArray(data.claimedQuestIds)) setClaimedQuestIds(data.claimedQuestIds);
      setNotice('Progresso importado e restaurado com sucesso!');
    } catch {
      setNotice('Não foi possível ler este arquivo de save.');
    }
  };

  const closeTutorial = () => {
    localStorage.setItem('viasmobs_tutorial_seen_v2', 'true');
    setTutorialOpen(false);
  };

  const startPavingTutorial = () => {
    const road = roads.find((item) => item.id === 'road_macapa_portogrande');
    if (!road || !Array.isArray(road.coordinates) || road.coordinates.length === 0) return setNotice('O trecho guiado ainda não está disponível.');
    const targetCoord = road.coordinates[1] || road.coordinates[0] || [0.0355, -51.0705];
    setSelectedCity(null);
    setSelectedRoad(road);
    if (Number.isFinite(targetCoord[0]) && Number.isFinite(targetCoord[1])) {
      setFocusTarget({ lat: targetCoord[0], lng: targetCoord[1], zoom: 8 });
    }
    setActiveTab('pave');
    setNotice('Passo guiado: clique em “Asfaltar Rodovia” para melhorar o trecho Macapá–Porto Grande.');
  };

  const startNeighborhoodTutorial = () => {
    const macapa = cities.find((city) => city.id === 'macapa');
    if (!macapa) return setNotice('Macapá ainda não está disponível.');
    setActiveTab('explore');
    setSelectedRoad(null);
    setCitySheetTab('neighborhoods');
    setSelectedCity(macapa);
    setFocusTarget({ lat: macapa.lat, lng: macapa.lng, zoom: 10 });
    setNotice('Passo guiado: escolha um bairro e clique em “Desenvolver” para aumentar sua influência.');
  };

  const showRoutes = () => {
    setSelectedCity(null);
    setSelectedRoad(null);
    setActiveTab('routes');
  };

  const showWorks = () => {
    setSelectedCity(null);
    setActiveTab('pave');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 font-sans select-none">
      <main className="relative h-full w-full overflow-hidden">
        <GameMap
          cities={cities}
          roads={roads}
          vehicles={vehicles}
          activeTrip={activeTrip}
          selectedCity={selectedCity}
          selectedRoad={selectedRoad}
          pointA={pointA}
          pointB={pointB}
          tileLayer={tileLayer}
          onSelectCity={(city) => { setSelectedCity(city); setCitySheetTab('overview'); setSelectedRoad(null); setFocusTarget({ lat: city.lat, lng: city.lng, zoom: 9 }); }}
          onSelectRoad={(road) => { setSelectedRoad(road); setSelectedCity(null); setActiveTab('pave'); }}
          onSetPointA={setPointA}
          onSetPointB={setPointB}
          weatherRainActive={weatherRainActive}
          focusTarget={focusTarget}
          missionTargetRoadId={missionTargetRoadId}
          missionTargetCityId={missionTargetCityId}
          roadFilter={roadFilter}
        />
      </main>

      {!activeTrip && (
        <ViasmobsHUD
          economy={economy}
          cities={cities}
          roads={roads}
          currentRegion={currentRegion}
          notice={notice}
          onOpenRoutes={showRoutes}
          onOpenWorks={showWorks}
          onOpenRegions={() => { setSelectedCity(null); setSelectedRoad(null); setActiveTab('regions'); }}
          onOpenBoss={() => { setSelectedCity(null); setSelectedRoad(null); setFocusTarget({ lat: -3.8, lng: -52.5, zoom: 6.5 }); setActiveTab('boss'); }}
          onOpenTutorial={() => { setTutorialStep(0); setTutorialOpen(true); }}
          onOpenRules={() => setRulesOpen(true)}
          onOpenLegend={() => setLegendOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          tileLayer={tileLayer}
          onChangeTileLayer={setTileLayer}
          roadFilter={roadFilter}
          onChangeRoadFilter={setRoadFilter}
          weatherRainActive={weatherRainActive}
          onToggleWeather={() => setWeatherRainActive(prev => !prev)}
        />
      )}

      {activeTab === 'routes' && !activeTrip && (
        <GoogleMapsDirections
          cities={cities}
          roads={roads}
          pointA={pointA}
          pointB={pointB}
          activeTrip={activeTrip}
          playerMoney={economy.money}
          onSelectPointA={setPointA}
          onSelectPointB={setPointB}
          onSwapPoints={() => { const previous = pointA; setPointA(pointB); setPointB(previous); }}
          onStartTrip={handleStartTrip}
          onPaveRoad={(roadId, cost) => handlePaveRoad(roadId, 'asfalto_simples', cost)}
          onClose={() => setActiveTab('explore')}
        />
      )}

      {activeTrip && (
        <GoogleMapsLiveNav
          activeTrip={activeTrip}
          originCity={cities.find((city) => city.id === activeTrip.originCityId)}
          destinationCity={cities.find((city) => city.id === activeTrip.destCityId)}
          onCancelTrip={() => { setActiveTrip(null); setVehicles((previous) => previous.filter((vehicle) => !vehicle.isPlayerTrip)); setNotice('Viagem cancelada. Nenhuma recompensa foi recebida.'); }}
        />
      )}

      {activeTab === 'pave' && !activeTrip && (
        <GoogleMapsPaveSheet
          roads={roads}
          playerMoney={economy.money}
          selectedRoad={selectedRoad}
          onSelectRoad={(road) => {
            setSelectedRoad(road);
            const targetCoord = road?.coordinates?.[0];
            if (targetCoord && Number.isFinite(targetCoord[0]) && Number.isFinite(targetCoord[1])) {
              setFocusTarget({ lat: targetCoord[0], lng: targetCoord[1], zoom: 8 });
            }
          }}
          onPaveRoad={handlePaveRoad}
          onRepairRoad={handleRepairRoad}
          onBuildToll={handleBuildToll}
          onBuildShortcut={handleBuildShortcut}
          onInstallBridges={handleInstallBridges}
          onClose={() => { setActiveTab('explore'); setSelectedRoad(null); }}
        />
      )}

      {selectedCity && !activeTrip && (
        <GoogleMapsCitySheet
          key={`${selectedCity.id}-${citySheetTab}`}
          city={selectedCity}
          playerMoney={economy.money}
          initialTab={citySheetTab}
          onClose={() => { setSelectedCity(null); setCitySheetTab('overview'); }}
          onSetPointA={(city) => { setPointA(city); setSelectedCity(null); showRoutes(); }}
          onSetPointB={(city) => { setPointB(city); setSelectedCity(null); showRoutes(); }}
          onUpgradeNeighborhood={handleUpgradeNeighborhood}
          onUpgradeSecurity={handleUpgradeSecurity}
        />
      )}

      {activeTab === 'boss' && !activeTrip && (
        <GoogleMapsBossSheet
          bossSectors={bossSectors}
          playerMoney={economy.money}
          onResolveChallenge={handleResolveBossChallenge}
          onClose={() => setActiveTab('explore')}
        />
      )}

      {activeTab === 'regions' && !activeTrip && (
        <GoogleMapsRegionsSheet
          regions={regions}
          cities={cities}
          currentRegion={currentRegion}
          onUnlockRegion={handleUnlockRegion}
          onClose={() => setActiveTab('explore')}
        />
      )}

      {/* Modals & Overlays */}
      {tutorialOpen && (
        <TutorialModal
          initialStep={tutorialStep}
          onClose={closeTutorial}
          onStartPaving={() => { closeTutorial(); startPavingTutorial(); }}
          onStartNeighborhood={() => { closeTutorial(); startNeighborhoodTutorial(); }}
        />
      )}

      {rulesOpen && (
        <RulesModal
          currentRegionName={currentRegion.name}
          citiesRequired={currentRegion.citiesRequiredToUnlockNext}
          onClose={() => setRulesOpen(false)}
        />
      )}

      {legendOpen && (
        <MapLegendModal onClose={() => setLegendOpen(false)} />
      )}

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          onResetGame={handleResetGame}
          onExportSave={handleExportSave}
          onImportSave={handleImportSave}
          onManualSave={() => {
            localStorage.setItem(`${STORAGE_KEY}_cities`, JSON.stringify(cities));
            localStorage.setItem(`${STORAGE_KEY}_roads`, JSON.stringify(roads));
            localStorage.setItem(`${STORAGE_KEY}_economy`, JSON.stringify(economy));
          }}
        />
      )}

      {workFeedbackData && (
        <WorkFeedbackModal
          data={workFeedbackData}
          onClose={() => {
            setWorkFeedbackData(null);
            if (pendingTutorialStep !== null) {
              setTutorialStep(pendingTutorialStep);
              setTutorialOpen(true);
              setPendingTutorialStep(null);
            }
          }}
        />
      )}
    </div>
  );
}
