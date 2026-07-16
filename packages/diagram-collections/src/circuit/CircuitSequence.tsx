import { useMemo } from 'react';
import { buildOutline, layoutSequence, type SequenceSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxBoard, CxLabel, CxTrace, cxGlow, cxInk } from './shapes.js';

const ACTOR_H = 40;
const ACTOR_INK: Record<string, number> = { user: 0, service: 1, store: 2, external: 1 };

/** Neon-terminal sequence: session panes, phosphor message traces. */
export function CircuitSequence({ spec }: { spec: SequenceSpecT }) {
  const layout = useMemo(() => layoutSequence(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="circuit" kind="sequence" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="sequence" />
        {layout.actors.map((actor, i) => (
          <g key={actor.id} data-node-kind={actor.kind}>
            <path d={`M${actor.x} ${layout.headerH} V${layout.height - 26}`} className="cx-lifeline" />
            <rect x={actor.x - layout.actorW / 2} y={10} width={layout.actorW} height={ACTOR_H} rx={6} className={`cx-chip ${cxInk(ACTOR_INK[actor.kind] ?? i)}`} />
            <circle cx={actor.x - layout.actorW / 2 + 13} cy={10 + 11} r={3} className={`cx-pin ${cxInk(ACTOR_INK[actor.kind] ?? i)}`} />
            {actor.kind === 'store' && (
              <path d={`M${actor.x - layout.actorW / 2 + 8} ${10 + ACTOR_H - 9} h${layout.actorW - 16}`} className={`cx-chip-inner ${cxInk(2)}`} fill="none" />
            )}
            <CxLabel x={actor.x} y={10 + ACTOR_H / 2 + 2} text={actor.label} maxChars={15} />
          </g>
        ))}
        {layout.messages.map((m, i) => {
          if (m.selfLoop) {
            const loopW = 40;
            return (
              <g key={i} className="cx-msg" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
                <CxTrace
                  d={`M${m.x1} ${m.y - 9} h${loopW} v16 h${-loopW + 5}`}
                  tip={{ x: m.x1 + 5, y: m.y + 7, angle: Math.PI }}
                  ink={cxInk(i)}
                  glow={cxGlow('sequence')}
                  flow={!reduced}
                />
                <CxLabel x={m.x1 + loopW + 12} y={m.y} text={m.label} className="cx-trace-label" maxChars={24} />
              </g>
            );
          }
          const dir = m.x2 > m.x1 ? 1 : -1;
          return (
            <g key={i} className="cx-msg" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
              <CxTrace
                d={`M${m.x1} ${m.y} H${m.x2 - dir * 4}`}
                tip={{ x: m.x2 - dir * 2, y: m.y, angle: dir > 0 ? 0 : Math.PI }}
                ink={m.reply ? 'cx-cyan' : 'cx-green'}
                glow={cxGlow('sequence')}
                flow={!reduced && !m.reply}
              />
              <CxLabel x={(m.x1 + m.x2) / 2} y={m.y - 11} text={m.label} className="cx-trace-label" maxChars={28} />
              {m.note !== undefined && (
                <CxLabel x={(m.x1 + m.x2) / 2} y={m.y + 11} text={m.note} className="cx-note" maxChars={32} />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
