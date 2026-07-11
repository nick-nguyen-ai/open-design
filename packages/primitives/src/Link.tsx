import { forwardRef } from 'react';
import type { AnchorHTMLAttributes } from 'react';
import { cx } from './cx.js';
import { VisuallyHidden } from './VisuallyHidden.js';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the link as leaving the current site/app: adds safe `target`/`rel` and an "(opens in new tab)" cue for assistive tech. */
  external?: boolean;
}

const BASE =
  'text-accent underline underline-offset-2 hover:text-accent-hover ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';

/** Styled `<a>`. `external` adds `target="_blank"` + `rel="noopener noreferrer"` and an accessible "opens in new tab" cue — never silently opens a new tab without warning. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { external = false, className, children, target, rel, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cx(BASE, className)}
      target={external ? '_blank' : target}
      rel={external ? 'noopener noreferrer' : rel}
      {...rest}
    >
      {children}
      {external ? <VisuallyHidden> (opens in new tab)</VisuallyHidden> : null}
    </a>
  );
});
