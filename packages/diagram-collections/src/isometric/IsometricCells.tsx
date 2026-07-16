import { useMemo } from 'react';
import { buildOutline, layoutCells, type CellsSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { IsoBox, IsoLabel, IsoShadow, isoExtent, isoInk } from './shapes.js';

const SCALE = 1.0;

/** Studio showroom: each concept a candy block on the floor, badge on the top face. */
export function IsometricCells({ spec }: { spec: CellsSpecT }) {
  const layout = useMemo(() => layoutCells(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  const view = isoExtent(layout.width * SCALE, layout.height * SCALE, 50);
  const cellsSorted = useMemo(() => [...layout.cells].sort((a, b) => a.x + a.y - (b.x + b.y)), [layout]);

  return (
    <DiagramFrame family="isometric" kind="cells" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          {cellsSorted.map((cell) => (
            <g key={cell.id} className="iso-node" data-node-kind="cell" style={reduced ? undefined : { animationDelay: `${cell.index * 60}ms` }}>
              <IsoShadow x={cell.x} y={cell.y} w={cell.w} d={cell.h - 24} />
              <IsoBox x={cell.x} y={cell.y} w={cell.w} d={cell.h - 24} h={18} ink={isoInk(cell.index)} />
              <IsoLabel wx={cell.x + cell.w / 2} wy={cell.y + (cell.h - 24) / 2} z={44} text={`${cell.badge} · ${cell.label}`} maxChars={20} className="iso-band-label" />
              {cell.detail !== undefined && (
                <IsoLabel wx={cell.x + cell.w / 2} wy={cell.y + (cell.h - 24) / 2} z={28} text={cell.detail} maxChars={30} className="iso-note" />
              )}
            </g>
          ))}
        </g>
      </svg>
    </DiagramFrame>
  );
}
