import { useMemo } from 'react';
import { buildOutline, layoutTimeline, type TimelineSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzLabel, GzMedallion, GzSheet } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Field-manual chronicle: an engraved rule with era plates and a marked present. */
export function GazetteTimeline({ spec }: { spec: TimelineSpecT }) {
  const layout = useMemo(() => layoutTimeline(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="gazette" kind="timeline" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="timeline" />
        <path d={`M18 ${layout.axisY} H${layout.width - 22}`} className="gz-wire-spot gz-draw" pathLength={1} />
        <path d={`M18 ${layout.axisY - 3} V${layout.axisY + 3} M${layout.width - 22} ${layout.axisY - 5} L${layout.width - 14} ${layout.axisY} L${layout.width - 22} ${layout.axisY + 5} Z`} className="gz-head-spot" />
        {layout.eras.map((era, i) => {
          const isNow = layout.nowX === era.x;
          const detailLines = era.detail !== undefined ? wrapLabel(era.detail, 24, 2) : [];
          return (
            <g key={era.id} className="gz-node" data-now={isNow || undefined} style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}>
              <path d={`M${era.x} ${layout.axisY} V${era.side === 'above' ? era.cardY + era.h : era.cardY}`} className="gz-rule-hair" />
              <GzMedallion x={era.x} y={layout.axisY} label={String(i + 1)} r={isNow ? 11 : 8} />
              <rect x={era.cardX} y={era.cardY} width={era.w} height={era.h} className={isNow ? 'gz-plate gz-plate-now' : 'gz-plate'} />
              <path d={`M${era.cardX + 8} ${era.cardY + 26} H${era.cardX + era.w - 8}`} className="gz-rule-hair" />
              <text x={era.cardX + 10} y={era.cardY + 18} className="gz-band-label">
                {wrapLabel(era.label, 16, 1)[0]}
              </text>
              {era.marker !== undefined && (
                <text x={era.cardX + era.w - 10} y={era.cardY + 18} textAnchor="end" className="gz-badge">
                  {era.marker}
                </text>
              )}
              {detailLines.map((line, k) => (
                <text key={k} x={era.cardX + 10} y={era.cardY + 44 + k * 15} className="gz-footnote-left">
                  {line}
                </text>
              ))}
              {isNow && <GzLabel x={era.x} y={layout.axisY + 24} text="the present day" className="gz-now" maxChars={16} />}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
