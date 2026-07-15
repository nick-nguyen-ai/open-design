/**
 * "The Drawing Office" — the live full-bleed rendering of
 * `exp-system-architecture`.
 *
 * Post-templatization this is a thin wrapper: it hands the shipped
 * {@link drawingOfficeFill} to {@link DrawingOfficeTemplate}, which carries the
 * whole craft (the bespoke ArchitectureDrawing, the title block, the schedule of
 * parts, the narrative, the motion). The rendered output is what the page
 * rendered before templatization. The document theme (light) is locked by
 * LiveExperience, not here.
 */
import DrawingOfficeTemplate from './DrawingOfficeTemplate.js';
import { drawingOfficeFill } from './content.js';

export default function DrawingOfficePage() {
  return <DrawingOfficeTemplate fill={drawingOfficeFill} />;
}
