// Viasmobs — interface focada no mapa: saldo, missão e duas ações principais.

import { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  CircleDollarSign,
  CloudRain,
  Construction,
  Filter,
  FlagTriangleRight,
  HelpCircle,
  Landmark,
  Layers,
  Map,
  Route,
  Satellite,
  Settings,
  Siren,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import type { City, GameEconomy, RegionInfo, Road, TileLayerType } from '../types/game';
import { getCityCrisisLevel } from '../utils/cityPolitics';

export type RoadFilterType = 'all' | 'dirt' | 'paved' | 'damaged' | 'tolls' | 'traffic';

interface ViasmobsHUDProps {
  economy: GameEconomy;
  cities: City[];
  roads: Road[];
  currentRegion: RegionInfo;
  notice: string | null;
  onOpenRoutes: () => void;
  onOpenWorks: () => void;
  onOpenRegions: () => void;
  onOpenBoss: () => void;
  onOpenTutorial: () => void;
  onOpenRules: () => void;
  onOpenLegend: () => void;
  onOpenSettings: () => void;
  tileLayer: TileLayerType;
  onChangeTileLayer: (layer: TileLayerType) => void;
  roadFilter: RoadFilterType;
  onChangeRoadFilter: (filter: RoadFilterType) => void;
  weatherRainActive: boolean;
  onToggleWeather: () => void;
  activePoliticalMissionCityId: string | null;
}

const money = (value: number) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`;

export function ViasmobsHUD({
  economy,
  cities,
  roads,
  currentRegion,
  notice,
  onOpenRoutes,
  onOpenWorks,
  onOpenRegions,
  onOpenBoss,
  onOpenTutorial,
  onOpenRules,
  onOpenLegend,
  onOpenSettings,
  tileLayer,
  onChangeTileLayer,
  roadFilter,
  onChangeRoadFilter,
  weatherRainActive,
  onToggleWeather,
  activePoliticalMissionCityId,
}: ViasmobsHUDProps) {
  const [showEconomy, setShowEconomy] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const incomePerMinute = (economy.taxRevenuePerSec + economy.tollRevenuePerSec + economy.tradeRevenuePerSec + economy.industryRevenuePerSec) * 60;
  const unlockedCities = cities.filter((city) => city.unlocked).length;
  const dominatedCities = cities.filter((city) => city.dominated || city.influence >= 95).length;
  const roadsNeedingWork = roads.filter((road) => road.type === 'terra' || road.condition < 65).length;
  const takenCities = cities.filter((city) => getCityCrisisLevel(city) === 'taken');
  const criticalCities = cities.filter((city) => getCityCrisisLevel(city) === 'critical');
  const selectedMissionCity = cities.find((city) => city.id === activePoliticalMissionCityId);
  const missionCity = selectedMissionCity ?? takenCities[0] ?? criticalCities[0];
  const missionIsReclaim = missionCity?.politics?.administration === 'rival';

  return (
    <div className="viasmobs-hud" aria-label="Central de comando Viasmobs">
      <header className="viasmobs-header">
        <div className="viasmobs-brand">
          <span className="viasmobs-mark"><Route size={22} strokeWidth={2.6} /></span>
          <div>
            <p>VIAS DE MOBILIDADE</p>
            <h1>VIASMOBS</h1>
          </div>
        </div>
        <div className="viasmobs-header-actions">
          <button className="economy-trigger" type="button" onClick={() => setShowEconomy((value) => !value)} aria-expanded={showEconomy}>
            <CircleDollarSign size={18} />
            <span><small>SALDO</small><strong>{money(economy.money)}</strong></span>
            <ChevronDown size={15} className={showEconomy ? 'rotate-180' : ''} />
          </button>
          <div className="mobile-quick-actions" aria-label="Atalhos móveis">
            <button className="icon-trigger" type="button" onClick={onOpenTutorial} title="Tutorial" aria-label="Abrir tutorial"><BookOpen size={17} /></button>
          </div>
          <button className="icon-trigger" type="button" onClick={() => setShowMore((value) => !value)} title="Abrir menu" aria-label="Abrir menu de mapa e jogo"><Map size={18} /></button>
          <button
            className={tileLayer === 'satellite' ? 'icon-trigger satellite-header-trigger active-mobile-layer' : 'icon-trigger satellite-header-trigger'}
            type="button"
            onClick={() => onChangeTileLayer(tileLayer === 'satellite' ? 'terrain' : 'satellite')}
            title={tileLayer === 'satellite' ? 'Voltar para terreno' : 'Abrir mapa satélite'}
            aria-label={tileLayer === 'satellite' ? 'Voltar para mapa de terreno' : 'Abrir mapa satélite'}
          >
            <Satellite size={17} />
          </button>
        </div>
      </header>

      <section className="mission-brief">
        <div className="mission-icon">{missionCity ? <Siren size={20} /> : <FlagTriangleRight size={20} />}</div>
        <div>
          <p>{missionCity ? missionIsReclaim ? 'MISSÃO URGENTE · RECONQUISTA' : selectedMissionCity?.id === missionCity.id ? 'MISSÃO ATIVA · DEFESA' : 'MISSÃO URGENTE · EVITAR GOLPE' : `OBJETIVO ATUAL · FASE ${currentRegion.phase}`}</p>
          <h2>{missionCity ? missionIsReclaim ? `Recupere ${missionCity.name}` : `Defenda ${missionCity.name}` : `Rede do ${currentRegion.name}`}</h2>
          <span>{missionCity
            ? missionIsReclaim
              ? 'Entregue rota, bairro e segurança para retomar a administração.'
              : `${missionCity.politics?.approval ?? 0}% de apoio · o rival está perto de tomar a cidade.`
            : `${dominatedCities}/${unlockedCities} cidades dominadas · ${roadsNeedingWork} vias em atenção`}</span>
        </div>
      </section>

      <section className="command-card">
        <p className="command-label">PRÓXIMA DECISÃO</p>
        <h2>Conecte cidades ou melhore uma via.</h2>
        <div className="command-actions">
          <button type="button" className="command-primary" onClick={onOpenRoutes}><Route size={17} /> Rotas</button>
          <button type="button" className="command-secondary" onClick={onOpenWorks}><Construction size={17} /> Obras</button>
        </div>
      </section>

      {showEconomy && (
        <aside className="economy-panel" aria-label="Como ganhar dinheiro">
          <div className="panel-title"><div><p>ECONOMIA</p><h2>Como financiar obras</h2></div><button type="button" onClick={() => setShowEconomy(false)} title="Fechar"><X size={17} /></button></div>
          <div className="income-total"><span>Entrada estimada</span><strong>{money(incomePerMinute)}<small>/min</small></strong></div>
          <div className="income-grid">
            <div><Landmark size={15} /><span>Impostos urbanos</span><strong>{money(economy.taxRevenuePerSec * 60)}/min</strong></div>
            <div><Sparkles size={15} /><span>Comércio e indústria</span><strong>{money((economy.tradeRevenuePerSec + economy.industryRevenuePerSec) * 60)}/min</strong></div>
            <div><CircleDollarSign size={15} /><span>Pedágios</span><strong>{money(economy.tollRevenuePerSec * 60)}/min</strong></div>
          </div>
          <div className="money-tips"><p><b>1.</b> Faça viagens e desenvolva cidades.</p><p><b>2.</b> Construa pedágios em vias importantes.</p></div>
        </aside>
      )}

      {showMore && (
        <div className="more-menu">
          <div className="map-layer-switcher">
            <span><Layers size={14} /> Camada do mapa</span>
            <div>
              <button type="button" className={tileLayer === 'osm' ? 'active-layer' : ''} onClick={() => onChangeTileLayer('osm')}>Base</button>
              <button type="button" className={tileLayer === 'terrain' ? 'active-layer' : ''} onClick={() => onChangeTileLayer('terrain')}>Terreno</button>
              <button type="button" className={tileLayer === 'satellite' ? 'active-layer' : ''} onClick={() => onChangeTileLayer('satellite')}>Satélite</button>
            </div>
          </div>
          <div className="map-layer-switcher">
            <span><Filter size={14} /> Mostrar vias</span>
            <div>
              <button type="button" className={roadFilter === 'all' ? 'active-layer' : ''} onClick={() => onChangeRoadFilter('all')}>Todas</button>
              <button type="button" className={roadFilter === 'dirt' ? 'active-layer' : ''} onClick={() => onChangeRoadFilter('dirt')}>Terra</button>
              <button type="button" className={roadFilter === 'damaged' ? 'active-layer' : ''} onClick={() => onChangeRoadFilter('damaged')}>Críticas</button>
            </div>
          </div>
          <button type="button" onClick={() => { onToggleWeather(); setShowMore(false); }}><CloudRain size={16} /> {weatherRainActive ? 'Desativar chuva' : 'Ativar chuva'}</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenRegions(); }}><Map size={16} /> Regiões</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenBoss(); }}><Trophy size={16} /> Desafio BR-230</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenTutorial(); }}><BookOpen size={16} /> Tutorial</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenRules(); }}><BookOpen size={16} /> Regras</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenLegend(); }}><HelpCircle size={16} /> Legenda</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenSettings(); }}><Settings size={16} /> Configurações</button>
        </div>
      )}

      {notice && <div className="game-notice" role="status">{notice}</div>}
    </div>
  );
}
