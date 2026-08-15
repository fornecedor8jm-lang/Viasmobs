// Viasmobs — painel mínimo de mobilidade: saldo, objetivo e ações essenciais acima do mapa.

import { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  CircleDollarSign,
  Construction,
  FlagTriangleRight,
  Landmark,
  Layers,
  Map,
  Route,
  Sparkles,
  Trophy,
  X,
  Settings,
  HelpCircle,
  Filter,
  CloudRain
} from 'lucide-react';
import type { City, GameEconomy, RegionInfo, Road, TileLayerType } from '../types/game';

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
}: ViasmobsHUDProps) {
  const [showEconomy, setShowEconomy] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const incomePerMinute = (economy.taxRevenuePerSec + economy.tollRevenuePerSec + economy.tradeRevenuePerSec + economy.industryRevenuePerSec) * 60;
  const unlockedCities = cities.filter((city) => city.unlocked).length;
  const dominatedCities = cities.filter((city) => city.dominated || city.influence >= 95).length;
  const roadsNeedingWork = roads.filter((road) => road.type === 'terra' || road.condition < 65).length;

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
          <button className="icon-trigger" type="button" onClick={() => setShowFilters(val => !val)} title="Filtros do Mapa"><Filter size={18} /></button>
          <button className="icon-trigger" type="button" onClick={onOpenLegend} title="Ver Legenda do Mapa"><HelpCircle size={18} /></button>
          <button className="icon-trigger" type="button" onClick={onOpenTutorial} title="Ver tutorial"><BookOpen size={18} /></button>
          <button className="icon-trigger" type="button" onClick={onOpenSettings} title="Configurações & Save"><Settings size={18} /></button>
          <button className="icon-trigger" type="button" onClick={() => setShowMore((value) => !value)} title="Mais opções"><Map size={18} /></button>
        </div>
      </header>

      {/* Filter Chips Bar */}
      {showFilters && (
        <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-xl overflow-x-auto text-[11px] font-semibold text-slate-200">
          <span className="text-[10px] text-slate-400 uppercase font-bold pl-1 shrink-0">Filtro de Vias:</span>
          
          <button
            onClick={() => onChangeRoadFilter('all')}
            className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${roadFilter === 'all' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            Todas ({roads.length})
          </button>

          <button
            onClick={() => onChangeRoadFilter('dirt')}
            className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${roadFilter === 'dirt' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            🪵 Terra ({roads.filter(r => r.type === 'terra').length})
          </button>

          <button
            onClick={() => onChangeRoadFilter('paved')}
            className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${roadFilter === 'paved' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            🛣️ Asfalto ({roads.filter(r => r.type !== 'terra').length})
          </button>

          <button
            onClick={() => onChangeRoadFilter('damaged')}
            className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${roadFilter === 'damaged' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            ⚠️ Críticas ({roads.filter(r => r.condition < 70).length})
          </button>

          <button
            onClick={() => onChangeRoadFilter('tolls')}
            className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${roadFilter === 'tolls' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            💰 Pedágios ({roads.filter(r => r.hasToll).length})
          </button>

          <button
            onClick={onToggleWeather}
            className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex items-center gap-1 transition ${weatherRainActive ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'bg-slate-800 hover:bg-slate-700'}`}
            title="Alternar Clima de Chuva"
          >
            <CloudRain size={13} />
            <span>{weatherRainActive ? 'Chuva Ativa' : 'Sol / Seco'}</span>
          </button>
        </div>
      )}

      <section className="mission-brief">
        <div className="mission-icon"><FlagTriangleRight size={20} /></div>
        <div>
          <p>OBJETIVO ATUAL · FASE {currentRegion.phase}</p>
          <h2>Fortaleça a rede do {currentRegion.name}</h2>
          <span>{dominatedCities}/{unlockedCities} cidades dominadas · {roadsNeedingWork} vias precisam de atenção</span>
        </div>
      </section>

      <section className="command-card">
        <p className="command-label">PRÓXIMA DECISÃO</p>
        <h2>Conecte cidades e transforme mobilidade em receita.</h2>
        <div className="command-actions">
          <button type="button" className="command-primary" onClick={onOpenRoutes}><Route size={17} /> Planejar rota</button>
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
          <div className="money-tips">
            <p><b>1.</b> Cidades desbloqueadas geram impostos continuamente.</p>
            <p><b>2.</b> Bairros com 50% de influência fortalecem indústria.</p>
            <p><b>3.</b> Pedágios rendem por minuto e viagens concluídas pagam prêmio.</p>
          </div>
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
          <button type="button" onClick={() => { setShowMore(false); onOpenRegions(); }}><Map size={16} /> Regiões</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenBoss(); }}><Trophy size={16} /> Desafio BR-230</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenRules(); }}><BookOpen size={16} /> Regras do jogo</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenLegend(); }}><HelpCircle size={16} /> Legenda do Mapa</button>
          <button type="button" onClick={() => { setShowMore(false); onOpenSettings(); }}><Settings size={16} /> Configurações & Save</button>
        </div>
      )}

      {notice && <div className="game-notice" role="status">{notice}</div>}
    </div>
  );
}

