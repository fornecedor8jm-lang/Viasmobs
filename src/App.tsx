import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  City, 
  Road, 
  BossSector, 
  RegionInfo, 
  ActiveVehicle, 
  ActiveTrip, 
  GameEconomy, 
  TileLayerType, 
  RoadType,
  RegionId
} from './types/game';
import { INITIAL_CITIES, REGIONS_DATA } from './data/brazilCities';
import { INITIAL_ROADS } from './data/brazilRoads';
import { INITIAL_BOSS_SECTORS } from './data/transamazonicaBoss';
import { GameMap } from './components/GameMap';
import { GoogleMapsSearchBar } from './components/GoogleMapsSearchBar';
import { GoogleMapsDirections } from './components/GoogleMapsDirections';
import { GoogleMapsLiveNav } from './components/GoogleMapsLiveNav';
import { GoogleMapsPaveSheet } from './components/GoogleMapsPaveSheet';
import { GoogleMapsCitySheet } from './components/GoogleMapsCitySheet';
import { GoogleMapsBossSheet } from './components/GoogleMapsBossSheet';
import { GoogleMapsRegionsSheet } from './components/GoogleMapsRegionsSheet';
import { GoogleMapsFabControls } from './components/GoogleMapsFabControls';
import { GoogleMapsBottomNav } from './components/GoogleMapsBottomNav';
import { HelpModal } from './components/HelpModal';
import { playSound } from './utils/audio';

const STORAGE_KEY = 'brasil_vias_game_state_v1';

export default function App() {
  // Game State
  const [cities, setCities] = useState<City[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cities`);
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [roads, setRoads] = useState<Road[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_roads`);
    return saved ? JSON.parse(saved) : INITIAL_ROADS;
  });

  const [bossSectors, setBossSectors] = useState<BossSector[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_boss`);
    return saved ? JSON.parse(saved) : INITIAL_BOSS_SECTORS;
  });

  const [regions, setRegions] = useState<RegionInfo[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_regions`);
    return saved ? JSON.parse(saved) : REGIONS_DATA;
  });

  const [economy, setEconomy] = useState<GameEconomy>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_economy`);
    return saved ? JSON.parse(saved) : {
      money: 65000, // Initial budget for Amapá start
      taxRevenuePerSec: 15,
      tollRevenuePerSec: 0,
      tradeRevenuePerSec: 8,
      industryRevenuePerSec: 12,
      totalEarned: 65000,
      totalInvested: 0,
      tripsCompleted: 0,
      roadsPavedKm: 25
    };
  });

  const [vehicles, setVehicles] = useState<ActiveVehicle[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);

  // Selected Entities & Active Navigation Mode
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);
  const [pointA, setPointA] = useState<City | null>(() => cities.find(c => c.id === 'macapa') || null);
  const [pointB, setPointB] = useState<City | null>(() => cities.find(c => c.id === 'santana') || null);

  // Mobile Bottom Tab Navigation State
  const [activeTab, setActiveTab] = useState<'explore' | 'routes' | 'pave' | 'boss' | 'regions'>('explore');

  // UI, Layers and Simulation controls
  const [tileLayer, setTileLayer] = useState<TileLayerType>('satellite');
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [weatherRainActive, setWeatherRainActive] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  // Save game state
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cities`, JSON.stringify(cities));
    localStorage.setItem(`${STORAGE_KEY}_roads`, JSON.stringify(roads));
    localStorage.setItem(`${STORAGE_KEY}_boss`, JSON.stringify(bossSectors));
    localStorage.setItem(`${STORAGE_KEY}_regions`, JSON.stringify(regions));
    localStorage.setItem(`${STORAGE_KEY}_economy`, JSON.stringify(economy));
  }, [cities, roads, bossSectors, regions, economy]);

  // Current active region
  const currentRegion = regions.find(r => r.unlocked && r.phase === Math.max(...regions.filter(reg => reg.unlocked).map(reg => reg.phase))) || regions[0];
  const dirtRoadsCount = roads.filter(r => r.type === 'terra').length;

  // Initialize Ambient Fleet
  useEffect(() => {
    const initialVehicles: ActiveVehicle[] = [];
    const availableRoads = roads.filter(r => {
      const from = cities.find(c => c.id === r.fromCityId);
      const to = cities.find(c => c.id === r.toCityId);
      return from?.unlocked && to?.unlocked;
    });

    availableRoads.slice(0, 12).forEach((r, idx) => {
      const types: ActiveVehicle['type'][] = ['caminhao_carga', 'carro', 'onibus_viagem', 'viatura_prf'];
      const vType = types[idx % types.length];
      const startCoord = r.coordinates[0];

      initialVehicles.push({
        id: `v_init_${idx}`,
        type: vType,
        name: vType === 'caminhao_carga' ? `Caminhão Graneleiro #${idx + 1}` : vType === 'viatura_prf' ? `Viatura PRF Base AP` : `Linha Regional #${idx + 10}`,
        fromCityId: r.fromCityId,
        toCityId: r.toCityId,
        roadId: r.id,
        progress: (idx * 0.25) % 1,
        speed: (r.maxSpeedKmH / 100) * 0.04,
        currentCoord: startCoord,
        cargoValue: Math.round(r.realKm * 35)
      });
    });

    setVehicles(initialVehicles);
  }, []);

  // Coordinate interpolator along polylines
  const getInterpolatedCoord = (coordinates: [number, number][], progress: number): [number, number] => {
    if (!coordinates || coordinates.length === 0) return [0, 0];
    if (coordinates.length === 1) return coordinates[0];

    const totalSegments = coordinates.length - 1;
    const scaledIndex = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledIndex), totalSegments - 1);
    const segmentProgress = scaledIndex - segmentIndex;

    const p1 = coordinates[segmentIndex];
    const p2 = coordinates[segmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    return [lat, lng];
  };

  // Main Game Simulation Tick Loop
  useEffect(() => {
    if (gameSpeed === 0) return; // Paused

    const interval = setInterval(() => {
      const tickDeltaSeconds = 0.2 * gameSpeed;

      // 1. Calculate Economy Flow
      const unlockedCities = cities.filter(c => c.unlocked);
      const totalCityTaxesPerHour = unlockedCities.reduce((acc, c) => {
        const dominationMultiplier = c.dominated ? 1.35 : 1.0 + (c.influence / 200);
        return acc + c.taxRevenuePerHour * dominationMultiplier;
      }, 0);

      const totalTollRevenuePerHour = roads.filter(r => r.hasToll).reduce((acc, r) => acc + r.tollRevenuePerHour, 0);

      const taxPerSec = totalCityTaxesPerHour / 3600;
      const tollPerSec = totalTollRevenuePerHour / 3600;
      const tradePerSec = unlockedCities.length * 2.8;
      const industryPerSec = unlockedCities.filter(c => c.influence >= 50).length * 4.2;

      const earnedThisTick = (taxPerSec + tollPerSec + tradePerSec + industryPerSec) * tickDeltaSeconds;

      setEconomy(prev => ({
        ...prev,
        money: prev.money + earnedThisTick,
        taxRevenuePerSec: taxPerSec,
        tollRevenuePerSec: tollPerSec,
        tradeRevenuePerSec: tradePerSec,
        industryRevenuePerSec: industryPerSec,
        totalEarned: prev.totalEarned + earnedThisTick
      }));

      // 2. Update Active Vehicles along roads
      setVehicles(prevVehicles => {
        return prevVehicles.map(v => {
          const road = roads.find(r => r.id === v.roadId);
          if (!road) return v;

          let newProgress = v.progress + v.speed * tickDeltaSeconds * 0.5;
          let newFrom = v.fromCityId;
          let newTo = v.toCityId;
          let currentCoords = road.coordinates;

          // Loop or reverse upon reaching destination
          if (newProgress >= 1) {
            newProgress = 0;
            newFrom = v.toCityId;
            newTo = v.fromCityId;
          }

          const currentCoord = getInterpolatedCoord(currentCoords, newProgress);

          return {
            ...v,
            progress: newProgress,
            fromCityId: newFrom,
            toCityId: newTo,
            currentCoord
          };
        });
      });

      // 3. Update Active Player Trip
      setActiveTrip(prevTrip => {
        if (!prevTrip || prevTrip.status !== 'traveling') return prevTrip;

        const newElapsed = prevTrip.elapsedSeconds + tickDeltaSeconds;
        const tripProgressRatio = Math.min(1, newElapsed / prevTrip.estimatedTimeSeconds);

        if (tripProgressRatio >= 1) {
          // Trip finished!
          if (!soundMuted) {
            playSound.coin();
            playSound.dominate();
          }
          
          setEconomy(prev => ({
            ...prev,
            money: prev.money + prevTrip.rewardMoney,
            tripsCompleted: prev.tripsCompleted + 1
          }));

          // Boost destination city influence slightly
          setCities(prevCities => {
            return prevCities.map(c => {
              if (c.id === prevTrip.destCityId) {
                const newInfluence = Math.min(100, c.influence + 6);
                return { ...c, influence: newInfluence, dominated: newInfluence >= 100 };
              }
              return c;
            });
          });

          return null; // Finished trip
        }

        return {
          ...prevTrip,
          elapsedSeconds: newElapsed,
          progress: tripProgressRatio
        };
      });

    }, 200);

    return () => clearInterval(interval);
  }, [gameSpeed, cities, roads, activeTrip, soundMuted]);

  // Upgrade Neighborhood Action
  const handleUpgradeNeighborhood = useCallback((
    cityId: string, 
    neighborhoodId: string, 
    cost: number
  ) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost
    }));

    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== cityId) return city;

        const updatedNeighborhoods = city.neighborhoods.map(nb => {
          if (nb.id !== neighborhoodId) return nb;

          const newInfluence = Math.min(100, nb.influencePercent + 25);
          const isDominated = newInfluence >= 100;
          return {
            ...nb,
            influencePercent: newInfluence,
            dominated: isDominated
          };
        });

        const avgInfluence = updatedNeighborhoods.reduce((acc, n) => acc + n.influencePercent, 0) / updatedNeighborhoods.length;
        const allDominated = updatedNeighborhoods.every(n => n.dominated);

        return {
          ...city,
          neighborhoods: updatedNeighborhoods,
          influence: avgInfluence,
          dominated: allDominated
        };
      });
    });

    setSelectedCity(prev => (prev && prev.id === cityId ? { ...prev, influence: Math.min(100, prev.influence + 5) } : prev));
  }, []);

  // Upgrade City Security Action
  const handleUpgradeSecurity = useCallback((
    cityId: string, 
    securityType: 'station' | 'patrol' | 'camera' | 'prf', 
    cost: number
  ) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost
    }));

    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== cityId) return city;

        const sec = { ...city.security };
        if (securityType === 'station') sec.policeStations += 1;
        if (securityType === 'patrol') sec.patrolCars += 1;
        if (securityType === 'camera') sec.cameras += 5;
        if (securityType === 'prf') sec.prfBases += 1;

        sec.score = Math.min(100, Math.round(
          sec.policeStations * 6 + sec.patrolCars * 4 + sec.cameras * 1.5 + sec.prfBases * 10 + 30
        ));

        return {
          ...city,
          security: sec
        };
      });
    });
  }, []);

  // Road Paving Action (Direct Asfalto CBUQ / Duplicação / Via Expressa)
  const handlePaveRoad = useCallback((roadId: string, targetType: RoadType, cost: number) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost,
      roadsPavedKm: prev.roadsPavedKm + 50
    }));

    setRoads(prevRoads => {
      return prevRoads.map(road => {
        if (road.id !== roadId) return road;

        let maxSpeed = 80;
        if (targetType === 'duplicada') maxSpeed = 100;
        if (targetType === 'via_expressa') maxSpeed = 120;

        return {
          ...road,
          type: targetType,
          condition: 100,
          maxSpeedKmH: maxSpeed,
          trafficLevel: targetType === 'via_expressa' ? 'Livre' : 'Moderado'
        };
      });
    });

    setSelectedRoad(prev => (prev && prev.id === roadId ? { ...prev, type: targetType, condition: 100 } : prev));
  }, []);

  // Road Quick Repair Action
  const handleRepairRoad = useCallback((roadId: string, cost: number) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost
    }));

    setRoads(prevRoads => {
      return prevRoads.map(road => {
        if (road.id !== roadId) return road;
        return { ...road, condition: 100 };
      });
    });

    setSelectedRoad(prev => (prev && prev.id === roadId ? { ...prev, condition: 100 } : prev));
  }, []);

  // Toll Construction
  const handleBuildToll = useCallback((roadId: string, cost: number, fee: number) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost
    }));

    setRoads(prevRoads => {
      return prevRoads.map(road => {
        if (road.id !== roadId) return road;
        return {
          ...road,
          hasToll: true,
          tollFee: fee,
          tollRevenuePerHour: Math.round(road.realKm * 18)
        };
      });
    });

    setSelectedRoad(prev => (prev && prev.id === roadId ? { ...prev, hasToll: true, tollFee: fee } : prev));
  }, []);

  // Shortcut Construction
  const handleBuildShortcut = useCallback((roadId: string, shortcutId: string, cost: number) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost
    }));

    setRoads(prevRoads => {
      return prevRoads.map(road => {
        if (road.id !== roadId) return road;
        const updatedShortcuts = road.shortcuts.map(sc => {
          if (sc.id === shortcutId) return { ...sc, built: true };
          return sc;
        });
        return {
          ...road,
          shortcuts: updatedShortcuts,
          maxSpeedKmH: road.maxSpeedKmH + 15
        };
      });
    });
  }, []);

  // Install Concrete Bridges
  const handleInstallBridges = useCallback((roadId: string, cost: number) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost
    }));

    setRoads(prevRoads => {
      return prevRoads.map(road => {
        if (road.id !== roadId) return road;
        return {
          ...road,
          bridgesCount: road.bridgesCount + 2,
          condition: Math.min(100, road.condition + 15)
        };
      });
    });
  }, []);

  // Boss Challenge Resolver
  const handleResolveBossChallenge = useCallback((sectorId: string, challengeId: string, cost: number) => {
    setEconomy(prev => ({
      ...prev,
      money: prev.money - cost,
      totalInvested: prev.totalInvested + cost
    }));

    setBossSectors(prevSectors => {
      return prevSectors.map(sec => {
        if (sec.id !== sectorId) return sec;

        const updatedChallenges = sec.challenges.map(ch => {
          if (ch.id === challengeId) return { ...ch, resolved: true };
          return ch;
        });

        const resolvedCount = updatedChallenges.filter(c => c.resolved).length;
        const secHp = Math.round(100 - (resolvedCount / updatedChallenges.length) * 100);
        const isComplete = resolvedCount === updatedChallenges.length;

        return {
          ...sec,
          challenges: updatedChallenges,
          hpPercent: secHp,
          completed: isComplete
        };
      });
    });
  }, []);

  // Unlock Regional Phase
  const handleUnlockRegion = useCallback((regionId: string) => {
    setRegions(prevRegions => {
      return prevRegions.map(reg => {
        if (reg.id === regionId) return { ...reg, unlocked: true };
        return reg;
      });
    });

    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.region === regionId) return { ...city, unlocked: true };
        return city;
      });
    });
  }, []);

  // Dispatch Player Google Maps Trip
  const handleStartTrip = useCallback((
    origin: City, 
    dest: City, 
    pathRoads: Road[], 
    totalKm: number, 
    durationSec: number, 
    reward: number
  ) => {
    const newTrip: ActiveTrip = {
      id: `trip_${Date.now()}`,
      originCityId: origin.id,
      destCityId: dest.id,
      pathRoadIds: pathRoads.map(r => r.id),
      currentRoadIndex: 0,
      progressOnCurrentRoad: 0,
      totalKm,
      estimatedTimeSeconds: durationSec,
      elapsedSeconds: 0,
      status: 'traveling',
      rewardMoney: reward
    };

    setActiveTrip(newTrip);
    setActiveTab('explore'); // close directions panel and show live navigation map!

    const playerVehicle: ActiveVehicle = {
      id: `player_vehicle_${Date.now()}`,
      type: 'caminhao_carga',
      name: `Comboio Expresso ${origin.name} ➔ ${dest.name}`,
      fromCityId: origin.id,
      toCityId: dest.id,
      roadId: pathRoads[0]?.id || '',
      progress: 0,
      speed: (1 / durationSec),
      currentCoord: [origin.lat, origin.lng],
      cargoValue: reward,
      isPlayerTrip: true
    };

    setVehicles(prev => [playerVehicle, ...prev.filter(v => !v.isPlayerTrip)]);
  }, []);

  // Focus Camera Handler
  const handleFocusRegion = (focusType: 'amapa' | 'transam' | 'brasil') => {
    if (focusType === 'amapa') {
      setFocusTarget({ lat: 0.0355, lng: -51.0705, zoom: 8 });
    } else if (focusType === 'transam') {
      setFocusTarget({ lat: -3.8, lng: -52.5, zoom: 6.5 });
    } else {
      setFocusTarget({ lat: -14.235, lng: -51.9253, zoom: 4.5 });
    }
  };

  // Speed cycler
  const handleCycleSpeed = () => {
    const next = gameSpeed === 1 ? 2 : gameSpeed === 2 ? 5 : gameSpeed === 5 ? 0 : 1;
    setGameSpeed(next);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col overflow-hidden select-none font-sans">
      
      {/* 🗺️ Main Fullscreen Interactive Map */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
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
          onSelectCity={(city) => {
            if (!soundMuted) playSound.click();
            setSelectedCity(city);
            setSelectedRoad(null);
          }}
          onSelectRoad={(road) => {
            if (!soundMuted) playSound.click();
            setSelectedRoad(road);
            setSelectedCity(null);
            setActiveTab('pave');
          }}
          onSetPointA={(city) => {
            if (!soundMuted) playSound.click();
            setPointA(city);
          }}
          onSetPointB={(city) => {
            if (!soundMuted) playSound.click();
            setPointB(city);
          }}
          weatherRainActive={weatherRainActive}
          focusTarget={focusTarget}
        />
      </main>

      {/* 🔍 Google Maps Top Floating Search Bar with Autocomplete & Filter Chips */}
      {!activeTrip && (
        <GoogleMapsSearchBar
          cities={cities}
          roads={roads}
          economy={economy}
          currentRegion={currentRegion}
          dirtRoadsCount={dirtRoadsCount}
          weatherRainActive={weatherRainActive}
          activeTab={activeTab}
          onSelectCity={(city) => {
            setSelectedCity(city);
            setFocusTarget({ lat: city.lat, lng: city.lng, zoom: 10 });
          }}
          onSelectRoad={(road) => {
            setSelectedRoad(road);
            setActiveTab('pave');
            if (road.coordinates[0]) {
              setFocusTarget({ lat: road.coordinates[0][0], lng: road.coordinates[0][1], zoom: 8 });
            }
          }}
          onOpenRoutes={() => {
            setActiveTab('routes');
            setSelectedCity(null);
            setSelectedRoad(null);
          }}
          onOpenPaveSheet={() => {
            setActiveTab('pave');
            setSelectedCity(null);
          }}
          onOpenBoss={() => {
            setActiveTab('boss');
            setSelectedCity(null);
            setSelectedRoad(null);
            handleFocusRegion('transam');
          }}
          onOpenRegions={() => {
            setActiveTab('regions');
            setSelectedCity(null);
            setSelectedRoad(null);
          }}
          onToggleWeather={() => setWeatherRainActive(!weatherRainActive)}
        />
      )}

      {/* 🔘 Google Maps Floating Action Buttons (Right Controls) */}
      {!activeTrip && (
        <GoogleMapsFabControls
          tileLayer={tileLayer}
          gameSpeed={gameSpeed}
          soundMuted={soundMuted}
          onChangeTileLayer={setTileLayer}
          onCycleGameSpeed={handleCycleSpeed}
          onToggleSound={() => setSoundMuted(!soundMuted)}
          onFocusRegion={handleFocusRegion}
          onOpenHelp={() => setHelpModalOpen(true)}
        />
      )}

      {/* 🧭 Google Maps Directions & Route Metrics Modal */}
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
          onSwapPoints={() => {
            const temp = pointA;
            setPointA(pointB);
            setPointB(temp);
          }}
          onStartTrip={handleStartTrip}
          onPaveRoad={(roadId, cost) => handlePaveRoad(roadId, 'asfalto_simples', cost)}
          onClose={() => setActiveTab('explore')}
        />
      )}

      {/* 🟢 Google Maps Live Turn-by-Turn Navigation Overlay */}
      {activeTrip && (
        <GoogleMapsLiveNav
          activeTrip={activeTrip}
          originCity={cities.find(c => c.id === activeTrip.originCityId)}
          destinationCity={cities.find(c => c.id === activeTrip.destCityId)}
          onCancelTrip={() => setActiveTrip(null)}
        />
      )}

      {/* 🛠️ Google Maps Paving & Infrastructure Sheet */}
      {activeTab === 'pave' && !activeTrip && (
        <GoogleMapsPaveSheet
          roads={roads}
          playerMoney={economy.money}
          selectedRoad={selectedRoad}
          onSelectRoad={(road) => {
            setSelectedRoad(road);
            if (road.coordinates[0]) {
              setFocusTarget({ lat: road.coordinates[0][0], lng: road.coordinates[0][1], zoom: 8 });
            }
          }}
          onPaveRoad={handlePaveRoad}
          onRepairRoad={handleRepairRoad}
          onBuildToll={handleBuildToll}
          onBuildShortcut={handleBuildShortcut}
          onInstallBridges={handleInstallBridges}
          onClose={() => {
            setActiveTab('explore');
            setSelectedRoad(null);
          }}
        />
      )}

      {/* 📍 Google Maps City Place Details Bottom Sheet */}
      {selectedCity && !activeTrip && (
        <GoogleMapsCitySheet
          city={selectedCity}
          playerMoney={economy.money}
          onClose={() => setSelectedCity(null)}
          onSetPointA={(c) => {
            setPointA(c);
            setSelectedCity(null);
            setActiveTab('routes');
          }}
          onSetPointB={(c) => {
            setPointB(c);
            setSelectedCity(null);
            setActiveTab('routes');
          }}
          onUpgradeNeighborhood={handleUpgradeNeighborhood}
          onUpgradeSecurity={handleUpgradeSecurity}
        />
      )}

      {/* 👑 Google Maps Boss Transamazônica Sheet */}
      {activeTab === 'boss' && !activeTrip && (
        <GoogleMapsBossSheet
          bossSectors={bossSectors}
          playerMoney={economy.money}
          onResolveChallenge={handleResolveBossChallenge}
          onClose={() => setActiveTab('explore')}
        />
      )}

      {/* 🇧🇷 Google Maps Regions Expansion Sheet */}
      {activeTab === 'regions' && !activeTrip && (
        <GoogleMapsRegionsSheet
          regions={regions}
          cities={cities}
          currentRegion={currentRegion}
          onUnlockRegion={handleUnlockRegion}
          onClose={() => setActiveTab('explore')}
        />
      )}

      {/* ❓ Help Guide Modal */}
      {helpModalOpen && (
        <HelpModal onClose={() => setHelpModalOpen(false)} />
      )}

      {/* 📱 Google Maps Mobile Bottom Navigation Bar */}
      {!activeTrip && (
        <GoogleMapsBottomNav
          activeTab={activeTab}
          dirtRoadsCount={dirtRoadsCount}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedCity(null);
            if (tab !== 'pave') setSelectedRoad(null);
            if (tab === 'boss') handleFocusRegion('transam');
          }}
        />
      )}
    </div>
  );
}
