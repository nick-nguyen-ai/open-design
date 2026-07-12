/**
 * "The River" — the live full-bleed rendering of `deck-transformation-roadmap`.
 *
 * A multi-year transformation told as ONE continuous waterway. A single
 * luminous ROUTE SPINE — a bespoke SVG river — persists across every slide and
 * PANS as the deck advances, so the audience always knows where on the journey
 * they stand. Three reaches (H1/H2/H3), nine stations on the spine, two
 * confluences where workstreams merge, and ONE narrows flagged CAPACITY
 * CONSTRAINT where two builds compete for the same engineering pool — the
 * spine visibly thins there. The route ledger is the page's accessible mirror.
 * Keyboard-driven (←/→/Home/End, N jumps to the narrows), `?slide=`
 * deep-linkable, printable one slide per page.
 *
 * Art-direction licence (task 16): this file and river.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven; reduced motion collapses slide turns
 * and the spine pan to a static, stepped position.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-mono/700.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import './river.css';
import {
  PROGRAMME,
  RIVER,
  RIVER_NODES,
  STATIONS,
  TRIBUTARIES,
  SLIDES,
  SLIDE_COUNT,
  STATUS_GLYPH,
  STATUS_LABEL,
  BENEFIT_SERIES,
  reachById,
  stationsForRefs,
  slideNumberForId,
} from './content.js';
import type { Slide, Station } from './content.js';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  glow: '#3fd9c4',
  water: '#12525f',
  muted: '#7fa298',
  ink: '#e8f5f0',
  grid: 'rgba(159, 210, 195, 0.14)',
} as const;

type Rec = Record<string, unknown>;

/* ---------------------------------------------------------------- */
/* Build wrapper                                                    */
/* ---------------------------------------------------------------- */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
  ...rest
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'dl';
} & Record<string, unknown>) {
  return (
    <Tag
      className={className ? `rv-build ${className}` : 'rv-build'}
      style={{ ['--rv-i' as string]: i }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* The river — commanding bespoke visual + pan                     */
/* ---------------------------------------------------------------- */

function RiverSpine({ slide, drawing }: { slide: Slide; drawing: boolean }) {
  const s = slide.focus.scale;
  const tx = 1175 - s * slide.focus.x;
  const ty = 270 - s * slide.focus.y;
  const pan = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s})`;

  return (
    <div className="rv-river-viewport" aria-hidden="true">
      <svg
        className="rv-river-svg"
        viewBox={RIVER.viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          <linearGradient id="rv-water-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0d3a44" stopOpacity="0.92" />
            <stop offset="0.5" stopColor="#1a6675" stopOpacity="0.96" />
            <stop offset="1" stopColor="#0f4653" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="rv-centre-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6ff0dd" />
            <stop offset="1" stopColor="#3fd9c4" />
          </linearGradient>
        </defs>
        <g className="rv-pan" style={{ ['--rv-pan' as string]: pan }}>
          {/* Tributaries feeding the confluences */}
          {TRIBUTARIES.map((t) => (
            <path key={t.id} className="rv-trib" d={t.d} />
          ))}
          {/* The water body — tapering ribbon */}
          <path className="rv-ribbon" d={RIVER.ribbonPath} />
          {/* The luminous thalweg — draws in from source to sea */}
          <path
            className="rv-centre"
            d={RIVER.centrePath}
            data-draw={drawing ? 'true' : undefined}
            style={{ ['--rv-centre-len' as string]: RIVER.centreLength }}
          />
          {/* Narrows marker */}
          <g className="rv-narrows-flag">
            <line
              x1={RIVER_NODES[6]!.x}
              y1={RIVER_NODES[6]!.y - 74}
              x2={RIVER_NODES[6]!.x}
              y2={RIVER_NODES[6]!.y + 74}
            />
            <text
              className="rv-svg-label rv-svg-label-warn"
              x={RIVER_NODES[6]!.x}
              y={RIVER_NODES[6]!.y - 46}
              textAnchor="middle"
            >
              CAPACITY CONSTRAINT
            </text>
          </g>
          {/* Stations on the spine */}
          {STATIONS.map((st) => {
            const p = RIVER.stationPoints[st.ref]!;
            const focused =
              slide.kind === 'reach' && reachById(slide.reachId).stationRefs.includes(st.ref);
            const above = st.node % 2 === 1;
            return (
              <g key={st.ref}>
                {focused ? <circle className="rv-station-ring" cx={p.x} cy={p.y} r={13} /> : null}
                <circle
                  className="rv-station-dot"
                  cx={p.x}
                  cy={p.y}
                  r={6.5}
                  data-status={st.status}
                  data-focus={focused ? 'true' : undefined}
                />
                <text
                  className={`rv-svg-label-ref${st.narrows ? ' rv-svg-label-warn' : ''}`}
                  x={p.x}
                  y={above ? p.y - 16 : p.y + 24}
                  textAnchor="middle"
                >
                  {st.ref}
                </text>
                <text
                  className="rv-svg-date"
                  x={p.x}
                  y={above ? p.y - 30 : p.y + 37}
                  textAnchor="middle"
                >
                  {st.date}
                </text>
                {st.confluence ? (
                  <text
                    className="rv-svg-label"
                    x={p.x + 10}
                    y={above ? p.y - 44 : p.y + 52}
                    fontSize={9}
                    fill={INK.glow}
                  >
                    ⋔
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/** The whole spine squashed to a hairline locator; the active position lit. */
function ChromeMap({ x, y }: { x: number; y: number }) {
  return (
    <span className="rv-chrome-map" aria-hidden="true">
      <svg viewBox="0 40 2350 460" preserveAspectRatio="none">
        <path
          d={RIVER.centrePath}
          fill="none"
          stroke={INK.grid}
          strokeWidth={10}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={x} cy={y} r={34} fill={INK.glow} />
      </svg>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Benefits chart                                                   */
/* ---------------------------------------------------------------- */

function useBenefitOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...BENEFIT_SERIES], {
      colors: [INK.muted, INK.glow],
      unit: '£m',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 10 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((ser) => ({
      ...ser,
      symbolSize: 6,
      lineStyle: { ...(ser.lineStyle as Rec), width: ser.id === 'benefit' ? 2.6 : 1.6 },
      areaStyle:
        ser.id === 'benefit'
          ? { color: 'rgba(63, 217, 196, 0.12)' }
          : undefined,
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 2,
        itemGap: 24,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#06232a',
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 48, right: 20, top: 42, bottom: 30, containLabel: true },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk,
        // Every FY quarter stays named on the category axis.
        axisLabel: { ...axisInk.axisLabel, interval: 0 },
        splitLine: { show: false },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        splitLine: { lineStyle: { color: INK.grid, type: 'dashed' } },
      },
    } as ChartOption;
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* Station card                                                    */
/* ---------------------------------------------------------------- */

function StationCard({ station, i }: { station: Station; i: number }) {
  return (
    <Build i={i} as="li" className="rv-station" data-narrows={station.narrows ? 'true' : undefined}>
      <span className="rv-station-top">
        <span className="rv-station-ref">{station.ref}</span>
        <span className="rv-station-date">{station.date}</span>
        <span className="rv-station-status">{STATUS_LABEL[station.status]}</span>
      </span>
      <span className="rv-station-name">{station.name}</span>
      {station.confluence ? <span className="rv-station-conf">⋔ {station.confluence}</span> : null}
      <span className="rv-station-note">{station.note}</span>
    </Build>
  );
}

/* ---------------------------------------------------------------- */
/* Route ledger (accessible mirror)                                */
/* ---------------------------------------------------------------- */

function RouteLedger() {
  return (
    <ol className="rv-ledger" data-testid="route-ledger">
      {STATIONS.map((st, i) => (
        <Build key={st.ref} i={i} as="li" className="rv-ledger-row" data-narrows={st.narrows ? 'true' : undefined}>
          <span className="rv-ledger-ref">{st.ref}</span>
          <span className="rv-ledger-name">
            <b>{st.name}</b>
            {st.confluence ? <span className="rv-ledger-conf">⋔ {st.confluence}</span> : null}
          </span>
          <span className="rv-ledger-meta">
            <span className="rv-ledger-date">{st.date}</span>
            <span className="rv-ledger-status">
              <span aria-hidden="true" className={st.status === 'at-risk' ? 'rv-glyph-atrisk' : ''}>
                {STATUS_GLYPH[st.status]}
              </span>{' '}
              {STATUS_LABEL[st.status]}
            </span>
          </span>
        </Build>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------- */
/* Slide bodies                                                    */
/* ---------------------------------------------------------------- */

function SlideBody({ slide, reduced, chartActive }: { slide: Slide; reduced: boolean; chartActive: boolean }) {
  const benefitOption = useBenefitOption(reduced);
  const benefitTable = useMemo(() => buildTrendChartTable([...BENEFIT_SERIES]), []);

  switch (slide.kind) {
    case 'thesis':
      return (
        <div className="rv-body rv-panel">
          <Build i={0}>
            <p className="rv-eyebrow">{slide.eyebrow}</p>
          </Build>
          <h2 className="rv-display">
            {slide.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="rv-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={slide.titleLines.length + 1}>
            <p className="rv-thesis">{slide.thesis}</p>
          </Build>
          <Build i={slide.titleLines.length + 2}>
            <div className="rv-front-meta">
              {slide.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );

    case 'overview':
      return (
        <div className="rv-overview-grid">
          <div className="rv-body rv-panel">
            <Build i={0}>
              <p className="rv-kicker">{slide.kicker}</p>
            </Build>
            <Build i={1}>
              <h2 className="rv-heading">{slide.heading}</h2>
            </Build>
            <Build i={2}>
              <p className="rv-standfirst">{slide.standfirst}</p>
            </Build>
          </div>
          <div className="rv-body rv-panel">
            <Build i={1}>
              <p className="rv-kicker">ROUTE LEDGER · NINE STATIONS</p>
            </Build>
            <RouteLedger />
          </div>
        </div>
      );

    case 'reach': {
      const reach = reachById(slide.reachId);
      const stations = stationsForRefs(reach.stationRefs);
      return (
        <div className="rv-body rv-panel">
          <Build i={0} className="rv-reach-head">
            <span className="rv-reach-label">{reach.label}</span>
            <span className="rv-reach-horizon">{reach.horizon}</span>
            <span className="rv-reach-theme">{reach.theme}</span>
          </Build>
          <Build i={1}>
            <p className="rv-standfirst">{reach.standfirst}</p>
          </Build>
          <ol className="rv-stations">
            {stations.map((st, i) => (
              <StationCard key={st.ref} station={st} i={i + 2} />
            ))}
          </ol>
        </div>
      );
    }

    case 'narrows':
      return (
        <div className="rv-body rv-panel">
          <Build i={0}>
            <p className="rv-kicker rv-kicker-warn">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="rv-heading">{slide.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="rv-standfirst">{slide.standfirst}</p>
          </Build>
          <dl className="rv-narrows-grid" data-testid="narrows-points">
            {slide.points.map((pt, i) => (
              <Build key={pt.label} i={i + 3} className="rv-narrows-point" as="div">
                <dt>{pt.label}</dt>
                <dd>{pt.value}</dd>
              </Build>
            ))}
          </dl>
          <Build i={slide.points.length + 3}>
            <p className="rv-resolution">{slide.resolution}</p>
          </Build>
        </div>
      );

    case 'confluence':
      return (
        <div className="rv-body rv-panel">
          <Build i={0}>
            <p className="rv-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="rv-heading">{slide.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="rv-standfirst">{slide.standfirst}</p>
          </Build>
          <ol className="rv-joins">
            {slide.joins.map((j, i) => (
              <Build key={j.workstream} i={i + 3} as="li" className="rv-join">
                <span className="rv-join-ws">{j.workstream}</span>
                <span className="rv-join-at">{j.at}</span>
                <span className="rv-join-brings">{j.brings}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'benefits':
      return (
        <div className="rv-benefits-grid">
          <div className="rv-benefits-side rv-body rv-panel">
            <Build i={0}>
              <p className="rv-kicker">{slide.kicker}</p>
            </Build>
            <Build i={1}>
              <h2 className="rv-heading">{slide.heading}</h2>
            </Build>
            <Build i={2}>
              <p className="rv-reading">{slide.reading}</p>
            </Build>
            <Build i={3}>
              <p className="rv-crossover">◆ {slide.crossover}</p>
            </Build>
          </div>
          <Build i={2} className="rv-chart-wrap">
            <ChartFigure
              key={chartActive ? 'entered' : 'parked'}
              title={slide.caption}
              sourceNote={slide.source}
              option={benefitOption}
              tableColumns={benefitTable.columns}
              tableRows={benefitTable.rows}
              height={360}
              reducedMotion={reduced}
              className="rv-chart"
            />
          </Build>
        </div>
      );

    case 'commitments':
      return (
        <div className="rv-body rv-panel">
          <Build i={0}>
            <p className="rv-kicker">{slide.kicker}</p>
          </Build>
          <h2 className="rv-display">
            {slide.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="rv-line">{line}</span>
              </Build>
            ))}
          </h2>
          <ol className="rv-commitments">
            {slide.commitments.map((c, i) => (
              <Build key={c.ref} i={slide.titleLines.length + 1 + i} as="li" className="rv-commitment">
                <span className="rv-commitment-ref">{c.ref}</span>
                <span className="rv-commitment-text">{c.text}</span>
              </Build>
            ))}
          </ol>
          <Build i={slide.titleLines.length + 1 + slide.commitments.length}>
            <div className="rv-front-meta">
              {slide.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );
  }
}

/* ---------------------------------------------------------------- */
/* The deck                                                        */
/* ---------------------------------------------------------------- */

export default function RiverDeckPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const [indexOpen, setIndexOpen] = useState(false);
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = `The River — ${PROGRAMME.name}, ${PROGRAMME.horizon} — Live`;
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'n' || event.key === 'N') {
        const n = slideNumberForId('narrows');
        if (n) goTo(n);
      }
      if (event.key === 'i' || event.key === 'I') setIndexOpen((open) => !open);
      if (event.key === 'Escape') setIndexOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  const drawing = activeSlide.kind === 'overview';
  const chartActive = activeSlide.kind === 'benefits';

  return (
    <div className="rv-root" data-testid="live-river" data-reduced={reduced ? 'true' : undefined}>
      <header className="rv-chrome" aria-label="Programme chrome">
        <div className="rv-chrome-cell">
          <RouterLink to="/" className="rv-back">
            ◄ GALLERY
          </RouterLink>
          <span className="rv-chrome-rule" aria-hidden="true" />
          <span>{PROGRAMME.name}</span>
        </div>
        <div className="rv-chrome-cell">
          <ChromeMap x={activeSlide.focus.x} y={activeSlide.focus.y} />
          <span className="rv-chrome-rule" aria-hidden="true" />
          <span data-testid="river-counter" aria-live="polite">
            {counter} · {activeSlide.place}
          </span>
          <span className="rv-chrome-rule" aria-hidden="true" />
          <button
            type="button"
            className="rv-index-toggle"
            aria-expanded={indexOpen}
            aria-controls="rv-index"
            onClick={() => setIndexOpen((open) => !open)}
          >
            REACHES
          </button>
        </div>
      </header>

      <nav
        id="rv-index"
        className="rv-index"
        aria-label="All slides"
        data-open={indexOpen ? 'true' : undefined}
        hidden={!indexOpen}
      >
        <p className="rv-index-heading">
          {PROGRAMME.name} · {SLIDE_COUNT} SLIDES
        </p>
        <ol className="rv-index-list">
          {SLIDES.map((slide, index) => (
            <li key={slide.id}>
              <button
                type="button"
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index + 1);
                  setIndexOpen(false);
                }}
              >
                <span className="rv-index-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{slide.indexTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="rv-main">
        <RiverSpine slide={activeSlide} drawing={drawing} />
        <h1>
          <VisuallyHidden>
            The River — {PROGRAMME.name}, a {PROGRAMME.horizon} transformation roadmap drawn as one
            continuous waterway in {SLIDE_COUNT} slides: three reaches, nine stations, two
            confluences and one flagged capacity constraint at the narrows (station{' '}
            {STATIONS.find((s) => s.narrows)?.ref}). The full route is listed as the route ledger on
            the overview slide. Currently on slide {activeNumber} of {SLIDE_COUNT}:{' '}
            {activeSlide.indexTitle}.
          </VisuallyHidden>
        </h1>
        <div className="rv-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="rv-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.indexTitle}`}
              >
                <SlideBody slide={slide} reduced={reduced} chartActive={chartActive} />
                <div className="rv-print-foot" aria-hidden="true">
                  {PROGRAMME.ref} · SLIDE {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} ·{' '}
                  {PROGRAMME.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="rv-footer">
        <span className="rv-footer-section" data-testid="slide-section">
          {activeSlide.section}
        </span>
        <span className="rv-footer-notice">{PROGRAMME.dataNotice}</span>
        <div className="rv-footer-nav">
          <span className="rv-hint">{PROGRAMME.keyboardHint}</span>
          <button
            type="button"
            className="rv-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="rv-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === SLIDE_COUNT - 1}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
