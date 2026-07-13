/**
 * "The Cutover" — the world-TEMPLATE. Carries the whole craft of
 * `deck-cloud-migration` and renders it from a typed {@link CutoverFill}
 * (content slots only). `CutoverPage` is now a thin wrapper that hands this
 * component the shipped fill; the rendered output is byte-for-byte what the page
 * rendered before templatization (the `LiveWorldsDecksE` + `live-decks-e` parity
 * oracles prove it).
 *
 * A cloud-migration plan rendered as a draw.io working file: a flat diagram-tool
 * canvas with a faint dot-grid, precise ORTHOGONAL connectors with port dots,
 * pastel-filled rounded system boxes with type badges, a layers legend chip in
 * the chrome, and draw.io selection handles on the focus node of each slide. The
 * idiom is exact geometry — straight strokes, the anti-excalidraw.
 *
 * Anomaly: the fill's single `stays` estate node is badged with its verbatim
 * anomaly text — the one box that never moves, drawn with a padlock and a heavier
 * stroke, in the same place on both the current and target estate.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect, useMemo } from 'react';
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
import type { CutoverFill, CutoverNode, CutoverEdge } from './cutover-fill.js';

/* ------------------------------------------------------------------ */
/* Slide structure (template-fixed anatomy, not content)              */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'current'
  | 'target'
  | 'delta'
  | 'waves'
  | 'cutover'
  | 'sync'
  | 'rollback'
  | 'risk'
  | 'closing';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
}

const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Cutover plan', kicker: 'CLOUD MIGRATION' },
  { id: 'current', kind: 'current', section: 'Current estate', kicker: '01 · CURRENT ESTATE' },
  { id: 'target', kind: 'target', section: 'Target estate', kicker: '02 · TARGET ESTATE' },
  { id: 'delta', kind: 'delta', section: 'The delta', kicker: '03 · MOVES / DIES / STAYS' },
  { id: 'waves', kind: 'waves', section: 'Migration waves', kicker: '04 · WAVES' },
  { id: 'cutover', kind: 'cutover', section: 'Cutover night', kicker: '05 · CUTOVER SEQUENCE' },
  { id: 'sync', kind: 'sync', section: 'Data sync', kicker: '06 · SYNC & VALIDATION' },
  { id: 'rollback', kind: 'rollback', section: 'Rollback', kicker: '07 · ROLLBACK TREE' },
  { id: 'risk', kind: 'risk', section: 'Risk register', kicker: '08 · RISK REGISTER' },
  { id: 'closing', kind: 'closing', section: 'Sign-off', kicker: '09 · REV SIGN-OFF' },
];

const SLIDE_COUNT = SLIDES.length;

/** Estate slides — the e2e deep links (C jumps to current, T to target). */
const CURRENT_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'current') + 1;
const TARGET_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'target') + 1;

const KEYBOARD_HINT = '← → NAVIGATE · HOME/END';

/* ------------------------------------------------------------------ */
/* Geometry (template-fixed canvas dimensions, draw.io idiom)          */
/* ------------------------------------------------------------------ */

const NODE_W = 176;
const NODE_H = 62;
const ESTATE_VIEW = '0 0 1020 560';
const ROLLBACK_VIEW = '0 0 1000 360';
/** The on-prem zone box that surrounds the locked node in the target estate. */
const ONPREM_ZONE = { x: 676, y: 116, w: 224, h: 122 } as const;

/* ------------------------------------------------------------------ */
/* Label maps                                                          */
/* ------------------------------------------------------------------ */

type NodeKind = CutoverNode['kind'];
type Disposition = CutoverNode['disposition'];
type Zone = CutoverNode['zone'];

const KIND_BADGE: Record<NodeKind, string> = {
  app: 'APP',
  data: 'DATA',
  integration: 'INT',
};

const DISPOSITION_LABEL: Record<Disposition, string> = {
  rehost: 'REHOST',
  refactor: 'REFACTOR',
  replatform: 'REPLATFORM',
  replace: 'REPLACE',
  retire: 'RETIRE',
  stays: 'STAYS',
};

const ZONE_LABEL: Record<Zone, string> = {
  onprem: 'On-prem data centre',
  cloud: 'Cloud landing zone',
};

/* ------------------------------------------------------------------ */
/* Orthogonal connector routing (exact, straight — draw.io idiom)      */
/* ------------------------------------------------------------------ */

type Side = 'l' | 'r' | 't' | 'b';
interface Box {
  x: number;
  y: number;
}
function port(box: Box, side: Side): readonly [number, number] {
  switch (side) {
    case 'l':
      return [box.x, box.y + NODE_H / 2];
    case 'r':
      return [box.x + NODE_W, box.y + NODE_H / 2];
    case 't':
      return [box.x + NODE_W / 2, box.y];
    case 'b':
      return [box.x + NODE_W / 2, box.y + NODE_H];
  }
}

/** An orthogonal path between two ports, one mid-bend (Z or L). */
function orth(p1: readonly [number, number], s1: Side, p2: readonly [number, number]): string {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  if (s1 === 'r' || s1 === 'l') {
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
}

interface BuiltConnector extends CutoverEdge {
  d: string;
  p1: readonly [number, number];
  p2: readonly [number, number];
}

function buildConnectors(
  nodes: readonly CutoverNode[],
  edges: readonly CutoverEdge[],
  layout: 'current' | 'target',
): BuiltConnector[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return edges.map((e) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const boxA: Box = layout === 'current' ? { x: a.cx, y: a.cy } : { x: a.tx, y: a.ty };
    const boxB: Box = layout === 'current' ? { x: b.cx, y: b.cy } : { x: b.tx, y: b.ty };
    const pA = port(boxA, e.fromSide);
    const pB = port(boxB, e.toSide);
    return { ...e, d: orth(pA, e.fromSide, pB), p1: pA, p2: pB };
  });
}

/* ------------------------------------------------------------------ */
/* Estate zones — the accessible mirror groups each diagram by zone     */
/* ------------------------------------------------------------------ */

/**
 * The two diagrams differ by WHERE each system lives, not just by disposition.
 * The current estate is one on-prem data centre; the target estate splits into a
 * cloud landing zone plus the on-prem zone that keeps the locked node. The
 * accessible mirror is grouped by that same zone level, so a screen-reader user
 * reads a TRUE mirror of each diagram.
 */
function zoneOf(node: CutoverNode, layout: 'current' | 'target'): Zone {
  if (layout === 'current') return 'onprem';
  return node.zone;
}

interface EstateMirrorSystem {
  id: string;
  label: string;
  kind: NodeKind;
  disposition: Disposition;
  locked?: boolean;
}

export interface EstateMirrorZone {
  zone: Zone;
  label: string;
  systems: readonly EstateMirrorSystem[];
}

function buildEstateMirror(
  nodes: readonly CutoverNode[],
  layout: 'current' | 'target',
): readonly EstateMirrorZone[] {
  const order: readonly Zone[] = ['onprem', 'cloud'];
  return order
    .map((zone) => ({
      zone,
      label: ZONE_LABEL[zone],
      systems: nodes
        .filter((n) => zoneOf(n, layout) === zone)
        .map((n) => ({
          id: n.id,
          label: n.label,
          kind: n.kind,
          disposition: n.disposition,
          locked: n.locked,
        })),
    }))
    .filter((g) => g.systems.length > 0);
}

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
  nodes,
  connectors,
  focus,
  anomalyText,
  testid,
}: {
  layout: 'current' | 'target';
  nodes: readonly CutoverNode[];
  connectors: readonly BuiltConnector[];
  focus: string;
  anomalyText: string;
  testid: string;
}) {
  const focusNode = nodes.find((n) => n.id === focus)!;
  const fx = layout === 'current' ? focusNode.cx : focusNode.tx;
  const fy = layout === 'current' ? focusNode.cy : focusNode.ty;
  return (
    <svg
      className="cu-estate-svg"
      viewBox={ESTATE_VIEW}
      role="img"
      aria-label={`${layout === 'current' ? 'Current' : 'Target'} estate diagram. ${nodes.map((n) => `${n.label}, ${DISPOSITION_LABEL[n.disposition]}`).join('; ')}. ${anomalyText}.`}
      data-testid={testid}
    >
      {/* target estate: the on-prem zone that keeps the locked node */}
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
      {nodes.map((n) => {
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
/* Accessible mirror — each estate grouped by zone, system by system   */
/* ------------------------------------------------------------------ */

function EstateMirror({
  title,
  groups,
  anomalyText,
  testid,
}: {
  title: string;
  groups: readonly EstateMirrorZone[];
  anomalyText: string;
  testid: string;
}) {
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
                  {s.locked ? ` (${anomalyText})` : ''}
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
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

interface Derived {
  currentConnectors: readonly BuiltConnector[];
  targetConnectors: readonly BuiltConnector[];
  anomalyText: string;
}

function KickerRow({ slide, fill }: { slide: Slide; fill: CutoverFill }) {
  return (
    <Build i={0} className="cu-kickerrow">
      <span className="cu-kicker">{slide.kicker}</span>
      <span className="cu-file">
        {fill.deck.file} · {fill.deck.rev}
      </span>
    </Build>
  );
}

function EstateSlide({
  layout,
  fill,
  connectors,
  focus,
  anomalyText,
  testid,
  heading,
  note,
}: {
  layout: 'current' | 'target';
  fill: CutoverFill;
  connectors: readonly BuiltConnector[];
  focus: string;
  anomalyText: string;
  testid: string;
  heading: string;
  note: string;
}) {
  return (
    <div className="cu-estate-body">
      <Build i={0} className="cu-kickerrow">
        <span className="cu-kicker">{layout === 'current' ? '01 · CURRENT ESTATE' : '02 · TARGET ESTATE'}</span>
        <span className="cu-file">
          {fill.deck.file} · {fill.deck.rev}
        </span>
      </Build>
      <Build i={1}>
        <h2 className="cu-heading cu-heading-tight">{heading}</h2>
      </Build>
      <Build i={2} className="cu-canvas">
        <EstateDiagram
          layout={layout}
          nodes={fill.nodes}
          connectors={connectors}
          focus={focus}
          anomalyText={anomalyText}
          testid={testid}
        />
      </Build>
      <Build i={3} className="cu-estate-foot">
        <p className="cu-estate-flag" data-testid={`${testid}-flag`}>
          <span className="cu-lock" aria-hidden="true">
            {'\u{1F512}'}
          </span>
          {anomalyText}
        </p>
        <p className="cu-canvas-note">{note}</p>
      </Build>
    </div>
  );
}

function SlideBody({ slide, fill, derived }: { slide: Slide; fill: CutoverFill; derived: Derived }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="cu-cover">
          <Build i={0} className="cu-kickerrow">
            <span className="cu-kicker">{fill.deck.file} · {fill.deck.rev}</span>
            <span className="cu-file">{fill.deck.editors}</span>
          </Build>
          <Build i={1}>
            <p className="cu-filetab">{fill.deck.programme}</p>
          </Build>
          <h2 className="cu-display">
            <Build i={2}>
              <span className="cu-line">{fill.thesis.line1}</span>
            </Build>
            <Build i={3}>
              <span className="cu-line cu-focus-text">{fill.thesis.line2}</span>
            </Build>
          </h2>
          <Build i={4}>
            <p className="cu-standfirst">{fill.thesis.standfirst}</p>
          </Build>
        </div>
      );

    case 'current':
      return (
        <EstateSlide
          layout="current"
          fill={fill}
          connectors={derived.currentConnectors}
          focus={fill.currentFocus}
          anomalyText={derived.anomalyText}
          testid="current-estate"
          heading="What we have today."
          note="Seven systems in one data centre, hung off a monolithic core that posts to the mainframe ledger. Selected: the ledger — the fixed point."
        />
      );

    case 'target':
      return (
        <EstateSlide
          layout="target"
          fill={fill}
          connectors={derived.targetConnectors}
          focus={fill.targetFocus}
          anomalyText={derived.anomalyText}
          testid="target-estate"
          heading="What we run after."
          note="Same canvas, moved. The core refactors into the cloud; batch ETL retires; the ledger stays exactly where it is, boxed in its on-prem zone."
        />
      );

    case 'delta':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading">Three columns say the whole plan.</h2>
          </Build>
          <div className="cu-delta-grid">
            <Build i={2} className="cu-delta-col" data-tone="move">
              <span className="cu-delta-head">MOVES</span>
              <ul>
                {fill.delta.moves.map((d) => (
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
                {fill.delta.dies.map((d) => (
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
                {fill.delta.stays.map((d) => (
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
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">Three weekends, three waves.</h2>
          </Build>
          <div className="cu-swimlanes">
            {fill.waves.map((w, i) => (
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
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">Cutover night, one path down.</h2>
          </Build>
          <Build i={2} className="cu-flow-frame">
            <FlowDiagram
              data={fill.cutoverFlow}
              title="Cutover-night sequence"
              sourceNote="Every step is reversible until the validation gate; a failed gate rolls straight back to source inside the same window."
            />
          </Build>
        </div>
      );

    case 'sync':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading">Nothing cuts over until the data agrees.</h2>
          </Build>
          <Build i={2} className="cu-sync-wrap">
            <ol className="cu-sync">
              {fill.syncPlan.map((s, i) => (
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
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">If it fails, we’re back by morning.</h2>
          </Build>
          <Build i={2} className="cu-canvas">
            <svg className="cu-rollback-svg" viewBox={ROLLBACK_VIEW} role="img" aria-label="Rollback tree from the validation gate: pass opens to customers; fail freezes the target, repoints DNS to source, and unfreezes source writes." data-testid="rollback-tree">
              {fill.rollback.edges.map((e, i) => {
                const a = fill.rollback.nodes.find((n) => n.id === e.from)!;
                const b = fill.rollback.nodes.find((n) => n.id === e.to)!;
                const midY = (a.y + 26 + b.y) / 2;
                return (
                  <path
                    key={i}
                    className="cu-rb-edge"
                    d={`M ${a.x} ${a.y + 26} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`}
                  />
                );
              })}
              {fill.rollback.nodes.map((n) => (
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
            <p className="cu-canvas-note">{fill.rollback.note}</p>
          </Build>
        </div>
      );

    case 'risk':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading">The risk register, one open item.</h2>
          </Build>
          <Build i={2} className="cu-risk-frame">
            <StatusList title="Cutover risk register" items={[...fill.risks]} />
          </Build>
        </div>
      );

    case 'closing':
      return (
        <div className="cu-closing">
          <Build i={0} className="cu-signoff">
            <div className="cu-signoff-head">
              <span className="cu-signoff-file">{fill.deck.file}</span>
              <span className="cu-signoff-rev">{fill.deck.rev} · READY FOR SIGN-OFF</span>
            </div>
            <h2 className="cu-signoff-title">{fill.signoff.title}</h2>
            <p className="cu-standfirst cu-standfirst-wide">{fill.signoff.detail}</p>
            <ul className="cu-approvals">
              {fill.signoff.approvals.map((a) => (
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
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function CutoverTemplate({ fill }: { fill: CutoverFill }) {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  const derived = useMemo<Derived>(
    () => ({
      currentConnectors: buildConnectors(fill.nodes, fill.currentEdges, 'current'),
      targetConnectors: buildConnectors(fill.nodes, fill.targetEdges, 'target'),
      anomalyText: fill.nodes.find((n) => n.disposition === 'stays')?.badge ?? '',
    }),
    [fill],
  );
  const currentMirror = useMemo(() => buildEstateMirror(fill.nodes, 'current'), [fill.nodes]);
  const targetMirror = useMemo(() => buildEstateMirror(fill.nodes, 'target'), [fill.nodes]);

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
            {fill.deck.code} · {fill.deck.world}
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
            ledger stays on-prem: “{derived.anomalyText}”. Slide {activeNumber} of {SLIDE_COUNT}:{' '}
            {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <VisuallyHidden>
          <EstateMirror title="Current estate, system by system" groups={currentMirror} anomalyText={derived.anomalyText} testid="current-estate-mirror" />
          <EstateMirror title="Target estate, system by system" groups={targetMirror} anomalyText={derived.anomalyText} testid="target-estate-mirror" />
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
                  <SlideBody slide={slide} fill={fill} derived={derived} />
                </div>
                <div className="cu-print-foot" aria-hidden="true">
                  {fill.deck.code} · {slide.section} · SLIDE {String(index + 1).padStart(2, '0')} /{' '}
                  {SLIDE_COUNT} · {fill.deck.notice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="cu-chrome cu-chrome-bottom" aria-label="Deck controls">
        <span className="cu-notice">{fill.deck.notice}</span>
        <div className="cu-footer-nav">
          <span className="cu-hint">{KEYBOARD_HINT}</span>
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
