import type { LayersSpecT } from '../specs.js';
import { PADDING } from './flow.js';

/**
 * Layer-stack layout: full-width horizontal bands, top-to-bottom in spec
 * order. Band height grows with declared content (detail line, item chips);
 * an optional side label reserves a left gutter for the renderer's rotated
 * caption.
 */

const BAND_W = 640;
const BAND_BASE_H = 58;
const DETAIL_H = 20;
const ITEMS_ROW_H = 26;
const BAND_GAP = 10;
const GUTTER_W = 40;

export interface LayersLayout {
  width: number;
  height: number;
  gutterX: number | null;
  bands: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    detail?: string;
    items: string[];
    tone: 'base' | 'accent' | 'alert';
    index: number;
  }>;
}

export function layoutLayers(spec: LayersSpecT): LayersLayout {
  const gutter = spec.sideLabel !== undefined ? GUTTER_W : 0;
  const x = PADDING + gutter;
  let y = PADDING;
  const bands: LayersLayout['bands'] = spec.layers.map((layer, index) => {
    const items = layer.items ?? [];
    const itemRows = items.length > 0 ? Math.ceil(items.length / 3) : 0;
    const h = BAND_BASE_H + (layer.detail !== undefined ? DETAIL_H : 0) + itemRows * ITEMS_ROW_H;
    const band = {
      id: layer.id,
      x,
      y,
      w: BAND_W,
      h,
      label: layer.label,
      detail: layer.detail,
      items,
      tone: layer.tone ?? ('base' as const),
      index,
    };
    y += h + BAND_GAP;
    return band;
  });

  return {
    width: PADDING * 2 + gutter + BAND_W,
    height: y - BAND_GAP + PADDING,
    gutterX: gutter > 0 ? PADDING + GUTTER_W / 2 : null,
    bands,
  };
}
