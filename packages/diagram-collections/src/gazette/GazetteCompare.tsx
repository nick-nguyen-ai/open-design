import { useMemo } from 'react';
import { buildOutline, layoutCompare, type CompareSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzLabel, GzSheet, gzHatch } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Field-manual tariff table: ruled columns, hatch-accented head, verdict colophon. */
export function GazetteCompare({ spec }: { spec: CompareSpecT }) {
  const layout = useMemo(() => layoutCompare(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="gazette" kind="compare" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="compare" />
        {layout.columns.map((col) => (
          <g key={col.id} data-tone={col.tone}>
            <rect
              x={col.x}
              y={24}
              width={col.w}
              height={layout.headerH - 10}
              className="gz-plate"
              fill={col.tone === 'accent' ? gzHatch('compare') : undefined}
            />
            <GzLabel x={col.x + col.w / 2} y={24 + (layout.headerH - 10) / 2} text={col.label} maxChars={16} className="gz-band-label-mid" />
            {col.tone === 'accent' && (
              <text x={col.x + col.w - 10} y={38} textAnchor="end" className="gz-badge-spot">
                ✦
              </text>
            )}
          </g>
        ))}
        {layout.rows.map((row, i) => (
          <g key={row.label} className="gz-node" style={reduced ? undefined : { animationDelay: `${i * 60}ms` }}>
            <GzLabel x={24 + layout.labelW / 2 - 10} y={row.y + row.h / 2} text={row.label} className="gz-row-label" maxChars={15} />
            {row.cells.map((cell, j) => {
              const lines = wrapLabel(cell.value, 26, 3);
              return (
                <g key={j}>
                  <rect x={cell.x} y={row.y} width={cell.w} height={row.h} className="gz-rule-fine" />
                  <text x={cell.x + 10} y={row.y + 18} className="gz-cell-value">
                    {lines.map((line, k) => (
                      <tspan key={k} x={cell.x + 10} dy={k === 0 ? 0 : 14}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
            <path d={`M24 ${row.y + row.h + 5} H${layout.width - 24}`} className="gz-rule-hair" />
          </g>
        ))}
        {layout.verdictAt !== null && spec.verdict !== undefined && (
          <g>
            <rect x={layout.verdictAt.x} y={layout.verdictAt.y} width={layout.verdictAt.w} height={layout.verdictAt.h} className="gz-verdict" />
            <GzLabel
              x={layout.verdictAt.x + layout.verdictAt.w / 2}
              y={layout.verdictAt.y + layout.verdictAt.h / 2}
              text={`❧ ${spec.verdict}`}
              maxChars={62}
              className="gz-verdict-label"
            />
          </g>
        )}
      </svg>
    </DiagramFrame>
  );
}
