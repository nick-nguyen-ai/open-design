/**
 * "The Validation Ledger" — the live full-bleed rendering of
 * `proj-ai-model-validation-hub`.
 *
 * Post-templatization this is a thin wrapper: it hands the shipped
 * {@link ledgerFill} to {@link LedgerTemplate}, which carries the whole craft
 * (the bespoke pipeline ledger with its flagged stalled item, the office chrome,
 * the mirror table, the posture band, the decision log & wire, the motion). The
 * rendered output is what the page rendered before templatization. The document
 * theme (light) is locked by LiveExperience, not here.
 */
import LedgerTemplate from './LedgerTemplate.js';
import { ledgerFill } from './content.js';

export default function LedgerPage() {
  return <LedgerTemplate fill={ledgerFill} />;
}
