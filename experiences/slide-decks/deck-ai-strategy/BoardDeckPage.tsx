/**
 * "The Morning Board Pack" — the live full-bleed rendering of
 * `deck-ai-strategy`.
 *
 * A browser-native board presentation. Monumental typography IS the visual:
 * each slide carries one statement in huge display type; scale, weight
 * contrast and measured space do the work. Keyboard-driven (←/→/Home/End),
 * `?slide=` deep-linkable, printable one slide per page (dark drops to
 * white).
 *
 * Art-direction licence (task 13): this file and deck.css are the
 * experience-local art layer — raw colour values are permitted HERE (and
 * only here). Motion easings/durations remain token-driven (var(--ease-*),
 * var(--dur-*)); reduced motion collapses slide turns to stepped opacity.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
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
import './deck.css';
import { DECK, EVIDENCE_SERIES, FIG1, SLIDES, SLIDE_COUNT } from './content.js';
import type { Slide } from './content.js';

/* ---------------------------------------------------------------- */
/* Local chart ink (experience-local art layer — licence §1)         */
/* ---------------------------------------------------------------- */

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ivory: '#e9dfc8',
  brass: '#c29a5f',
  muted: '#8d8677',
  grid: 'rgba(233, 223, 200, 0.13)',
  panel: '#171310',
} as const;

type Rec = Record<string, unknown>;

function useEvidenceOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...EVIDENCE_SERIES], {
      colors: [INK.brass, INK.muted],
      unit: '%',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 11 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 7,
      label: {
        show: true,
        // The lines cross near FY24 — labels sit on opposite sides so the
        // two series never collide.
        position: s.id === 'certified' ? 'top' : 'bottom',
        color: s.id === 'certified' ? INK.brass : INK.muted,
        fontFamily: MONO,
        fontSize: 11,
        formatter: '{@[1]}%',
      },
      ...(s.id === 'rollbacks'
        ? { lineStyle: { ...(s.lineStyle as Rec), width: 1.25, type: 'dashed' } }
        : { lineStyle: { ...(s.lineStyle as Rec), width: 2 } }),
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
        itemGap: 32,
        textStyle: { color: INK.ivory, fontFamily: MONO, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.panel,
        borderColor: INK.grid,
        textStyle: { color: INK.ivory, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 48, right: 24, top: 44, bottom: 32 },
      xAxis: { ...(base.xAxis as Rec), ...axisInk, splitLine: { show: false } },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        max: 100,
        splitLine: { lineStyle: { color: INK.grid } },
      },
    } as ChartOption;
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* Slide bodies                                                      */
/* ---------------------------------------------------------------- */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  return (
    <Tag className={className ? `bd-build ${className}` : 'bd-build'} style={{ ['--bd-i' as string]: i }}>
      {children}
    </Tag>
  );
}

function FactsRow({ facts }: { facts: readonly { label: string; value: string }[] }) {
  return (
    <dl className="bd-facts">
      {facts.map((fact) => (
        <div key={fact.label} className="bd-fact">
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SlideBody({
  slide,
  reduced,
  evidenceActive,
}: {
  slide: Slide;
  reduced: boolean;
  /** Remount key driver: data-ink-draw replays each time the slide is entered. */
  evidenceActive: boolean;
}) {
  const evidenceOption = useEvidenceOption(reduced);
  const evidenceTable = useMemo(() => buildTrendChartTable([...EVIDENCE_SERIES]), []);

  switch (slide.kind) {
    case 'title':
      return (
        <div className="bd-body bd-body-title">
          <Build i={0}>
            <p className="bd-kicker">{slide.kicker}</p>
          </Build>
          <h2 className="bd-display bd-display-title">
            {slide.lines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="bd-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={slide.lines.length + 1}>
            <div className="bd-title-meta">
              {slide.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );
    case 'section':
      return (
        <div className="bd-body bd-body-section">
          <Build i={0}>
            <span aria-hidden="true" className="bd-numeral">
              {slide.numeral}
            </span>
          </Build>
          <Build i={1}>
            <h2 className="bd-section-title">{slide.title}</h2>
          </Build>
          <Build i={2}>
            <p className="bd-whisper">{slide.whisper}</p>
          </Build>
        </div>
      );
    case 'statement':
      return (
        <div className="bd-body">
          <Build i={0}>
            <p className="bd-kicker">{slide.kicker}</p>
          </Build>
          <h2 className="bd-display">
            {slide.lines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="bd-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={slide.lines.length + 1}>
            <p className="bd-sub">{slide.sub}</p>
          </Build>
          {slide.facts ? (
            <Build i={slide.lines.length + 2}>
              <FactsRow facts={slide.facts} />
            </Build>
          ) : null}
        </div>
      );
    case 'summary':
      return (
        <div className="bd-body">
          <Build i={0}>
            <p className="bd-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="bd-display bd-display-compact">{slide.heading}</h2>
          </Build>
          <ol className="bd-commitments">
            {slide.commitments.map((c, i) => (
              <Build key={c.no} i={i + 2} as="li" className="bd-commitment">
                <span aria-hidden="true" className="bd-commitment-no">
                  {c.no}
                </span>
                <span className="bd-commitment-body">
                  <span className="bd-commitment-title">{c.title}</span>
                  <span className="bd-commitment-line">{c.line}</span>
                </span>
              </Build>
            ))}
          </ol>
          <Build i={slide.commitments.length + 2}>
            <p className="bd-test">{slide.test}</p>
          </Build>
        </div>
      );
    case 'evidence':
      return (
        <div className="bd-body">
          <Build i={0}>
            <p className="bd-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="bd-display bd-display-compact">{slide.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="bd-sub bd-sub-evidence">{slide.sub}</p>
          </Build>
          <Build i={3} className="bd-evidence-figure">
            <ChartFigure
              key={evidenceActive ? 'entered' : 'parked'}
              title={FIG1.title}
              sourceNote={FIG1.source}
              option={evidenceOption}
              tableColumns={evidenceTable.columns}
              tableRows={evidenceTable.rows}
              height={340}
              reducedMotion={reduced}
              className="bd-chart"
            />
          </Build>
        </div>
      );
    case 'envelope':
      return (
        <div className="bd-body">
          <Build i={0}>
            <p className="bd-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="bd-display bd-envelope-figure">{slide.figure}</h2>
          </Build>
          <Build i={2}>
            <p className="bd-sub">{slide.figureLine}</p>
          </Build>
          <dl className="bd-splits">
            {slide.splits.map((split, i) => (
              <Build key={split.label} i={i + 3} className="bd-split">
                <dt>{split.label}</dt>
                <dd>
                  <span className="bd-split-amount">{split.amount}</span>
                  <span className="bd-split-note">{split.note}</span>
                </dd>
              </Build>
            ))}
          </dl>
          <Build i={slide.splits.length + 3}>
            <p className="bd-footline">{slide.footline}</p>
          </Build>
        </div>
      );
    case 'milestones':
      return (
        <div className="bd-body">
          <Build i={0}>
            <p className="bd-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="bd-display bd-display-compact">{slide.heading}</h2>
          </Build>
          <ol className="bd-milestones">
            {slide.rows.map((row, i) => (
              <Build key={row.q} i={i + 2} as="li" className="bd-milestone">
                <span aria-hidden="true" className="bd-milestone-q">
                  {row.q}
                </span>
                <VisuallyHidden>{`Quarter ${row.q.slice(1)}: `}</VisuallyHidden>
                <span className="bd-milestone-line">{row.line}</span>
              </Build>
            ))}
          </ol>
        </div>
      );
    case 'resolution':
      return (
        <div className="bd-body">
          <Build i={0}>
            <p className="bd-kicker bd-kicker-resolution">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="bd-display bd-display-compact">{slide.heading}</h2>
          </Build>
          <ol className="bd-resolves">
            {slide.items.map((item, i) => (
              <Build key={item.letter} i={i + 2} as="li" className="bd-resolve">
                <span aria-hidden="true" className="bd-resolve-letter">
                  ({item.letter})
                </span>
                <span className="bd-resolve-text">{item.text}</span>
              </Build>
            ))}
          </ol>
          <Build i={slide.items.length + 2}>
            <p className="bd-carry">{slide.carryLine}</p>
          </Build>
        </div>
      );
    case 'closing':
      return (
        <div className="bd-body bd-body-closing">
          <h2 className="bd-display bd-display-title">
            {slide.lines.map((line, i) => (
              <Build key={i} i={i}>
                <span className="bd-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={slide.lines.length}>
            <p className="bd-sub">{slide.sub}</p>
          </Build>
          <Build i={slide.lines.length + 1}>
            <div className="bd-title-meta">
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
/* The deck                                                          */
/* ---------------------------------------------------------------- */

function clampSlide(n: number): number {
  if (Number.isNaN(n)) return 1;
  return Math.min(Math.max(Math.trunc(n), 1), SLIDE_COUNT);
}

export default function BoardDeckPage() {
  const { reduced } = useMotionPreference();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeIndex = clampSlide(Number(searchParams.get('slide') ?? '1')) - 1;
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [agendaOpen, setAgendaOpen] = useState(false);
  const leaveTimer = useRef<number | null>(null);
  const activeSlide = SLIDES[activeIndex] as Slide;
  // The CURRENT 1-based slide number, updated optimistically on navigation
  // so rapid key presses never act on a stale value (the URL is the source
  // of truth; this ref just tracks it between commits).
  const activeNumberRef = useRef(activeIndex + 1);

  useEffect(() => {
    activeNumberRef.current = activeIndex + 1;
  }, [activeIndex]);

  useEffect(() => {
    document.title = 'The Morning Board Pack — AI Strategy, FY27 — Live';
  }, []);

  /** Navigate by absolute slide number or relative to the current one. */
  const goTo = useCallback(
    (to: number | ((current: number) => number)) => {
      const current = activeNumberRef.current;
      const next = clampSlide(typeof to === 'function' ? to(current) : to);
      if (next === current) return;
      if (!reduced) {
        setLeavingIndex(current - 1);
        if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
        leaveTimer.current = window.setTimeout(() => setLeavingIndex(null), 420);
      }
      activeNumberRef.current = next;
      setSearchParams({ slide: String(next) }, { replace: true });
    },
    [reduced, setSearchParams],
  );

  useEffect(() => () => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          goTo((current) => current + 1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goTo((current) => current - 1);
          break;
        case 'Home':
          event.preventDefault();
          goTo(1);
          break;
        case 'End':
          event.preventDefault();
          goTo(SLIDE_COUNT);
          break;
        case 'a':
        case 'A':
          setAgendaOpen((open) => !open);
          break;
        case 'Escape':
          setAgendaOpen(false);
          break;
        default:
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  const counter = `${String(activeIndex + 1).padStart(2, '0')} / ${String(SLIDE_COUNT).padStart(2, '0')}`;

  return (
    <div className="bd-root" data-testid="live-deck" data-reduced={reduced ? 'true' : undefined}>
      <header className="bd-chrome" aria-label="Deck chrome">
        <div className="bd-chrome-cell">
          <RouterLink to="/" className="bd-back">
            ◄ GALLERY
          </RouterLink>
          <span className="bd-chrome-rule" aria-hidden="true" />
          <span>{DECK.paper}</span>
        </div>
        <div className="bd-chrome-cell">
          <span data-testid="slide-counter" aria-live="polite">
            {counter} · {DECK.counterTitle} · {DECK.audience} · {DECK.horizon}
          </span>
          <span className="bd-chrome-rule" aria-hidden="true" />
          <button
            type="button"
            className="bd-agenda-toggle"
            aria-expanded={agendaOpen}
            aria-controls="bd-agenda"
            onClick={() => setAgendaOpen((open) => !open)}
          >
            AGENDA
          </button>
        </div>
      </header>

      <nav
        id="bd-agenda"
        className="bd-agenda"
        aria-label="All slides"
        data-open={agendaOpen ? 'true' : undefined}
        hidden={!agendaOpen}
      >
        <p className="bd-agenda-heading">THE PACK · {SLIDE_COUNT} SLIDES</p>
        <ol className="bd-agenda-list">
          {SLIDES.map((slide, index) => (
            <li key={slide.id}>
              <button
                type="button"
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index + 1);
                  setAgendaOpen(false);
                }}
              >
                <span className="bd-agenda-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{slide.agendaTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="bd-main">
        <h1>
          <VisuallyHidden>
            The Morning Board Pack — FY27 AI strategy, a twelve-slide board presentation.
            Currently on slide {activeIndex + 1} of {SLIDE_COUNT}: {activeSlide.agendaTitle}.
          </VisuallyHidden>
        </h1>
        <div className="bd-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="bd-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.agendaTitle}`}
              >
                <SlideBody
                  slide={slide}
                  reduced={reduced}
                  evidenceActive={activeSlide.kind === 'evidence'}
                />
                <div className="bd-print-foot" aria-hidden="true">
                  {DECK.paper} · SLIDE {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} ·{' '}
                  {DECK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="bd-footer">
        <span className="bd-footer-section" data-testid="deck-section">
          {activeSlide.section}
        </span>
        <span className="bd-footer-notice">{DECK.dataNotice}</span>
        <div className="bd-footer-nav">
          <span className="bd-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="bd-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="bd-nav-btn"
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
