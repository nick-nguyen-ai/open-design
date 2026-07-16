import { wrapLabel } from '../shared/text.js';

/**
 * Gazette shape kit — the print-atelier vocabulary: fine ink rules on cream
 * paper, one vermilion spot colour, numbered medallions with serif numerals,
 * diagonal hatch fills for emphasis. Node KIND is encoded by silhouette and
 * rule treatment; vermilion is an accent, never the sole encoding.
 */

export type GzNodeKind = 'start' | 'process' | 'decision' | 'data' | 'actor' | 'end';

/** Sheet furniture: hatch pattern defs + double-rule frame. */
export function GzSheet({ width, height, kind }: { width: number; height: number; kind: string }) {
  const hatchId = `dgm-gz-hatch-${kind}`;
  return (
    <>
      <defs>
        <pattern id={hatchId} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={6} className="gz-hatch-line" />
        </pattern>
      </defs>
      <rect x={3} y={3} width={width - 6} height={height - 6} className="gz-rule-heavy" />
      <rect x={7} y={7} width={width - 14} height={height - 14} className="gz-rule-fine" />
    </>
  );
}

export const gzHatch = (kind: string): string => `url(#dgm-gz-hatch-${kind})`;

/** Vermilion medallion with a serif numeral — the family's step marker. */
export function GzMedallion({ x, y, label, r = 11 }: { x: number; y: number; label: string; r?: number }) {
  return (
    <g className="gz-medallion">
      <circle cx={x} cy={y} r={r} className="gz-medallion-disc" />
      <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="middle" className="gz-medallion-num">
        {label}
      </text>
    </g>
  );
}

export function GzShape({
  kind,
  x,
  y,
  w,
  h,
  hatch,
}: {
  kind: GzNodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  hatch: string;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  switch (kind) {
    case 'start':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={h / 2} className="gz-plate" />
        </g>
      );
    case 'end':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} rx={h / 2} className="gz-plate" />
          <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={(h - 8) / 2} className="gz-rule-fine" />
        </g>
      );
    case 'decision':
      return (
        <g data-node-kind={kind}>
          <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} className="gz-plate" fill={hatch} />
          <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} className="gz-plate-outline" />
        </g>
      );
    case 'data':
      return (
        <g data-node-kind={kind}>
          <path
            d={`M${x} ${y + 7} A${w / 2} 7 0 0 1 ${x + w} ${y + 7} V${y + h - 7} A${w / 2} 7 0 0 1 ${x} ${y + h - 7} Z`}
            className="gz-plate"
          />
          <path d={`M${x} ${y + 7} A${w / 2} 7 0 0 0 ${x + w} ${y + 7}`} className="gz-rule-fine" fill="none" />
        </g>
      );
    case 'actor':
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} className="gz-plate" />
          <circle cx={x + 15} cy={y + h / 2 - 6} r={4.5} className="gz-ink-fill" />
          <path d={`M${x + 8} ${y + h - 9} Q${x + 15} ${y + h / 2 + 4} ${x + 22} ${y + h - 9} Z`} className="gz-ink-fill" />
        </g>
      );
    default:
      return (
        <g data-node-kind={kind}>
          <rect x={x} y={y} width={w} height={h} className="gz-plate" />
          <rect x={x} y={y} width={4} height={h} className="gz-spot-fill" />
        </g>
      );
  }
}

/** A fine ink connector with a classic engraving arrowhead. */
export function GzEdge({
  x1,
  y1,
  x2,
  y2,
  dashed = false,
  spot = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  spot?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const barb = 8;
  const b1x = x2 - barb * Math.cos(angle - 0.4);
  const b1y = y2 - barb * Math.sin(angle - 0.4);
  const b2x = x2 - barb * Math.cos(angle + 0.4);
  const b2y = y2 - barb * Math.sin(angle + 0.4);
  const cls = `${spot ? 'gz-wire-spot' : 'gz-wire'}${dashed ? ' gz-dashed' : ''} gz-draw`;
  return (
    <g className="gz-edge">
      <path d={`M${x1} ${y1} L${x2} ${y2}`} className={cls} pathLength={1} />
      <path d={`M${b1x} ${b1y} L${x2} ${y2} L${b2x} ${b2y} Z`} className={spot ? 'gz-head-spot' : 'gz-head'} />
    </g>
  );
}

/** Centred label in the family's serif hand. */
export function GzLabel({
  x,
  y,
  text,
  maxChars = 18,
  className = 'gz-label',
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
