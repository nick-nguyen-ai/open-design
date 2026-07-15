/**
 * The commanding visual of the Drawing Office: the platform as a signed
 * engineering drawing — hand-composed SVG on a drafting-grid field, with
 * orthogonal routed connections, dimension lines, section markers (A–A,
 * B–B), zone boundaries, and a hatched capacity-constraint part.
 *
 * This is a TEMPLATE helper (not a `*Template.tsx`): it owns the drawing's
 * whole GEOMETRY and takes only CONTENT as props (the parts, the connections,
 * the zone and dimension captions, the constraint flag label). Every editorial
 * string it draws is passed in; the plan placement, edge routing, zone boxes,
 * dimension lines, section cuts, grid, and orientation stamp are hand-drafted
 * per id and content-independent. The plan is FIXED-SLOT: `PLAN`, `ROUTES`,
 * `ZONE_GEOMETRY`, and `DIMENSION_GEOMETRY` are keyed by the shipped ids, which
 * the fill schema pins exactly, so every drafted slot is filled.
 *
 * The SVG is decorative (`aria-hidden`); the SCHEDULE OF PARTS panel and the
 * title block rendered by DrawingOfficeTemplate are the accessible equivalents.
 */
import { DataInkDraw } from '@enterprise-design/motion';
import type {
  DrawingOfficeDimension,
  DrawingOfficeEdge,
  DrawingOfficeNode,
  DrawingOfficeNodeKind,
  DrawingOfficeZone,
} from './drawing-office-fill.js';

export const SHEET_W = 1560;
export const SHEET_H = 960;

const NODE_W = 200;
const NODE_H = 66;

/** Hand-drafted plan placement (top-left corners), keyed by node id. */
const PLAN: Record<string, { x: number; y: number }> = {
  'edge-gateway': { x: 70, y: 300 },
  'decision-api': { x: 400, y: 300 },
  'model-serving': { x: 750, y: 300 },
  'policy-engine': { x: 1100, y: 300 },
  'model-registry': { x: 750, y: 110 },
  'stream-ingest': { x: 400, y: 560 },
  'feature-store': { x: 750, y: 560 },
  'decision-log': { x: 1100, y: 560 },
  'drift-watch': { x: 750, y: 780 },
  'case-review': { x: 460, y: 780 },
};

/** Two-line wrapping for long part names (drafting lettering stays inside the box). */
function splitLabel(label: string): string[] {
  if (label.length <= 16) return [label];
  const mid = Math.floor(label.length / 2);
  let best = -1;
  for (let i = 0; i < label.length; i += 1) {
    if (label[i] === ' ' && (best === -1 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  }
  if (best === -1) return [label];
  return [label.slice(0, best), label.slice(best + 1)];
}

/** Orthogonal edge routes: polyline points + a label anchor, keyed by edge id. */
const ROUTES: Record<string, { points: string; lx: number; ly: number; anchor?: 'start' | 'middle' | 'end' }> = {
  'e-edge-api': { points: '270,333 400,333', lx: 335, ly: 354, anchor: 'middle' },
  'e-edge-ingest': { points: '170,366 170,593 400,593', lx: 285, ly: 582, anchor: 'middle' },
  'e-ingest-fs': { points: '600,593 750,593', lx: 675, ly: 582, anchor: 'middle' },
  'e-api-serving': { points: '600,333 750,333', lx: 675, ly: 322, anchor: 'middle' },
  'e-fs-serving': { points: '850,560 850,366', lx: 862, ly: 475, anchor: 'start' },
  'e-registry-serving': { points: '850,176 850,300', lx: 862, ly: 288, anchor: 'start' },
  'e-serving-policy': { points: '950,333 1100,333', lx: 1002, ly: 322, anchor: 'middle' },
  'e-policy-log': { points: '1200,366 1200,560', lx: 1212, ly: 475, anchor: 'start' },
  'e-log-drift': { points: '1100,610 1040,610 1040,700 870,700 870,780', lx: 1028, ly: 660, anchor: 'end' },
  'e-drift-case': { points: '750,813 660,813', lx: 705, ly: 800, anchor: 'middle' },
};

/** Hand-drafted zone-box geometry + label anchor, keyed by zone id. */
const ZONE_GEOMETRY: Record<string, { x: number; y: number; w: number; h: number; lx: number; ly: number; core?: boolean }> = {
  'channel-dmz': { x: 56, y: 230, w: 260, h: 430, lx: 68, ly: 648 },
  'core-zone': { x: 360, y: 80, w: 990, h: 585, lx: 372, ly: 102, core: true },
  oversight: { x: 360, y: 735, w: 990, h: 155, lx: 372, ly: 757 },
};

/** Hand-drafted dimension-line geometry, keyed by dimension id. */
const DIMENSION_GEOMETRY: Record<string, { orientation: 'h' | 'v'; x1?: number; x2?: number; y?: number; y1?: number; y2?: number; x?: number }> = {
  'hot-path': { orientation: 'h', x1: 70, x2: 1300, y: 252 },
  'durable-record': { orientation: 'v', y1: 300, y2: 600, x: 1404 },
};

const KIND_CAPTION: Record<DrawingOfficeNodeKind, string> = {
  start: 'INGRESS',
  process: 'SERVICE',
  decision: 'DECISION',
  data: 'STORE',
  end: 'WORKBENCH',
};

function GridField() {
  const lines = [];
  const M = 42; // frame margin
  for (let x = M; x <= SHEET_W - M; x += 40) {
    lines.push(<line key={`v${x}`} x1={x} y1={M} x2={x} y2={SHEET_H - M} className="dw-grid" />);
  }
  for (let y = M; y <= SHEET_H - M; y += 40) {
    lines.push(<line key={`h${y}`} x1={M} y1={y} x2={SHEET_W - M} y2={y} className="dw-grid" />);
  }
  // Frame coordinate labels: letters along top/bottom, numbers along sides.
  const cols = 'ABCDEFGH'.split('');
  const colW = (SHEET_W - 2 * M) / cols.length;
  const rows = [1, 2, 3, 4, 5, 6];
  const rowH = (SHEET_H - 2 * M) / rows.length;
  return (
    <g>
      <rect x={10} y={10} width={SHEET_W - 20} height={SHEET_H - 20} className="dw-frame-outer" />
      <rect x={M} y={M} width={SHEET_W - 2 * M} height={SHEET_H - 2 * M} className="dw-frame-inner" />
      <g>{lines}</g>
      {cols.map((c, i) => (
        <g key={c}>
          <text x={M + colW * (i + 0.5)} y={30} textAnchor="middle" className="dw-frame-coord">
            {c}
          </text>
          <text x={M + colW * (i + 0.5)} y={SHEET_H - 20} textAnchor="middle" className="dw-frame-coord">
            {c}
          </text>
          {i > 0 ? (
            <>
              <line x1={M + colW * i} y1={10} x2={M + colW * i} y2={M} className="dw-frame-tick" />
              <line x1={M + colW * i} y1={SHEET_H - M} x2={M + colW * i} y2={SHEET_H - 10} className="dw-frame-tick" />
            </>
          ) : null}
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r}>
          <text x={24} y={M + rowH * (i + 0.5) + 4} textAnchor="middle" className="dw-frame-coord">
            {r}
          </text>
          <text x={SHEET_W - 24} y={M + rowH * (i + 0.5) + 4} textAnchor="middle" className="dw-frame-coord">
            {r}
          </text>
          {i > 0 ? (
            <>
              <line x1={10} y1={M + rowH * i} x2={M} y2={M + rowH * i} className="dw-frame-tick" />
              <line x1={SHEET_W - M} y1={M + rowH * i} x2={SHEET_W - 10} y2={M + rowH * i} className="dw-frame-tick" />
            </>
          ) : null}
        </g>
      ))}
    </g>
  );
}

function Zones({ zones }: { zones: readonly DrawingOfficeZone[] }) {
  return (
    <g>
      {zones.map((zone) => {
        const g = ZONE_GEOMETRY[zone.id];
        if (!g) return null;
        return (
          <g key={zone.id}>
            <rect
              x={g.x}
              y={g.y}
              width={g.w}
              height={g.h}
              className={g.core ? 'dw-zone dw-zone-core' : 'dw-zone'}
            />
            <text x={g.lx} y={g.ly} className="dw-zone-label">
              {zone.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Hatch({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="url(#dw-hatch)" />;
}

function Parts({ nodes, constraintFlag }: { nodes: readonly DrawingOfficeNode[]; constraintFlag: string }) {
  return (
    <g>
      {nodes.map((node, index) => {
        const pos = PLAN[node.id];
        if (!pos) return null;
        const mark = String(index + 1).padStart(2, '0');
        const constrained = node.emphasis === 'constrained';
        return (
          <g key={node.id} data-part={mark}>
            {constrained ? <Hatch x={pos.x} y={pos.y} w={NODE_W} h={NODE_H} /> : null}
            <rect x={pos.x} y={pos.y} width={NODE_W} height={NODE_H} className="dw-part" />
            <rect
              x={pos.x + 4}
              y={pos.y + 4}
              width={NODE_W - 8}
              height={NODE_H - 8}
              className="dw-part-inner"
            />
            {(() => {
              const lines = splitLabel(node.label);
              return lines.length === 1 ? (
                <>
                  <text x={pos.x + NODE_W / 2} y={pos.y + 30} textAnchor="middle" className="dw-part-label">
                    {node.label}
                  </text>
                  <text x={pos.x + NODE_W / 2} y={pos.y + 48} textAnchor="middle" className="dw-part-kind">
                    {KIND_CAPTION[node.kind]}
                  </text>
                </>
              ) : (
                <>
                  <text x={pos.x + NODE_W / 2} y={pos.y + 24} textAnchor="middle" className="dw-part-label">
                    {lines[0]}
                  </text>
                  <text x={pos.x + NODE_W / 2} y={pos.y + 41} textAnchor="middle" className="dw-part-label">
                    {lines[1]}
                  </text>
                  <text x={pos.x + NODE_W / 2} y={pos.y + 57} textAnchor="middle" className="dw-part-kind">
                    {KIND_CAPTION[node.kind]}
                  </text>
                </>
              );
            })()}
            <circle cx={pos.x} cy={pos.y} r={13} className="dw-mark" />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" className="dw-mark-text">
              {mark}
            </text>
            {constrained ? (
              <g>
                <path
                  d={`M ${pos.x + NODE_W + 10} ${pos.y + 8} l 22 -14 v 28 z`}
                  className="dw-note-flag"
                />
                <text x={pos.x + NODE_W + 40} y={pos.y + 2} className="dw-note-flag-text">
                  {constraintFlag}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

function Connections({ edges }: { edges: readonly DrawingOfficeEdge[] }) {
  return (
    <g>
      {edges.map((edge) => {
        const route = ROUTES[edge.id];
        if (!route) return null;
        return (
          <g key={edge.id}>
            <polyline points={route.points} className="dw-edge" markerEnd="url(#dw-arrow)" />
            {edge.label ? (
              <text x={route.lx} y={route.ly} textAnchor={route.anchor ?? 'middle'} className="dw-edge-label">
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

function DimensionH({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g className="dw-dim">
      <line x1={x1} y1={y} x2={x2} y2={y} className="dw-dim-line" />
      <line x1={x1} y1={y - 7} x2={x1} y2={y + 7} className="dw-dim-line" />
      <line x1={x2} y1={y - 7} x2={x2} y2={y + 7} className="dw-dim-line" />
      <path d={`M ${x1} ${y} l 12 -4 v 8 z`} className="dw-dim-arrow" />
      <path d={`M ${x2} ${y} l -12 -4 v 8 z`} className="dw-dim-arrow" />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" className="dw-dim-label">
        {label}
      </text>
    </g>
  );
}

function DimensionV({ y1, y2, x, label }: { y1: number; y2: number; x: number; label: string }) {
  return (
    <g className="dw-dim">
      <line x1={x} y1={y1} x2={x} y2={y2} className="dw-dim-line" />
      <line x1={x - 7} y1={y1} x2={x + 7} y2={y1} className="dw-dim-line" />
      <line x1={x - 7} y1={y2} x2={x + 7} y2={y2} className="dw-dim-line" />
      <path d={`M ${x} ${y1} l -4 12 h 8 z`} className="dw-dim-arrow" />
      <path d={`M ${x} ${y2} l -4 -12 h 8 z`} className="dw-dim-arrow" />
      <text
        x={x - 8}
        y={(y1 + y2) / 2}
        textAnchor="middle"
        transform={`rotate(-90 ${x - 8} ${(y1 + y2) / 2})`}
        className="dw-dim-label"
      >
        {label}
      </text>
    </g>
  );
}

function Dimensions({ dimensions }: { dimensions: readonly DrawingOfficeDimension[] }) {
  return (
    <g>
      {dimensions.map((dim) => {
        const g = DIMENSION_GEOMETRY[dim.id];
        if (!g) return null;
        return g.orientation === 'h' ? (
          <DimensionH key={dim.id} x1={g.x1 ?? 0} x2={g.x2 ?? 0} y={g.y ?? 0} label={dim.label} />
        ) : (
          <DimensionV key={dim.id} y1={g.y1 ?? 0} y2={g.y2 ?? 0} x={g.x ?? 0} label={dim.label} />
        );
      })}
    </g>
  );
}

function SectionCut({
  orientation,
  at,
  from,
  to,
  label,
}: {
  orientation: 'v' | 'h';
  at: number;
  from: number;
  to: number;
  label: string;
}) {
  const isV = orientation === 'v';
  const c1 = isV ? { x: at, y: from - 22 } : { x: from - 22, y: at };
  const c2 = isV ? { x: at, y: to + 22 } : { x: to + 22, y: at };
  return (
    <g className="dw-section">
      <line
        x1={isV ? at : from}
        y1={isV ? from : at}
        x2={isV ? at : to}
        y2={isV ? to : at}
        className="dw-section-line"
      />
      {[c1, c2].map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={15} className="dw-section-bubble" />
          <text x={c.x} y={c.y + 4.5} textAnchor="middle" className="dw-section-text">
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}

/**
 * Drafting furniture — section cuts and the orientation stamp. Content-
 * independent chrome (section letters, reading-direction convention); the
 * measured latency budgets live in the dimension-line captions from the fill.
 */
function Annotations() {
  return (
    <g>
      <SectionCut orientation="v" at={1040} from={94} to={470} label="A" />
      <SectionCut orientation="h" at={873} from={100} to={1000} label="B" />
      {/* Orientation stamp — fills the field's lower-left, drafting-style. */}
      <g className="dw-stamp">
        <circle cx={104} cy={760} r={26} className="dw-stamp-ring" />
        <line x1={104} y1={738} x2={104} y2={782} className="dw-stamp-line" />
        <line x1={82} y1={760} x2={126} y2={760} className="dw-stamp-line" />
        <text x={148} y={752} className="dw-stamp-text">
          FLOW L → R
        </text>
        <text x={148} y={772} className="dw-stamp-text">
          RETURN BELOW
        </text>
      </g>
    </g>
  );
}

export interface ArchitectureDrawingProps {
  className?: string;
  nodes: readonly DrawingOfficeNode[];
  edges: readonly DrawingOfficeEdge[];
  zones: readonly DrawingOfficeZone[];
  dimensions: readonly DrawingOfficeDimension[];
  /** The short flag label drawn beside the constrained part. */
  constraintFlag: string;
}

export function ArchitectureDrawing({
  className,
  nodes,
  edges,
  zones,
  dimensions,
  constraintFlag,
}: ArchitectureDrawingProps) {
  return (
    <svg
      viewBox={`0 0 ${SHEET_W} ${SHEET_H}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      data-testid="architecture-drawing"
    >
      <defs>
        <pattern id="dw-hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="9" className="dw-hatch-line" />
        </pattern>
        <marker id="dw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" className="dw-arrowhead" />
        </marker>
      </defs>

      <DataInkDraw
        as="g"
        groups={[
          {
            id: 'field',
            content: (
              <g>
                <GridField />
                <Zones zones={zones} />
              </g>
            ),
          },
          { id: 'parts', content: <Parts nodes={nodes} constraintFlag={constraintFlag} /> },
          { id: 'connections', content: <Connections edges={edges} /> },
          {
            id: 'annotations',
            content: (
              <g>
                <Dimensions dimensions={dimensions} />
                <Annotations />
              </g>
            ),
          },
        ]}
      />
    </svg>
  );
}
