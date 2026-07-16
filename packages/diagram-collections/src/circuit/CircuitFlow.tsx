import { useMemo } from 'react';
import { buildOutline, layoutFlow, type FlowSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxBoard, CxChip, CxLabel, CxStep, CxTrace, cxGlow, cxInk } from './shapes.js';

/** Neon-terminal flow: glass chips, phosphor traces flowing left to right. */
export function CircuitFlow({ spec }: { spec: FlowSpecT }) {
  const layout = useMemo(() => layoutFlow(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="circuit" kind="flow" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="flow" />
        {layout.edges.map((edge, i) => {
          const [x1, y1] = edge.points[0]!;
          const [x2, y2] = edge.points[1]!;
          const mx = Math.round((x1 + x2) / 2);
          const d = y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} H${mx} V${y2} H${x2}`;
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <CxTrace
                d={d}
                tip={{ x: x2, y: y2, angle: x2 >= mx ? 0 : Math.PI }}
                ink={cxInk(i)}
                glow={cxGlow('flow')}
                flow={!reduced}
              />
              {edge.label !== undefined && (
                <CxLabel x={edge.labelAt[0]} y={edge.labelAt[1] - 5} text={edge.label} className="cx-trace-label" maxChars={16} />
              )}
              {edge.step !== undefined && <CxStep x={edge.labelAt[0]} y={edge.labelAt[1] + 12} step={edge.step} />}
            </g>
          );
        })}
        {layout.nodes.map((node, i) => (
          <g key={node.id} className="cx-node" style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}>
            <CxChip kind={node.kind} x={node.x} y={node.y} w={node.w} h={node.h} ink={cxInk(node.rank)} />
            <CxLabel x={node.x + node.w / 2} y={node.y + node.h / 2} text={node.label} />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
