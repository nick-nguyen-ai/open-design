import { wrapLabel } from '../shared/text.js';

/**
 * Circuit shape kit — the neon-terminal vocabulary: glassy chips on a
 * near-black board, phosphor-glow traces (SVG gaussian filter), scanline
 * corner accent. Node KIND is encoded by silhouette; the three phosphor inks
 * rotate for grouping only, never as the sole encoding.
 */

export type CxNodeKind = 'start' | 'process' | 'decision' | 'data' | 'actor' | 'end';

export const CX_INKS = ['cx-green', 'cx-cyan', 'cx-magenta'] as const;
export const cxInk = (index: number): string => CX_INKS[index % CX_INKS.length]!;

/** Board background: faint trace grid, glow filter defs, corner scanlines. */
export function CxBoard({ width, height, kind }: { width: number; height: number; kind: string }) {
  const glowId = `dgm-cx-glow-${kind}`;
  const gridId = `dgm-cx-grid-${kind}`;
  return (
    <>
      <defs>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id={gridId} width={28} height={28} patternUnits="userSpaceOnUse">
          <path d="M28 0 H0 V28" className="cx-grid-line" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={width} height={height} className="cx-board" rx={8} />
      <rect x={0} y={0} width={width} height={height} fill={`url(#${gridId})`} rx={8} />
      <g className="cx-scan">
        <path d={`M${width - 46} 10 h36 M${width - 46} 15 h36 M${width - 46} 20 h24`} />
      </g>
    </>
  );
}

/** The family's glow filter url for a given kind board. */
export const cxGlow = (kind: string): string => `url(#dgm-cx-glow-${kind})`;

export function CxChip({
  kind,
  x,
  y,
  w,
  h,
  ink,
}: {
  kind: CxNodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  ink: string;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  switch (kind) {
    case 'start':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={h / 2} className={`cx-chip ${ink}`} />
          <circle cx={x + h / 2} cy={cy} r={4} className={`cx-pin ${ink}`} />
        </g>
      );
    case 'end':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={h / 2} className={`cx-chip ${ink}`} />
          <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={(h - 8) / 2} className={`cx-chip-inner ${ink}`} />
        </g>
      );
    case 'decision':
      return (
        <g data-node-kind={kind}>
          <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} className={`cx-chip ${ink}`} />
        </g>
      );
    case 'data':
      return (
        <g data-node-kind={kind}>
          <path
            d={`M${x} ${y + 7} A${w / 2} 7 0 0 1 ${x + w} ${y + 7} V${y + h - 7} A${w / 2} 7 0 0 1 ${x} ${y + h - 7} Z`}
            className={`cx-chip ${ink}`}
          />
          <path d={`M${x} ${y + 7} A${w / 2} 7 0 0 0 ${x + w} ${y + 7}`} className={`cx-chip-inner ${ink}`} fill="none" />
        </g>
      );
    case 'actor':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={6} className={`cx-chip ${ink}`} />
          <circle cx={x + 15} cy={cy} r={5} className={`cx-chip-inner ${ink}`} />
        </g>
      );
    default:
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={6} className={`cx-chip ${ink}`} />
          {/* chip legs */}
          <path d={`M${x + 10} ${y - 4} v4 M${x + w - 10} ${y - 4} v4 M${x + 10} ${y + h} v4 M${x + w - 10} ${y + h} v4`} className={`cx-pin-line ${ink}`} />
        </g>
      );
  }
}

/** A glowing trace with an arrow tip; optionally carries the dash-flow pulse. */
export function CxTrace({
  d,
  tip,
  ink,
  glow,
  flow = true,
}: {
  d: string;
  tip?: { x: number; y: number; angle: number };
  ink: string;
  glow: string;
  flow?: boolean;
}) {
  const barb = 8;
  return (
    <g className="cx-edge">
      <path d={d} className={`cx-trace ${ink}${flow ? ' cx-flow' : ''}`} filter={glow} fill="none" />
      {tip && (
        <path
          d={`M${tip.x - barb * Math.cos(tip.angle - 0.45)} ${tip.y - barb * Math.sin(tip.angle - 0.45)} L${tip.x} ${tip.y} L${tip.x - barb * Math.cos(tip.angle + 0.45)} ${tip.y - barb * Math.sin(tip.angle + 0.45)}`}
          className={`cx-tip ${ink}`}
          fill="none"
        />
      )}
    </g>
  );
}

/** Centred label, wrapped, in the family face. */
export function CxLabel({
  x,
  y,
  text,
  maxChars = 18,
  className = 'cx-label',
  lineHeight = 14,
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

/** Terminal-style step tag: `[03]`. */
export function CxStep({ x, y, step }: { x: number; y: number; step: number }) {
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="cx-step">
      [{String(step).padStart(2, '0')}]
    </text>
  );
}
