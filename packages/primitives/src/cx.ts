/** Tiny classname joiner — avoids pulling in `clsx` for a one-line need. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
