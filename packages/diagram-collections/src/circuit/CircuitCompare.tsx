import { useMemo } from 'react';
import { buildOutline, layoutCompare, type CompareSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxLabel, CxBoard, cxInk } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Neon-terminal diff view: session columns compared row by row. */
export function CircuitCompare({ spec }: { spec: CompareSpecT }) {
  const layout = useMemo(() => layoutCompare(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="circuit" kind="compare" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="compare" />
        {layout.columns.map((col, i) => (
          <g key={col.id} data-tone={col.tone}>
            <rect x={col.x} y={22} width={col.w} height={layout.headerH - 8} rx={6} className={`cx-chip ${col.tone === 'accent' ? 'cx-green' : cxInk(i + 1)}`} />
            <CxLabel x={col.x + col.w / 2} y={22 + (layout.headerH - 8) / 2} text={col.label} maxChars={16} className="cx-band-label-mid" />
            {col.tone === 'accent' && (
              <text x={col.x + col.w - 10} y={36} textAnchor="end" className="cx-step">
                ◆
              </text>
            )}
          </g>
        ))}
        {layout.rows.map((row, i) => (
          <g key={row.label} className="cx-node" style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}>
            <CxLabel x={24 + layout.labelW / 2 - 10} y={row.y + row.h / 2} text={row.label} className="cx-row-label" maxChars={15} />
            {row.cells.map((cell, j) => {
              const lines = wrapLabel(cell.value, 26, 3);
              return (
                <g key={j}>
                  <rect x={cell.x} y={row.y} width={cell.w} height={row.h} rx={5} className="cx-module" />
                  <text x={cell.x + 10} y={row.y + 18} className="cx-cell-value">
                    {lines.map((line, k) => (
                      <tspan key={k} x={cell.x + 10} dy={k === 0 ? 0 : 14}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
        {layout.verdictAt !== null && spec.verdict !== undefined && (
          <g>
            <rect x={layout.verdictAt.x} y={layout.verdictAt.y} width={layout.verdictAt.w} height={layout.verdictAt.h} rx={6} className="cx-chip cx-magenta" />
            <CxLabel
              x={layout.verdictAt.x + layout.verdictAt.w / 2}
              y={layout.verdictAt.y + layout.verdictAt.h / 2}
              text={`>> ${spec.verdict}`}
              maxChars={62}
            />
          </g>
        )}
      </svg>
    </DiagramFrame>
  );
}
