import { useMemo } from 'react';
import { buildOutline, layoutCells, type CellsSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { roughRect } from '../shared/rough.js';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { skTint } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Hand-journal top-N grid: rotated sticky notes with numbered corner badges. */
export function SketchnoteCells({ spec }: { spec: CellsSpecT }) {
  const layout = useMemo(() => layoutCells(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="cells" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        {layout.cells.map((cell, i) => {
          const tilt = (i % 2 === 0 ? -1.4 : 1.4) + (i % 3 === 0 ? 0.5 : 0);
          const detailLines = cell.detail !== undefined ? wrapLabel(cell.detail, 26, 2) : [];
          return (
            <g
              key={cell.id}
              className="sk-node"
              data-node-kind="cell"
              transform={`rotate(${tilt} ${cell.x + cell.w / 2} ${cell.y + cell.h / 2})`}
              style={reduced ? undefined : { animationDelay: `${i * 55}ms` }}
            >
              <path d={roughRect(cell.x, cell.y, cell.w, cell.h, `cell:${cell.id}`)} className={`sk-shape ${skTint(i)}`} />
              <text x={cell.x + 12} y={cell.y + 26} className="sk-badge">
                {cell.badge}
              </text>
              <text x={cell.x + 44} y={cell.y + 26} className="sk-band-label">
                {wrapLabel(cell.label, 18, 1)[0]}
              </text>
              {detailLines.map((line, k) => (
                <text key={k} x={cell.x + 12} y={cell.y + 50 + k * 17} className="sk-detail">
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
