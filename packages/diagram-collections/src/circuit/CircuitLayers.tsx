import { useMemo } from 'react';
import { buildOutline, layoutLayers, type LayersSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { CxBoard, CxLabel, cxInk } from './shapes.js';

const TONE_BADGE: Record<'base' | 'accent' | 'alert', string> = { base: 'B', accent: 'A', alert: '!' };

/** Neon-terminal layer rack: glass slabs with pin rails and item modules. */
export function CircuitLayers({ spec }: { spec: LayersSpecT }) {
  const layout = useMemo(() => layoutLayers(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="circuit" kind="layers" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        <CxBoard width={layout.width} height={layout.height} kind="layers" />
        {layout.gutterX !== null && spec.sideLabel !== undefined && (
          <text
            x={layout.gutterX}
            y={layout.height / 2}
            className="cx-side-label"
            textAnchor="middle"
            transform={`rotate(-90 ${layout.gutterX} ${layout.height / 2})`}
          >
            {spec.sideLabel.toUpperCase()}
          </text>
        )}
        {layout.bands.map((band, i) => (
          <g key={band.id} className="cx-node" data-tone={band.tone} style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
            <rect x={band.x} y={band.y} width={band.w} height={band.h} rx={6} className={`cx-chip ${band.tone === 'alert' ? 'cx-magenta' : cxInk(i)}`} />
            <path d={`M${band.x + 6} ${band.y + 6} v${band.h - 12}`} className={`cx-pin-rail ${band.tone === 'alert' ? 'cx-magenta' : cxInk(i)}`} />
            <text x={band.x + 18} y={band.y + 24} className="cx-band-label">
              {band.label}
            </text>
            <text x={band.x + band.w - 16} y={band.y + 24} textAnchor="end" className="cx-step">
              [{TONE_BADGE[band.tone]}]
            </text>
            {band.detail !== undefined && (
              <text x={band.x + 18} y={band.y + 43} className="cx-note-left">
                {band.detail}
              </text>
            )}
            {band.items.map((item, j) => {
              const modW = 104;
              const totalRows = Math.ceil(band.items.length / 3);
              const row = Math.floor(j / 3);
              const mx = band.x + 18 + (j % 3) * (modW + 10);
              const my = band.y + band.h - 10 - (totalRows - row) * 24 + 2;
              return (
                <g key={item}>
                  <rect x={mx} y={my} width={modW} height={19} rx={4} className="cx-module" />
                  <CxLabel x={mx + modW / 2} y={my + 10} text={item} className="cx-module-label" maxChars={15} />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
