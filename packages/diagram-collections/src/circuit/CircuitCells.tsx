import { useMemo } from 'react';
import { buildOutline, layoutCells, type CellsSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxBoard, cxInk } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Neon-terminal module grid: indexed glass tiles with status pins. */
export function CircuitCells({ spec }: { spec: CellsSpecT }) {
  const layout = useMemo(() => layoutCells(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="circuit" kind="cells" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="cells" />
        {layout.cells.map((cell, i) => {
          const detailLines = cell.detail !== undefined ? wrapLabel(cell.detail, 28, 2) : [];
          return (
            <g key={cell.id} className="cx-node" data-node-kind="cell" style={reduced ? undefined : { animationDelay: `${i * 55}ms` }}>
              <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={7} className={`cx-chip ${cxInk(i)}`} />
              <circle cx={cell.x + 14} cy={cell.y + 15} r={3.5} className={`cx-pin ${cxInk(i)}`} />
              <text x={cell.x + 26} y={cell.y + 19} className="cx-band-label">
                {wrapLabel(cell.label, 17, 1)[0]}
              </text>
              <text x={cell.x + cell.w - 10} y={cell.y + 19} textAnchor="end" className="cx-step">
                [{cell.badge}]
              </text>
              {detailLines.map((line, k) => (
                <text key={k} x={cell.x + 14} y={cell.y + 44 + k * 15} className="cx-note-left">
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
