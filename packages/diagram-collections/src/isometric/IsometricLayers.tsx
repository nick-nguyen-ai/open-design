import { useMemo } from 'react';
import { buildOutline, type LayersSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { IsoBox, IsoLabel, IsoShadow, isoExtent, isoInk } from './shapes.js';
import { isoProject } from '../shared/iso.js';

const SLAB_W = 330;
const SLAB_D = 78;
const SLAB_H = 18;
const STEP_D = 96;
const TONE_BADGE: Record<'base' | 'accent' | 'alert', string> = { base: 'B', accent: 'A', alert: '!' };

/** Studio terraces: layers as a descending staircase of slabs, items as pads on top. */
export function IsometricLayers({ spec }: { spec: LayersSpecT }) {
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  const n = spec.layers.length;
  const worldH = n * STEP_D + SLAB_D;
  const maxZ = n * 26 + 60;
  const view = isoExtent(SLAB_W + 220, worldH, maxZ);

  return (
    <DiagramFrame family="isometric" kind="layers" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          {spec.sideLabel !== undefined && (
            <text
              x={isoProject(-24, worldH / 2, 0)[0]}
              y={isoProject(-24, worldH / 2, 0)[1]}
              className="iso-side-label"
              textAnchor="middle"
            >
              {spec.sideLabel}
            </text>
          )}
          {spec.layers.map((layer, i) => {
            const wy = i * STEP_D;
            const z = (n - 1 - i) * 26;
            const items = layer.items ?? [];
            return (
              <g key={layer.id} className="iso-node" data-tone={layer.tone ?? 'base'} style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
                <IsoShadow x={0} y={wy} w={SLAB_W} d={SLAB_D} />
                <IsoBox x={0} y={wy} z={z} w={SLAB_W} d={SLAB_D} h={SLAB_H} ink={layer.tone === 'alert' ? 'iso-rose' : isoInk(i)} />
                <IsoLabel wx={SLAB_W + 96} wy={wy + SLAB_D / 2} z={z + SLAB_H + 10} text={`${layer.label} [${TONE_BADGE[layer.tone ?? 'base']}]`} maxChars={26} className="iso-band-label" />
                {layer.detail !== undefined && (
                  <IsoLabel wx={SLAB_W + 96} wy={wy + SLAB_D / 2} z={z + SLAB_H - 8} text={layer.detail} maxChars={34} className="iso-note" />
                )}
                {items.map((item, j) => {
                  const padW = 86;
                  const px = 14 + (j % 3) * (padW + 12);
                  const py = wy + SLAB_D - 30 - Math.floor(j / 3) * 28;
                  return (
                    <g key={item}>
                      <IsoBox x={px} y={py} z={z + SLAB_H} w={padW} d={22} h={6} ink="iso-neutral" />
                      <IsoLabel wx={px + padW / 2} wy={py + 11} z={z + SLAB_H + 16} text={item} maxChars={13} className="iso-chip-label" />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>
    </DiagramFrame>
  );
}
