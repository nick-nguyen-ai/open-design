import type { SequenceSpecT } from '../specs.js';
import { PADDING } from './flow.js';

/**
 * Sequence layout: actors evenly spaced along the top, one lifeline each;
 * messages as ordered horizontal rows. A self-message (`from === to`) is
 * flagged `selfLoop` with `x1 === x2`; the renderer draws the loop shape.
 */

const ACTOR_W = 132;
const ACTOR_GAP = 72;
const HEADER_H = 64;
const ROW_H = 46;
const FOOT_H = 24;

export interface SequenceLayout {
  width: number;
  height: number;
  actors: Array<{ id: string; x: number; label: string; kind: SequenceSpecT['actors'][number]['kind'] }>;
  messages: Array<{
    from: string;
    to: string;
    x1: number;
    x2: number;
    y: number;
    label: string;
    reply: boolean;
    selfLoop: boolean;
    note?: string;
  }>;
  headerH: number;
  actorW: number;
}

export function layoutSequence(spec: SequenceSpecT): SequenceLayout {
  const actors = spec.actors.map((a, i) => ({
    id: a.id,
    x: PADDING + ACTOR_W / 2 + i * (ACTOR_W + ACTOR_GAP),
    label: a.label,
    kind: a.kind,
  }));
  const xById = new Map(actors.map((a) => [a.id, a.x]));

  const messages = spec.messages.map((m, i) => {
    const x1 = xById.get(m.from)!;
    const x2 = xById.get(m.to)!;
    return {
      from: m.from,
      to: m.to,
      x1,
      x2,
      y: HEADER_H + ROW_H * (i + 1),
      label: m.label,
      reply: m.reply ?? false,
      selfLoop: m.from === m.to,
      note: m.note,
    };
  });

  return {
    width: PADDING * 2 + spec.actors.length * ACTOR_W + (spec.actors.length - 1) * ACTOR_GAP,
    height: HEADER_H + ROW_H * (spec.messages.length + 1) + FOOT_H,
    actors,
    messages,
    headerH: HEADER_H,
    actorW: ACTOR_W,
  };
}
