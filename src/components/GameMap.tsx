import React, { useEffect, useRef } from 'react';
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
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

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
  focusTarget
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const roadsLayerRef = useRef<L.LayerGroup | null>(null);
  const vehiclesLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Amapá / Brasil Norte
    const map = L.map(mapContainerRef.current, {
      center: [0.0355, -51.0705],
      zoom: 7,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialTile = L.tileLayer(TILE_PROVIDERS[tileLayer].url, {
      attribution: TILE_PROVIDERS[tileLayer].attribution,
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = initialTile;
    markersLayerRef.current = L.layerGroup().addTo(map);
    roadsLayerRef.current = L.layerGroup().addTo(map);
    vehiclesLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // FlyTo upon focus target changes
  useEffect(() => {
    if (!mapInstanceRef.current || !focusTarget) return;
    mapInstanceRef.current.flyTo([focusTarget.lat, focusTarget.lng], focusTarget.zoom, {
      duration: 1.2
    });
  }, [focusTarget]);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(TILE_PROVIDERS[tileLayer].url, {
      attribution: TILE_PROVIDERS[tileLayer].attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [tileLayer]);

  // Render Roads & Shortcuts
  useEffect(() => {
    if (!roadsLayerRef.current || !mapInstanceRef.current) return;
    roadsLayerRef.current.clearLayers();

    roads.forEach(road => {
      const isSelected = selectedRoad?.id === road.id;
      const isTransam = road.isTransamazonicaSector;
      const isTripRoad = activeTrip?.pathRoadIds.includes(road.id);

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

      // Outer glow for selected or transamazonica or trip route
      if (isSelected || isTransam || isTripRoad) {
        const glowPolyline = L.polyline(road.coordinates, {
          color: isTripRoad ? '#22c55e' : (isTransam ? '#dc2626' : '#38bdf8'),
          weight: weight + 6,
          opacity: 0.45,
          lineCap: 'round',
          lineJoin: 'round'
        });
        roadsLayerRef.current?.addLayer(glowPolyline);
      }

      const polyline = L.polyline(road.coordinates, {
        color,
        weight,
        opacity: 0.9,
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
      road.shortcuts.forEach(sc => {
        const scColor = sc.built ? '#10b981' : '#f59e0b';
        const scPoly = L.polyline(sc.coordinates, {
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
  }, [roads, selectedRoad, activeTrip]);

  // Render City Markers (Google Maps Place Pins)
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    cities.filter((city) => city.unlocked || pointA?.id === city.id || pointB?.id === city.id || selectedCity?.id === city.id).forEach(city => {
      const isPointA = pointA?.id === city.id;
      const isPointB = pointB?.id === city.id;
      const isSelected = selectedCity?.id === city.id;

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
          ${city.unlocked ? '<div class="absolute -inset-1 rounded-full bg-blue-500/20 city-pulse"></div>' : ''}
          <div class="relative flex items-center gap-1 px-2.5 py-1 rounded-full ${pinColor} shadow-xl border border-white/60 transition-transform transform group-hover:scale-110">
            <span class="text-xs">${iconEmoji}</span>
            <span class="text-xs font-bold font-display whitespace-nowrap tracking-tight">${city.name}</span>
            <span class="text-[9px] px-1 rounded bg-black/30 font-mono">${city.state}</span>
          </div>
          ${
            city.unlocked
              ? `<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-slate-950/90 border border-slate-700 text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 shadow">
                  <span>${Math.round(city.influence)}%</span>
                </div>`
              : `<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1 rounded bg-rose-950 text-[9px] text-rose-300 border border-rose-800">
                  🔒 Bloqueada
                </div>`
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
  }, [cities, pointA, pointB, selectedCity]);

  // Render Animated Vehicles
  useEffect(() => {
    if (!vehiclesLayerRef.current || !mapInstanceRef.current) return;
    vehiclesLayerRef.current.clearLayers();

    vehicles.forEach(vehicle => {
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

      const marker = L.marker(vehicle.currentCoord, { icon: vehicleIcon });
      marker.bindTooltip(
        `<div class="text-xs p-1">
          <div class="font-bold text-cyan-300">${vehicle.name}</div>
          <div class="text-slate-300">${vehicle.type} &bull; Carga: R$ ${vehicle.cargoValue.toLocaleString('pt-BR')}</div>
        </div>`,
        { sticky: true }
      );

      vehiclesLayerRef.current?.addLayer(marker);
    });
  }, [vehicles]);

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
