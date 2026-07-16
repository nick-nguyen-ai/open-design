import { useMemo } from 'react';
import { buildOutline, type SequenceSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { isoProject } from '../shared/iso.js';
import { IsoGroundArrow, IsoLabel, IsoNode, IsoPad, isoExtent, isoInk } from './shapes.js';

const ACTOR_W = 110;
const ACTOR_D = 58;
const ACTOR_GAP = 52;
const ROW_D = 52;
const ACTOR_KIND: Record<string, 'actor' | 'process' | 'data' | 'start'> = {
  user: 'actor',
  service: 'process',
  store: 'data',
  external: 'start',
};

/** Studio-floor sequence: actor blocks on the back row, messages step down the floor. */
export function IsometricSequence({ spec }: { spec: SequenceSpecT }) {
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  const actorX = (i: number): number => i * (ACTOR_W + ACTOR_GAP);
  const xById = new Map(spec.actors.map((a, i) => [a.id, actorX(i) + ACTOR_W / 2]));
  const worldW = spec.actors.length * (ACTOR_W + ACTOR_GAP);
  const worldH = ACTOR_D + 40 + spec.messages.length * ROW_D + 40;
  const view = isoExtent(worldW, worldH, 60);

  return (
    <DiagramFrame family="isometric" kind="sequence" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          {spec.actors.map((actor, i) => (
            <g key={actor.id} data-node-kind={actor.kind}>
              <IsoPad x={actorX(i) + ACTOR_W / 2 - 8} y={ACTOR_D} w={16} d={worldH - ACTOR_D - 30} dashed />
              <IsoNode kind={ACTOR_KIND[actor.kind] ?? 'process'} x={actorX(i)} y={0} w={ACTOR_W} d={ACTOR_D} ink={isoInk(i)} />
              <IsoLabel wx={actorX(i) + ACTOR_W / 2} wy={ACTOR_D / 2} z={64} text={actor.label} />
            </g>
          ))}
          {spec.messages.map((m, i) => {
            const y = ACTOR_D + 40 + i * ROW_D;
            const x1 = xById.get(m.from)!;
            const x2 = xById.get(m.to)!;
            const [lx, ly] = isoProject((x1 + x2) / 2, y, 0);
            if (m.from === m.to) {
              return (
                <g key={i} className="iso-msg" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
                  <IsoGroundArrow x1={x1} y1={y - 14} x2={x1 + 46} y2={y} dashed />
                  <IsoGroundArrow x1={x1 + 46} y1={y} x2={x1} y2={y + 14} dashed />
                  <text x={isoProject(x1 + 60, y, 0)[0]} y={isoProject(x1 + 60, y, 0)[1]} className="iso-edge-label">
                    {m.label}
                  </text>
                </g>
              );
            }
            return (
              <g key={i} className="iso-msg" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
                <IsoGroundArrow x1={x1} y1={y} x2={x2} y2={y} dashed={m.reply} />
                <text x={lx} y={ly - 8} textAnchor="middle" className="iso-edge-label">
                  {m.label}
                </text>
                {m.note !== undefined && (
                  <text x={lx} y={ly + 12} textAnchor="middle" className="iso-note">
                    {m.note}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </DiagramFrame>
  );
}
