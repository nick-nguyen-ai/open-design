import { useMemo } from 'react';
import { buildOutline, layoutCompare, type CompareSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpLabel, BpSheet } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Drafting-sheet versus table: specification columns with ruled contrast rows. */
export function BlueprintCompare({ spec }: { spec: CompareSpecT }) {
  const layout = useMemo(() => layoutCompare(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="blueprint" kind="compare" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="compare" />
        {layout.columns.map((col) => (
          <g key={col.id} data-tone={col.tone}>
            <rect x={col.x} y={22} width={col.w} height={layout.headerH - 8} className={col.tone === 'accent' ? 'bp-shape bp-accent' : 'bp-shape'} />
            <BpLabel x={col.x + col.w / 2} y={22 + (layout.headerH - 8) / 2} text={col.label.toUpperCase()} maxChars={16} />
            {col.tone === 'accent' && (
              <text x={col.x + col.w - 12} y={36} textAnchor="end" className="bp-step-num">
                ▲
              </text>
            )}
          </g>
        ))}
        {layout.rows.map((row, i) => (
          <g key={row.label} className="bp-node" style={reduced ? undefined : { animationDelay: `${i * 60}ms` }}>
            <BpLabel x={24 + layout.labelW / 2 - 10} y={row.y + row.h / 2} text={row.label.toUpperCase()} className="bp-row-label" maxChars={15} />
            {row.cells.map((cell, j) => {
              const lines = wrapLabel(cell.value, 26, 3);
              return (
                <g key={j}>
                  <rect x={cell.x} y={row.y} width={cell.w} height={row.h} className="bp-stroke-only" />
                  <text x={cell.x + 10} y={row.y + 18} className="bp-cell-value">
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
            <rect
              x={layout.verdictAt.x}
              y={layout.verdictAt.y}
              width={layout.verdictAt.w}
              height={layout.verdictAt.h}
              className="bp-shape bp-alert"
            />
            <BpLabel
              x={layout.verdictAt.x + layout.verdictAt.w / 2}
              y={layout.verdictAt.y + layout.verdictAt.h / 2}
              text={`VERDICT — ${spec.verdict}`}
              maxChars={60}
            />
          </g>
        )}
      </svg>
    </DiagramFrame>
  );
}
