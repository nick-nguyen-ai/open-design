/**
 * "THE GAZETTE" — live full-bleed rendering of `deck-dgm-gazette`.
 * Thin wrapper: hands the shipped fill to the template, which carries the craft.
 */
import GazetteDeckTemplate from './GazetteDeckTemplate.js';
import { SHIPPED_FILL } from './content.js';

export default function GazetteDeckPage() {
  return <GazetteDeckTemplate fill={SHIPPED_FILL} />;
}
