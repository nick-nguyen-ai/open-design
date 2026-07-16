import { useMemo } from 'react';
import { buildOutline, layoutTimeline, type TimelineSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpLabel, BpSheet } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Drafting-sheet timeline: a dimensioned datum line with alternating stations. */
export function BlueprintTimeline({ spec }: { spec: TimelineSpecT }) {
  const layout = useMemo(() => layoutTimeline(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="blueprint" kind="timeline" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="timeline" />
        <path d={`M16 ${layout.axisY} H${layout.width - 20}`} className="bp-wire bp-draw" pathLength={1} />
        <path d={`M${layout.width - 26} ${layout.axisY - 3.5} L${layout.width - 20} ${layout.axisY} L${layout.width - 26} ${layout.axisY + 3.5} Z`} className="bp-head" />
        {layout.eras.map((era, i) => {
          const isNow = layout.nowX === era.x;
          const detailLines = era.detail !== undefined ? wrapLabel(era.detail, 24, 2) : [];
          return (
            <g key={era.id} className="bp-node" data-now={isNow || undefined} style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}>
              <path
                d={`M${era.x} ${layout.axisY} V${era.side === 'above' ? era.cardY + era.h : era.cardY}`}
                className="bp-wire bp-dashed"
              />
              <path d={`M${era.x - 4} ${layout.axisY - 4} L${era.x + 4} ${layout.axisY + 4} M${era.x - 4} ${layout.axisY + 4} L${era.x + 4} ${layout.axisY - 4}`} className={isNow ? 'bp-tick bp-tick-now' : 'bp-tick'} />
              <rect x={era.cardX} y={era.cardY} width={era.w} height={era.h} className={isNow ? 'bp-shape bp-accent' : 'bp-shape bp-unit'} />
              <path d={`M${era.cardX} ${era.cardY + 24} H${era.cardX + era.w}`} className="bp-stroke-only" />
              <text x={era.cardX + 8} y={era.cardY + 16} className="bp-band-label">
                {wrapLabel(era.label, 16, 1)[0]!.toUpperCase()}
              </text>
              {era.marker !== undefined && (
                <text x={era.cardX + era.w - 8} y={era.cardY + 16} textAnchor="end" className="bp-step-num">
                  {era.marker}
                </text>
              )}
              {detailLines.map((line, k) => (
                <text key={k} x={era.cardX + 8} y={era.cardY + 42 + k * 15} className="bp-note">
                  {line}
                </text>
              ))}
              {isNow && <BpLabel x={era.x} y={layout.axisY + 18} text="DATUM: NOW" className="bp-wire-label" maxChars={12} />}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
