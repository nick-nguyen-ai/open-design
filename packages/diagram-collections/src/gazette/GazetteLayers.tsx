import { useMemo } from 'react';
import { buildOutline, layoutLayers, type LayersSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { GzLabel, GzMedallion, GzSheet, gzHatch } from './shapes.js';

const TONE_BADGE: Record<'base' | 'accent' | 'alert', string> = { base: 'B', accent: 'A', alert: '!' };

/** Field-manual stratigraphy: ruled bands, hatch emphasis, marginal medallions. */
export function GazetteLayers({ spec }: { spec: LayersSpecT }) {
  const layout = useMemo(() => layoutLayers(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="gazette" kind="layers" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <GzSheet width={layout.width} height={layout.height} kind="layers" />
        {layout.gutterX !== null && spec.sideLabel !== undefined && (
          <text
            x={layout.gutterX}
            y={layout.height / 2}
            className="gz-side-label"
            textAnchor="middle"
            transform={`rotate(-90 ${layout.gutterX} ${layout.height / 2})`}
          >
            {spec.sideLabel}
          </text>
        )}
        {layout.bands.map((band, i) => (
          <g key={band.id} className="gz-node" data-tone={band.tone} style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}>
            <rect
              x={band.x}
              y={band.y}
              width={band.w}
              height={band.h}
              className="gz-plate"
              fill={band.tone === 'accent' ? gzHatch('layers') : undefined}
            />
            {band.tone === 'alert' && <rect x={band.x} y={band.y} width={5} height={band.h} className="gz-spot-fill" />}
            <GzMedallion x={band.x + 22} y={band.y + 20} label={String(i + 1)} r={9} />
            <text x={band.x + 40} y={band.y + 25} className="gz-band-label">
              {band.label}
            </text>
            <text x={band.x + band.w - 14} y={band.y + 25} textAnchor="end" className="gz-badge">
              {TONE_BADGE[band.tone]}
            </text>
            {band.detail !== undefined && (
              <text x={band.x + 40} y={band.y + 44} className="gz-footnote-left">
                {band.detail}
              </text>
            )}
            {band.items.map((item, j) => {
              const chipW = 100;
              const totalRows = Math.ceil(band.items.length / 3);
              const row = Math.floor(j / 3);
              const bx = band.x + 40 + (j % 3) * (chipW + 10);
              const by = band.y + band.h - 12 - (totalRows - row) * 24 + 4;
              return (
                <g key={item}>
                  <rect x={bx} y={by} width={chipW} height={19} className="gz-rule-fine" />
                  <GzLabel x={bx + chipW / 2} y={by + 10} text={item} className="gz-chip-label" maxChars={15} />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
