import { useMemo } from 'react';
import { buildOutline, layoutCycle, type CycleSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { roughEllipse, roughLine, roughRect, seededJitter } from '../shared/rough.js';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { SkLabel, skTint } from './shapes.js';

/** A rough circular arc between two ring points, drawn as two wobbled passes. */
function roughArc(x1: number, y1: number, x2: number, y2: number, r: number, seed: string): string {
  const j = seededJitter(`arc:${seed}`);
  const a = `M${x1 + j(0)} ${y1 + j(1)} A${r} ${r} 0 0 1 ${x2 + j(2)} ${y2 + j(3)}`;
  const b = `M${x1 + j(4)} ${y1 + j(5)} A${r + j(6) * 3} ${r + j(7) * 3} 0 0 1 ${x2 + j(8)} ${y2 + j(9)}`;
  return `${a} ${b}`;
}

/** Hand-journal cycle: sticky stages on a ring, rough arc arrows, hub scribble. */
export function SketchnoteCycle({ spec }: { spec: CycleSpecT }) {
  const layout = useMemo(() => layoutCycle(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="cycle" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        {layout.arcs.map((arc) => {
          const angle = Math.atan2(arc.y2 - layout.centre[1], arc.x2 - layout.centre[0]) + Math.PI / 2;
          const barb = 9;
          return (
            <g key={arc.fromIndex} className="sk-msg" style={reduced ? undefined : { animationDelay: `${arc.fromIndex * 100}ms` }}>
              <path
                d={roughArc(arc.x1, arc.y1, arc.x2, arc.y2, layout.radius, `${arc.fromIndex}`)}
                className="sk-stroke sk-draw"
                fill="none"
                pathLength={1}
              />
              <path
                d={`${roughLine(arc.x2, arc.y2, arc.x2 - barb * Math.cos(angle - 0.5), arc.y2 - barb * Math.sin(angle - 0.5), `cb1:${arc.fromIndex}`, 1)} ${roughLine(
                  arc.x2,
                  arc.y2,
                  arc.x2 - barb * Math.cos(angle + 0.5),
                  arc.y2 - barb * Math.sin(angle + 0.5),
                  `cb2:${arc.fromIndex}`,
                  1,
                )}`}
                className="sk-stroke"
                fill="none"
              />
            </g>
          );
        })}
        {spec.hubLabel !== undefined && (
          <g>
            <path
              d={roughEllipse(layout.centre[0], layout.centre[1], 46, 30, 'hub')}
              className="sk-shape sk-tint-amber"
            />
            <SkLabel x={layout.centre[0]} y={layout.centre[1]} text={spec.hubLabel} maxChars={12} />
          </g>
        )}
        {layout.stages.map((stage, i) => (
          <g key={stage.id} className="sk-node" data-node-kind="stage" style={reduced ? undefined : { animationDelay: `${i * 100}ms` }}>
            <path
              d={roughRect(stage.cx - stage.w / 2, stage.cy - stage.h / 2, stage.w, stage.h, `stage:${stage.id}`)}
              className={`sk-shape ${skTint(i)}`}
            />
            <SkLabel x={stage.cx} y={stage.cy - (stage.detail ? 8 : 0)} text={stage.label} maxChars={16} />
            {stage.detail !== undefined && (
              <SkLabel x={stage.cx} y={stage.cy + 12} text={stage.detail} className="sk-detail-center" maxChars={22} />
            )}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
