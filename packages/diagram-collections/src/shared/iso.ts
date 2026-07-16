/**
 * Isometric projection math for the isometric family. Standard 30° isometric:
 * world x runs down-right, world y runs down-left, world z runs straight up.
 * Pure functions — the family's renderers own all styling.
 */

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

/** Projects a world-space point to the 2D isometric plane. */
export function isoProject(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS30, (x + y) * SIN30 - z];
}

const pts = (points: Array<[number, number]>): string =>
  points.map(([x, y]) => `${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`).join(' ');

/**
 * The three visible faces of an axis-aligned box whose base corner sits at
 * world (x, y, z) with footprint w×d and height h — as SVG polygon `points`
 * strings. Faces: top (lightest), left (x-facing), right (y-facing, darkest).
 */
export function isoBoxFaces(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
): { top: string; left: string; right: string } {
  const p = (wx: number, wy: number, wz: number) => isoProject(wx, wy, wz);
  return {
    top: pts([p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)]),
    left: pts([p(x, y, z), p(x + w, y, z), p(x + w, y, z + h), p(x, y, z + h)]),
    right: pts([p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)]),
  };
}
