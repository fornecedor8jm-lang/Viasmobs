import { City, Road, ActiveTrip } from '../types/game';

export interface RouteCalculationResult {
  roads: Road[];
  totalKm: number;
  // Real-world Google Maps style metrics
  realDrivingMinutes: number;
  formattedRealTime: string; // e.g. "2 h 45 min" or "48 min"
  dirtRoadKm: number;
  hasDirtSections: boolean;
  timeLostOnDirtMinutes: number;
  potentialTimeIfPavedMinutes: number;
  formattedPotentialTime: string;
  trafficStatus: 'Livre' | 'Moderado' | 'Intenso' | 'Congestionado';
  tollCostTotal: number;
  tollCount: number;
  avgSpeedKmH: number;
  // Game simulation metrics
  gameDurationSeconds: number;
  cargoRewardMoney: number;
  vehicleTypeName: string;
}

/**
 * Computes shortest route using Breadth-First Search on the road network
 */
export function findRouteBetweenCities(startCity: City, endCity: City, allRoads: Road[]): Road[] {
  if (startCity.id === endCity.id) return [];

  const queue: { cityId: string; path: Road[] }[] = [{ cityId: startCity.id, path: [] }];
  const visited = new Set<string>([startCity.id]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.cityId === endCity.id) {
      return current.path;
    }

    const adjacentRoads = allRoads.filter(
      r => r.fromCityId === current.cityId || r.toCityId === current.cityId
    );

    for (const road of adjacentRoads) {
      const nextCityId = road.fromCityId === current.cityId ? road.toCityId : road.fromCityId;
      if (!visited.has(nextCityId)) {
        visited.add(nextCityId);
        queue.push({
          cityId: nextCityId,
          path: [...current.path, road]
        });
      }
    }
  }

  return [];
}

/**
 * Calculates realistic Google Maps metrics for a route
 */
export function calculateGoogleMapsMetrics(
  roads: Road[],
  vehicleType: 'carro' | 'caminhao' | 'onibus' | 'moto' = 'carro'
): RouteCalculationResult {
  if (roads.length === 0) {
    return {
      roads: [],
      totalKm: 0,
      realDrivingMinutes: 0,
      formattedRealTime: '0 min',
      dirtRoadKm: 0,
      hasDirtSections: false,
      timeLostOnDirtMinutes: 0,
      potentialTimeIfPavedMinutes: 0,
      formattedPotentialTime: '0 min',
      trafficStatus: 'Livre',
      tollCostTotal: 0,
      tollCount: 0,
      avgSpeedKmH: 60,
      gameDurationSeconds: 0,
      cargoRewardMoney: 0,
      vehicleTypeName: 'Carro'
    };
  }

  const totalKm = roads.reduce((acc, r) => acc + r.realKm, 0);
  let totalMinutes = 0;
  let dirtKm = 0;
  let dirtMinutesExtra = 0;
  let totalTolls = 0;
  let tollCount = 0;

  // Vehicle speed factor
  const vehicleFactor = vehicleType === 'moto' ? 1.05 : vehicleType === 'carro' ? 1.0 : vehicleType === 'onibus' ? 0.85 : 0.78;

  roads.forEach(road => {
    // Base speed on road type
    let baseSpeed = road.maxSpeedKmH;
    if (road.type === 'terra') {
      baseSpeed = 38; // dirt road is slow, average 35-40 km/h
      dirtKm += road.realKm;
    } else if (road.type === 'asfalto_simples') {
      baseSpeed = 75;
    } else if (road.type === 'duplicada') {
      baseSpeed = 95;
    } else if (road.type === 'via_expressa') {
      baseSpeed = 110;
    }

    // Condition penalty
    const conditionFactor = Math.max(0.5, road.condition / 100);
    const effectiveSpeed = baseSpeed * conditionFactor * vehicleFactor;

    // Traffic penalty
    const trafficMultiplier = 
      road.trafficLevel === 'Congestionado' ? 1.6 :
      road.trafficLevel === 'Intenso' ? 1.35 :
      road.trafficLevel === 'Moderado' ? 1.15 : 1.0;

    // Shortcuts bonus (time reduction)
    const builtShortcuts = road.shortcuts.filter(s => s.built);
    const shortcutSavingsPercent = builtShortcuts.reduce((acc, s) => acc + s.timeSavingsPercent, 0);
    const shortcutFactor = Math.max(0.5, 1 - (shortcutSavingsPercent / 100));

    // Road driving minutes
    const segmentHours = (road.realKm / effectiveSpeed) * trafficMultiplier * shortcutFactor;
    const segmentMinutes = segmentHours * 60;
    totalMinutes += segmentMinutes;

    // If it were paved asphalt
    if (road.type === 'terra') {
      const pavedSpeed = 80 * vehicleFactor;
      const pavedHours = (road.realKm / pavedSpeed) * trafficMultiplier * shortcutFactor;
      dirtMinutesExtra += Math.max(0, (segmentHours - pavedHours) * 60);
    }

    // Tolls
    if (road.hasToll) {
      totalTolls += road.tollFee;
      tollCount += 1;
    }
  });

  const realMinutes = Math.max(5, Math.round(totalMinutes));
  const potentialPavedMinutes = Math.max(5, Math.round(totalMinutes - dirtMinutesExtra));
  const avgSpeed = Math.round(totalKm / (realMinutes / 60));

  // Determine overall route traffic condition
  const trafficStatus: 'Livre' | 'Moderado' | 'Intenso' | 'Congestionado' = 
    roads.some(r => r.trafficLevel === 'Congestionado') ? 'Congestionado' :
    roads.some(r => r.trafficLevel === 'Intenso') ? 'Intenso' :
    roads.some(r => r.trafficLevel === 'Moderado') ? 'Moderado' : 'Livre';

  // Game scaled time: 1 real hour ≈ 4 game seconds, minimum 6 seconds
  const gameDurationSec = Math.max(6, Math.round((realMinutes / 60) * 4));

  // Freight profit reward
  const baseRewardMultiplier = vehicleType === 'caminhao' ? 55 : vehicleType === 'onibus' ? 40 : 25;
  const cargoReward = Math.round(totalKm * baseRewardMultiplier + 1500);

  const vehicleTypeName = 
    vehicleType === 'caminhao' ? 'Caminhão Bitrem' :
    vehicleType === 'onibus' ? 'Ônibus Interestadual' :
    vehicleType === 'moto' ? 'Moto Express' : 'Carro de Passeio';

  return {
    roads,
    totalKm,
    realDrivingMinutes: realMinutes,
    formattedRealTime: formatMinutesToGoogleMaps(realMinutes),
    dirtRoadKm: dirtKm,
    hasDirtSections: dirtKm > 0,
    timeLostOnDirtMinutes: Math.round(dirtMinutesExtra),
    potentialTimeIfPavedMinutes: potentialPavedMinutes,
    formattedPotentialTime: formatMinutesToGoogleMaps(potentialPavedMinutes),
    trafficStatus,
    tollCostTotal: totalTolls,
    tollCount,
    avgSpeedKmH: avgSpeed,
    gameDurationSeconds: gameDurationSec,
    cargoRewardMoney: cargoReward,
    vehicleTypeName
  };
}

export function formatMinutesToGoogleMaps(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = Math.round(minutes % 60);
  if (remainingMins === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${remainingMins} min`;
}
