import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { City, Road, ActiveVehicle, ActiveTrip, TileLayerType } from '../types/game';

interface GameMapProps {
  cities: City[];
  roads: Road[];
  vehicles: ActiveVehicle[];
  activeTrip: ActiveTrip | null;
  selectedCity: City | null;
  selectedRoad: Road | null;
  pointA: City | null;
  pointB: City | null;
  tileLayer: TileLayerType;
  onSelectCity: (city: City) => void;
  onSelectRoad: (road: Road) => void;
  onSetPointA: (city: City) => void;
  onSetPointB: (city: City) => void;
  weatherRainActive: boolean;
  focusTarget?: { lat: number; lng: number; zoom: number } | null;
  missionTargetRoadId?: string | null;
  missionTargetCityId?: string | null;
  roadFilter?: 'all' | 'dirt' | 'paved' | 'damaged' | 'tolls' | 'traffic';
}

const TILE_PROVIDERS = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  terrain: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

function createTileLayer(type: TileLayerType) {
  const provider = TILE_PROVIDERS[type] || TILE_PROVIDERS.osm;
  return L.tileLayer(provider.url, {
    attribution: provider.attribution,
    maxZoom: 19,
    maxNativeZoom: 19,
    keepBuffer: 10,
    updateWhenIdle: false,
    updateWhenZooming: true,
    crossOrigin: true,
  });
}

function sanitizeCoordinateList(coordinates?: [number, number][]): [number, number][] {
  if (!coordinates || !Array.isArray(coordinates)) return [];
  return coordinates.filter(
    (pt) => Array.isArray(pt) && Number.isFinite(pt[0]) && Number.isFinite(pt[1])
  );
}

export const GameMap: React.FC<GameMapProps> = ({
  cities,
  roads,
  vehicles,
  activeTrip,
  selectedCity,
  selectedRoad,
  pointA,
  pointB,
  tileLayer,
  onSelectCity,
  onSelectRoad,
  onSetPointA,
  onSetPointB,
  weatherRainActive,
  focusTarget,
  missionTargetRoadId,
  missionTargetCityId,
  roadFilter = 'all'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const roadsLayerRef = useRef<L.LayerGroup | null>(null);
  const vehiclesLayerRef = useRef<L.LayerGroup | null>(null);
  const [zoomLevel, setZoomLevel] = useState(7);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Amapá / Brasil Norte
    const map = L.map(mapContainerRef.current, {
      center: [0.0355, -51.0705],
      zoom: 7,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      preferCanvas: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialTile = createTileLayer(tileLayer).addTo(map);

    tileLayerRef.current = initialTile;
    markersLayerRef.current = L.layerGroup().addTo(map);
    roadsLayerRef.current = L.layerGroup().addTo(map);
    vehiclesLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    const refreshMap = () => {
      if (!map) return;
      setZoomLevel(map.getZoom());
      map.invalidateSize({ animate: false, pan: false });
    };
    map.on('zoomend moveend resize', refreshMap);
    window.addEventListener('resize', refreshMap);
    window.setTimeout(refreshMap, 80);

    return () => {
      window.removeEventListener('resize', refreshMap);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // FlyTo upon focus target changes
  useEffect(() => {
    if (!mapInstanceRef.current || !focusTarget) return;
    if (!Number.isFinite(focusTarget.lat) || !Number.isFinite(focusTarget.lng) || !Number.isFinite(focusTarget.zoom)) return;
    try {
      mapInstanceRef.current.flyTo([focusTarget.lat, focusTarget.lng], focusTarget.zoom, {
        duration: 1.2
      });
    } catch {
      // Ignora erro de coordenadas inválidas
    }
  }, [focusTarget]);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    try {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newTile = createTileLayer(tileLayer).addTo(mapInstanceRef.current);
      tileLayerRef.current = newTile;
    } catch {
      // Ignora erro de transição de camada
    }
  }, [tileLayer]);

  // Render Roads & Shortcuts
  useEffect(() => {
    if (!roadsLayerRef.current || !mapInstanceRef.current) return;
    roadsLayerRef.current.clearLayers();

    roads.forEach(road => {
      // Apply Road Filter
      if (roadFilter === 'dirt' && road.type !== 'terra') return;
      if (roadFilter === 'paved' && road.type === 'terra') return;
      if (roadFilter === 'damaged' && road.condition >= 70) return;
      if (roadFilter === 'tolls' && !road.hasToll) return;
      if (roadFilter === 'traffic' && road.trafficLevel !== 'Intenso') return;

      const validCoords = sanitizeCoordinateList(road.coordinates);
      if (validCoords.length < 2) return;

      const isSelected = selectedRoad?.id === road.id;
      const isTargetRoad = missionTargetRoadId === road.id;
      const isTransam = road.isTransamazonicaSector;
      const isTripRoad = activeTrip?.pathRoadIds.includes(road.id);
      const isOverview = zoomLevel < 7.5;
      const visibleOnOverview = road.fromCityId === 'macapa' || road.fromCityId === 'manaus' || road.fromCityId === 'belem' || isTransam || isSelected || isTripRoad || isTargetRoad;
      if (isOverview && !visibleOnOverview) return;

      let color = '#78716c'; // terra/padrao
      let weight = 4;
      let dashArray: string | undefined = undefined;

      if (road.type === 'terra') {
        color = isTransam ? '#ef4444' : '#d97706';
        dashArray = '6, 8';
        weight = isSelected ? 7 : 5;
      } else if (road.type === 'asfalto_simples') {
        color = isTransam ? '#f97316' : '#38bdf8';
        weight = isSelected ? 7 : 5;
      } else if (road.type === 'duplicada') {
        color = '#06b6d4'; // cyan
        weight = isSelected ? 8 : 6;
      } else if (road.type === 'via_expressa') {
        color = '#10b981'; // emerald
        weight = isSelected ? 9 : 7;
      }

      if (isTripRoad) {
        color = '#22c55e'; // active navigation path (Google Maps Green / Blue)
        weight = 8;
      }

      if (isOverview) weight = Math.max(2, weight - 2);

      // Mission target golden pulsing glow
      if (isTargetRoad) {
        const targetHalo = L.polyline(validCoords, {
          color: '#fbbf24',
          weight: weight + 10,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round',
          className: 'mission-target-ring'
        });
        roadsLayerRef.current?.addLayer(targetHalo);
      }

      // Outer glow for selected or transamazonica or trip route
      if (isSelected || isTransam || isTripRoad) {
        const glowPolyline = L.polyline(validCoords, {
          color: isTripRoad ? '#22c55e' : (isTransam ? '#dc2626' : '#38bdf8'),
          weight: weight + 6,
          opacity: 0.45,
          lineCap: 'round',
          lineJoin: 'round'
        });
        roadsLayerRef.current?.addLayer(glowPolyline);
      }

      const polyline = L.polyline(validCoords, {
        color: isTargetRoad ? '#f59e0b' : color,
        weight: isTargetRoad ? weight + 3 : weight,
        opacity: 0.95,
        dashArray,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Click to inspect road
      polyline.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectRoad(road);
      });

      // Tooltip Google Maps style
      const badgeIcon = road.type === 'terra' ? '🪵 Não Pavimentada (Terra)' : road.type === 'duplicada' ? '🛣️ Duplicada' : road.type === 'via_expressa' ? '⚡ Via Expressa' : '🛣️ Asfalto CBUQ';
      polyline.bindTooltip(
        `<div class="text-xs font-semibold p-1.5 min-w-[160px]">
          ${isTargetRoad ? '<div class="text-amber-400 font-black text-[10px] uppercase mb-0.5 animate-pulse">🎯 ALVO DA MISSÃO PRINCIPAL</div>' : ''}
          <div class="text-amber-400 font-black text-sm">${road.name}</div>
          <div class="text-slate-200 mt-0.5">${badgeIcon} &bull; ${road.realKm} km</div>
          <div class="text-emerald-400 text-[11px] mt-1 font-mono">Velocidade Máx: ${road.maxSpeedKmH} km/h</div>
          <div class="text-slate-300 text-[10px]">Trânsito: ${road.trafficLevel} ${road.hasToll ? `&bull; Pedágio: R$ ${road.tollFee.toFixed(2)}` : ''}</div>
          <div class="text-amber-300 text-[10px] mt-1 font-bold">👆 Clique para abrir painel de asfaltamento</div>
        </div>`,
        { sticky: true, opacity: 0.95 }
      );

      roadsLayerRef.current?.addLayer(polyline);

      // Render Shortcuts if any
      road.shortcuts?.forEach(sc => {
        const validScCoords = sanitizeCoordinateList(sc.coordinates);
        if (validScCoords.length < 2) return;

        const scColor = sc.built ? '#10b981' : '#f59e0b';
        const scPoly = L.polyline(validScCoords, {
          color: scColor,
          weight: sc.built ? 5 : 3,
          dashArray: sc.built ? undefined : '4, 6',
          opacity: 0.85
        });

        scPoly.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectRoad(road);
        });

        scPoly.bindTooltip(
          `<div class="text-xs p-1">
            <div class="font-bold text-amber-300">⚡ Atalho: ${sc.name}</div>
            <div class="text-slate-300">${sc.built ? '✅ Construído' : '🔨 Disponível para Construção'} (-${sc.timeSavingsPercent}% tempo)</div>
          </div>`,
          { sticky: true }
        );

        roadsLayerRef.current?.addLayer(scPoly);
      });
    });
  }, [roads, selectedRoad, activeTrip, zoomLevel, missionTargetRoadId, roadFilter]);

  // Render City Markers (Google Maps Place Pins)
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    const overviewHubs = new Set(['macapa', 'belem', 'manaus', 'manacapuru', 'santarem']);
    const isOverview = zoomLevel < 7.5;
    cities.filter((city) => {
      if (!city || !Number.isFinite(city.lat) || !Number.isFinite(city.lng)) return false;
      const requiredForInteraction = pointA?.id === city.id || pointB?.id === city.id || selectedCity?.id === city.id || missionTargetCityId === city.id;
      return requiredForInteraction || (isOverview ? overviewHubs.has(city.id) : city.unlocked);
    }).forEach(city => {
      const isPointA = pointA?.id === city.id;
      const isPointB = pointB?.id === city.id;
      const isSelected = selectedCity?.id === city.id;
      const isTargetCity = missionTargetCityId === city.id;

      // Color scheme based on unlock, domination, and selection
      let pinColor = 'bg-blue-600 text-white';
      let iconEmoji = '📍';

      if (city.isStartingCity) {
        pinColor = 'bg-emerald-600 text-white';
        iconEmoji = '🚩';
      }

      if (city.dominated) {
        pinColor = 'bg-amber-500 text-slate-950 font-black';
        iconEmoji = '👑';
      }

      if (isPointA) {
        pinColor = 'bg-emerald-600 text-white animate-bounce';
        iconEmoji = '🅰️';
      } else if (isPointB) {
        pinColor = 'bg-rose-600 text-white animate-bounce';
        iconEmoji = '🅱️';
      } else if (isSelected) {
        pinColor = 'bg-indigo-600 text-white ring-4 ring-indigo-300';
      }

      const lockOpacity = city.unlocked ? 'opacity-100' : 'opacity-40 grayscale';

      // Google Maps Place Marker Style
      const customHtml = `
        <div class="relative group cursor-pointer ${lockOpacity}">
          ${isTargetCity ? '<div class="absolute -inset-2.5 rounded-full bg-amber-400/50 mission-target-ring"></div>' : ''}
          ${city.unlocked && !isTargetCity ? '<div class="absolute -inset-1 rounded-full bg-blue-500/20 city-pulse"></div>' : ''}
          <div class="relative flex items-center gap-1 px-2.5 py-1 rounded-full ${pinColor} shadow-xl border ${isTargetCity ? 'border-amber-300 ring-4 ring-amber-400/60' : 'border-white/60'} transition-transform transform group-hover:scale-110">
            <span class="text-xs">${iconEmoji}</span>
            <span class="text-xs font-bold font-display whitespace-nowrap tracking-tight">${city.name}</span>
            ${isOverview ? '' : `<span class="text-[9px] px-1 rounded bg-black/30 font-mono">${city.state}</span>`}
          </div>
          ${
            city.unlocked && !isOverview
              ? `<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-slate-950/90 border border-slate-700 text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 shadow">
                  <span>${Math.round(city.influence)}%</span>
                </div>`
              : (!city.unlocked && !isOverview
                ? `<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1 rounded bg-rose-950 text-[9px] text-rose-300 border border-rose-800">
                    🔒 Bloqueada
                  </div>`
                : '')
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'city-marker-div',
        iconSize: [120, 36],
        iconAnchor: [60, 18]
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectCity(city);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [cities, pointA, pointB, selectedCity, zoomLevel, missionTargetCityId]);

  // Render Animated Vehicles
  useEffect(() => {
    if (!vehiclesLayerRef.current || !mapInstanceRef.current) return;
    vehiclesLayerRef.current.clearLayers();

    vehicles.filter((vehicle) => {
      if (!vehicle || !vehicle.currentCoord || !Array.isArray(vehicle.currentCoord)) return false;
      if (!Number.isFinite(vehicle.currentCoord[0]) || !Number.isFinite(vehicle.currentCoord[1])) return false;
      return zoomLevel >= 7.5 || vehicle.isPlayerTrip;
    }).forEach(vehicle => {
      let iconChar = '🚗';
      let bgColor = 'bg-blue-600';
      if (vehicle.type === 'caminhao_carga') {
        iconChar = '🚛';
        bgColor = 'bg-amber-600';
      } else if (vehicle.type === 'onibus_viagem') {
        iconChar = '🚌';
        bgColor = 'bg-indigo-600';
      } else if (vehicle.type === 'viatura_prf') {
        iconChar = '🚓';
        bgColor = 'bg-cyan-600 animate-pulse';
      } else if (vehicle.type === 'ambulancia') {
        iconChar = '🚑';
        bgColor = 'bg-rose-600 animate-pulse';
      }

      const isPlayer = vehicle.isPlayerTrip;
      const markerHtml = `
        <div class="relative flex items-center justify-center w-7 h-7 rounded-full ${isPlayer ? 'bg-emerald-500 shadow-emerald-400/80 ring-4 ring-emerald-300' : bgColor} shadow-md text-xs border border-white/60 transition-transform">
          <span>${iconChar}</span>
          ${isPlayer ? '<div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></div>' : ''}
        </div>
      `;

      const vehicleIcon = L.divIcon({
        html: markerHtml,
        className: 'vehicle-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([vehicle.currentCoord[0], vehicle.currentCoord[1]], { icon: vehicleIcon });
      marker.bindTooltip(
        `<div class="text-xs p-1">
          <div class="font-bold text-cyan-300">${vehicle.name}</div>
          <div class="text-slate-300">${vehicle.type} &bull; Carga: R$ ${Math.round(vehicle.cargoValue || 0).toLocaleString('pt-BR')}</div>
        </div>`,
        { sticky: true }
      );

      vehiclesLayerRef.current?.addLayer(marker);
    });
  }, [vehicles, zoomLevel]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Atmospheric Amazon Rain Overlay */}
      {weatherRainActive && (
        <div className="pointer-events-none absolute inset-0 z-[400] bg-cyan-950/20 backdrop-contrast-125 overflow-hidden">
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] animate-pulse"></div>
          <div className="absolute top-20 left-4 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-xs shadow-lg backdrop-blur-md">
            <span className="animate-bounce">🌧️</span>
            <span>Chuva Tropical na Amazônia (Alerta de Lama na BR-230/BR-156)</span>
          </div>
        </div>
      )}
    </div>
  );
};
