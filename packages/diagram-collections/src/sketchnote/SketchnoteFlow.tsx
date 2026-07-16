import { useMemo } from 'react';
import { buildOutline, layoutFlow, type FlowSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { SkArrow, SkLabel, SkShape, SkStepBadge, skTint } from './shapes.js';

/** Hand-journal flow: sticky-note steps, rough dashed arrows, numbered badges. */
export function SketchnoteFlow({ spec }: { spec: FlowSpecT }) {
  const layout = useMemo(() => layoutFlow(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="flow" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        {layout.edges.map((edge, i) => (
          <g key={`${edge.from}-${edge.to}-${i}`}>
            <SkArrow
              x1={edge.points[0]![0]}
              y1={edge.points[0]![1]}
              x2={edge.points[1]![0]}
              y2={edge.points[1]![1]}
              seed={`${edge.from}->${edge.to}`}
              dashed
            />
            {edge.label !== undefined && (
              <SkLabel x={edge.labelAt[0]} y={edge.labelAt[1] - 6} text={edge.label} className="sk-edge-label" maxChars={16} />
            )}
            {edge.step !== undefined && (
              <SkStepBadge x={edge.labelAt[0]} y={edge.labelAt[1] + 14} step={edge.step} seed={`${edge.from}->${edge.to}`} />
            )}
          </g>
        ))}
        {layout.nodes.map((node, i) => (
          <g key={node.id} className="sk-node" style={reduced ? undefined : { animationDelay: `${i * 60}ms` }}>
            <SkShape kind={node.kind} x={node.x} y={node.y} w={node.w} h={node.h} seed={node.id} tint={skTint(node.rank)} />
            <SkLabel x={node.x + node.w / 2} y={node.y + node.h / 2 + (node.kind === 'actor' ? 6 : 0)} text={node.label} />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
