import { isoBoxFaces, isoProject } from '../shared/iso.js';
import { wrapLabel } from '../shared/text.js';

/**
 * Isometric shape kit — the 2.5D studio vocabulary: every node is an extruded
 * block with three-face candy shading and a ground shadow; connectors travel
 * on the ground plane. Node KIND is encoded by structure (footprint shape,
 * stack count, height class), never colour alone. All world→screen mapping
 * goes through `isoProject`; text is billboarded (never skewed).
 */

export const ISO_INKS = ['iso-violet', 'iso-mint', 'iso-peach', 'iso-rose'] as const;
export const isoInk = (index: number): string => ISO_INKS[index % ISO_INKS.length]!;

/** Screen-space extent of a world-space box scene, for viewBox fitting. */
export function isoExtent(worldW: number, worldH: number, maxZ: number, pad = 28) {
  const corners: Array<[number, number]> = [
    isoProject(0, 0, 0),
    isoProject(worldW, 0, 0),
    isoProject(0, worldH, 0),
    isoProject(worldW, worldH, 0),
    isoProject(0, 0, maxZ),
    isoProject(worldW, 0, maxZ),
    isoProject(0, worldH, maxZ),
    isoProject(worldW, worldH, maxZ),
  ];
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return {
    width: Math.max(...xs) - minX + pad,
    height: Math.max(...ys) - minY + pad,
    tx: -minX,
    ty: -minY,
  };
}

const pts = (points: Array<[number, number]>): string =>
  points.map(([x, y]) => `${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`).join(' ');

/** Soft ground shadow under a footprint. */
export function IsoShadow({ x, y, w, d }: { x: number; y: number; w: number; d: number }) {
  const o = 6;
  return (
    <polygon
      points={pts([isoProject(x + o, y + o, 0), isoProject(x + w + o, y + o, 0), isoProject(x + w + o, y + d + o, 0), isoProject(x + o, y + d + o, 0)])}
      className="iso-shadow"
    />
  );
}

/** An extruded block with three shaded faces. */
export function IsoBox({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  ink,
}: {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  ink: string;
}) {
  const faces = isoBoxFaces(x, y, z, w, d, h);
  return (
    <g className={ink}>
      <polygon points={faces.left} className="iso-face-left" />
      <polygon points={faces.right} className="iso-face-right" />
      <polygon points={faces.top} className="iso-face-top" />
    </g>
  );
}

/** A flat ground pad (footprint outline, no extrusion). */
export function IsoPad({ x, y, w, d, ink, dashed = false }: { x: number; y: number; w: number; d: number; ink?: string; dashed?: boolean }) {
  return (
    <polygon
      points={pts([isoProject(x, y, 0), isoProject(x + w, y, 0), isoProject(x + w, y + d, 0), isoProject(x, y + d, 0)])}
      className={`iso-pad${ink ? ` ${ink}` : ''}${dashed ? ' iso-dashed' : ''}`}
    />
  );
}

/**
 * A node block whose STRUCTURE encodes its kind:
 * start/end = flat pad (end adds an inner ring), process = full block,
 * decision = diamond-footprint block, data = two stacked slabs,
 * actor = block with a head sphere.
 */
export function IsoNode({
  kind,
  x,
  y,
  w,
  d,
  ink,
}: {
  kind: 'start' | 'process' | 'decision' | 'data' | 'actor' | 'end';
  x: number;
  y: number;
  w: number;
  d: number;
  ink: string;
}) {
  switch (kind) {
    case 'start':
    case 'end': {
      const inner = pts([
        isoProject(x + 8, y + 8, 4),
        isoProject(x + w - 8, y + 8, 4),
        isoProject(x + w - 8, y + d - 8, 4),
        isoProject(x + 8, y + d - 8, 4),
      ]);
      return (
        <g data-node-kind={kind}>
          <IsoShadow x={x} y={y} w={w} d={d} />
          <IsoBox x={x} y={y} w={w} d={d} h={6} ink={ink} />
          {kind === 'end' && <polygon points={inner} className="iso-ring" />}
        </g>
      );
    }
    case 'decision': {
      const cx = x + w / 2;
      const cy = y + d / 2;
      const faces = {
        top: pts([isoProject(cx, y, 34), isoProject(x + w, cy, 34), isoProject(cx, y + d, 34), isoProject(x, cy, 34)]),
        left: pts([isoProject(x, cy, 0), isoProject(cx, y + d, 0), isoProject(cx, y + d, 34), isoProject(x, cy, 34)]),
        right: pts([isoProject(cx, y + d, 0), isoProject(x + w, cy, 0), isoProject(x + w, cy, 34), isoProject(cx, y + d, 34)]),
      };
      return (
        <g data-node-kind={kind} className={ink}>
          <IsoShadow x={x} y={y} w={w} d={d} />
          <polygon points={faces.left} className="iso-face-left" />
          <polygon points={faces.right} className="iso-face-right" />
          <polygon points={faces.top} className="iso-face-top" />
        </g>
      );
    }
    case 'data':
      return (
        <g data-node-kind={kind}>
          <IsoShadow x={x} y={y} w={w} d={d} />
          <IsoBox x={x} y={y} w={w} d={d} h={14} ink={ink} />
          <IsoBox x={x + 5} y={y + 5} z={14} w={w - 10} d={d - 10} h={12} ink={ink} />
        </g>
      );
    case 'actor': {
      const [hx, hy] = isoProject(x + w / 2, y + d / 2, 44);
      return (
        <g data-node-kind={kind}>
          <IsoShadow x={x} y={y} w={w} d={d} />
          <IsoBox x={x} y={y} w={w} d={d} h={30} ink={ink} />
          <circle cx={hx} cy={hy} r={8} className={`${ink} iso-head`} />
        </g>
      );
    }
    default:
      return (
        <g data-node-kind={kind}>
          <IsoShadow x={x} y={y} w={w} d={d} />
          <IsoBox x={x} y={y} w={w} d={d} h={26} ink={ink} />
        </g>
      );
  }
}

/** A ground-plane arrow between two world points. */
export function IsoGroundArrow({
  x1,
  y1,
  x2,
  y2,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}) {
  const [sx, sy] = isoProject(x1, y1, 0);
  const [ex, ey] = isoProject(x2, y2, 0);
  const angle = Math.atan2(ey - sy, ex - sx);
  const barb = 8;
  return (
    <g className="iso-edge">
      <path d={`M${sx} ${sy} L${ex} ${ey}`} className={dashed ? 'iso-wire iso-dashed iso-draw' : 'iso-wire iso-draw'} pathLength={1} />
      <path
        d={`M${ex - barb * Math.cos(angle - 0.45)} ${ey - barb * Math.sin(angle - 0.45)} L${ex} ${ey} L${ex - barb * Math.cos(angle + 0.45)} ${ey - barb * Math.sin(angle + 0.45)}`}
        className="iso-wire"
        fill="none"
      />
    </g>
  );
}

/** Billboarded label floating above a world point. */
export function IsoLabel({
  wx,
  wy,
  z,
  text,
  maxChars = 16,
  className = 'iso-label',
  lineHeight = 13,
}: {
  wx: number;
  wy: number;
  z: number;
  text: string;
  maxChars?: number;
  className?: string;
  lineHeight?: number;
}) {
  const [x, y] = isoProject(wx, wy, z);
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
