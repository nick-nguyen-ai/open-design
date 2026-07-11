/**
 * Node-kind glyphs, distinguished by SHAPE — not colour — so kind reads even
 * in greyscale/print or for a colour-blind viewer. `start`/`end` additionally
 * differ from each other via a single vs. double border (a common flowchart
 * convention for "entry" vs. "terminal").
 */
import { cssVar } from '@enterprise-design/design-tokens';
import type { FlowNodeKind } from './buildFlowDiagramLayout.js';

export interface NodeShapeProps {
  kind: FlowNodeKind;
  width: number;
  height: number;
}

const SURFACE = cssVar('diagram-node-surface');
const BORDER = cssVar('diagram-node-border');

export function NodeShape({ kind, width, height }: NodeShapeProps) {
  const common = { fill: SURFACE, stroke: BORDER, strokeWidth: 1.5 };

  switch (kind) {
    case 'decision': {
      const cx = width / 2;
      const cy = height / 2;
      const points = `${cx},0 ${width},${cy} ${cx},${height} 0,${cy}`;
      return <polygon points={points} {...common} />;
    }
    case 'data': {
      const skew = 18;
      const points = `${skew},0 ${width},0 ${width - skew},${height} 0,${height}`;
      return <polygon points={points} {...common} />;
    }
    case 'start':
      return <rect width={width} height={height} rx={height / 2} {...common} />;
    case 'end':
      return (
        <>
          <rect width={width} height={height} rx={height / 2} {...common} />
          <rect
            x={4}
            y={4}
            width={width - 8}
            height={height - 8}
            rx={(height - 8) / 2}
            fill="none"
            stroke={BORDER}
            strokeWidth={1.5}
          />
        </>
      );
    case 'process':
    default:
      return <rect width={width} height={height} rx={8} {...common} />;
  }
}
