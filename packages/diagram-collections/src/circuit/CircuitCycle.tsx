import { useMemo } from 'react';
import { buildOutline, layoutCycle, type CycleSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxBoard, CxLabel, CxTrace, cxGlow, cxInk } from './shapes.js';

/** Neon-terminal cycle: a phosphor ring bus with glass stage chips. */
export function CircuitCycle({ spec }: { spec: CycleSpecT }) {
  const layout = useMemo(() => layoutCycle(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();
  const [cx, cy] = layout.centre;

  return (
    <DiagramFrame family="circuit" kind="cycle" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="cycle" />
        {layout.arcs.map((arc) => {
          const angle = Math.atan2(arc.y2 - cy, arc.x2 - cx) + Math.PI / 2;
          return (
            <g key={arc.fromIndex} className="cx-msg" style={reduced ? undefined : { animationDelay: `${arc.fromIndex * 100}ms` }}>
              <CxTrace
                d={`M${arc.x1} ${arc.y1} A${layout.radius} ${layout.radius} 0 0 1 ${arc.x2} ${arc.y2}`}
                tip={{ x: arc.x2, y: arc.y2, angle }}
                ink={cxInk(arc.fromIndex)}
                glow={cxGlow('cycle')}
                flow={!reduced}
              />
            </g>
          );
        })}
        {spec.hubLabel !== undefined && (
          <g>
            <circle cx={cx} cy={cy} r={36} className="cx-module" />
            <circle cx={cx} cy={cy} r={30} className="cx-hub-ring" />
            <CxLabel x={cx} y={cy} text={spec.hubLabel} maxChars={10} />
          </g>
        )}
        {layout.stages.map((stage, i) => (
          <g key={stage.id} className="cx-node" data-node-kind="stage" style={reduced ? undefined : { animationDelay: `${i * 100}ms` }}>
            <rect x={stage.cx - stage.w / 2} y={stage.cy - stage.h / 2} width={stage.w} height={stage.h} rx={6} className={`cx-chip ${cxInk(i)}`} />
            <text x={stage.cx - stage.w / 2 + 8} y={stage.cy - stage.h / 2 + 14} className="cx-step">
              [{String(i + 1).padStart(2, '0')}]
            </text>
            <CxLabel x={stage.cx} y={stage.cy + (stage.detail ? -2 : 4)} text={stage.label} maxChars={14} />
            {stage.detail !== undefined && (
              <CxLabel x={stage.cx} y={stage.cy + 15} text={stage.detail} className="cx-note" maxChars={20} />
            )}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
