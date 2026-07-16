/**
 * "THE DRAFTING BOARD" — live full-bleed rendering of `deck-dgm-blueprint`.
 * Thin wrapper: hands the shipped fill to the template, which carries the craft.
 */
import BlueprintDeckTemplate from './BlueprintDeckTemplate.js';
import { SHIPPED_FILL } from './content.js';

export default function BlueprintDeckPage() {
  return <BlueprintDeckTemplate fill={SHIPPED_FILL} />;
}
