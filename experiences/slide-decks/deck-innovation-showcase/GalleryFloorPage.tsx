/**
 * "The Gallery Floor" — the live full-bleed rendering of
 * `deck-innovation-showcase`.
 *
 * The innovation portfolio as an EXHIBITION. A bespoke top-down FLOOR PLAN —
 * numbered halls and plinths — persists across the deck and pans/zooms across
 * the floor as the audience walks from exhibit to exhibit (reduced motion:
 * hard cut with a position label). Each exhibit is a piece (a real chart, a
 * monumental claim, or a row of measures) with a museum PLACARD and a status
 * band: IN PRODUCTION, PILOT, or the anomaly — a celebrated RETIRED piece
 * deliberately sunset. The floor plan doubles as the accessible mirror (the
 * catalogue list). Keyboard-driven (←/→/Home/End, R jumps to the retired
 * piece), `?slide=` deep-linkable, printable one exhibit per page.
 *
 * Art-direction licence (task 16): this file and gallery.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven.
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
import './gallery.css';
import {
  EXHIBITION,
  HALLS,
  FLOOR,
  EXHIBITS,
  SLIDES,
  SLIDE_COUNT,
  STATUS_LABEL,
  RETIRED_EXHIBIT,
  exhibitById,
  slideNumberForId,
} from './content.js';
import type { Exhibit, Piece, Slide } from './content.js';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  brass: '#d7a86e',
  brassSoft: '#eecfa3',
  muted: '#8f8371',
  ink: '#efe6d6',
  grid: 'rgba(215, 168, 110, 0.18)',
  gridSoft: 'rgba(215, 168, 110, 0.1)',
} as const;

type Rec = Record<string, unknown>;

/* ---------------------------------------------------------------- */
/* Build wrapper                                                   */
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
  as?: 'div' | 'li';
} & Record<string, unknown>) {
  return (
    <Tag
      className={className ? `gf-build ${className}` : 'gf-build'}
      style={{ ['--gf-i' as string]: i }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* The floor plan — commanding bespoke visual + pan                */
/* ---------------------------------------------------------------- */

function FloorPlan({ slide }: { slide: Slide }) {
  const s = slide.focus.scale;
  const tx = 800 - s * slide.focus.x;
  const ty = 500 - s * slide.focus.y;
  const pan = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s})`;
  const activeExhibitId = slide.kind === 'exhibit' ? slide.exhibitId : null;

  // A walkway polyline threading the plinths in catalogue order.
  const walk = [
    `${FLOOR.entrance.x} ${FLOOR.entrance.y}`,
    ...EXHIBITS.map((e) => `${e.plinth.x} ${e.plinth.y}`),
  ].join(' L ');

  return (
    <div className="gf-floor-viewport" aria-hidden="true">
      <svg
        className="gf-floor-svg"
        viewBox={FLOOR.viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          {EXHIBITS.map((e) => (
            <radialGradient key={e.id} id={`gf-spot-${e.id}`} cx="0.5" cy="0.5" r="0.5">
              <stop
                offset="0"
                stopColor={e.status === 'retired' ? '#e6c6c6' : '#f8efdd'}
                stopOpacity="0.6"
              />
              <stop
                offset="0.5"
                stopColor={e.status === 'retired' ? '#d6afaf' : '#f4e9d6'}
                stopOpacity="0.22"
              />
              <stop offset="1" stopColor="#f4e9d6" stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        <g className="gf-pan" style={{ ['--gf-pan' as string]: pan }}>
          {/* Walkway */}
          <path className="gf-walkway" d={`M ${walk}`} />

          {/* Halls */}
          {HALLS.map((h) => (
            <g key={h.id}>
              <rect className="gf-hall" x={h.rect.x} y={h.rect.y} width={h.rect.w} height={h.rect.h} rx={4} />
              <text className="gf-hall-no" x={h.rect.x + 16} y={h.rect.y + 30}>
                {h.no}
              </text>
              <text
                className="gf-hall-label"
                x={h.rect.x + h.rect.w / 2}
                y={h.rect.y + h.rect.h - 22}
                textAnchor="middle"
              >
                {h.label}
              </text>
            </g>
          ))}

          {/* Spotlight pools */}
          {EXHIBITS.map((e) => (
            <circle
              key={`spot-${e.id}`}
              className="gf-spot"
              cx={e.plinth.x}
              cy={e.plinth.y}
              r={190}
              fill={`url(#gf-spot-${e.id})`}
              data-active={e.id === activeExhibitId ? 'true' : undefined}
            />
          ))}

          {/* Plinths */}
          {EXHIBITS.map((e) => (
            <g key={`plinth-${e.id}`}>
              <rect
                className="gf-plinth"
                x={e.plinth.x - 30}
                y={e.plinth.y - 30}
                width={60}
                height={60}
                rx={3}
                data-status={e.status}
                data-active={e.id === activeExhibitId ? 'true' : undefined}
              />
              <text
                className="gf-plinth-no"
                x={e.plinth.x}
                y={e.plinth.y + 6}
                data-status={e.status}
                data-active={e.id === activeExhibitId ? 'true' : undefined}
              >
                {e.cat}
              </text>
            </g>
          ))}

          {/* Entrance */}
          <circle className="gf-entrance" cx={FLOOR.entrance.x} cy={FLOOR.entrance.y} r={14} />
          <text className="gf-entrance-label" x={FLOOR.entrance.x} y={FLOOR.entrance.y + 34}>
            ENTRANCE
          </text>
        </g>
      </svg>
    </div>
  );
}

/** The whole plan squashed to a locator; the active plinth lit. */
function ChromeMap({ slide }: { slide: Slide }) {
  const activeExhibitId = slide.kind === 'exhibit' ? slide.exhibitId : null;
  return (
    <span className="gf-chrome-map" aria-hidden="true">
      <svg viewBox="60 120 1480 760" preserveAspectRatio="none">
        {HALLS.map((h) => (
          <rect
            key={h.id}
            x={h.rect.x}
            y={h.rect.y}
            width={h.rect.w}
            height={h.rect.h}
            fill="none"
            stroke={INK.grid}
            strokeWidth={12}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {EXHIBITS.map((e) => (
          <circle
            key={e.id}
            cx={e.plinth.x}
            cy={e.plinth.y}
            r={e.id === activeExhibitId ? 60 : 34}
            fill={e.id === activeExhibitId ? INK.brass : INK.gridSoft}
          />
        ))}
      </svg>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Chart piece                                                     */
/* ---------------------------------------------------------------- */

function useExhibitChartOption(piece: Extract<Piece, { kind: 'chart' }>, reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...piece.series], {
      colors: [INK.brass, INK.muted],
      unit: piece.unit,
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 10 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 6,
      lineStyle: { ...(s.lineStyle as Rec), width: 2.4 },
      areaStyle: { color: 'rgba(215, 168, 110, 0.12)' },
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1f1a15',
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 46, right: 20, top: 24, bottom: 28, containLabel: true },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk,
        axisLabel: { ...axisInk.axisLabel, interval: 0 },
        splitLine: { show: false },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        splitLine: { lineStyle: { color: INK.gridSoft, type: 'dashed' } },
      },
    } as ChartOption;
  }, [piece, reduced]);
}

function ChartPieceView({ piece, reduced, active }: { piece: Extract<Piece, { kind: 'chart' }>; reduced: boolean; active: boolean }) {
  const option = useExhibitChartOption(piece, reduced);
  const table = useMemo(() => buildTrendChartTable([...piece.series]), [piece]);
  return (
    <ChartFigure
      key={active ? 'entered' : 'parked'}
      title={piece.caption}
      sourceNote={piece.source}
      option={option}
      tableColumns={table.columns}
      tableRows={table.rows}
      height={300}
      reducedMotion={reduced}
      className="gf-chart"
    />
  );
}

function PieceView({ piece, status, reduced, active }: { piece: Piece; status: Exhibit['status']; reduced: boolean; active: boolean }) {
  if (piece.kind === 'chart') {
    return (
      <div className="gf-piece" data-status={status}>
        <ChartPieceView piece={piece} reduced={reduced} active={active} />
      </div>
    );
  }
  if (piece.kind === 'metrics') {
    return (
      <div className="gf-piece" data-status={status}>
        <div className="gf-metrics">
          {piece.tiles.map((t) => (
            <div className="gf-tile" key={t.label}>
              <span className="gf-tile-value">{t.value}</span>
              <span className="gf-tile-label">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="gf-piece" data-status={status}>
      <div className="gf-claim">
        <span className="gf-claim-headline">{piece.headline}</span>
        {piece.unit ? <span className="gf-claim-unit">{piece.unit}</span> : null}
        <p className="gf-claim-caption">{piece.caption}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Exhibit body                                                    */
/* ---------------------------------------------------------------- */

function ExhibitBody({ exhibit, reduced, active }: { exhibit: Exhibit; reduced: boolean; active: boolean }) {
  return (
    <div className="gf-exhibit-grid">
      <Build i={1} className="gf-piece-wrap">
        <PieceView piece={exhibit.piece} status={exhibit.status} reduced={reduced} active={active} />
      </Build>
      <Build i={2}>
        <figure className="gf-placard" data-status={exhibit.status} data-testid={exhibit.anomaly ? 'retired-placard' : undefined}>
          <figcaption>
            <p className="gf-placard-cat">
              {exhibit.cat} · {exhibit.hallNo} · {exhibit.position}
            </p>
            <h2 className="gf-placard-title">{exhibit.title}</h2>
          </figcaption>
          <p className="gf-placard-wall">{exhibit.wall}</p>
          <dl className="gf-placard-spec">
            <div>
              <dt>TEAM</dt>
              <dd>{exhibit.placard.team}</dd>
            </div>
            <div>
              <dt>YEAR</dt>
              <dd>{exhibit.placard.year}</dd>
            </div>
            <div>
              <dt>MATERIALS</dt>
              <dd>{exhibit.placard.materials}</dd>
            </div>
          </dl>
          <span className="gf-status-band" data-status={exhibit.status}>
            {STATUS_LABEL[exhibit.status]}
          </span>
        </figure>
      </Build>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Catalogue (accessible mirror)                                   */
/* ---------------------------------------------------------------- */

function Catalogue() {
  return (
    <ol className="gf-catalogue" data-testid="floor-catalogue">
      {EXHIBITS.map((e, i) => (
        <Build key={e.id} i={i} as="li" className="gf-cat-row" data-status={e.status}>
          <span className="gf-cat-no">{e.cat}</span>
          <span className="gf-cat-name">
            <b>{e.title}</b>
            <span className="gf-cat-hall">
              {e.hallNo} · {e.position}
            </span>
          </span>
          <span className="gf-cat-status" data-status={e.status}>
            {STATUS_LABEL[e.status]}
          </span>
        </Build>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------- */
/* Slide bodies                                                    */
/* ---------------------------------------------------------------- */

function SlideBody({ slide, reduced, activeId }: { slide: Slide; reduced: boolean; activeId: string }) {
  switch (slide.kind) {
    case 'cover':
      return (
        <div className="gf-body gf-panel">
          <Build i={0}>
            <p className="gf-eyebrow">{slide.eyebrow}</p>
          </Build>
          <h2 className="gf-display">
            {slide.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="gf-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={slide.titleLines.length + 1}>
            <p className="gf-thesis">{slide.thesis}</p>
          </Build>
          <Build i={slide.titleLines.length + 2}>
            <div className="gf-front-meta">
              {slide.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );

    case 'plan':
      return (
        <div className="gf-plan-grid">
          <div className="gf-body gf-panel">
            <Build i={0}>
              <p className="gf-kicker">{slide.kicker}</p>
            </Build>
            <Build i={1}>
              <h2 className="gf-heading">{slide.heading}</h2>
            </Build>
            <Build i={2}>
              <p className="gf-standfirst">{slide.standfirst}</p>
            </Build>
          </div>
          <div className="gf-body gf-panel">
            <Build i={1}>
              <p className="gf-kicker">THE CATALOGUE · SIX EXHIBITS</p>
            </Build>
            <Catalogue />
          </div>
        </div>
      );

    case 'exhibit': {
      const exhibit = exhibitById(slide.exhibitId);
      return <ExhibitBody exhibit={exhibit} reduced={reduced} active={activeId === slide.id} />;
    }

    case 'close':
      return (
        <div className="gf-body gf-panel">
          <Build i={0}>
            <p className="gf-kicker">{slide.kicker}</p>
          </Build>
          <h2 className="gf-display">
            {slide.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="gf-line">{line}</span>
              </Build>
            ))}
          </h2>
          <ol className="gf-commissions">
            {slide.commissions.map((c, i) => (
              <Build key={c.ref} i={slide.titleLines.length + 1 + i} as="li" className="gf-commission">
                <span className="gf-commission-ref">{c.ref}</span>
                <span className="gf-commission-text">{c.text}</span>
              </Build>
            ))}
          </ol>
          <Build i={slide.titleLines.length + 1 + slide.commissions.length}>
            <div className="gf-front-meta">
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
/* The exhibition                                                  */
/* ---------------------------------------------------------------- */

export default function GalleryFloorPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const [indexOpen, setIndexOpen] = useState(false);
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = `The Gallery Floor — ${EXHIBITION.title} — Live`;
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'r' || event.key === 'R') {
        const n = slideNumberForId(RETIRED_EXHIBIT.id);
        if (n) goTo(n);
      }
      if (event.key === 'i' || event.key === 'I') setIndexOpen((open) => !open);
      if (event.key === 'Escape') setIndexOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="gf-root" data-testid="live-gallery-floor" data-reduced={reduced ? 'true' : undefined}>
      <header className="gf-chrome" aria-label="Exhibition chrome">
        <div className="gf-chrome-cell">
          <RouterLink to="/" className="gf-back">
            ◄ GALLERY
          </RouterLink>
          <span className="gf-chrome-rule" aria-hidden="true" />
          <span>{EXHIBITION.title}</span>
        </div>
        <div className="gf-chrome-cell">
          <ChromeMap slide={activeSlide} />
          <span className="gf-chrome-rule" aria-hidden="true" />
          <span data-testid="floor-counter" aria-live="polite">
            {counter} · {activeSlide.place}
          </span>
          <span className="gf-chrome-rule" aria-hidden="true" />
          <button
            type="button"
            className="gf-index-toggle"
            aria-expanded={indexOpen}
            aria-controls="gf-index"
            onClick={() => setIndexOpen((open) => !open)}
          >
            CATALOGUE
          </button>
        </div>
      </header>

      <nav
        id="gf-index"
        className="gf-index"
        aria-label="All slides"
        data-open={indexOpen ? 'true' : undefined}
        hidden={!indexOpen}
      >
        <p className="gf-index-heading">
          {EXHIBITION.title} · {SLIDE_COUNT} SLIDES
        </p>
        <ol className="gf-index-list">
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
                <span className="gf-index-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{slide.indexTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="gf-main">
        <FloorPlan slide={activeSlide} />
        <h1>
          <VisuallyHidden>
            The Gallery Floor — {EXHIBITION.title}, the innovation portfolio hung as an exhibition in{' '}
            {SLIDE_COUNT} slides: three halls, six exhibits — two in production, three pilots, and one
            celebrated retired piece ({RETIRED_EXHIBIT.title}). The floor plan and its catalogue list
            every exhibit. Currently on slide {activeNumber} of {SLIDE_COUNT}: {activeSlide.indexTitle}.
          </VisuallyHidden>
        </h1>
        <div className="gf-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="gf-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.indexTitle}`}
              >
                <SlideBody slide={slide} reduced={reduced} activeId={activeSlide.id} />
                <div className="gf-print-foot" aria-hidden="true">
                  {EXHIBITION.title} · SLIDE {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} ·{' '}
                  {EXHIBITION.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="gf-footer">
        <span className="gf-footer-section" data-testid="slide-section">
          {activeSlide.section}
        </span>
        <span className="gf-footer-notice">{EXHIBITION.dataNotice}</span>
        <div className="gf-footer-nav">
          <span className="gf-hint">{EXHIBITION.keyboardHint}</span>
          <button
            type="button"
            className="gf-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="gf-nav-btn"
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
