import { useMemo } from 'react';
import { buildOutline, layoutTimeline, type TimelineSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxBoard, CxLabel, CxTrace, cxGlow, cxInk } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Neon-terminal timeline: a phosphor bus with era chips docked above and below. */
export function CircuitTimeline({ spec }: { spec: TimelineSpecT }) {
  const layout = useMemo(() => layoutTimeline(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="circuit" kind="timeline" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="timeline" />
        <CxTrace
          d={`M16 ${layout.axisY} H${layout.width - 20}`}
          tip={{ x: layout.width - 20, y: layout.axisY, angle: 0 }}
          ink="cx-green"
          glow={cxGlow('timeline')}
          flow={!reduced}
        />
        {layout.eras.map((era, i) => {
          const isNow = layout.nowX === era.x;
          const detailLines = era.detail !== undefined ? wrapLabel(era.detail, 24, 2) : [];
          return (
            <g key={era.id} className="cx-node" data-now={isNow || undefined} style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
              <path d={`M${era.x} ${layout.axisY} V${era.side === 'above' ? era.cardY + era.h : era.cardY}`} className="cx-lifeline" />
              <circle cx={era.x} cy={layout.axisY} r={isNow ? 6 : 4} className={`cx-pin ${isNow ? 'cx-magenta' : cxInk(i)}`} />
              <rect x={era.cardX} y={era.cardY} width={era.w} height={era.h} rx={7} className={`cx-chip ${isNow ? 'cx-magenta' : cxInk(i)}`} />
              <text x={era.cardX + 10} y={era.cardY + 18} className="cx-band-label">
                {wrapLabel(era.label, 16, 1)[0]}
              </text>
              {era.marker !== undefined && (
                <text x={era.cardX + era.w - 10} y={era.cardY + 18} textAnchor="end" className="cx-step">
                  [{era.marker}]
                </text>
              )}
              {detailLines.map((line, k) => (
                <text key={k} x={era.cardX + 10} y={era.cardY + 42 + k * 15} className="cx-note-left">
                  {line}
                </text>
              ))}
              {isNow && <CxLabel x={era.x} y={layout.axisY + 18} text="LIVE" className="cx-live" maxChars={6} />}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
