/**
 * "T-Minus" — the live full-bleed rendering of `deck-product-launch`.
 *
 * Post-templatization this is a thin wrapper: it hands the shipped
 * {@link tminusFill} to {@link TMinusTemplate}, which carries the whole craft.
 * The rendered output is identical to the pre-refactor page (the
 * `LiveWorldsDecksE` + `live-decks-e` parity oracles prove it), so all the
 * anatomy notes now live in `TMinusTemplate.tsx`.
 */
import TMinusTemplate from './TMinusTemplate.js';
import { tminusFill } from './content.js';

export default function TMinusPage() {
  return <TMinusTemplate fill={tminusFill} />;
}
