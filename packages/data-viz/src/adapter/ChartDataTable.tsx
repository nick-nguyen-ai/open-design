/**
 * The accessible alternative required by plan §10.3: a REAL `<table>` with
 * the chart's actual series values, visually hidden but always present and
 * always reachable by assistive tech and by Ctrl/Cmd+F / in-page search —
 * unlike a canvas or an opaque SVG blob, a screen reader can navigate this
 * cell-by-cell.
 */
import { VisuallyHidden } from '@enterprise-design/primitives';

export interface ChartDataTableProps {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly (string | number)[])[];
}

export function ChartDataTable({ caption, columns, rows }: ChartDataTableProps) {
  return (
    <VisuallyHidden as="div">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </VisuallyHidden>
  );
}
