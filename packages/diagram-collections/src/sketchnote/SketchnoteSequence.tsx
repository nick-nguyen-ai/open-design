import { useMemo } from 'react';
import { buildOutline, layoutSequence, type SequenceSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { roughLine, roughRect } from '../shared/rough.js';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { SkArrow, SkLabel, skTint } from './shapes.js';

const ACTOR_H = 44;
const ACTOR_TINT: Record<string, number> = { user: 1, service: 2, store: 3, external: 0 };

/** Hand-journal sequence: sticky actor plates, dashed lifelines, rough message arrows. */
export function SketchnoteSequence({ spec }: { spec: SequenceSpecT }) {
  const layout = useMemo(() => layoutSequence(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="sequence" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        {layout.actors.map((actor) => (
          <g key={actor.id} data-node-kind={actor.kind}>
            <path
              d={roughLine(actor.x, layout.headerH, actor.x, layout.height - 12, `life:${actor.id}`)}
              className="sk-stroke sk-dashed sk-faint"
              fill="none"
            />
            <path
              d={roughRect(actor.x - layout.actorW / 2, 8, layout.actorW, ACTOR_H, `actor:${actor.id}`)}
              className={`sk-shape ${skTint(ACTOR_TINT[actor.kind] ?? 0)}`}
            />
            <SkLabel x={actor.x} y={8 + ACTOR_H / 2} text={actor.label} maxChars={16} />
          </g>
        ))}
        {layout.messages.map((m, i) => {
          if (m.selfLoop) {
            const loopW = 42;
            return (
              <g key={i} className="sk-msg" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
                <path
                  d={`${roughLine(m.x1, m.y - 10, m.x1 + loopW, m.y - 10, `self1:${i}`)} ${roughLine(
                    m.x1 + loopW,
                    m.y - 10,
                    m.x1 + loopW,
                    m.y + 8,
                    `self2:${i}`,
                  )} ${roughLine(m.x1 + loopW, m.y + 8, m.x1 + 6, m.y + 8, `self3:${i}`)}`}
                  className="sk-stroke"
                  fill="none"
                />
                <SkLabel x={m.x1 + loopW + 10} y={m.y - 2} text={m.label} className="sk-edge-label" maxChars={22} />
              </g>
            );
          }
          return (
            <g key={i} className="sk-msg" style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
              <SkArrow x1={m.x1} y1={m.y} x2={m.x2} y2={m.y} seed={`msg:${i}`} dashed={m.reply} />
              <SkLabel x={(m.x1 + m.x2) / 2} y={m.y - 12} text={m.label} className="sk-edge-label" maxChars={26} />
              {m.note !== undefined && (
                <SkLabel x={(m.x1 + m.x2) / 2} y={m.y + 12} text={m.note} className="sk-note" maxChars={30} />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
