import { useMemo } from 'react';
import { buildOutline, layoutSequence, type SequenceSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpLabel, BpSheet } from './shapes.js';

const ACTOR_H = 40;

/** Drafting-sheet sequence: stencil actor plates, ruled lifelines, ticked wires. */
export function BlueprintSequence({ spec }: { spec: SequenceSpecT }) {
  const layout = useMemo(() => layoutSequence(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="blueprint" kind="sequence" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="sequence" />
        {layout.actors.map((actor) => (
          <g key={actor.id} data-node-kind={actor.kind}>
            <path d={`M${actor.x} ${layout.headerH} V${layout.height - 30}`} className="bp-wire bp-dashed" />
            <rect x={actor.x - layout.actorW / 2} y={10} width={layout.actorW} height={ACTOR_H} className="bp-shape" />
            {actor.kind === 'store' && (
              <path d={`M${actor.x - layout.actorW / 2} ${10 + 6} H${actor.x + layout.actorW / 2}`} className="bp-stroke-only" />
            )}
            {actor.kind === 'user' && <circle cx={actor.x - layout.actorW / 2 + 14} cy={10 + ACTOR_H / 2} r={5} className="bp-stroke-only" />}
            {actor.kind === 'external' && (
              <rect x={actor.x - layout.actorW / 2 + 4} y={14} width={layout.actorW - 8} height={ACTOR_H - 8} className="bp-stroke-only bp-dashed" />
            )}
            <BpLabel x={actor.x} y={10 + ACTOR_H / 2} text={actor.label} maxChars={15} />
          </g>
        ))}
        {layout.messages.map((m, i) => {
          if (m.selfLoop) {
            const loopW = 38;
            return (
              <g key={i} className="bp-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
                <path
                  d={`M${m.x1} ${m.y - 9} H${m.x1 + loopW} V${m.y + 7} H${m.x1 + 5}`}
                  className="bp-wire bp-draw"
                  pathLength={1}
                />
                <path d={`M${m.x1 + 11} ${m.y + 3.5} L${m.x1 + 5} ${m.y + 7} L${m.x1 + 11} ${m.y + 10.5} Z`} className="bp-head" />
                <BpLabel x={m.x1 + loopW + 12} y={m.y} text={m.label} className="bp-wire-label" maxChars={24} />
              </g>
            );
          }
          const dir = m.x2 > m.x1 ? 1 : -1;
          return (
            <g key={i} className="bp-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
              <path d={`M${m.x1} ${m.y} H${m.x2 - dir * 4}`} className={m.reply ? 'bp-wire bp-dashed bp-draw' : 'bp-wire bp-draw'} pathLength={1} />
              <path
                d={`M${m.x2 - dir * 10} ${m.y - 3.5} L${m.x2 - dir * 4} ${m.y} L${m.x2 - dir * 10} ${m.y + 3.5} Z`}
                className="bp-head"
              />
              <BpLabel x={(m.x1 + m.x2) / 2} y={m.y - 10} text={m.label} className="bp-wire-label" maxChars={28} />
              {m.note !== undefined && (
                <BpLabel x={(m.x1 + m.x2) / 2} y={m.y + 11} text={m.note} className="bp-note" maxChars={32} />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
