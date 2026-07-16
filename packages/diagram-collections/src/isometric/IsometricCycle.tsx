import { useMemo } from 'react';
import { buildOutline, layoutCycle, type CycleSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { isoProject } from '../shared/iso.js';
import { IsoBox, IsoLabel, IsoShadow, isoExtent, isoInk } from './shapes.js';

const BOX_W = 104;
const BOX_D = 58;

/** Studio carousel: stage blocks on a ground ring with floor arc arrows. */
export function IsometricCycle({ spec }: { spec: CycleSpecT }) {
  const layout = useMemo(() => layoutCycle(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();
  const [cx, cy] = layout.centre;

  const ringPath = useMemo(() => {
    const steps = 72;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const a = (i / steps) * Math.PI * 2;
      const [x, y] = isoProject(cx + layout.radius * Math.sin(a), cy - layout.radius * Math.cos(a), 0);
      pts.push(`${i === 0 ? 'M' : 'L'}${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`);
    }
    return pts.join(' ');
  }, [cx, cy, layout.radius]);

  const arcPath = (fromDegIndex: number): { d: string; tip: [number, number]; angle: number } => {
    const n = spec.stages.length;
    const inset = 26;
    const a0 = ((360 / n) * fromDegIndex + inset) * (Math.PI / 180);
    const a1 = ((360 / n) * (fromDegIndex + 1) - inset) * (Math.PI / 180);
    const steps = 18;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const a = a0 + ((a1 - a0) * i) / steps;
      const [x, y] = isoProject(cx + layout.radius * Math.sin(a), cy - layout.radius * Math.cos(a), 0);
      pts.push(`${i === 0 ? 'M' : 'L'}${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`);
    }
    const [tx, ty] = isoProject(cx + layout.radius * Math.sin(a1), cy - layout.radius * Math.cos(a1), 0);
    const [px, py] = isoProject(cx + layout.radius * Math.sin(a1 - 0.06), cy - layout.radius * Math.cos(a1 - 0.06), 0);
    return { d: pts.join(' '), tip: [tx, ty], angle: Math.atan2(ty - py, tx - px) };
  };

  const view = isoExtent(cx + layout.radius + BOX_W, cy + layout.radius + BOX_D, 60);
  const stagesSorted = useMemo(
    () => [...layout.stages].sort((a, b) => a.cx + a.cy - (b.cx + b.cy)),
    [layout],
  );

  return (
    <DiagramFrame family="isometric" kind="cycle" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          <path d={ringPath} className="iso-ring-ground" />
          {layout.arcs.map((arc) => {
            const { d, tip, angle } = arcPath(arc.fromIndex);
            const barb = 8;
            return (
              <g key={arc.fromIndex} className="iso-msg" style={reduced ? undefined : { animationDelay: `${arc.fromIndex * 100}ms` }}>
                <path d={d} className="iso-wire iso-draw" pathLength={1} fill="none" />
                <path
                  d={`M${tip[0] - barb * Math.cos(angle - 0.45)} ${tip[1] - barb * Math.sin(angle - 0.45)} L${tip[0]} ${tip[1]} L${tip[0] - barb * Math.cos(angle + 0.45)} ${tip[1] - barb * Math.sin(angle + 0.45)}`}
                  className="iso-wire"
                  fill="none"
                />
              </g>
            );
          })}
          {spec.hubLabel !== undefined && (
            <g>
              <IsoShadow x={cx - 52} y={cy - 32} w={104} d={64} />
              <IsoBox x={cx - 52} y={cy - 32} w={104} d={64} h={12} ink="iso-neutral" />
              <IsoLabel wx={cx} wy={cy} z={30} text={spec.hubLabel} maxChars={12} className="iso-band-label" />
            </g>
          )}
          {stagesSorted.map((stage) => (
            <g key={stage.id} className="iso-node" data-node-kind="stage" style={reduced ? undefined : { animationDelay: `${stage.index * 100}ms` }}>
              <IsoShadow x={stage.cx - BOX_W / 2} y={stage.cy - BOX_D / 2} w={BOX_W} d={BOX_D} />
              <IsoBox x={stage.cx - BOX_W / 2} y={stage.cy - BOX_D / 2} w={BOX_W} d={BOX_D} h={24} ink={isoInk(stage.index)} />
              <IsoLabel wx={stage.cx} wy={stage.cy} z={44} text={`${stage.index + 1}. ${stage.label}`} maxChars={16} />
              {stage.detail !== undefined && (
                <IsoLabel wx={stage.cx} wy={stage.cy} z={30} text={stage.detail} maxChars={22} className="iso-note" />
              )}
            </g>
          ))}
        </g>
      </svg>
    </DiagramFrame>
  );
}
