import { useMemo } from 'react';
import { buildOutline, layoutZones, type ZonesSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzEdge, GzLabel, GzSheet } from './shapes.js';

/** Field-manual plate map: ruled districts, ink parcels, dispatch lines. */
export function GazetteZones({ spec }: { spec: ZonesSpecT }) {
  const layout = useMemo(() => layoutZones(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="gazette" kind="zones" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="zones" />
        {layout.zones.map((zone) => (
          <g key={zone.id} data-node-kind="zone">
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} className="gz-rule-heavy" />
            <rect x={zone.x + 3} y={zone.y + 3} width={zone.w - 6} height={zone.h - 6} className="gz-rule-fine" />
            <rect x={zone.x + 10} y={zone.y - 10} width={Math.min(zone.w - 20, zone.label.length * 9 + 20)} height={20} className="gz-plate" />
            <text x={zone.x + 20} y={zone.y + 4} className="gz-zone-label">
              {zone.label}
            </text>
          </g>
        ))}
        {layout.links.map((link, i) => (
          <g key={i} className="gz-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
            <GzEdge x1={link.points[0]![0]} y1={link.points[0]![1]} x2={link.points[1]![0]} y2={link.points[1]![1]} spot />
            {link.label !== undefined && (
              <GzLabel x={link.labelAt[0]} y={link.labelAt[1]} text={link.label} className="gz-edge-label" maxChars={14} />
            )}
          </g>
        ))}
        {layout.nodes.map((node) => (
          <g key={node.id} data-node-kind="node">
            <rect x={node.x} y={node.y} width={node.w} height={node.h} className="gz-plate" />
            <GzLabel x={node.x + node.w / 2} y={node.y + node.h / 2} text={node.label} maxChars={14} className="gz-plate-label" />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
