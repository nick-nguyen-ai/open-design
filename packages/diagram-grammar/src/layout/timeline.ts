import type { TimelineSpecT } from '../specs.js';
import { PADDING } from './flow.js';

/**
 * Timeline layout: a horizontal axis through the middle; era cards evenly
 * spaced, alternating above/below the axis, each with a marker dot on the
 * axis at the card's centre x. `nowX` marks the current era when the spec
 * declares one.
 */

const CARD_W = 168;
const CARD_H = 84;
const CARD_GAP = 28;
const AXIS_CLEARANCE = 28;

export interface TimelineLayout {
  width: number;
  height: number;
  axisY: number;
  eras: Array<{
    id: string;
    x: number;
    cardX: number;
    cardY: number;
    w: number;
    h: number;
    side: 'above' | 'below';
    label: string;
    detail?: string;
    marker?: string;
    index: number;
  }>;
  nowX: number | null;
}

export function layoutTimeline(spec: TimelineSpecT): TimelineLayout {
  const axisY = PADDING + CARD_H + AXIS_CLEARANCE;

  const eras = spec.eras.map((era, index) => {
    const cardX = PADDING + index * (CARD_W + CARD_GAP);
    const side: 'above' | 'below' = index % 2 === 0 ? 'above' : 'below';
    return {
      id: era.id,
      x: cardX + CARD_W / 2,
      cardX,
      cardY: side === 'above' ? axisY - AXIS_CLEARANCE - CARD_H : axisY + AXIS_CLEARANCE,
      w: CARD_W,
      h: CARD_H,
      side,
      label: era.label,
      detail: era.detail,
      marker: era.marker,
      index,
    };
  });

  return {
    width: PADDING * 2 + spec.eras.length * CARD_W + (spec.eras.length - 1) * CARD_GAP,
    height: axisY + AXIS_CLEARANCE + CARD_H + PADDING,
    axisY,
    eras,
    nowX: spec.nowIndex !== undefined ? eras[spec.nowIndex]!.x : null,
  };
}
