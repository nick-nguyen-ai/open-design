import { useMemo } from 'react';
import { buildOutline, layoutZones, type ZonesSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxBoard, CxLabel, CxTrace, cxGlow, cxInk } from './shapes.js';

/** Neon-terminal system board: sector frames, glass modules, live traces. */
export function CircuitZones({ spec }: { spec: ZonesSpecT }) {
  const layout = useMemo(() => layoutZones(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="circuit" kind="zones" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="zones" />
        {layout.zones.map((zone, i) => (
          <g key={zone.id} data-node-kind="zone">
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={8} className={`cx-sector ${cxInk(i)}`} />
            <text x={zone.x + 12} y={zone.y + 17} className={`cx-sector-label ${cxInk(i)}`}>
              ▞ {zone.label.toUpperCase()}
            </text>
          </g>
        ))}
        {layout.links.map((link, i) => {
          const [x1, y1] = link.points[0]!;
          const [x2, y2] = link.points[1]!;
          const mx = Math.round((x1 + x2) / 2);
          const horizontal = Math.abs(x2 - x1) >= Math.abs(y2 - y1);
          const d = horizontal ? `M${x1} ${y1} H${mx} V${y2} H${x2}` : `M${x1} ${y1} V${Math.round((y1 + y2) / 2)} H${x2} V${y2}`;
          return (
            <g key={i} className="cx-msg" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
              <CxTrace d={d} ink={cxInk(i)} glow={cxGlow('zones')} flow={!reduced} />
              {link.label !== undefined && (
                <CxLabel x={link.labelAt[0]} y={link.labelAt[1]} text={link.label} className="cx-trace-label" maxChars={14} />
              )}
            </g>
          );
        })}
        {layout.nodes.map((node) => (
          <g key={node.id} data-node-kind="node">
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={5} className="cx-module" />
            <CxLabel x={node.x + node.w / 2} y={node.y + node.h / 2} text={node.label} maxChars={14} className="cx-label" />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
