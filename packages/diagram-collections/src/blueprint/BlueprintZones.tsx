import { useMemo } from 'react';
import { buildOutline, layoutZones, type ZonesSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpEdge, BpLabel, BpSheet } from './shapes.js';

/** Drafting-sheet estate map: dashed zone parcels, stencil units, ticked wires. */
export function BlueprintZones({ spec }: { spec: ZonesSpecT }) {
  const layout = useMemo(() => layoutZones(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="blueprint" kind="zones" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="zones" />
        {layout.zones.map((zone) => (
          <g key={zone.id} data-node-kind="zone">
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} className="bp-stroke-only bp-dashed" />
            <rect x={zone.x} y={zone.y - 1} width={Math.min(zone.w, zone.label.length * 8 + 22)} height={20} className="bp-shape" />
            <text x={zone.x + 10} y={zone.y + 12} className="bp-zone-label">
              {zone.label.toUpperCase()}
            </text>
          </g>
        ))}
        {layout.links.map((link, i) => (
          <g key={i} className="bp-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
            <BpEdge
              x1={link.points[0]![0]}
              y1={link.points[0]![1]}
              x2={link.points[1]![0]}
              y2={link.points[1]![1]}
              horizontalFirst={Math.abs(link.points[1]![0] - link.points[0]![0]) >= Math.abs(link.points[1]![1] - link.points[0]![1])}
            />
            {link.label !== undefined && (
              <BpLabel x={link.labelAt[0]} y={link.labelAt[1]} text={link.label} className="bp-wire-label" maxChars={14} />
            )}
          </g>
        ))}
        {layout.nodes.map((node) => (
          <g key={node.id} data-node-kind="node">
            <rect x={node.x} y={node.y} width={node.w} height={node.h} className="bp-shape bp-unit" />
            <BpLabel x={node.x + node.w / 2} y={node.y + node.h / 2} text={node.label} maxChars={14} />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
