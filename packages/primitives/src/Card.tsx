import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, Ref } from 'react';
import { cx } from './cx.js';

const BASE =
  'rounded-lg border border-border-subtle bg-surface-raised p-4 text-left shadow-sm transition-shadow duration-feedback ease-settle';

const INTERACTIVE =
  'hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring cursor-pointer';

export interface CardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  onClick?: never;
}
export interface CardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
  onClick: NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClick']>;
}
export interface CardStaticProps extends HTMLAttributes<HTMLDivElement> {
  href?: never;
  onClick?: never;
}

export type CardProps = CardLinkProps | CardButtonProps | CardStaticProps;

/**
 * A clickable Card renders as a real `<a href>` or `<button>` (never a `<div
 * onClick>`), so it's reachable by Tab and operable with Enter/Space with no
 * nested-interactive ambiguity. No `href`/`onClick` → a plain, non-interactive `<div>`.
 */
export const Card = forwardRef<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement, CardProps>(
  function Card({ className, ...rest }, ref) {
    if ('href' in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as CardLinkProps;
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={cx(BASE, INTERACTIVE, className)}
          {...anchorRest}
        />
      );
    }
    if ('onClick' in rest && rest.onClick !== undefined) {
      const { onClick, ...buttonRest } = rest as CardButtonProps;
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cx(BASE, INTERACTIVE, 'w-full', className)}
          {...buttonRest}
        />
      );
    }
    return <div ref={ref as Ref<HTMLDivElement>} className={cx(BASE, className)} {...(rest as CardStaticProps)} />;
  },
);
