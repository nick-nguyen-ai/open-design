import { useMemo } from 'react';
import { buildOutline, type CompareSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { IsoBox, IsoLabel, IsoPad, IsoShadow, isoExtent, isoInk } from './shapes.js';

const COL_W = 200;
const COL_GAP = 46;
const LABEL_GUTTER = 130;
const HEAD_D = 56;
const ROW_D = 64;
const ROW_GAP = 18;

/** Studio podiums: column header blocks at the back, value pads stepping forward. */
export function IsometricCompare({ spec }: { spec: CompareSpecT }) {
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  const colX = (j: number): number => LABEL_GUTTER + j * (COL_W + COL_GAP);
  const rowY = (i: number): number => HEAD_D + 34 + i * (ROW_D + ROW_GAP);
  const worldW = LABEL_GUTTER + spec.columns.length * (COL_W + COL_GAP);
  const verdictY = rowY(spec.rows.length);
  const worldH = verdictY + (spec.verdict !== undefined ? ROW_D + 20 : 20);
  const view = isoExtent(worldW, worldH, 70);

  return (
    <DiagramFrame family="isometric" kind="compare" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          {spec.columns.map((col, j) => (
            <g key={col.id} data-tone={col.tone ?? 'base'}>
              <IsoShadow x={colX(j)} y={0} w={COL_W} d={HEAD_D} />
              <IsoBox x={colX(j)} y={0} w={COL_W} d={HEAD_D} h={col.tone === 'accent' ? 40 : 26} ink={isoInk(j + (col.tone === 'accent' ? 0 : 1))} />
              <IsoLabel wx={colX(j) + COL_W / 2} wy={HEAD_D / 2} z={(col.tone === 'accent' ? 40 : 26) + 18} text={col.tone === 'accent' ? `★ ${col.label}` : col.label} maxChars={18} className="iso-band-label" />
            </g>
          ))}
          {spec.rows.map((row, i) => (
            <g key={row.label} className="iso-node" style={reduced ? undefined : { animationDelay: `${i * 80}ms` }}>
              <IsoLabel wx={LABEL_GUTTER / 2} wy={rowY(i) + ROW_D / 2} z={8} text={row.label} maxChars={15} className="iso-row-label" />
              {row.values.map((value, j) => (
                <g key={j}>
                  <IsoPad x={colX(j)} y={rowY(i)} w={COL_W} d={ROW_D} ink="iso-pad-fill" />
                  <IsoLabel wx={colX(j) + COL_W / 2} wy={rowY(i) + ROW_D / 2} z={10} text={value} maxChars={24} className="iso-cell-value" />
                </g>
              ))}
            </g>
          ))}
          {spec.verdict !== undefined && (
            <g>
              <IsoShadow x={LABEL_GUTTER} y={verdictY} w={worldW - LABEL_GUTTER - COL_GAP} d={ROW_D - 10} />
              <IsoBox x={LABEL_GUTTER} y={verdictY} w={worldW - LABEL_GUTTER - COL_GAP} d={ROW_D - 10} h={12} ink="iso-rose" />
              <IsoLabel wx={LABEL_GUTTER + (worldW - LABEL_GUTTER - COL_GAP) / 2} wy={verdictY + (ROW_D - 10) / 2} z={30} text={`Verdict: ${spec.verdict}`} maxChars={58} className="iso-band-label" />
            </g>
          )}
        </g>
      </svg>
    </DiagramFrame>
  );
}
