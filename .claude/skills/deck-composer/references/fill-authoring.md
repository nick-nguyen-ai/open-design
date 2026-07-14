# Fill Authoring — writing content into a fillSkeleton

The fillSkeleton returned by `compose_slide_deck` lists every slide kind and slot with `spec` (type + limits), `guidance` (what the slot is for), and `example` (a real value from the shipped deck). Treat it as a per-slot writing brief. `validate_fill` enforces the same specs, so discipline here saves loop rounds.

## Slot discipline

- **Limits are hard.** `maxChars` exists because the template's type ramp breaks beyond it — a 41-char headline in a 40-char slot is a validation failure, not a rounding error. Write short, then check counts on every display-type slot (titles, KPI labels, node labels).
- **The example anchors register and magnitude.** If the example is `"Settlement ledger"`, the slot wants a noun phrase, not a sentence. If the example series has 8 points between 90 and 130, don't supply 3 points between 0 and 10⁶ — the template's axis/scale craft was tuned around the example's magnitude.
- **`minItems`/`maxItems` are composition bounds.** The layout stays composed only inside them. When the source offers more items than `maxItems`, cut by relevance to the audience answer — never squeeze.
- **Machine-id slots** (fields named `id`, `code`): stable kebab/short tokens, no spaces, mirroring the example's shape.

## Fidelity application (the intake answer)

- **Retain:** use repeatable slide kinds up to their descriptor `repeats.max`; prefer dropping adjectives over dropping facts; long source lists become multiple repeats of the list-bearing kind rather than truncated single slides.
- **Condense:** fewest beats that keep the arc; each slide earns its place by advancing the story; merge source sections that make one point; the kept/cut list from Phase 3 is binding — don't smuggle cut material into stray slots.

## Honesty rules

- **Anomaly slot:** every template requires exactly one flagged anomaly/blocker/tension. It must be a REAL tension from the source (a limitation, an unresolved risk, an honest caveat). If the source is pure marketing with no stated tension, derive an honest one from what the source omits (e.g. a dependency, a maturity caveat) — and make sure the notice covers any inference.
- **Notice slot:** states data provenance verbatim-style, e.g. `Synthetic illustrative data — figures are not measurements` or `Content derived from <source>; unverified figures marked`. If ANY number in the fill is invented or extrapolated, the notice must say so.
- **Numbers:** prefer real figures from the source. An invented figure needs both a plausible magnitude AND coverage by the notice. Never invent quotes or attribute statements to real people/orgs.

## Geometry

None. Ever. Fills are content-only; templates auto-lay every node, lane, and connector. If a diagram-bearing template exposes optional geometry fields, leave them out — auto-layout is the contract, and hand geometry is how off-canvas bugs happen.

## Validate-loop etiquette

Fix exactly what each finding names, content-side, and re-validate. Findings echo the slot path, the violated limit, and the guidance — read all three before editing. Three failed rounds means something structural is wrong (usually a narrative-map beat that doesn't fit its slide kind): go back one phase instead of brute-forcing round four.
