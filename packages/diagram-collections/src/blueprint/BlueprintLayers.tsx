import { useMemo } from 'react';
import { buildOutline, layoutLayers, type LayersSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { BpLabel, BpSheet } from './shapes.js';

const TONE_BADGE: Record<'base' | 'accent' | 'alert', string> = { base: 'B', accent: 'A', alert: '!' };

/** Drafting-sheet layer stack: ruled bands with elevation marks and item bays. */
export function BlueprintLayers({ spec }: { spec: LayersSpecT }) {
  const layout = useMemo(() => layoutLayers(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="blueprint" kind="layers" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <BpSheet width={layout.width} height={layout.height} kind="layers" />
        {layout.gutterX !== null && spec.sideLabel !== undefined && (
          <g>
            <path d={`M${layout.gutterX} 28 V${layout.height - 28}`} className="bp-wire" />
            <path d={`M${layout.gutterX - 4} 34 L${layout.gutterX} 28 L${layout.gutterX + 4} 34`} className="bp-head" />
            <text
              x={layout.gutterX - 8}
              y={layout.height / 2}
              className="bp-side-label"
              textAnchor="middle"
              transform={`rotate(-90 ${layout.gutterX - 8} ${layout.height / 2})`}
            >
              {spec.sideLabel}
            </text>
          </g>
        )}
        {layout.bands.map((band, i) => (
          <g
            key={band.id}
            className="bp-node"
            data-tone={band.tone}
            style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}
          >
            <rect
              x={band.x}
              y={band.y}
              width={band.w}
              height={band.h}
              className={band.tone === 'accent' ? 'bp-shape bp-accent' : band.tone === 'alert' ? 'bp-shape bp-alert' : 'bp-shape'}
            />
            <text x={band.x + 14} y={band.y + 24} className="bp-band-label">
              {`${String(layout.bands.length - i).padStart(2, '0')} · ${band.label.toUpperCase()}`}
            </text>
            <g>
              <rect x={band.x + band.w - 34} y={band.y + 8} width={24} height={18} className="bp-stroke-only" />
              <text x={band.x + band.w - 22} y={band.y + 18} textAnchor="middle" dominantBaseline="middle" className="bp-step-num">
                {TONE_BADGE[band.tone]}
              </text>
            </g>
            {band.detail !== undefined && (
              <text x={band.x + 14} y={band.y + 42} className="bp-note">
                {band.detail}
              </text>
            )}
            {band.items.map((item, j) => {
              const bayW = 108;
              const totalRows = Math.ceil(band.items.length / 3);
              const row = Math.floor(j / 3);
              const bx = band.x + 14 + (j % 3) * (bayW + 10);
              const by = band.y + band.h - 12 - (totalRows - row) * 24 + 4;
              return (
                <g key={item}>
                  <rect x={bx} y={by} width={bayW} height={20} className="bp-stroke-only" />
                  <BpLabel x={bx + bayW / 2} y={by + 10} text={item} className="bp-bay-label" maxChars={15} />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
