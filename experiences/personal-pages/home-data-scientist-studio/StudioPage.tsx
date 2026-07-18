/**
 * "The Studio" — the live full-bleed rendering of
 * `home-data-scientist-studio`.
 *
 * A craftsperson's bench at the bank, late afternoon: translucent panes
 * stacked over a deep dusk field, several correlated signals visible at
 * once, and one failed experiment kept on the shelf with its lesson —
 * honesty as design. HorizonSweep registers the panes onto the page's
 * datum line; everything settles to stillness.
 *
 * Art-direction licence (task 13): this file and studio.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 * Motion easings/durations remain token-driven; reduced motion collapses
 * the sweep to ordered opacity steps and stills the field.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector and consumed by the design skill): never rename or
 * remove one without updating LivePartIds.test.tsx.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { HorizonSweep, useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { StatusList } from '@enterprise-design/content-components';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './studio.css';
import {
  BENCH_LOG,
  CLUSTER_LABEL,
  CONSTELLATION,
  CONSTELLATION_EDGES,
  DRIFT_SERIES,
  DRIFT_WIDGET,
  EXPERIMENTS,
  EXPERIMENT_STATUS_LABEL,
  IDENTITY_FACTS,
  NOW,
  PERSON,
  SHELF,
  STATEMENT,
  STATEMENT_SUBLINE,
} from './content.js';
import type { SkillStar } from './content.js';

/* ---------------------------------------------------------------- */
/* Local chart ink (experience-local art layer — licence §1)         */
/* ---------------------------------------------------------------- */

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  text: '#e8eaf2',
  muted: '#a7b0c4',
  amber: '#f0b06d',
  cyan: '#7fd4e0',
  lavender: '#c0a8e8',
  grid: 'rgba(232, 234, 242, 0.12)',
  panel: '#1d2030',
} as const;

type Rec = Record<string, unknown>;

function useDriftOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...DRIFT_SERIES], {
      colors: [INK.cyan, INK.amber],
      unit: 'PSI',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 9 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      ...(s.id === 'watch'
        ? { lineStyle: { ...(s.lineStyle as Rec), width: 1, type: 'dashed' } }
        : {
            lineStyle: { ...(s.lineStyle as Rec), width: 2 },
            areaStyle: { color: 'rgba(127, 212, 224, 0.10)' },
          }),
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 12,
        itemHeight: 2,
        textStyle: { color: INK.muted, fontFamily: MONO, fontSize: 9 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.panel,
        borderColor: INK.grid,
        textStyle: { color: INK.text, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 40, right: 12, top: 32, bottom: 26 },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk,
        axisLabel: { ...axisInk.axisLabel, interval: 3 },
        splitLine: { show: false },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        max: 0.14,
        splitLine: { lineStyle: { color: INK.grid } },
      },
    } as ChartOption;
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* The constellation (bespoke SVG; mirrored by a plain list)         */
/* ---------------------------------------------------------------- */

const STAR_RADIUS: Record<SkillStar['depth'], number> = { 1: 1.0, 2: 1.5, 3: 2.1 };

function starById(id: string): SkillStar {
  return CONSTELLATION.find((star) => star.id === id) as SkillStar;
}

function Constellation() {
  return (
    <svg
      className="st-constellation"
      viewBox="0 0 100 86"
      role="img"
      aria-label="Skills constellation — mirrored by the list that follows"
      data-testid="skills-constellation"
      data-part-id="home-data-scientist-studio/constellation/skill-map"
    >
      {CONSTELLATION_EDGES.map(([fromId, toId]) => {
        const from = starById(fromId);
        const to = starById(toId);
        return (
          <line
            key={`${fromId}-${toId}`}
            className="st-edge"
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
          />
        );
      })}
      {CONSTELLATION.map((star) => (
        <g key={star.id} className={`st-star st-star-${star.cluster}`}>
          <circle className="st-star-halo" cx={star.x} cy={star.y} r={STAR_RADIUS[star.depth] * 2.4} />
          <circle className="st-star-core" cx={star.x} cy={star.y} r={STAR_RADIUS[star.depth]} />
          <text className="st-star-label" x={star.x} y={star.y - STAR_RADIUS[star.depth] - 2.2}>
            {star.label}
          </text>
        </g>
      ))}
      <text className="st-cluster-label" x={12} y={8}>
        CRAFT
      </text>
      <text className="st-cluster-label" x={72} y={8}>
        SYSTEMS
      </text>
      <text className="st-cluster-label" x={44} y={84}>
        VOICE
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Panes                                                             */
/* ---------------------------------------------------------------- */

function BenchRow({ reduced }: { reduced: boolean }) {
  const driftOption = useDriftOption(reduced);
  const driftTable = useMemo(() => buildTrendChartTable([...DRIFT_SERIES]), []);
  return (
    <div className="st-row st-row-bench" data-part-id="home-data-scientist-studio/bench">
      <section className="st-pane st-pane-now" aria-labelledby="st-now-heading" data-part-id="home-data-scientist-studio/bench/now-card">
        <h2 id="st-now-heading" className="st-pane-heading">
          NOW WORKING ON
        </h2>
        <p className="st-now-title">{NOW.title}</p>
        <p className="st-now-line">{NOW.line}</p>
        <p className="st-now-status">
          <span className="st-chip">{NOW.status}</span>
        </p>
        <dl className="st-checkpoints">
          {NOW.checkpoints.map((cp) => (
            <div key={cp.label} className="st-checkpoint">
              <dt>{cp.label}</dt>
              <dd>{cp.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="st-pane st-pane-drift" aria-labelledby="st-drift-heading" data-part-id="home-data-scientist-studio/bench/drift-chart">
        <h2 id="st-drift-heading" className="st-pane-heading">
          THE MODEL I WATCH
        </h2>
        <ChartFigure
          title={DRIFT_WIDGET.title}
          sourceNote={DRIFT_WIDGET.source}
          option={driftOption}
          tableColumns={driftTable.columns}
          tableRows={driftTable.rows}
          height={190}
          reducedMotion={reduced}
          className="st-drift-chart"
        />
        <p className="st-drift-caption">
          <span className="st-drift-value">PSI {DRIFT_WIDGET.current.toFixed(3)}</span>{' '}
          {DRIFT_WIDGET.caption}
        </p>
      </section>
    </div>
  );
}

function ExperimentShelf() {
  return (
    <section className="st-shelf-section" aria-labelledby="st-shelf-heading" data-part-id="home-data-scientist-studio/shelf">
      <h2 id="st-shelf-heading" className="st-section-heading">
        THE EXPERIMENT SHELF
        <span className="st-section-sub">HYPOTHESIS → STATUS → METRIC · THE FAILURE STAYS ON THE SHELF</span>
      </h2>
      <ul className="st-shelf" data-testid="experiment-shelf" data-part-id="home-data-scientist-studio/shelf/cards">
        {EXPERIMENTS.map((experiment) => (
          <li
            key={experiment.id}
            className="st-pane st-card"
            data-status={experiment.status}
          >
            <div className="st-card-head">
              <span className="st-card-code">{experiment.code}</span>
              <span className="st-chip st-chip-status" data-status={experiment.status}>
                {EXPERIMENT_STATUS_LABEL[experiment.status]}
              </span>
            </div>
            <p className="st-card-title">{experiment.title}</p>
            <p className="st-card-hypothesis">{experiment.hypothesis}</p>
            <p className="st-card-metric">{experiment.metric}</p>
            {experiment.lesson ? <p className="st-card-lesson">{experiment.lesson}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ConstellationRow() {
  return (
    <div className="st-row st-row-constellation">
      <section className="st-pane st-pane-constellation" aria-labelledby="st-const-heading" data-part-id="home-data-scientist-studio/constellation">
        <h2 id="st-const-heading" className="st-pane-heading">
          THE PRACTICE, AS A CONSTELLATION
        </h2>
        <Constellation />
        <dl className="st-const-mirror">
          {(['craft', 'systems', 'voice'] as const).map((cluster) => (
            <div key={cluster} className="st-const-cluster">
              <dt>{CLUSTER_LABEL[cluster]}</dt>
              <dd>
                {CONSTELLATION.filter((star) => star.cluster === cluster)
                  .map((star) => `${star.label} (${star.depth}/3)`)
                  .join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="st-pane st-pane-shelf" aria-labelledby="st-notes-heading" data-part-id="home-data-scientist-studio/notes">
        <h2 id="st-notes-heading" className="st-pane-heading">
          TALKS & NOTES
        </h2>
        <ul className="st-notes">
          {SHELF.map((item) => (
            <li key={item.id} className="st-note">
              <span className="st-note-kind">{item.kind}</span>
              <span className="st-note-body">
                <span className="st-note-title">{item.title}</span>
                <span className="st-note-meta">
                  {item.venue} · {item.date}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function BenchLog() {
  return (
    <section className="st-pane st-pane-log" aria-labelledby="st-log-heading" data-part-id="home-data-scientist-studio/log">
      <h2 id="st-log-heading" className="st-pane-heading">
        BENCH LOG
      </h2>
      <StatusList title="Bench log" items={[...BENCH_LOG]} />
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* The page                                                          */
/* ---------------------------------------------------------------- */

export default function StudioPage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Studio — Anaya Rao — Live';
  }, []);

  const panes = useMemo(
    () => [
      { id: 'bench', content: <BenchRow reduced={reduced} /> },
      { id: 'experiments', content: <ExperimentShelf /> },
      { id: 'constellation', content: <ConstellationRow /> },
      { id: 'log', content: <BenchLog /> },
    ],
    [reduced],
  );

  return (
    <div className="st-root" data-testid="live-studio" data-reduced={reduced ? 'true' : undefined}>
      <div className="st-field" aria-hidden="true" />
      <header className="st-chrome" aria-label="Studio chrome" data-part-id="home-data-scientist-studio/chrome">
        <div className="st-chrome-cell">
          <RouterLink to="/" className="st-back">
            ◄ GALLERY
          </RouterLink>
          <span className="st-chrome-rule" aria-hidden="true" />
          <span>THE STUDIO · PERSONAL PAGE</span>
        </div>
        <div className="st-chrome-cell">
          <span>{PERSON.timeOfDay}</span>
          <span className="st-chrome-rule" aria-hidden="true" />
          <span className="st-synthetic" data-testid="synthetic-mark">
            {PERSON.syntheticMark}
          </span>
        </div>
      </header>

      <main className="st-main">
        <section className="st-hero" aria-labelledby="st-statement" data-part-id="home-data-scientist-studio/hero">
          <div className="st-identity">
            <p className="st-name">{PERSON.name}</p>
            <p className="st-role">
              {PERSON.role.toUpperCase()} · {PERSON.team.toUpperCase()} · {PERSON.location}
            </p>
          </div>
          <h1 id="st-statement" className="st-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="st-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="st-subline">{STATEMENT_SUBLINE}</p>
          <dl className="st-facts" aria-label="Identity facts">
            {IDENTITY_FACTS.map((fact) => (
              <div key={fact.label} className="st-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a
            real member of staff. Production telemetry shown is synthetic demonstration data.
          </VisuallyHidden>
        </section>

        <HorizonSweep className="st-sweep" items={panes} />
      </main>

      <footer className="st-footer">
        <span>{PERSON.syntheticMark} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>
          {PERSON.since} · MODELS IN PRODUCTION {PERSON.modelsInProduction}
        </span>
      </footer>
    </div>
  );
}
