/**
 * "The Model Risk Control Room, 02:47" — the live full-bleed rendering of
 * `db-model-monitoring-cockpit`.
 *
 * A bank's overnight watch on its production model fleet, in the visual
 * register of a dealing-floor instrument. The bespoke DriftScope owns the
 * viewport; the detail band beneath answers the scrutiny the scope invites.
 *
 * Art-direction licence (task 12): this file and cockpit.css are the
 * experience-local art layer — raw colour values are permitted HERE (and only
 * here); shared components inside continue consuming tokens (the page locks
 * the document theme to dark). Motion easings/durations remain token-driven.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { KpiTile, StatusList } from '@enterprise-design/content-components';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './cockpit.css';
import {
  BREACHING_MODEL,
  DOSSIER_FACTS,
  DRIFT_TREND_SERIES,
  FEATURE_DRIFT,
  FLEET,
  FLEET_KPIS,
  OVERNIGHT_LOG,
  PSI_BREACH_THRESHOLD,
  PSI_WATCH_THRESHOLD,
  SECTORS,
  STATEMENT,
  STATEMENT_SUBLINE,
  WATCH,
} from './content.js';
import type { ContactStatus } from './content.js';
import { DriftScope } from './DriftScope.js';

/* ---------------------------------------------------------------- */
/* Local chart ink (experience-local art layer — licence §1)         */
/* ---------------------------------------------------------------- */

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  amber: '#f0a052',
  phosphor: '#6fc7ae',
  slate: '#5d7484',
  axis: '#8fa1ab',
  grid: 'rgba(158, 197, 210, 0.14)',
  text: '#c7d3d9',
  panel: '#0b141b',
} as const;

type Rec = Record<string, unknown>;

function inkAxis(extra?: Rec): Rec {
  const { axisLabel, ...rest } = extra ?? {};
  return {
    axisLine: { lineStyle: { color: INK.grid } },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: INK.grid } },
    nameTextStyle: { color: INK.axis, fontFamily: MONO },
    ...rest,
    axisLabel: { color: INK.axis, fontFamily: MONO, fontSize: 10, ...(axisLabel as Rec) },
  };
}

function useTrendOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...DRIFT_TREND_SERIES], {
      colors: [INK.amber, INK.slate],
      unit: 'PSI',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const xAxis = base.xAxis as Rec;
    const yAxis = base.yAxis as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      ...(s.id === 'psi'
        ? {
            markArea: {
              silent: true,
              itemStyle: { color: 'rgba(240, 160, 82, 0.07)' },
              data: [[{ yAxis: PSI_BREACH_THRESHOLD }, { yAxis: 0.35 }]],
            },
          }
        : { lineStyle: { ...(s.lineStyle as Rec), width: 1 } }),
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.axis },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 2,
        textStyle: { color: INK.axis, fontFamily: MONO, fontSize: 10 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.panel,
        borderColor: INK.grid,
        textStyle: { color: INK.text, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: { ...xAxis, ...inkAxis({ axisLabel: { interval: 13 }, splitLine: { show: false } }) },
      yAxis: { ...yAxis, max: 0.35, ...inkAxis() },
    } as ChartOption;
  }, [reduced]);
}

function useFeatureBarOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...FEATURE_DRIFT], {
      colors: [INK.amber],
      unit: 'PSI',
      orientation: 'horizontal',
      reducedMotion: reduced,
    }) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      barWidth: 10,
      itemStyle: { ...(s.itemStyle as Rec), borderRadius: [0, 2, 2, 0] },
      label: { ...(s.label as Rec), color: INK.text, fontFamily: MONO, fontSize: 10 },
    }));
    return {
      ...base,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.axis },
      xAxis: { ...(base.xAxis as Rec), ...inkAxis() },
      yAxis: {
        ...(base.yAxis as Rec),
        ...inkAxis({ axisLabel: { fontSize: 10, color: INK.text }, splitLine: { show: false } }),
        inverse: true,
      },
      series,
    } as ChartOption;
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* Chrome pieces                                                     */
/* ---------------------------------------------------------------- */

const CLOCK_BASE_SECONDS = 2 * 3600 + 47 * 60 + 12; // 02:47:12

function formatClock(totalSeconds: number): string {
  const s = totalSeconds % 86_400;
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function WatchClock({ reduced }: { reduced: boolean }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);
  return (
    <span className="ck-clock" data-testid="watch-clock">
      {formatClock(CLOCK_BASE_SECONDS + elapsed)} {WATCH.timezone}
    </span>
  );
}

const STATUS_GLYPH: Record<ContactStatus, string> = {
  stable: '●',
  watch: '◇',
  breach: '⊕',
};

const STATUS_WORD: Record<ContactStatus, string> = {
  stable: 'STABLE',
  watch: 'WATCH',
  breach: 'BREACH',
};

function sectorLabel(sectorId: string): string {
  return SECTORS.find((s) => s.id === sectorId)?.label ?? sectorId.toUpperCase();
}

/* ---------------------------------------------------------------- */
/* The page                                                          */
/* ---------------------------------------------------------------- */

export default function CockpitPage() {
  const { reduced } = useMotionPreference();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.title = 'The Model Risk Control Room, 02:47 — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'p' || event.key === 'P') setPaused((p) => !p);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const trendOption = useTrendOption(reduced);
  const trendTable = useMemo(() => buildTrendChartTable([...DRIFT_TREND_SERIES]), []);
  const barOption = useFeatureBarOption(reduced);
  const barTable = useMemo(() => buildCategoryBarChartTable([...FEATURE_DRIFT]), []);

  const scopeHeld = reduced || paused;

  return (
    <div
      className="ck-root"
      data-testid="live-cockpit"
      data-reduced={reduced ? 'true' : undefined}
      data-paused={paused ? 'true' : undefined}
    >
      <header className="ck-chrome" aria-label="Control room chrome">
        <div className="ck-chrome-cell ck-chrome-tl">
          <RouterLink to="/" className="ck-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ck-chrome-rule" aria-hidden="true" />
          <span>{WATCH.commandLine}</span>
        </div>
        <div className="ck-chrome-cell ck-chrome-tr">
          <WatchClock reduced={reduced} />
          <span className="ck-chrome-rule" aria-hidden="true" />
          <span>
            ENV {WATCH.environment} · {WATCH.refreshCadence}
          </span>
          <span className="ck-chrome-rule" aria-hidden="true" />
          <span className={scopeHeld ? 'ck-live-flag ck-live-flag-held' : 'ck-live-flag'}>
            {scopeHeld ? 'SCOPE HELD ◦' : 'SCOPE LIVE ●'}
          </span>
          <button
            type="button"
            className="ck-pause"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? 'RESUME SWEEP' : 'HOLD SWEEP'}
          </button>
        </div>
      </header>

      <main className="ck-main">
        <section className="ck-hero" aria-labelledby="ck-statement">
          <dl className="ck-readout" aria-label="Watch readout">
            <div className="ck-readout-row">
              <dt>CONTACTS</dt>
              <dd>{String(FLEET.length).padStart(2, '0')}</dd>
            </div>
            <div className="ck-readout-row">
              <dt>ON WATCH</dt>
              <dd>{String(FLEET.filter((m) => m.status === 'watch').length).padStart(2, '0')}</dd>
            </div>
            <div className="ck-readout-row ck-readout-breach">
              <dt>IN BREACH</dt>
              <dd>{String(FLEET.filter((m) => m.status === 'breach').length).padStart(2, '0')}</dd>
            </div>
            <div className="ck-readout-row">
              <dt>SWEEP</dt>
              <dd>9 S / REV</dd>
            </div>
          </dl>
          <div className="ck-statement-block">
            <p className="ck-kicker">THE MODEL RISK CONTROL ROOM · 02:47</p>
            <h1 id="ck-statement" className="ck-statement">
              {STATEMENT.map((line, i) => (
                <span key={i} className="ck-statement-line" style={{ ['--ck-line' as string]: i }}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="ck-subline">{STATEMENT_SUBLINE}</p>
          </div>

          <figure className="ck-scope-figure">
            <DriftScope reduced={reduced} />
            <figcaption>
              <VisuallyHidden>
                Fleet drift scope: twelve production models plotted by 30-day population
                stability index within four business-line sectors. {BREACHING_MODEL.name} is
                beyond the 0.25 breach limit at PSI {BREACHING_MODEL.psi}. The fleet watchlist
                table below carries the same data.
              </VisuallyHidden>
            </figcaption>
          </figure>

          <div className="ck-hero-foot">
            <dl className="ck-legend" aria-label="Scope legend">
              <div className="ck-legend-item">
                <dt aria-hidden="true" className="ck-legend-glyph ck-legend-stable">
                  ●
                </dt>
                <dd>STABLE · PSI &lt; {PSI_WATCH_THRESHOLD.toFixed(2)}</dd>
              </div>
              <div className="ck-legend-item">
                <dt aria-hidden="true" className="ck-legend-glyph ck-legend-watch">
                  ◇
                </dt>
                <dd>
                  WATCH · {PSI_WATCH_THRESHOLD.toFixed(2)}–{PSI_BREACH_THRESHOLD.toFixed(2)}
                </dd>
              </div>
              <div className="ck-legend-item">
                <dt aria-hidden="true" className="ck-legend-glyph ck-legend-breach">
                  ⊕
                </dt>
                <dd>BREACH · BEYOND {PSI_BREACH_THRESHOLD.toFixed(2)}</dd>
              </div>
              <div className="ck-legend-item ck-legend-note">
                <dt className="ck-vh-dt">Encoding</dt>
                <dd>RADIUS = 30-DAY PSI · SECTOR = BUSINESS LINE</dd>
              </div>
            </dl>
            <p className="ck-hero-notice">
              <span>{WATCH.dataNotice}</span>
              <span>{WATCH.keyboardHint}</span>
            </p>
          </div>
        </section>

        <section className="ck-band" aria-labelledby="ck-watchlist-heading">
          <h2 id="ck-watchlist-heading" className="ck-band-heading">
            <span className="ck-band-index">01</span> FLEET WATCHLIST
            <span className="ck-band-sub">TEXTUAL MIRROR OF THE SCOPE · 12 CONTACTS</span>
          </h2>
          <div className="ck-table-wrap">
            <table className="ck-table" data-testid="fleet-watchlist">
              <caption>
                <VisuallyHidden>
                  Fleet watchlist — the drift scope&apos;s contents as a table. Twelve models
                  with sector, 30-day PSI, limit, status, owner, and last retrain date.
                </VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">CONTACT</th>
                  <th scope="col">SECTOR</th>
                  <th scope="col" className="ck-num">
                    PSI 30D
                  </th>
                  <th scope="col" className="ck-num">
                    LIMIT
                  </th>
                  <th scope="col">STATUS</th>
                  <th scope="col">OWNER</th>
                  <th scope="col">LAST RETRAIN</th>
                </tr>
              </thead>
              <tbody>
                {FLEET.map((model) => (
                  <tr key={model.id} data-status={model.status}>
                    <th scope="row">{model.name}</th>
                    <td>{sectorLabel(model.sectorId)}</td>
                    <td className="ck-num">{model.psi.toFixed(3)}</td>
                    <td className="ck-num">{PSI_BREACH_THRESHOLD.toFixed(3)}</td>
                    <td>
                      <span className={`ck-status ck-status-${model.status}`}>
                        <span aria-hidden="true">{STATUS_GLYPH[model.status]}</span>{' '}
                        {STATUS_WORD[model.status]}
                      </span>
                    </td>
                    <td>{model.owner}</td>
                    <td className="ck-num">{model.lastRetrain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ck-band" aria-labelledby="ck-dossier-heading">
          <h2 id="ck-dossier-heading" className="ck-band-heading">
            <span className="ck-band-index">02</span> THE DOSSIER — CARD-FRAUD-V4
            <span className="ck-band-sub">
              WHY THE SCOPE IS POINTING AT IT · LIMIT {PSI_BREACH_THRESHOLD.toFixed(2)}
            </span>
          </h2>
          <div className="ck-dossier-grid">
            <div className="ck-panel ck-panel-trend">
              <h3 className="ck-panel-heading">DRIFT · 90 DAYS VS LIMIT</h3>
              <ChartFigure
                title="card-fraud-v4 — population stability index, 90 days"
                sourceNote={`Daily 30-day-window PSI vs the ${PSI_BREACH_THRESHOLD.toFixed(2)} breach limit. Synthetic demonstration data.`}
                option={trendOption}
                tableColumns={trendTable.columns}
                tableRows={trendTable.rows}
                height={300}
                reducedMotion={reduced}
              />
            </div>
            <div className="ck-panel ck-panel-features">
              <h3 className="ck-panel-heading">FEATURE CONTRIBUTIONS TO DRIFT</h3>
              <ChartFigure
                title="card-fraud-v4 — feature-level PSI contribution"
                sourceNote="Top six features by contribution to composite PSI. Synthetic demonstration data."
                option={barOption}
                tableColumns={barTable.columns}
                tableRows={barTable.rows}
                height={300}
                reducedMotion={reduced}
              />
            </div>
            <div className="ck-panel ck-panel-facts">
              <h3 className="ck-panel-heading">REGISTER ENTRY</h3>
              <dl className="ck-facts">
                {DOSSIER_FACTS.map((fact) => (
                  <div key={fact.label} className="ck-fact">
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="ck-panel ck-panel-log">
              <h3 className="ck-panel-heading">OVERNIGHT LOG</h3>
              <StatusList title="Overnight event log" items={[...OVERNIGHT_LOG]} />
            </div>
          </div>
        </section>

        <section className="ck-band" aria-labelledby="ck-instruments-heading">
          <h2 id="ck-instruments-heading" className="ck-band-heading">
            <span className="ck-band-index">03</span> SUPPORTING INSTRUMENTATION
            <span className="ck-band-sub">FLEET-LEVEL GAUGES · SUBORDINATE TO THE SCOPE</span>
          </h2>
          <KpiTile title="Fleet gauges" metrics={[...FLEET_KPIS]} className="ck-kpis" />
        </section>
      </main>

      <footer className="ck-footer">
        <span>{WATCH.dataNotice}</span>
        <span>
          {WATCH.lastRefresh} · NEXT 02:48:12 · {scopeHeld ? 'SWEEP HELD' : 'SWEEP 9 S / REV'}
        </span>
      </footer>
    </div>
  );
}
