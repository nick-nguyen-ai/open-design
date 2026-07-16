/**
 * "THE LIT BOARD" — live full-bleed rendering of `deck-dgm-circuit`.
 * Thin wrapper: hands the shipped fill to the template, which carries the craft.
 */
import CircuitDeckTemplate from './CircuitDeckTemplate.js';
import { SHIPPED_FILL } from './content.js';

export default function CircuitDeckPage() {
  return <CircuitDeckTemplate fill={SHIPPED_FILL} />;
}
