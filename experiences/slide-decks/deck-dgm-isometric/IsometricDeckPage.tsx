/**
 * "THE STUDIO FLOOR" — live full-bleed rendering of `deck-dgm-isometric`.
 * Thin wrapper: hands the shipped fill to the template, which carries the craft.
 */
import IsometricDeckTemplate from './IsometricDeckTemplate.js';
import { SHIPPED_FILL } from './content.js';

export default function IsometricDeckPage() {
  return <IsometricDeckTemplate fill={SHIPPED_FILL} />;
}
