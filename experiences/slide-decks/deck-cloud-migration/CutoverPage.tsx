/**
 * "The Cutover" — the live full-bleed rendering of `deck-cloud-migration`.
 *
 * A cloud-migration plan rendered as a draw.io working file: a flat diagram-tool
 * canvas with a faint dot-grid, precise ORTHOGONAL connectors with port dots,
 * pastel-filled rounded system boxes with type badges, a layers legend chip in
 * the chrome, and draw.io selection handles on the focus node of each slide. The
 * idiom is exact geometry — straight strokes, the anti-excalidraw.
 *
 * Anomaly: one estate node is badged `MAINFRAME LEDGER — STAYS ON-PREM · LATENCY
 * SLA 4ms` — the one box that never moves, drawn with a padlock and a heavier
 * stroke, in the same place on both the current and the target estate.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { StatusList } from '@enterprise-design/content-components';
import { FlowDiagram } from '@enterprise-design/diagrams';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './cutover.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ANOMALY_TEXT,
  CURRENT_CONNECTORS,
  CURRENT_ESTATE_MIRROR,
  CURRENT_FOCUS,
  CURRENT_SLIDE_NUMBER,
  CUTOVER_FLOW,
  DECK,
  DELTA_DIES,
  DELTA_MOVES,
  DELTA_STAYS,
  DISPOSITION_LABEL,
  ESTATE_VIEW,
  NODE_H,
  NODE_W,
  NODES,
  ONPREM_ZONE,
  RISKS,
  ROLLBACK_EDGES,
  ROLLBACK_NODES,
  ROLLBACK_NOTE,
  ROLLBACK_VIEW,
  SIGNOFF,
  SLIDES,
  SLIDE_COUNT,
  SYNC_PLAN,
  TARGET_CONNECTORS,
  TARGET_ESTATE_MIRROR,
  TARGET_FOCUS,
  TARGET_SLIDE_NUMBER,
  THESIS,
  WAVES,
} from './content.js';
import type { EstateMirrorZone, EstateNode, Slide } from './content.js';

/* ------------------------------------------------------------------ */
/* Build wrapper                                                       */
/* ------------------------------------------------------------------ */

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
    <Tag className={className ? `cu-build ${className}` : 'cu-build'} style={{ ['--cu-i' as string]: i }}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* The estate diagram — shared by current & target slides              */
/* ------------------------------------------------------------------ */

const KIND_BADGE: Record<EstateNode['kind'], string> = {
  app: 'APP',
  data: 'DATA',
  integration: 'INT',
};

function SelectionHandles({ x, y }: { x: number; y: number }) {
  const pts: readonly [number, number][] = [
    [x, y],
    [x + NODE_W / 2, y],
    [x + NODE_W, y],
    [x, y + NODE_H / 2],
    [x + NODE_W, y + NODE_H / 2],
    [x, y + NODE_H],
    [x + NODE_W / 2, y + NODE_H],
    [x + NODE_W, y + NODE_H],
  ];
  return (
    <g className="cu-handles" aria-hidden="true">
      <rect className="cu-handle-outline" x={x - 4} y={y - 4} width={NODE_W + 8} height={NODE_H + 8} rx={4} />
      {pts.map(([hx, hy], i) => (
        <rect key={i} className="cu-handle" x={hx - 3.5} y={hy - 3.5} width={7} height={7} />
      ))}
    </g>
  );
}

function EstateDiagram({
  layout,
  focus,
  testid,
}: {
  layout: 'current' | 'target';
  focus: string;
  testid: string;
}) {
  const connectors = layout === 'current' ? CURRENT_CONNECTORS : TARGET_CONNECTORS;
  const focusNode = NODES.find((n) => n.id === focus)!;
  const fx = layout === 'current' ? focusNode.cx : focusNode.tx;
  const fy = layout === 'current' ? focusNode.cy : focusNode.ty;
  return (
    <svg
      className="cu-estate-svg"
      viewBox={ESTATE_VIEW}
      role="img"
      aria-label={`${layout === 'current' ? 'Current' : 'Target'} estate diagram. ${NODES.map((n) => `${n.label}, ${DISPOSITION_LABEL[n.disposition]}`).join('; ')}. ${ANOMALY_TEXT}.`}
      data-testid={testid}
    >
      {/* target estate: the on-prem zone that keeps the locked ledger */}
      {layout === 'target' ? (
        <g className="cu-zone" aria-hidden="true">
          <rect x={ONPREM_ZONE.x} y={ONPREM_ZONE.y} width={ONPREM_ZONE.w} height={ONPREM_ZONE.h} rx={8} />
          <text className="cu-zone-label" x={ONPREM_ZONE.x + 10} y={ONPREM_ZONE.y + 20}>
            ON-PREM · STAYS
          </text>
        </g>
      ) : null}

      {/* connectors first, under the boxes */}
      {connectors.map((c) => (
        <g key={c.id} className="cu-conn">
          <path className="cu-conn-line" d={c.d} />
          <circle className="cu-port" cx={c.p1[0]} cy={c.p1[1]} r={3} />
          <circle className="cu-port" cx={c.p2[0]} cy={c.p2[1]} r={3} />
          {c.label ? (
            <>
              <rect
                className="cu-conn-label-bg"
                x={(c.p1[0] + c.p2[0]) / 2 - (c.label.length * 6.2) / 2 - 4}
                y={(c.p1[1] + c.p2[1]) / 2 - 17}
                width={c.label.length * 6.2 + 8}
                height={15}
                rx={2}
              />
              <text className="cu-conn-label" x={(c.p1[0] + c.p2[0]) / 2} y={(c.p1[1] + c.p2[1]) / 2 - 5} textAnchor="middle">
                {c.label}
              </text>
            </>
          ) : null}
        </g>
      ))}

      {/* selection handles on the focus node (draw.io idiom) */}
      <SelectionHandles x={fx} y={fy} />

      {/* the system boxes */}
      {NODES.map((n) => {
        const nx = layout === 'current' ? n.cx : n.tx;
        const ny = layout === 'current' ? n.cy : n.ty;
        const retired = layout === 'target' && n.disposition === 'retire';
        return (
          <g
            key={n.id}
            className="cu-node"
            data-kind={n.kind}
            data-locked={n.locked ? 'true' : undefined}
            data-retired={retired ? 'true' : undefined}
            data-focus={n.id === focus ? 'true' : undefined}
          >
            <rect className="cu-node-box" x={nx} y={ny} width={NODE_W} height={NODE_H} rx={7} />
            <text className="cu-node-kind" x={nx + 12} y={ny + 18}>
              {n.locked ? '\u{1F512} ' : ''}
              {KIND_BADGE[n.kind]}
            </text>
            <text className="cu-node-label" x={nx + 12} y={ny + 42}>
              {n.label}
            </text>
            <text className="cu-node-disp" x={nx + NODE_W - 12} y={ny + 18} textAnchor="end">
              {DISPOSITION_LABEL[n.disposition]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function KickerRow({ slide }: { slide: Slide }) {
  return (
    <Build i={0} className="cu-kickerrow">
      <span className="cu-kicker">{slide.kicker}</span>
      <span className="cu-file">
        {DECK.file} · {DECK.rev}
      </span>
    </Build>
  );
}

function EstateSlide({ layout, focus, testid, heading, note }: { layout: 'current' | 'target'; focus: string; testid: string; heading: string; note: string }) {
  return (
    <div className="cu-estate-body">
      <Build i={0} className="cu-kickerrow">
        <span className="cu-kicker">{layout === 'current' ? '01 · CURRENT ESTATE' : '02 · TARGET ESTATE'}</span>
        <span className="cu-file">
          {DECK.file} · {DECK.rev}
        </span>
      </Build>
      <Build i={1}>
        <h2 className="cu-heading cu-heading-tight">{heading}</h2>
      </Build>
      <Build i={2} className="cu-canvas">
        <EstateDiagram layout={layout} focus={focus} testid={testid} />
      </Build>
      <Build i={3} className="cu-estate-foot">
        <p className="cu-estate-flag" data-testid={`${testid}-flag`}>
          <span className="cu-lock" aria-hidden="true">
            {'\u{1F512}'}
          </span>
          {ANOMALY_TEXT}
        </p>
        <p className="cu-canvas-note">{note}</p>
      </Build>
    </div>
  );
}

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="cu-cover">
          <Build i={0} className="cu-kickerrow">
            <span className="cu-kicker">{DECK.file} · {DECK.rev}</span>
            <span className="cu-file">{DECK.editors}</span>
          </Build>
          <Build i={1}>
            <p className="cu-filetab">{DECK.programme}</p>
          </Build>
          <h2 className="cu-display">
            <Build i={2}>
              <span className="cu-line">{THESIS.line1}</span>
            </Build>
            <Build i={3}>
              <span className="cu-line cu-focus-text">{THESIS.line2}</span>
            </Build>
          </h2>
          <Build i={4}>
            <p className="cu-standfirst">{THESIS.standfirst}</p>
          </Build>
        </div>
      );

    case 'current':
      return (
        <EstateSlide
          layout="current"
          focus={CURRENT_FOCUS}
          testid="current-estate"
          heading="What we have today."
          note="Seven systems in one data centre, hung off a monolithic core that posts to the mainframe ledger. Selected: the ledger — the fixed point."
        />
      );

    case 'target':
      return (
        <EstateSlide
          layout="target"
          focus={TARGET_FOCUS}
          testid="target-estate"
          heading="What we run after."
          note="Same canvas, moved. The core refactors into the cloud; batch ETL retires; the ledger stays exactly where it is, boxed in its on-prem zone."
        />
      );

    case 'delta':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cu-heading">Three columns say the whole plan.</h2>
          </Build>
          <div className="cu-delta-grid">
            <Build i={2} className="cu-delta-col" data-tone="move">
              <span className="cu-delta-head">MOVES</span>
              <ul>
                {DELTA_MOVES.map((d) => (
                  <li key={d.system}>
                    <b>{d.system}</b>
                    {d.note}
                  </li>
                ))}
              </ul>
            </Build>
            <Build i={3} className="cu-delta-col" data-tone="die">
              <span className="cu-delta-head">DIES</span>
              <ul>
                {DELTA_DIES.map((d) => (
                  <li key={d.system}>
                    <b>{d.system}</b>
                    {d.note}
                  </li>
                ))}
              </ul>
            </Build>
            <Build i={4} className="cu-delta-col" data-tone="stay">
              <span className="cu-delta-head">STAYS</span>
              <ul>
                {DELTA_STAYS.map((d) => (
                  <li key={d.system}>
                    <b>{d.system}</b>
                    {d.note}
                  </li>
                ))}
              </ul>
            </Build>
          </div>
        </div>
      );

    case 'waves':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">Three weekends, three waves.</h2>
          </Build>
          <div className="cu-swimlanes">
            {WAVES.map((w, i) => (
              <Build key={w.id} i={i + 2} className="cu-lane">
                <div className="cu-lane-head">
                  <span className="cu-lane-name">{w.name}</span>
                  <span className="cu-lane-when">{w.when}</span>
                </div>
                <div className="cu-lane-chips">
                  {w.chips.map((c) => (
                    <span key={c.label} className="cu-chip" data-kind={c.kind}>
                      {c.label}
                    </span>
                  ))}
                </div>
                <p className="cu-lane-note">{w.note}</p>
              </Build>
            ))}
          </div>
        </div>
      );

    case 'cutover':
      return (
        <div className="cu-flow-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">Cutover night, one path down.</h2>
          </Build>
          <Build i={2} className="cu-flow-frame">
            <FlowDiagram
              data={CUTOVER_FLOW}
              title="Cutover-night sequence"
              sourceNote="Every step is reversible until the validation gate; a failed gate rolls straight back to source inside the same window."
            />
          </Build>
        </div>
      );

    case 'sync':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cu-heading">Nothing cuts over until the data agrees.</h2>
          </Build>
          <Build i={2} className="cu-sync-wrap">
            <ol className="cu-sync">
              {SYNC_PLAN.map((s, i) => (
                <li key={s.id}>
                  <span className="cu-sync-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cu-sync-stage">{s.stage}</span>
                  <span className="cu-sync-detail">{s.detail}</span>
                </li>
              ))}
            </ol>
          </Build>
        </div>
      );

    case 'rollback':
      return (
        <div className="cu-flow-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">If it fails, we’re back by morning.</h2>
          </Build>
          <Build i={2} className="cu-canvas">
            <svg className="cu-rollback-svg" viewBox={ROLLBACK_VIEW} role="img" aria-label="Rollback tree from the validation gate: pass opens to customers; fail freezes the target, repoints DNS to source, and unfreezes source writes." data-testid="rollback-tree">
              {ROLLBACK_EDGES.map((e, i) => {
                const a = ROLLBACK_NODES.find((n) => n.id === e.from)!;
                const b = ROLLBACK_NODES.find((n) => n.id === e.to)!;
                const midY = (a.y + 26 + b.y) / 2;
                return (
                  <path
                    key={i}
                    className="cu-rb-edge"
                    d={`M ${a.x} ${a.y + 26} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`}
                  />
                );
              })}
              {ROLLBACK_NODES.map((n) => (
                <g key={n.id} className="cu-rb-node" data-tone={n.tone}>
                  <rect x={n.x - 130} y={n.y} width={260} height={40} rx={6} />
                  <text x={n.x} y={n.y + 25} textAnchor="middle">
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </Build>
          <Build i={3}>
            <p className="cu-canvas-note">{ROLLBACK_NOTE}</p>
          </Build>
        </div>
      );

    case 'risk':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cu-heading">The risk register, one open item.</h2>
          </Build>
          <Build i={2} className="cu-risk-frame">
            <StatusList title="Cutover risk register" items={[...RISKS]} />
          </Build>
        </div>
      );

    case 'closing':
      return (
        <div className="cu-closing">
          <Build i={0} className="cu-signoff">
            <div className="cu-signoff-head">
              <span className="cu-signoff-file">{DECK.file}</span>
              <span className="cu-signoff-rev">{DECK.rev} · READY FOR SIGN-OFF</span>
            </div>
            <h2 className="cu-signoff-title">{SIGNOFF.title}</h2>
            <p className="cu-standfirst cu-standfirst-wide">{SIGNOFF.detail}</p>
            <ul className="cu-approvals">
              {SIGNOFF.approvals.map((a) => (
                <li key={a.role}>
                  <span className="cu-approval-role">{a.role}</span>
                  <span className="cu-approval-decision">{a.decision}</span>
                  <span className="cu-approval-box" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Accessible mirror — each estate grouped by zone, system by system   */
/* ------------------------------------------------------------------ */

function EstateMirror({ title, groups, testid }: { title: string; groups: readonly EstateMirrorZone[]; testid: string }) {
  return (
    <div data-testid={testid}>
      <h2>{title}</h2>
      <ul>
        {groups.map((g) => (
          <li key={g.zone}>
            {g.label}
            <ul>
              {g.systems.map((s) => (
                <li key={s.id}>
                  {s.label} — {s.kind} — {DISPOSITION_LABEL[s.disposition]}
                  {s.locked ? ` (${ANOMALY_TEXT})` : ''}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function CutoverPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Cutover — cutover-plan.drawio — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'c' || event.key === 'C') goTo(CURRENT_SLIDE_NUMBER);
      if (event.key === 't' || event.key === 'T') goTo(TARGET_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="cu-root" data-testid="live-cutover" data-reduced={reduced ? 'true' : undefined}>
      <header className="cu-chrome cu-chrome-top" aria-label="Deck chrome">
        <div className="cu-chrome-cell">
          <RouterLink to="/" className="cu-back">
            ◄ GALLERY
          </RouterLink>
          <span className="cu-chrome-rule" aria-hidden="true" />
          <span>
            {DECK.code} · {DECK.world}
          </span>
        </div>
        <div className="cu-chrome-cell">
          {/* the layers legend chip — draw.io chrome */}
          <span className="cu-legend" aria-hidden="true">
            <span className="cu-legend-chip" data-kind="app">
              APP
            </span>
            <span className="cu-legend-chip" data-kind="data">
              DATA
            </span>
            <span className="cu-legend-chip" data-kind="integration">
              INT
            </span>
          </span>
          <span className="cu-chrome-rule" aria-hidden="true" />
          <span data-testid="cutover-counter" aria-live="polite">
            {counter} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="cu-main">
        <h1>
          <VisuallyHidden>
            The Cutover — the synthetic core-banking cloud migration, rendered as a draw.io working
            file (cutover-plan.drawio, rev 14). Seven systems move over three weekends; the mainframe
            ledger stays on-prem: “{ANOMALY_TEXT}”. Slide {activeNumber} of {SLIDE_COUNT}:{' '}
            {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <VisuallyHidden>
          <EstateMirror title="Current estate, system by system" groups={CURRENT_ESTATE_MIRROR} testid="current-estate-mirror" />
          <EstateMirror title="Target estate, system by system" groups={TARGET_ESTATE_MIRROR} testid="target-estate-mirror" />
        </VisuallyHidden>
        <div className="cu-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="cu-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="cu-slide-inner">
                  <SlideBody slide={slide} />
                </div>
                <div className="cu-print-foot" aria-hidden="true">
                  {DECK.code} · {slide.section} · SLIDE {String(index + 1).padStart(2, '0')} /{' '}
                  {SLIDE_COUNT} · {DECK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="cu-chrome cu-chrome-bottom" aria-label="Deck controls">
        <span className="cu-notice">{DECK.dataNotice}</span>
        <div className="cu-footer-nav">
          <span className="cu-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="cu-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="cu-nav-btn"
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
