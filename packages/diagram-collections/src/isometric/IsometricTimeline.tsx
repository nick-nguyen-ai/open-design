import { useMemo } from 'react';
import { buildOutline, type TimelineSpecT } from '@enterprise-design/diagram-grammar';
import { useMotionPreference } from '@enterprise-design/motion';
import { DiagramFrame } from '../shared/DiagramFrame.js';
import { IsoBox, IsoGroundArrow, IsoLabel, IsoPad, IsoShadow, isoExtent, isoInk } from './shapes.js';

const ERA_W = 132;
const ERA_D = 66;
const ERA_GAP = 42;
const ROAD_D = 46;

/** Studio boulevard: a ground road with era blocks parked on alternating sides. */
export function IsometricTimeline({ spec }: { spec: TimelineSpecT }) {
  const outline = useMemo(() => buildOutline(spec), [spec]);
  const { reduced } = useMotionPreference();

  const n = spec.eras.length;
  const roadY = ERA_D + 46;
  const eraX = (i: number): number => 20 + i * (ERA_W + ERA_GAP);
  const worldW = 20 + n * (ERA_W + ERA_GAP) + 40;
  const worldH = roadY + ROAD_D + 46 + ERA_D;
  const view = isoExtent(worldW, worldH, 76);

  return (
    <DiagramFrame family="isometric" kind="timeline" title={spec.title} outline={outline} reduced={reduced}>
      <svg viewBox={`0 0 ${view.width} ${view.height}`} role="presentation" aria-hidden focusable="false">
        <g transform={`translate(${view.tx} ${view.ty})`}>
          <IsoPad x={0} y={roadY} w={worldW} d={ROAD_D} ink="iso-pad-fill" />
          <IsoGroundArrow x1={8} y1={roadY + ROAD_D / 2} x2={worldW - 8} y2={roadY + ROAD_D / 2} dashed />
          {spec.eras.map((era, i) => {
            const above = i % 2 === 0;
            const isNow = spec.nowIndex === i;
            const y = above ? roadY - ERA_D - 26 : roadY + ROAD_D + 26;
            const h = isNow ? 42 : 20;
            return (
              <g key={era.id} className="iso-node" data-now={isNow || undefined} style={reduced ? undefined : { animationDelay: `${i * 90}ms` }}>
                <IsoGroundArrow
                  x1={eraX(i) + ERA_W / 2}
                  y1={above ? y + ERA_D : roadY + ROAD_D / 2}
                  x2={above ? eraX(i) + ERA_W / 2 : eraX(i) + ERA_W / 2}
                  y2={above ? roadY + ROAD_D / 2 : y}
                  dashed
                />
                <IsoShadow x={eraX(i)} y={y} w={ERA_W} d={ERA_D} />
                <IsoBox x={eraX(i)} y={y} w={ERA_W} d={ERA_D} h={h} ink={isNow ? 'iso-rose' : isoInk(i)} />
                <IsoLabel wx={eraX(i) + ERA_W / 2} wy={y + ERA_D / 2} z={h + 30} text={era.marker !== undefined ? `${era.label} · ${era.marker}` : era.label} maxChars={18} className="iso-band-label" />
                {era.detail !== undefined && (
                  <IsoLabel wx={eraX(i) + ERA_W / 2} wy={y + ERA_D / 2} z={h + 14} text={era.detail} maxChars={24} className="iso-note" />
                )}
                {isNow && (
                  <IsoLabel wx={eraX(i) + ERA_W / 2} wy={y + ERA_D + 16} z={0} text="you are here" maxChars={14} className="iso-now" />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </DiagramFrame>
  );
}
