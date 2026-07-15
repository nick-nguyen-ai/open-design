/**
 * "The Line" — the live full-bleed rendering of `home-career-project-timeline`.
 *
 * Post-templatization this is a thin wrapper: it hands the shipped
 * {@link theLineFill} to {@link TheLineTemplate}, which carries the whole craft
 * (the continuous survey line with its stations, gauge changes, branches and the
 * one honest switchback, the identity head, the interchanges panel, the terminus,
 * the station-register mirror table, the line-draw motion). The rendered output
 * is what the page rendered before templatization. The document theme (dark) is
 * locked by LiveExperience, not here.
 */
import TheLineTemplate from './TheLineTemplate.js';
import { theLineFill } from './content.js';

export default function TheLinePage() {
  return <TheLineTemplate fill={theLineFill} />;
}
