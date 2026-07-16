import { useMemo } from 'react';
import { buildOutline, layoutFlow, type FlowSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpEdge, BpLabel, BpShape, BpSheet, BpStep } from './shapes.js';

/** Drafting-sheet flow: stencil stations, orthogonal wires, hex step stamps. */
export function BlueprintFlow({ spec }: { spec: FlowSpecT }) {
  const layout = useMemo(() => layoutFlow(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="blueprint" kind="flow" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="flow" />
        {layout.edges.map((edge, i) => (
          <g key={`${edge.from}-${edge.to}-${i}`}>
            <BpEdge
              x1={edge.points[0]![0]}
              y1={edge.points[0]![1]}
              x2={edge.points[1]![0]}
              y2={edge.points[1]![1]}
              horizontalFirst={edge.points[0]![1] !== edge.points[1]![1] || true}
            />
            {edge.label !== undefined && (
              <BpLabel x={edge.labelAt[0]} y={edge.labelAt[1] - 4} text={edge.label} className="bp-wire-label" maxChars={16} />
            )}
            {edge.step !== undefined && <BpStep x={edge.labelAt[0]} y={edge.labelAt[1] + 14} step={edge.step} />}
          </g>
        ))}
        {layout.nodes.map((node, i) => (
          <g key={node.id} className="bp-node" style={reduced ? undefined : { animationDelay: `${i * 60}ms` }}>
            <BpShape kind={node.kind} x={node.x} y={node.y} w={node.w} h={node.h} accent={node.kind === 'decision'} />
            <BpLabel x={node.x + node.w / 2} y={node.y + node.h / 2 + (node.kind === 'actor' ? 6 : 0)} text={node.label} />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
