/**
 * "The Cutover" — the live full-bleed rendering of `deck-cloud-migration`.
 *
 * Post-templatization this is a thin wrapper: it hands the shipped
 * {@link cutoverFill} to {@link CutoverTemplate}, which carries the whole craft.
 * The rendered output is identical to the pre-refactor page (the
 * `LiveWorldsDecksE` + `live-decks-e` parity oracles prove it), so all the
 * anatomy notes now live in `CutoverTemplate.tsx`.
 */
import CutoverTemplate from './CutoverTemplate.js';
import { cutoverFill } from './content.js';

export default function CutoverPage() {
  return <CutoverTemplate fill={cutoverFill} />;
}
