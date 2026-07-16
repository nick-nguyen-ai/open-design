import { useMemo } from 'react';
import { buildOutline, layoutFlow, type FlowSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzEdge, GzLabel, GzMedallion, GzShape, GzSheet, gzHatch } from './shapes.js';

/** Field-manual flow: ruled plates, fine ink connectors, vermilion medallions. */
export function GazetteFlow({ spec }: { spec: FlowSpecT }) {
  const layout = useMemo(() => layoutFlow(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="gazette" kind="flow" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="flow" />
        {layout.edges.map((edge, i) => (
          <g key={`${edge.from}-${edge.to}-${i}`}>
            <GzEdge
              x1={edge.points[0]![0]}
              y1={edge.points[0]![1]}
              x2={edge.points[1]![0]}
              y2={edge.points[1]![1]}
            />
            {edge.label !== undefined && (
              <GzLabel x={edge.labelAt[0]} y={edge.labelAt[1] - 5} text={edge.label} className="gz-edge-label" maxChars={16} />
            )}
            {edge.step !== undefined && <GzMedallion x={edge.labelAt[0]} y={edge.labelAt[1] + 15} label={String(edge.step)} />}
          </g>
        ))}
        {layout.nodes.map((node, i) => (
          <g key={node.id} className="gz-node" style={reduced ? undefined : { animationDelay: `${i * 60}ms` }}>
            <GzShape kind={node.kind} x={node.x} y={node.y} w={node.w} h={node.h} hatch={gzHatch('flow')} />
            <GzLabel x={node.x + node.w / 2} y={node.y + node.h / 2 + (node.kind === 'actor' ? 4 : 0)} text={node.label} />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
