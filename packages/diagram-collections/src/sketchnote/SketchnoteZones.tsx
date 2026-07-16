import { useMemo } from 'react';
import { buildOutline, layoutZones, type ZonesSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { roughLine, roughRect } from '../shared/rough.js';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { SkLabel, skTint } from './shapes.js';

/** Hand-journal architecture map: dashed zone frames, sticky nodes, rough links. */
export function SketchnoteZones({ spec }: { spec: ZonesSpecT }) {
  const layout = useMemo(() => layoutZones(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="zones" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        {layout.zones.map((zone, i) => (
          <g key={zone.id} data-node-kind="zone">
            <path d={roughRect(zone.x, zone.y, zone.w, zone.h, `zone:${zone.id}`, 3)} className="sk-stroke sk-dashed" fill="none" />
            <path
              d={roughRect(zone.x + 10, zone.y - 12, Math.min(zone.w - 20, zone.label.length * 11 + 26), 26, `zl:${zone.id}`)}
              className={`sk-shape ${skTint(i)}`}
            />
            <SkLabel x={zone.x + 10 + Math.min(zone.w - 20, zone.label.length * 11 + 26) / 2} y={zone.y + 1} text={zone.label} maxChars={20} />
          </g>
        ))}
        {layout.links.map((link, i) => (
          <g key={i} className="sk-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
            <path
              d={roughLine(link.points[0]![0], link.points[0]![1], link.points[1]![0], link.points[1]![1], `link:${i}`)}
              className="sk-stroke sk-draw"
              fill="none"
              pathLength={1}
            />
            {link.label !== undefined && (
              <SkLabel x={link.labelAt[0]} y={link.labelAt[1]} text={link.label} className="sk-edge-label" maxChars={14} />
            )}
          </g>
        ))}
        {layout.nodes.map((node) => (
          <g key={node.id} data-node-kind="node">
            <path d={roughRect(node.x, node.y, node.w, node.h, `n:${node.id}`)} className="sk-shape sk-paper-fill" />
            <SkLabel x={node.x + node.w / 2} y={node.y + node.h / 2} text={node.label} maxChars={15} />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
