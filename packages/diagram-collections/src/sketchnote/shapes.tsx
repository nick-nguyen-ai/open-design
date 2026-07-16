import { roughEllipse, roughLine, roughRect, seededJitter } from '../shared/rough.js';
import { wrapLabel } from '../shared/text.js';

/**
 * Sketchnote shape kit — the family's hand-drawn vocabulary, shared by all
 * eight renderers. Node KIND is encoded by silhouette (pill / rect / diamond /
 * cylinder / figure / double pill), never colour alone. Sticky tints rotate
 * through the family's four highlighter inks by a stable index.
 */

export const SK_TINTS = ['sk-tint-amber', 'sk-tint-coral', 'sk-tint-sky', 'sk-tint-sage'] as const;

export const skTint = (index: number): string => SK_TINTS[index % SK_TINTS.length]!;

export type SkNodeKind = 'start' | 'process' | 'decision' | 'data' | 'actor' | 'end';

export function SkShape({
  kind,
  x,
  y,
  w,
  h,
  seed,
  tint,
}: {
  kind: SkNodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  seed: string;
  tint: string;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  switch (kind) {
    case 'start':
    case 'end': {
      const outer = <path d={roughEllipse(cx, cy, w / 2, h / 2, seed)} className={`sk-shape ${tint}`} />;
      if (kind === 'start') return <g data-node-kind={kind}>{outer}</g>;
      return (
        <g data-node-kind={kind}>
          {outer}
          <path d={roughEllipse(cx, cy, w / 2 - 5, h / 2 - 5, `${seed}:inner`)} className="sk-stroke" fill="none" />
        </g>
      );
    }
    case 'decision': {
      const j = seededJitter(`diamond:${seed}`);
      const p = (px: number, py: number, i: number) => `${px + j(i) * 2} ${py + j(i + 1) * 2}`;
      const d = `M${p(cx, y, 0)} L${p(x + w, cy, 2)} L${p(cx, y + h, 4)} L${p(x, cy, 6)} Z`;
      return (
        <g data-node-kind={kind}>
          <path d={d} className={`sk-shape ${tint}`} />
        </g>
      );
    }
    case 'data':
      return (
        <g data-node-kind={kind}>
          <path d={roughRect(x, y + 6, w, h - 12, seed)} className={`sk-shape ${tint}`} />
          <path d={roughEllipse(cx, y + 7, w / 2, 7, `${seed}:lid`)} className="sk-stroke" fill="none" />
        </g>
      );
    case 'actor': {
      const headR = 8;
      return (
        <g data-node-kind={kind}>
          <path d={roughRect(x, y + 12, w, h - 12, seed)} className={`sk-shape ${tint}`} />
          <path d={roughEllipse(x + 20, y + 12, headR, headR, `${seed}:head`)} className="sk-stroke sk-paper-fill" />
        </g>
      );
    }
    default:
      return (
        <g data-node-kind={kind}>
          <path d={roughRect(x, y, w, h, seed)} className={`sk-shape ${tint}`} />
        </g>
      );
  }
}

/** A hand-drawn arrow: rough shaft plus two rough barbs at the tip. */
export function SkArrow({
  x1,
  y1,
  x2,
  y2,
  seed,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  seed: string;
  dashed?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const barb = 9;
  const b1x = x2 - barb * Math.cos(angle - 0.5);
  const b1y = y2 - barb * Math.sin(angle - 0.5);
  const b2x = x2 - barb * Math.cos(angle + 0.5);
  const b2y = y2 - barb * Math.sin(angle + 0.5);
  return (
    <g className="sk-edge">
      <path d={roughLine(x1, y1, x2, y2, seed)} className={dashed ? 'sk-stroke sk-dashed sk-draw' : 'sk-stroke sk-draw'} fill="none" pathLength={1} />
      <path d={`${roughLine(x2, y2, b1x, b1y, `${seed}:b1`, 1)} ${roughLine(x2, y2, b2x, b2y, `${seed}:b2`, 1)}`} className="sk-stroke" fill="none" />
    </g>
  );
}

/** Centred, wrapped SVG label in the family hand. */
export function SkLabel({
  x,
  y,
  text,
  maxChars = 18,
  className = 'sk-label',
  lineHeight = 17,
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

/** A numbered step badge — rough circle + numeral, the family's step marker. */
export function SkStepBadge({ x, y, step, seed }: { x: number; y: number; step: number; seed: string }) {
  return (
    <g className="sk-step">
      <path d={roughEllipse(x, y, 10, 10, `step:${seed}`)} className="sk-shape sk-tint-amber" />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" className="sk-step-num">
        {step}
      </text>
    </g>
  );
}
