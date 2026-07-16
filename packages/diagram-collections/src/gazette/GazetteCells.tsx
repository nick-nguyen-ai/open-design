import { useMemo } from 'react';
import { buildOutline, layoutCells, type CellsSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzMedallion, GzSheet } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Field-manual gazetteer: ruled entry cards with vermilion medallion numerals. */
export function GazetteCells({ spec }: { spec: CellsSpecT }) {
  const layout = useMemo(() => layoutCells(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="gazette" kind="cells" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="cells" />
        {layout.cells.map((cell, i) => {
          const detailLines = cell.detail !== undefined ? wrapLabel(cell.detail, 28, 2) : [];
          return (
            <g key={cell.id} className="gz-node" data-node-kind="cell" style={reduced ? undefined : { animationDelay: `${i * 50}ms` }}>
              <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} className="gz-plate" />
              <path d={`M${cell.x + 10} ${cell.y + 30} H${cell.x + cell.w - 10}`} className="gz-rule-hair" />
              <GzMedallion x={cell.x + 18} y={cell.y + 17} label={String(i + 1)} r={9} />
              <text x={cell.x + 34} y={cell.y + 21} className="gz-band-label">
                {wrapLabel(cell.label, 17, 1)[0]}
              </text>
              {cell.badge !== String(i + 1).padStart(2, '0') && (
                <text x={cell.x + cell.w - 10} y={cell.y + 21} textAnchor="end" className="gz-badge">
                  {cell.badge}
                </text>
              )}
              {detailLines.map((line, k) => (
                <text key={k} x={cell.x + 12} y={cell.y + 48 + k * 15} className="gz-footnote-left">
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
