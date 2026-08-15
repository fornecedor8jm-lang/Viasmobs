/** Design Viasmobs: regras transparentes de pressão urbana, rivalidade fictícia e reconquista por obras. */
import type { City, CityPolitics, Road, RivalFocus } from '../types/game';

const focusLabels: Record<RivalFocus, string> = {
  infraestrutura: 'Infraestrutura Popular',
  bairros: 'Bairros em Movimento',
  segurança: 'Segurança Comunitária',
  transporte: 'Mobilidade Cidadã',
};

const focusOrder: RivalFocus[] = ['infraestrutura', 'bairros', 'segurança', 'transporte'];

export type CityCrisisLevel = 'stable' | 'alert' | 'critical' | 'taken';

export interface RecoveryObjectives {
  routeReady: boolean;
  neighborhoodReady: boolean;
  securityReady: boolean;
}

export interface DefenseMissionObjectives extends RecoveryObjectives {
  approvalReady: boolean;
}

export const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function createCityPolitics(city: City, index: number): CityPolitics {
  const approval = clampPercent(62 + (city.security.score >= 60 ? 6 : 0) + (city.influence >= 50 ? 4 : 0) - (index % 4));
  const primaryFocus = focusOrder[index % focusOrder.length];
  const secondaryFocus = focusOrder[(index + 1) % focusOrder.length];

  return {
    approval,
    administration: 'player',
    rivals: [
      { id: `${city.id}-rival-principal`, name: `Frente ${focusLabels[primaryFocus]}`, focus: primaryFocus, support: clampPercent(100 - approval) },
      { id: `${city.id}-rival-secundario`, name: `Aliança ${focusLabels[secondaryFocus]}`, focus: secondaryFocus, support: clampPercent(Math.max(12, 46 - approval / 2)) },
    ],
  };
}

export function ensureCityPolitics(city: City, index: number): City {
  return city.politics ? city : { ...city, politics: createCityPolitics(city, index) };
}

export function getCityCrisisLevel(city: City): CityCrisisLevel {
  const politics = city.politics;
  if (politics?.administration === 'rival') return 'taken';
  const approval = politics?.approval ?? 65;
  if (approval < 30) return 'critical';
  if (approval < 50) return 'alert';
  return 'stable';
}

export function getLeadRival(city: City) {
  const rivals = city.politics?.rivals ?? [];
  return rivals.reduce((leader, rival) => rival.support > leader.support ? rival : leader, rivals[0]);
}

export function getRecoveryObjectives(city: City, roads: Road[]): RecoveryObjectives {
  const connectedRoads = roads.filter((road) => road.fromCityId === city.id || road.toCityId === city.id);
  return {
    routeReady: connectedRoads.some((road) => road.type !== 'terra' && road.condition >= 75),
    neighborhoodReady: city.neighborhoods.some((neighborhood) => neighborhood.influencePercent >= 75),
    securityReady: city.security.score >= 60,
  };
}

export function allRecoveryObjectivesComplete(objectives: RecoveryObjectives) {
  return objectives.routeReady && objectives.neighborhoodReady && objectives.securityReady;
}

export function getDefenseMissionObjectives(city: City, roads: Road[]): DefenseMissionObjectives {
  const recovery = getRecoveryObjectives(city, roads);
  return {
    ...recovery,
    approvalReady: (city.politics?.approval ?? 0) >= 60,
  };
}

export function allDefenseMissionObjectivesComplete(objectives: DefenseMissionObjectives) {
  return objectives.routeReady && objectives.neighborhoodReady && objectives.securityReady && objectives.approvalReady;
}

export function adjustCityApproval(city: City, change: number): City {
  const politics = city.politics ?? createCityPolitics(city, 0);
  const approval = clampPercent(politics.approval + change);
  const rivalReduction = Math.max(1, Math.round(Math.abs(change) * 0.8));
  const rivals = politics.rivals.map((rival, index) => ({
    ...rival,
    support: clampPercent(change >= 0 ? rival.support - rivalReduction : rival.support + (index === 0 ? Math.abs(change) : Math.ceil(Math.abs(change) / 2))),
  }));
  return { ...city, politics: { ...politics, approval, rivals } };
}

export function progressCityPolitics(city: City, roads: Road[], index: number): City {
  const preparedCity = ensureCityPolitics(city, index);
  const politics = preparedCity.politics!;
  if (!preparedCity.unlocked || politics.administration === 'rival') return preparedCity;

  const connectedRoads = roads.filter((road) => road.fromCityId === preparedCity.id || road.toCityId === preparedCity.id);
  const hasPoorRoute = connectedRoads.some((road) => road.type === 'terra' || road.condition < 60);
  const hasReliableRoute = connectedRoads.some((road) => road.type !== 'terra' && road.condition >= 75);
  const weakNeighborhoods = preparedCity.neighborhoods.filter((neighborhood) => neighborhood.influencePercent < 45).length;
  const pressure = (hasPoorRoute ? 1 : 0) + (weakNeighborhoods > 0 ? 1 : 0) + (preparedCity.security.score < 50 ? 1 : 0);
  const protection = (hasReliableRoute ? 1 : 0) + (preparedCity.security.score >= 65 ? 1 : 0) + (preparedCity.influence >= 60 ? 1 : 0);
  const change = Math.max(-1, Math.min(1, protection - pressure));
  const updated = adjustCityApproval(preparedCity, change);

  if ((updated.politics?.approval ?? 100) > 9) return updated;
  return {
    ...updated,
    politics: {
      ...updated.politics!,
      administration: 'rival',
      approval: 8,
      rivals: updated.politics!.rivals.map((rival, rivalIndex) => ({ ...rival, support: rivalIndex === 0 ? 100 : Math.max(35, rival.support) })),
    },
  };
}
