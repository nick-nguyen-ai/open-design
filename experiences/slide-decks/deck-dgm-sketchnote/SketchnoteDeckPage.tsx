/**
 * "The Field Notebook" — live full-bleed rendering of `deck-dgm-sketchnote`.
 * Thin wrapper: hands the shipped fill to the template, which carries the craft.
 */
import SketchnoteDeckTemplate from './SketchnoteDeckTemplate.js';
import { SHIPPED_FILL } from './content.js';

export default function SketchnoteDeckPage() {
  return <SketchnoteDeckTemplate fill={SHIPPED_FILL} />;
}
