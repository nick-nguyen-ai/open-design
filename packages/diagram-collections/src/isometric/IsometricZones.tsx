import { useMemo } from 'react';
import { buildOutline, layoutZones, type ZonesSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { isoProject } from '../shared/iso.js';
import { IsoGroundArrow, IsoLabel, IsoNode, IsoPad, isoExtent, isoInk } from './shapes.js';

const SCALE = 1.0;

/** Studio-floor estate: zone parcels as ground pads, systems as candy blocks. */
export function IsometricZones({ spec }: { spec: ZonesSpecT }) {
  const layout = useMemo(() => layoutZones(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  const view = isoExtent(layout.width * SCALE, layout.height * SCALE, 60);
  const nodesSorted = useMemo(
    () => [...layout.nodes].sort((a, b) => a.x + a.y - (b.x + b.y)),
    [layout],
  );

  return (
    <DiagramFrame family="isometric" kind="zones" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          {layout.zones.map((zone, i) => (
            <g key={zone.id} data-node-kind="zone">
              <IsoPad x={zone.x} y={zone.y} w={zone.w} d={zone.h} ink={isoInk(i)} />
              <IsoLabel wx={zone.x + 64} wy={zone.y + zone.h + 18} z={0} text={zone.label} className="iso-zone-label" maxChars={20} />
            </g>
          ))}
          {layout.links.map((link, i) => {
            const [lx, ly] = isoProject(link.labelAt[0], link.labelAt[1], 0);
            return (
              <g key={i} className="iso-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
                <IsoGroundArrow x1={link.points[0]![0]} y1={link.points[0]![1]} x2={link.points[1]![0]} y2={link.points[1]![1]} />
                {link.label !== undefined && (
                  <text x={lx} y={ly - 6} textAnchor="middle" className="iso-edge-label">
                    {link.label}
                  </text>
                )}
              </g>
            );
          })}
          {nodesSorted.map((node) => (
            <g key={node.id}>
              <IsoNode kind="process" x={node.x} y={node.y} w={node.w} d={node.h} ink="iso-neutral-block" />
              <IsoLabel wx={node.x + node.w / 2} wy={node.y + node.h / 2} z={44} text={node.label} maxChars={14} />
            </g>
          ))}
        </g>
      </svg>
    </DiagramFrame>
  );
}
