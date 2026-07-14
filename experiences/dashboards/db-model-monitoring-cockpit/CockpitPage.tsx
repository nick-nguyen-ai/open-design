/**
 * "The Model Risk Control Room, 02:47" — the live full-bleed rendering of
 * `db-model-monitoring-cockpit`.
 *
 * Post-templatization this is a thin wrapper: it hands the shipped
 * {@link cockpitFill} to {@link CockpitTemplate}, which carries the whole craft
 * (the bespoke DriftScope, the dealing-floor chrome, the detail band, the
 * motion). The rendered output is what the page rendered before templatization.
 * The document theme (dark) is locked by LiveExperience, not here.
 */
import CockpitTemplate from './CockpitTemplate.js';
import { cockpitFill } from './content.js';

export default function CockpitPage() {
  return <CockpitTemplate fill={cockpitFill} />;
}
