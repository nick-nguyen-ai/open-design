import { useMemo } from 'react';
import { buildOutline, layoutLayers, type LayersSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { roughEllipse, roughRect } from '../shared/rough.js';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { SkLabel, skTint } from './shapes.js';

const TONE_BADGE: Record<'base' | 'accent' | 'alert', string> = { base: 'B', accent: 'A', alert: '!' };

/** Hand-journal layer stack: sticky bands, lettered tone badges, item chips. */
export function SketchnoteLayers({ spec }: { spec: LayersSpecT }) {
  const layout = useMemo(() => layoutLayers(spec), [spec]);
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  return (
    <DiagramFrame family="sketchnote" kind="layers" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="presentation" aria-hidden focusable="false">
        {layout.gutterX !== null && spec.sideLabel !== undefined && (
          <text
            x={layout.gutterX}
            y={layout.height / 2}
            className="sk-side-label"
            textAnchor="middle"
            transform={`rotate(-90 ${layout.gutterX} ${layout.height / 2})`}
          >
            {spec.sideLabel}
          </text>
        )}
        {layout.bands.map((band, i) => (
          <g
            key={band.id}
            className="sk-node"
            data-tone={band.tone}
            style={reduced ? undefined : { animationDelay: `${i * 70}ms` }}
          >
            <path d={roughRect(band.x, band.y, band.w, band.h, band.id)} className={`sk-shape ${skTint(i)}`} />
            <text x={band.x + 16} y={band.y + 26} className="sk-band-label">
              {band.label}
            </text>
            <g>
              <path d={roughEllipse(band.x + band.w - 22, band.y + 20, 11, 11, `tone:${band.id}`)} className="sk-shape sk-paper-fill" />
              <text x={band.x + band.w - 22} y={band.y + 21} textAnchor="middle" dominantBaseline="middle" className="sk-step-num">
                {TONE_BADGE[band.tone]}
              </text>
            </g>
            {band.detail !== undefined && (
              <text x={band.x + 16} y={band.y + 46} className="sk-detail">
                {band.detail}
              </text>
            )}
            {band.items.map((item, j) => {
              const chipW = 96;
              const totalRows = Math.ceil(band.items.length / 3);
              const row = Math.floor(j / 3);
              const chipX = band.x + 16 + (j % 3) * (chipW + 12) + chipW / 2;
              const chipY = band.y + band.h - 16 - (totalRows - 1 - row) * 26;
              return (
                <g key={item}>
                  <path d={roughEllipse(chipX, chipY, chipW / 2, 11, `chip:${band.id}:${j}`)} className="sk-shape sk-paper-fill" />
                  <SkLabel x={chipX} y={chipY} text={item} className="sk-chip-label" maxChars={14} />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
