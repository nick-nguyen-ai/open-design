import { useMemo } from 'react';
import { buildOutline, layoutCycle, type CycleSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzLabel, GzMedallion, GzSheet } from './shapes.js';

/** Field-manual rosette: stages around an engraved ring, vermilion bearings. */
export function GazetteCycle({ spec }: { spec: CycleSpecT }) {
  const layout = useMemo(() => layoutCycle(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();
  const [cx, cy] = layout.centre;

  return (
    <DiagramFrame family="gazette" kind="cycle" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="cycle" />
        <circle cx={cx} cy={cy} r={layout.radius + 26} className="gz-rule-fine" fill="none" />
        {layout.arcs.map((arc) => {
          const angle = Math.atan2(arc.y2 - cy, arc.x2 - cx) + Math.PI / 2;
          const barb = 8;
          return (
            <g key={arc.fromIndex} className="gz-msg" style={reduced ? undefined : { animationDelay: `${arc.fromIndex * 90}ms` }}>
              <path
                d={`M${arc.x1} ${arc.y1} A${layout.radius} ${layout.radius} 0 0 1 ${arc.x2} ${arc.y2}`}
                className="gz-wire-spot gz-draw"
                pathLength={1}
                fill="none"
              />
              <path
                d={`M${arc.x2 - barb * Math.cos(angle - 0.4)} ${arc.y2 - barb * Math.sin(angle - 0.4)} L${arc.x2} ${arc.y2} L${arc.x2 - barb * Math.cos(angle + 0.4)} ${arc.y2 - barb * Math.sin(angle + 0.4)} Z`}
                className="gz-head-spot"
              />
            </g>
          );
        })}
        {spec.hubLabel !== undefined && (
          <g>
            <circle cx={cx} cy={cy} r={34} className="gz-plate-circle" />
            <circle cx={cx} cy={cy} r={29} className="gz-rule-fine" fill="none" />
            <GzLabel x={cx} y={cy} text={spec.hubLabel} maxChars={10} className="gz-band-label-mid" />
          </g>
        )}
        {layout.stages.map((stage, i) => (
          <g key={stage.id} className="gz-node" data-node-kind="stage" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
            <rect x={stage.cx - stage.w / 2} y={stage.cy - stage.h / 2} width={stage.w} height={stage.h} className="gz-plate" />
            <GzMedallion x={stage.cx - stage.w / 2} y={stage.cy - stage.h / 2} label={String(i + 1)} r={10} />
            <GzLabel x={stage.cx} y={stage.cy + (stage.detail ? -4 : 0)} text={stage.label} maxChars={15} className="gz-plate-label" />
            {stage.detail !== undefined && (
              <GzLabel x={stage.cx} y={stage.cy + 13} text={stage.detail} className="gz-footnote" maxChars={20} />
            )}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
