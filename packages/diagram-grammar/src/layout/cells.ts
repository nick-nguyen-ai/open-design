import type { CellsSpecT } from '../specs.js';
import { PADDING } from './flow.js';

/**
 * Cells (top-N grid) layout: row-major grid; column count honours
 * `columnsHint`, else 2 up to six cells, 3 up to nine, 4 beyond. Every cell
 * carries its 1-based index — collections render it as the numbered badge
 * when the spec doesn't provide one.
 */

const CELL_W = 200;
const CELL_H = 100;
const CELL_GAP = 16;

export interface CellsLayout {
  width: number;
  height: number;
  columns: number;
  cells: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    detail?: string;
    badge: string;
    index: number;
  }>;
}

export function layoutCells(spec: CellsSpecT): CellsLayout {
  const n = spec.cells.length;
  const columns = spec.columnsHint ?? (n <= 6 ? 2 : n <= 9 ? 3 : 4);

  const cells = spec.cells.map((c, index) => ({
    id: c.id,
    x: PADDING + (index % columns) * (CELL_W + CELL_GAP),
    y: PADDING + Math.floor(index / columns) * (CELL_H + CELL_GAP),
    w: CELL_W,
    h: CELL_H,
    label: c.label,
    detail: c.detail,
    badge: c.badge ?? String(index + 1).padStart(2, '0'),
    index,
  }));

  const rowCount = Math.ceil(n / columns);
  return {
    width: PADDING * 2 + columns * CELL_W + (columns - 1) * CELL_GAP,
    height: PADDING * 2 + rowCount * CELL_H + (rowCount - 1) * CELL_GAP,
    columns,
    cells,
  };
}
