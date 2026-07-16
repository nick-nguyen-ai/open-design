import { useMemo } from 'react';
import { buildOutline, layoutTimeline, type TimelineSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { roughEllipse, roughLine, roughRect } from '../shared/rough.js';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { SkLabel, skTint } from './shapes.js';
import { wrapLabel } from '../shared/text.js';

/** Hand-journal timeline: rough axis, alternating sticky era cards, starred now. */
export function SketchnoteTimeline({ spec }: { spec: TimelineSpecT }) {
  const layout = useMemo(() => layoutTimeline(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="timeline" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <path
          d={roughLine(16, layout.axisY, layout.width - 24, layout.axisY, 'axis', 2.4)}
          className="sk-stroke sk-draw"
          fill="none"
          pathLength={1}
        />
        <path
          d={`${roughLine(layout.width - 24, layout.axisY, layout.width - 34, layout.axisY - 6, 'axb1', 1)} ${roughLine(
            layout.width - 24,
            layout.axisY,
            layout.width - 34,
            layout.axisY + 6,
            'axb2',
            1,
          )}`}
          className="sk-stroke"
          fill="none"
        />
        {layout.eras.map((era, i) => {
          const isNow = layout.nowX === era.x;
          const detailLines = era.detail !== undefined ? wrapLabel(era.detail, 22, 2) : [];
          return (
            <g key={era.id} className="sk-node" data-now={isNow || undefined} style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
              <path
                d={roughLine(era.x, layout.axisY, era.x, era.side === 'above' ? era.cardY + era.h : era.cardY, `tick:${era.id}`, 1)}
                className="sk-stroke sk-faint"
                fill="none"
              />
              <path d={roughEllipse(era.x, layout.axisY, isNow ? 9 : 5, isNow ? 9 : 5, `dot:${era.id}`)} className={`sk-shape ${isNow ? 'sk-tint-coral' : 'sk-tint-sky'}`} />
              <path d={roughRect(era.cardX, era.cardY, era.w, era.h, `card:${era.id}`)} className={`sk-shape ${skTint(i)}`} />
              <text x={era.cardX + 12} y={era.cardY + 24} className="sk-band-label">
                {wrapLabel(era.label, 17, 1)[0]}
              </text>
              {era.marker !== undefined && (
                <text x={era.cardX + era.w - 12} y={era.cardY + 24} textAnchor="end" className="sk-badge">
                  {era.marker}
                </text>
              )}
              {detailLines.map((line, k) => (
                <text key={k} x={era.cardX + 12} y={era.cardY + 46 + k * 17} className="sk-detail">
                  {line}
                </text>
              ))}
              {isNow && <SkLabel x={era.x} y={layout.axisY + 20} text="you are here" className="sk-edge-label" maxChars={14} />}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
