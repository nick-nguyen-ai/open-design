import { useMemo } from 'react';
import { buildOutline, layoutSequence, type SequenceSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzEdge, GzLabel, GzMedallion, GzSheet } from './shapes.js';

const ACTOR_H = 40;

/** Field-manual correspondence: ruled column heads, fine dispatch lines. */
export function GazetteSequence({ spec }: { spec: SequenceSpecT }) {
  const layout = useMemo(() => layoutSequence(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="gazette" kind="sequence" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="sequence" />
        {layout.actors.map((actor, i) => (
          <g key={actor.id} data-node-kind={actor.kind}>
            <path d={`M${actor.x} ${layout.headerH} V${layout.height - 26}`} className="gz-rule-column" />
            <rect x={actor.x - layout.actorW / 2} y={12} width={layout.actorW} height={ACTOR_H} className="gz-plate" />
            {actor.kind === 'store' && <path d={`M${actor.x - layout.actorW / 2} ${18} H${actor.x + layout.actorW / 2}`} className="gz-rule-fine" />}
            {actor.kind === 'user' && <circle cx={actor.x - layout.actorW / 2 + 13} cy={12 + ACTOR_H / 2} r={4} className="gz-ink-fill" />}
            {actor.kind === 'external' && (
              <rect x={actor.x - layout.actorW / 2 + 4} y={16} width={layout.actorW - 8} height={ACTOR_H - 8} className="gz-rule-fine gz-dashed" />
            )}
            <GzLabel x={actor.x} y={12 + ACTOR_H / 2} text={actor.label} maxChars={15} className="gz-plate-label" />
            <GzMedallion x={actor.x} y={layout.headerH + 2} label={String(i + 1)} r={8} />
          </g>
        ))}
        {layout.messages.map((m, i) => {
          if (m.selfLoop) {
            const loopW = 40;
            return (
              <g key={i} className="gz-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
                <path d={`M${m.x1} ${m.y - 8} H${m.x1 + loopW} V${m.y + 8} H${m.x1 + 6}`} className="gz-wire gz-draw" pathLength={1} fill="none" />
                <path d={`M${m.x1 + 12} ${m.y + 4.5} L${m.x1 + 6} ${m.y + 8} L${m.x1 + 12} ${m.y + 11.5} Z`} className="gz-head" />
                <GzLabel x={m.x1 + loopW + 12} y={m.y} text={m.label} className="gz-edge-label" maxChars={24} />
              </g>
            );
          }
          return (
            <g key={i} className="gz-msg" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
              <GzEdge x1={m.x1} y1={m.y} x2={m.x2} y2={m.y} dashed={m.reply} spot={!m.reply} />
              <GzLabel x={(m.x1 + m.x2) / 2} y={m.y - 10} text={m.label} className="gz-edge-label" maxChars={28} />
              {m.note !== undefined && (
                <GzLabel x={(m.x1 + m.x2) / 2} y={m.y + 11} text={m.note} className="gz-footnote" maxChars={32} />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
