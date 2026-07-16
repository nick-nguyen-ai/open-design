import type { ReactNode } from 'react';
import { VisuallyHidden } from '@enterprise-design/primitives';
import type { DiagramKind } from '@enterprise-design/diagram-grammar';

export interface DiagramFrameProps {
  family: string;
  kind: DiagramKind;
  title: string;
  /** The grammar's textual mirror — rendered visually hidden but always present. */
  outline: string[];
  /** Resolved motion preference; stamps the styling hook `data-reduced`. */
  reduced: boolean;
  children: ReactNode;
}

/**
 * The one wrapper every collection renderer uses: a `<figure>` carrying the
 * family/kind test anchor, the visible family-styled caption, the visually
 * hidden outline (the a11y contract from the grammar), and the `data-reduced`
 * styling hook. Keeping this shared means all 40 components agree on their
 * accessibility surface while disagreeing completely on paint.
 */
export function DiagramFrame({ family, kind, title, outline, reduced, children }: DiagramFrameProps) {
  return (
    <figure
      className={`dgm dgm-${family} dgm-kind-${kind}`}
      data-testid={`dgm-${family}-${kind}`}
      data-reduced={reduced || undefined}
    >
      <figcaption className="dgm-title">{title}</figcaption>
      <VisuallyHidden>
        <ol className="dgm-outline">
          {outline.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </VisuallyHidden>
      {children}
    </figure>
  );
}
