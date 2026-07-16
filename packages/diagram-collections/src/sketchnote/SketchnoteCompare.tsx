import { useMemo } from 'react';
import { buildOutline, layoutCompare, type CompareSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { roughLine, roughRect } from '../shared/rough.js';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { SkLabel, skTint } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Hand-journal versus panel: sticky column headers, ruled rows, marker verdict. */
export function SketchnoteCompare({ spec }: { spec: CompareSpecT }) {
  const layout = useMemo(() => layoutCompare(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="compare" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        {layout.columns.map((col, i) => (
          <g key={col.id} data-tone={col.tone}>
            <path d={roughRect(col.x, 24, col.w, layout.headerH - 10, `head:${col.id}`)} className={`sk-shape ${skTint(col.tone === 'accent' ? 1 : i * 2)}`} />
            <SkLabel x={col.x + col.w / 2} y={24 + (layout.headerH - 10) / 2} text={col.label} maxChars={18} />
            {col.tone === 'accent' && (
              <text x={col.x + col.w - 14} y={40} className="sk-step-num">
                ★
              </text>
            )}
          </g>
        ))}
        {layout.rows.map((row, i) => (
          <g key={row.label} className="sk-node" style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}>
            <SkLabel x={24 + layout.labelW / 2 - 12} y={row.y + row.h / 2} text={row.label} className="sk-band-label-mid" maxChars={16} />
            {row.cells.map((cell, j) => {
              const lines = wrapLabel(cell.value, 24, 3);
              return (
                <g key={j}>
                  <path d={roughRect(cell.x, row.y, cell.w, row.h, `cell:${i}:${j}`, 1.4)} className="sk-stroke sk-faint" fill="none" />
                  <text x={cell.x + 12} y={row.y + 20} className="sk-cell-value">
                    {lines.map((line, k) => (
                      <tspan key={k} x={cell.x + 12} dy={k === 0 ? 0 : 15}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
            <path
              d={roughLine(24, row.y + row.h + 5, layout.width - 24, row.y + row.h + 5, `rule:${i}`, 1)}
              className="sk-stroke sk-faint"
              fill="none"
            />
          </g>
        ))}
        {layout.verdictAt !== null && spec.verdict !== undefined && (
          <g>
            <path
              d={roughRect(layout.verdictAt.x, layout.verdictAt.y, layout.verdictAt.w, layout.verdictAt.h, 'verdict')}
              className="sk-shape sk-tint-amber"
            />
            <SkLabel
              x={layout.verdictAt.x + layout.verdictAt.w / 2}
              y={layout.verdictAt.y + layout.verdictAt.h / 2}
              text={`Verdict: ${spec.verdict}`}
              maxChars={64}
            />
          </g>
        )}
      </svg>
    </DiagramFrame>
  );
}
