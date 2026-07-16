import { useMemo } from 'react';
import { buildOutline, layoutCells, type CellsSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpSheet } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Drafting-sheet catalogue grid: numbered part bays with spec notes. */
export function BlueprintCells({ spec }: { spec: CellsSpecT }) {
  const layout = useMemo(() => layoutCells(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="blueprint" kind="cells" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="cells" />
        {layout.cells.map((cell, i) => {
          const detailLines = cell.detail !== undefined ? wrapLabel(cell.detail, 28, 2) : [];
          return (
            <g key={cell.id} className="bp-node" data-node-kind="cell" style={reduced ? undefined : { animationDelay: `${i * 50}ms` }}>
              <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} className="bp-shape bp-unit" />
              <path d={`M${cell.x} ${cell.y + 26} H${cell.x + cell.w}`} className="bp-stroke-only" />
              <text x={cell.x + 8} y={cell.y + 17} className="bp-step-num">
                {cell.badge}
              </text>
              <text x={cell.x + 36} y={cell.y + 17} className="bp-band-label">
                {wrapLabel(cell.label, 18, 1)[0]!.toUpperCase()}
              </text>
              {detailLines.map((line, k) => (
                <text key={k} x={cell.x + 8} y={cell.y + 44 + k * 15} className="bp-note">
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
