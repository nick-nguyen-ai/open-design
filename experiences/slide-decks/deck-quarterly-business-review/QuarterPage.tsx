/**
 * "The Quarter" — the live full-bleed rendering of
 * `deck-quarterly-business-review`.
 *
 * Post-templatization this is a thin wrapper: it hands the shipped
 * {@link quarterFill} to {@link QuarterTemplate}, which carries the whole craft.
 * The rendered output is identical to the pre-refactor page (the
 * `LiveWorldsDecksF` + `live-decks-f` parity oracles prove it), so all the
 * anatomy notes now live in `QuarterTemplate.tsx`.
 */
import QuarterTemplate from './QuarterTemplate.js';
import { quarterFill } from './content.js';

export default function QuarterPage() {
  return <QuarterTemplate fill={quarterFill} />;
}
