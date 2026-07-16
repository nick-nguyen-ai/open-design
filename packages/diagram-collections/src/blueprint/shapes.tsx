import { wrapLabel } from '../shared/text.js';

/**
 * Blueprint shape kit — the drafting-table vocabulary: crisp stencil
 * silhouettes, strictly orthogonal connectors with square heads and dimension
 * ticks, a dot-grid sheet with a title-block stamp. No jitter anywhere; the
 * family's precision IS the craft. Node KIND is encoded by silhouette.
 */

export type BpNodeKind = 'start' | 'process' | 'decision' | 'data' | 'actor' | 'end';

/** The drawing sheet: dot grid + border + corner title block. */
export function BpSheet({ width, height, kind }: { width: number; height: number; kind: string }) {
  const patternId = `dgm-bp-grid-${kind}`;
  return (
    <>
      <defs>
        <pattern id={patternId} width={16} height={16} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={0.8} className="bp-grid-dot" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={width} height={height} className="bp-field" />
      <rect x={0} y={0} width={width} height={height} fill={`url(#${patternId})`} />
      <rect x={4} y={4} width={width - 8} height={height - 8} className="bp-frame" />
      <g className="bp-titleblock">
        <rect x={width - 118} y={height - 26} width={114} height={22} className="bp-frame" />
        <text x={width - 111} y={height - 11} className="bp-stamp">
          DGM-{kind.toUpperCase()}-01
        </text>
      </g>
    </>
  );
}

export function BpShape({
  kind,
  x,
  y,
  w,
  h,
  accent = false,
}: {
  kind: BpNodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: boolean;
}) {
  const cls = accent ? 'bp-shape bp-accent' : 'bp-shape';
  const cx = x + w / 2;
  const cy = y + h / 2;
  switch (kind) {
    case 'start':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={h / 2} className={cls} />
        </g>
      );
    case 'end':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={h / 2} className={cls} />
          <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={(h - 8) / 2} className="bp-stroke-only" />
        </g>
      );
    case 'decision':
      return (
        <g data-node-kind={kind}>
          <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} className={cls} />
        </g>
      );
    case 'data':
      return (
        <g data-node-kind={kind}>
          <path
            d={`M${x} ${y + 7} A${w / 2} 7 0 0 1 ${x + w} ${y + 7} V${y + h - 7} A${w / 2} 7 0 0 1 ${x} ${y + h - 7} Z`}
            className={cls}
          />
          <path d={`M${x} ${y + 7} A${w / 2} 7 0 0 0 ${x + w} ${y + 7}`} className="bp-stroke-only" />
        </g>
      );
    case 'actor':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} className={cls} />
          <circle cx={x + 16} cy={y + h / 2 - 8} r={5} className="bp-stroke-only" />
          <path
            d={`M${x + 8} ${y + h - 8} Q${x + 16} ${y + h / 2 + 2} ${x + 24} ${y + h - 8}`}
            className="bp-stroke-only"
          />
        </g>
      );
    default:
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} className={cls} />
        </g>
      );
  }
}

/** Manhattan-routed connector: elbow at the midpoint, square head, mid tick. */
export function BpEdge({
  x1,
  y1,
  x2,
  y2,
  horizontalFirst = true,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  horizontalFirst?: boolean;
  dashed?: boolean;
}) {
  const mx = Math.round((x1 + x2) / 2);
  const my = Math.round((y1 + y2) / 2);
  const d = horizontalFirst
    ? `M${x1} ${y1} L${mx} ${y1} L${mx} ${y2} L${x2} ${y2}`
    : `M${x1} ${y1} L${x1} ${my} L${x2} ${my} L${x2} ${y2}`;
  const headTowardRight = horizontalFirst ? x2 >= mx : x2 >= x1;
  const head = headTowardRight
    ? `M${x2 - 6} ${y2 - 3.5} L${x2} ${y2} L${x2 - 6} ${y2 + 3.5} Z`
    : `M${x2 + 6} ${y2 - 3.5} L${x2} ${y2} L${x2 + 6} ${y2 + 3.5} Z`;
  return (
    <g className="bp-edge">
      <path d={d} className={dashed ? 'bp-wire bp-dashed bp-draw' : 'bp-wire bp-draw'} pathLength={1} />
      <path d={head} className="bp-head" />
      <path d={`M${mx - 3} ${my - 3} L${mx + 3} ${my + 3}`} className="bp-tick" />
    </g>
  );
}

/** Centred mono label, wrapped. */
export function BpLabel({
  x,
  y,
  text,
  maxChars = 18,
  className = 'bp-label',
  lineHeight = 13,
}: {
  x: number;
  y: number;
  text: string;
  maxChars?: number;
  className?: string;
  lineHeight?: number;
}) {
  const lines = wrapLabel(text, maxChars);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  return (
    <text x={x} y={startY} textAnchor="middle" dominantBaseline="middle" className={className}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} y={startY + i * lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/** Hexagonal step marker — the family's numbered station stamp. */
export function BpStep({ x, y, step }: { x: number; y: number; step: number }) {
  const r = 9;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${Math.round((x + r * Math.cos(a)) * 10) / 10},${Math.round((y + r * Math.sin(a)) * 10) / 10}`;
  }).join(' ');
  return (
    <g className="bp-step">
      <polygon points={pts} className="bp-shape bp-alert" />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" className="bp-step-num">
        {step}
      </text>
    </g>
  );
}
