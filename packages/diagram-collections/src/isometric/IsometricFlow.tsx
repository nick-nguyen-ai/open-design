import { useMemo } from 'react';
import { buildOutline, layoutFlow, type FlowSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { isoProject } from '../shared/iso.js';
import { IsoGroundArrow, IsoLabel, IsoNode, isoExtent, isoInk } from './shapes.js';

const SCALE = 0.95;
const FOOT_W = 112;
const FOOT_D = 60;
const KIND_Z: Record<string, number> = { start: 6, end: 6, process: 26, decision: 34, data: 26, actor: 44 };

/** Studio-floor flow: extruded stations on a soft ground, arrows on the floor. */
export function IsometricFlow({ spec }: { spec: FlowSpecT }) {
  const layout = useMemo(() => layoutFlow(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  const world = useMemo(() => {
    const nodes = layout.nodes.map((n) => ({ ...n, wx: n.x * SCALE, wy: n.y * SCALE }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    return { nodes: [...nodes].sort((a, b) => a.wx + a.wy - (b.wx + b.wy)), byId };
  }, [layout]);

  const view = isoExtent(layout.width * SCALE + FOOT_W, layout.height * SCALE + FOOT_D, 60);

  return (
    <DiagramFrame family="isometric" kind="flow" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          {layout.edges.map((edge, i) => {
            const from = world.byId.get(edge.from)!;
            const to = world.byId.get(edge.to)!;
            const [lx, ly] = isoProject((from.wx + to.wx) / 2 + FOOT_W / 2, (from.wy + to.wy) / 2 + FOOT_D / 2, 0);
            return (
              <g key={`${edge.from}-${edge.to}-${i}`} className="iso-msg" style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}>
                <IsoGroundArrow
                  x1={from.wx + FOOT_W / 2}
                  y1={from.wy + FOOT_D / 2}
                  x2={to.wx + FOOT_W / 2}
                  y2={to.wy + FOOT_D / 2}
                />
                {edge.label !== undefined && (
                  <text x={lx} y={ly + 14} textAnchor="middle" className="iso-edge-label">
                    {edge.label}
                  </text>
                )}
                {edge.step !== undefined && (
                  <text x={lx} y={ly + 28} textAnchor="middle" className="iso-step">
                    {edge.step}
                  </text>
                )}
              </g>
            );
          })}
          {world.nodes.map((node, i) => (
            <g key={node.id} className="iso-node" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
              <IsoNode kind={node.kind} x={node.wx} y={node.wy} w={FOOT_W} d={FOOT_D} ink={isoInk(node.rank)} />
              <IsoLabel
                wx={node.wx + FOOT_W / 2}
                wy={node.wy + FOOT_D / 2}
                z={(KIND_Z[node.kind] ?? 26) + 18}
                text={node.label}
              />
            </g>
          ))}
        </g>
      </svg>
    </DiagramFrame>
  );
}
