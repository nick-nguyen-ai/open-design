import { useMemo } from 'react';
import { buildOutline, layoutCycle, type CycleSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpLabel, BpSheet } from './shapes.js';

/** Drafting-sheet cycle: a compass ring with stencil stations and arc bearings. */
export function BlueprintCycle({ spec }: { spec: CycleSpecT }) {
  const layout = useMemo(() => layoutCycle(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();
  const [cx, cy] = layout.centre;

  return (
    <DiagramFrame family="blueprint" kind="cycle" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="cycle" />
        {/* compass construction lines */}
        <circle cx={cx} cy={cy} r={layout.radius} className="bp-construction" />
        <path d={`M${cx - layout.radius - 14} ${cy} H${cx + layout.radius + 14} M${cx} ${cy - layout.radius - 14} V${cy + layout.radius + 14}`} className="bp-construction" />
        {layout.arcs.map((arc) => {
          const angle = Math.atan2(arc.y2 - cy, arc.x2 - cx) + Math.PI / 2;
          const barb = 8;
          return (
            <g key={arc.fromIndex} className="bp-msg" style={reduced ? undefined : { animationDelay: `${arc.fromIndex * 90}ms` }}>
              <path
                d={`M${arc.x1} ${arc.y1} A${layout.radius} ${layout.radius} 0 0 1 ${arc.x2} ${arc.y2}`}
                className="bp-wire bp-draw"
                pathLength={1}
              />
              <path
                d={`M${arc.x2 - barb * Math.cos(angle - 0.45)} ${arc.y2 - barb * Math.sin(angle - 0.45)} L${arc.x2} ${arc.y2} L${arc.x2 - barb * Math.cos(angle + 0.45)} ${arc.y2 - barb * Math.sin(angle + 0.45)} Z`}
                className="bp-head"
              />
            </g>
          );
        })}
        {spec.hubLabel !== undefined && (
          <g>
            <circle cx={cx} cy={cy} r={34} className="bp-shape" />
            <BpLabel x={cx} y={cy} text={spec.hubLabel} maxChars={10} />
          </g>
        )}
        {layout.stages.map((stage, i) => (
          <g key={stage.id} className="bp-node" data-node-kind="stage" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
            <rect x={stage.cx - stage.w / 2} y={stage.cy - stage.h / 2} width={stage.w} height={stage.h} className="bp-shape bp-unit" />
            <text x={stage.cx - stage.w / 2 + 8} y={stage.cy - stage.h / 2 + 14} className="bp-step-num">
              {String(i + 1).padStart(2, '0')}
            </text>
            <BpLabel x={stage.cx} y={stage.cy + (stage.detail ? -4 : 2)} text={stage.label} maxChars={14} />
            {stage.detail !== undefined && (
              <BpLabel x={stage.cx} y={stage.cy + 14} text={stage.detail} className="bp-note" maxChars={20} />
            )}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
