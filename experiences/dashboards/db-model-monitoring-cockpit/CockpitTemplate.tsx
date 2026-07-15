/**
 * "The Cockpit" — the world-TEMPLATE. Carries the whole craft of
 * `db-model-monitoring-cockpit` and renders it from a typed {@link CockpitFill}
 * (content slots only). `CockpitPage` is now a thin wrapper that hands this
 * component the shipped fill; the rendered output is what the page rendered
 * before templatization.
 *
 * A bank's overnight watch on its production model fleet, in the visual register
 * of a dealing-floor instrument. The bespoke DriftScope owns the viewport; the
 * detail band beneath answers the scrutiny the scope invites.
 *
 * Anomaly: exactly one fleet model carries `breach` status — the single contact
 * past the limit ring (crosshair + callout on the scope, the breach row of the
 * watchlist, and the climax of the hero statement). The dossier auto-titles it
 * and derives its callout, trend labels, and ring labels from the fleet +
 * thresholds.
 *
 * Art-direction licence (task 12): this file and cockpit.css are the
 * experience-local art layer — raw colour values are permitted HERE (and only
 * here); shared components inside continue consuming tokens. The document theme
 * (dark) is locked by LiveExperience — not re-locked here.
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
import type { ChartOption, TrendChartSeriesInput } from '@enterprise-design/data-viz';
import { KpiTile, StatusList } from '@enterprise-design/content-components';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './cockpit.css';
import { DriftScope } from './DriftScope.js';
import type { CockpitContactStatus, CockpitFill, CockpitFleetModel } from './cockpit-fill.js';

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

function useTrendOption(reduced: boolean, series: TrendChartSeriesInput[], breach: number): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...series], {
      colors: [INK.amber, INK.slate],
      unit: 'PSI',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const xAxis = base.xAxis as Rec;
    const yAxis = base.yAxis as Rec;
    const seriesOption = (base.series as Rec[]).map((s) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      ...(s.id === 'psi'
        ? {
            markArea: {
              silent: true,
              itemStyle: { color: 'rgba(240, 160, 82, 0.07)' },
              data: [[{ yAxis: breach }, { yAxis: 0.35 }]],
            },
          }
        : { lineStyle: { ...(s.lineStyle as Rec), width: 1 } }),
    }));
    return {
      ...base,
      series: seriesOption,
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
  }, [reduced, series, breach]);
}

function useFeatureBarOption(reduced: boolean, features: CockpitFill['dossier']['featureDrift']): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...features], {
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
  }, [reduced, features]);
}

/* ---------------------------------------------------------------- */
/* Chrome pieces                                                     */
/* ---------------------------------------------------------------- */

function clockBaseSeconds(label: string): number {
  const [hh, mm, ss] = label.split(':').map((part) => Number(part));
  return (hh ?? 0) * 3600 + (mm ?? 0) * 60 + (ss ?? 0);
}

function formatClock(totalSeconds: number): string {
  const s = totalSeconds % 86_400;
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function WatchClock({ reduced, base, timezone }: { reduced: boolean; base: number; timezone: string }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);
  return (
    <span className="ck-clock" data-testid="watch-clock">
      {formatClock(base + elapsed)} {timezone}
    </span>
  );
}

const STATUS_GLYPH: Record<CockpitContactStatus, string> = {
  stable: '●',
  watch: '◇',
  breach: '⊕',
};

const STATUS_WORD: Record<CockpitContactStatus, string> = {
  stable: 'STABLE',
  watch: 'WATCH',
  breach: 'BREACH',
};

/* ---------------------------------------------------------------- */
/* The template                                                      */
/* ---------------------------------------------------------------- */

export default function CockpitTemplate({ fill }: { fill: CockpitFill }) {
  const { reduced } = useMotionPreference();
  const [paused, setPaused] = useState(false);

  const { watch, statement, thresholds, scope, fleet, dossier, log, instruments } = fill;
  const breaching = (fleet.models.find((m) => m.status === 'breach') ?? fleet.models[0]) as CockpitFleetModel;

  useEffect(() => {
    // Derived from the fill: a different monitoring story gets a truthful tab
    // title (" — Live" is the gallery live-route suffix, chrome not content).
    document.title = `${watch.pageTitle} — Live`;
  }, [watch.pageTitle]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'p' || event.key === 'P') setPaused((p) => !p);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const clockBase = useMemo(() => clockBaseSeconds(watch.clockLabel), [watch.clockLabel]);

  // The two trend series are DERIVED from the fill: the breaching model's PSI
  // history and a flat line at the breach limit (labels name whichever is flagged).
  const trendSeries = useMemo<TrendChartSeriesInput[]>(
    () => [
      { id: 'psi', label: `${breaching.name} PSI`, points: [...dossier.trendPoints] },
      {
        id: 'limit',
        label: `Breach limit ${thresholds.breach.toFixed(2)}`,
        points: dossier.trendPoints.map((p) => ({ x: p.x, y: thresholds.breach })),
      },
    ],
    [breaching.name, dossier.trendPoints, thresholds.breach],
  );

  const trendOption = useTrendOption(reduced, trendSeries, thresholds.breach);
  const trendTable = useMemo(() => buildTrendChartTable([...trendSeries]), [trendSeries]);
  const barOption = useFeatureBarOption(reduced, dossier.featureDrift);
  const barTable = useMemo(() => buildCategoryBarChartTable([...dossier.featureDrift]), [dossier.featureDrift]);

  const sectorLabel = (sectorId: string): string =>
    fleet.sectors.find((s) => s.id === sectorId)?.label ?? sectorId.toUpperCase();

  const scopeHeld = reduced || paused;
  const watchCount = fleet.models.filter((m) => m.status === 'watch').length;
  const breachCount = fleet.models.filter((m) => m.status === 'breach').length;

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
          <span>{watch.commandLine}</span>
        </div>
        <div className="ck-chrome-cell ck-chrome-tr">
          <WatchClock reduced={reduced} base={clockBase} timezone={watch.timezone} />
          <span className="ck-chrome-rule" aria-hidden="true" />
          <span>
            ENV {watch.environment} · {watch.refreshCadence}
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
              <dd>{String(fleet.models.length).padStart(2, '0')}</dd>
            </div>
            <div className="ck-readout-row">
              <dt>ON WATCH</dt>
              <dd>{String(watchCount).padStart(2, '0')}</dd>
            </div>
            <div className="ck-readout-row ck-readout-breach">
              <dt>IN BREACH</dt>
              <dd>{String(breachCount).padStart(2, '0')}</dd>
            </div>
            <div className="ck-readout-row">
              <dt>SWEEP</dt>
              <dd>{watch.sweepCadence}</dd>
            </div>
          </dl>
          <div className="ck-statement-block">
            <p className="ck-kicker">{statement.kicker}</p>
            <h1 id="ck-statement" className="ck-statement">
              {statement.lines.map((line, i) => (
                <span key={i} className="ck-statement-line" style={{ ['--ck-line' as string]: i }}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="ck-subline">{statement.subline}</p>
          </div>

          <figure className="ck-scope-figure">
            <DriftScope
              reduced={reduced}
              sectors={fleet.sectors}
              models={fleet.models}
              watch={thresholds.watch}
              breach={thresholds.breach}
              breachCalloutNote={scope.breachCalloutNote}
            />
            <figcaption>
              <VisuallyHidden>{scope.caption}</VisuallyHidden>
            </figcaption>
          </figure>

          <div className="ck-hero-foot">
            <dl className="ck-legend" aria-label="Scope legend">
              <div className="ck-legend-item">
                <dt aria-hidden="true" className="ck-legend-glyph ck-legend-stable">
                  ●
                </dt>
                <dd>STABLE · PSI &lt; {thresholds.watch.toFixed(2)}</dd>
              </div>
              <div className="ck-legend-item">
                <dt aria-hidden="true" className="ck-legend-glyph ck-legend-watch">
                  ◇
                </dt>
                <dd>
                  WATCH · {thresholds.watch.toFixed(2)}–{thresholds.breach.toFixed(2)}
                </dd>
              </div>
              <div className="ck-legend-item">
                <dt aria-hidden="true" className="ck-legend-glyph ck-legend-breach">
                  ⊕
                </dt>
                <dd>BREACH · BEYOND {thresholds.breach.toFixed(2)}</dd>
              </div>
              <div className="ck-legend-item ck-legend-note">
                <dt className="ck-vh-dt">Encoding</dt>
                <dd>{scope.encodingNote}</dd>
              </div>
            </dl>
            <p className="ck-hero-notice">
              <span>{watch.dataNotice}</span>
              <span>{watch.keyboardHint}</span>
            </p>
          </div>
        </section>

        <section className="ck-band" aria-labelledby="ck-watchlist-heading">
          <h2 id="ck-watchlist-heading" className="ck-band-heading">
            <span className="ck-band-index">01</span> {fleet.bandTitle}
            <span className="ck-band-sub">{fleet.bandSub}</span>
          </h2>
          <div className="ck-table-wrap">
            <table className="ck-table" data-testid="fleet-watchlist">
              <caption>
                <VisuallyHidden>{fleet.tableCaption}</VisuallyHidden>
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
                {fleet.models.map((model) => (
                  <tr key={model.id} data-status={model.status}>
                    <th scope="row">{model.name}</th>
                    <td>{sectorLabel(model.sectorId)}</td>
                    <td className="ck-num">{model.psi.toFixed(3)}</td>
                    <td className="ck-num">{thresholds.breach.toFixed(3)}</td>
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
            <span className="ck-band-index">02</span> {dossier.bandTitle} — {breaching.name.toUpperCase()}
            <span className="ck-band-sub">
              {dossier.bandSub} · LIMIT {thresholds.breach.toFixed(2)}
            </span>
          </h2>
          <div className="ck-dossier-grid">
            <div className="ck-panel ck-panel-trend">
              <h3 className="ck-panel-heading">{dossier.trendHeading}</h3>
              <ChartFigure
                title={dossier.trendChartTitle}
                sourceNote={dossier.trendChartSource}
                option={trendOption}
                tableColumns={trendTable.columns}
                tableRows={trendTable.rows}
                height={300}
                reducedMotion={reduced}
              />
            </div>
            <div className="ck-panel ck-panel-features">
              <h3 className="ck-panel-heading">{dossier.featureHeading}</h3>
              <ChartFigure
                title={dossier.featureChartTitle}
                sourceNote={dossier.featureChartSource}
                option={barOption}
                tableColumns={barTable.columns}
                tableRows={barTable.rows}
                height={300}
                reducedMotion={reduced}
              />
            </div>
            <div className="ck-panel ck-panel-facts">
              <h3 className="ck-panel-heading">{dossier.registerHeading}</h3>
              <dl className="ck-facts">
                {dossier.facts.map((fact) => (
                  <div key={fact.label} className="ck-fact">
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="ck-panel ck-panel-log">
              <h3 className="ck-panel-heading">{log.heading}</h3>
              {/* The header clock is UTC; the log's stamps must agree with it. */}
              <StatusList title={log.listTitle} items={[...log.items]} timeZone="UTC" />
            </div>
          </div>
        </section>

        <section className="ck-band" aria-labelledby="ck-instruments-heading">
          <h2 id="ck-instruments-heading" className="ck-band-heading">
            <span className="ck-band-index">03</span> {instruments.bandTitle}
            <span className="ck-band-sub">{instruments.bandSub}</span>
          </h2>
          <KpiTile title={instruments.kpiTitle} metrics={[...instruments.kpis]} className="ck-kpis" />
        </section>
      </main>

      <footer className="ck-footer">
        <span>{watch.dataNotice}</span>
        <span>
          {watch.lastRefresh} · {watch.nextRefresh} · {scopeHeld ? 'SWEEP HELD' : `SWEEP ${watch.sweepCadence}`}
        </span>
      </footer>
    </div>
  );
}
