export type RegionId = 'NORTE' | 'NORDESTE' | 'CENTRO-OESTE' | 'SUDESTE' | 'SUL';

export interface RegionInfo {
  id: RegionId;
  name: string;
  phase: number;
  icon: string;
  description: string;
  unlocked: boolean;
  citiesRequiredToUnlockNext: number;
  color: string;
}

export type NeighborhoodType = 
  | 'Centro'
  | 'Zona Norte'
  | 'Zona Sul'
  | 'Zona Leste'
  | 'Zona Oeste'
  | 'Distrito Industrial'
  | 'Zona Rural'
  | 'Orla / Porto'
  | 'Polo Tecnológico';

export interface NeighborhoodIndicators {
  infrastructure: number; // 0 to 100
  traffic: number;        // 0 to 100 (lower is better, or traffic flow efficiency)
  security: number;       // 0 to 100
  health: number;         // 0 to 100
  transport: number;      // 0 to 100
  development: number;    // 0 to 100
}

export interface Neighborhood {
  id: string;
  name: string;
  type: NeighborhoodType;
  indicators: NeighborhoodIndicators;
  influencePercent: number; // 0 to 100
  dominated: boolean;
  upgrades: string[];
}

export interface CitySecurity {
  policeStations: number;
  patrolCars: number;
  cameras: number;
  prfBases: number;
  score: number; // 0 - 100
}

export interface City {
  id: string;
  name: string;
  state: string;
  region: RegionId;
  lat: number;
  lng: number;
  population: number;
  isStartingCity?: boolean;
  unlocked: boolean;
  dominated: boolean;
  influence: number; // average of neighborhoods
  taxRevenuePerHour: number;
  neighborhoods: Neighborhood[];
  security: CitySecurity;
  landmark: string;
  description: string;
}

export type RoadType = 'terra' | 'asfalto_simples' | 'duplicada' | 'via_expressa';
export type TrafficStatus = 'Livre' | 'Moderado' | 'Intenso' | 'Congestionado';

export interface Shortcut {
  id: string;
  name: string;
  cost: number;
  timeSavingsPercent: number;
  built: boolean;
  description: string;
  coordinates: [number, number][];
}

export interface RoadUpgradeOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  typeResult?: RoadType;
  speedBonus: number;
  trafficReduction: number;
  conditionBonus?: number;
  addsToll?: boolean;
  tollRevenuePerHour?: number;
}

export interface Road {
  id: string;
  name: string; // e.g. "BR-156 Norte", "BR-230 Transamazônica"
  fromCityId: string;
  toCityId: string;
  realKm: number;
  type: RoadType;
  condition: number; // 0 to 100 (100 = perfeito, 20 = buracos/lama)
  trafficLevel: TrafficStatus;
  hasToll: boolean;
  tollFee: number;
  tollRevenuePerHour: number;
  bridgesCount: number;
  hasOverpass: boolean;
  hasSmartTrafficLights: boolean;
  maxSpeedKmH: number;
  shortcuts: Shortcut[];
  coordinates: [number, number][];
  isTransamazonicaSector?: boolean;
  bossSectorId?: string;
}

export interface BossSector {
  id: string;
  name: string;
  fromName: string;
  toName: string;
  km: number;
  hpPercent: number; // 100 to 0 (0 = conquered)
  completed: boolean;
  challenges: {
    id: string;
    name: string;
    icon: string;
    resolved: boolean;
    cost: number;
    description: string;
    benefit: string;
  }[];
}

export interface ActiveVehicle {
  id: string;
  type: 'carro' | 'caminhao_carga' | 'onibus_viagem' | 'viatura_prf' | 'ambulancia';
  name: string;
  fromCityId: string;
  toCityId: string;
  roadId: string;
  progress: number; // 0 to 1
  speed: number;
  currentCoord: [number, number];
  cargoValue: number;
  isPlayerTrip?: boolean;
}

export interface ActiveTrip {
  id: string;
  originCityId: string;
  destCityId: string;
  pathRoadIds: string[];
  currentRoadIndex: number;
  progressOnCurrentRoad: number;
  totalKm: number;
  estimatedTimeSeconds: number;
  elapsedSeconds: number;
  status: 'traveling' | 'completed';
  rewardMoney: number;
}

export interface GameEconomy {
  money: number;
  taxRevenuePerSec: number;
  tollRevenuePerSec: number;
  tradeRevenuePerSec: number;
  industryRevenuePerSec: number;
  totalEarned: number;
  totalInvested: number;
  tripsCompleted: number;
  roadsPavedKm: number;
}

export type TileLayerType = 'osm' | 'satellite' | 'terrain' | 'dark';
