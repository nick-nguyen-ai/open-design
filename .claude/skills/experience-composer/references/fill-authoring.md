# Fill Authoring — writing content into a fillSkeleton

The fillSkeleton returned by the compose tool lists every section/kind and slot with `spec` (type + limits), `guidance` (what the slot is for), and `example` (a real value from the shipped world). Treat it as a per-slot writing brief. `validate_fill` enforces the same specs, so discipline here saves loop rounds. This guidance is surface-neutral; the surface-specific notes at the end apply on top of it.

## Slot discipline

- **Limits are hard.** `maxChars` exists because the template's type ramp breaks beyond it — a 41-char headline in a 40-char slot is a validation failure, not a rounding error. Write short, then check counts on every display-type slot (titles, KPI labels, node labels, section headings).
- **The example anchors register and magnitude.** If the example is `"Settlement ledger"`, the slot wants a noun phrase, not a sentence. If the example series has 8 points between 90 and 130, don't supply 3 points between 0 and 10⁶ — the template's axis/scale craft was tuned around the example's magnitude.
- **`minItems`/`maxItems` are composition bounds.** The layout stays composed only inside them. When the source offers more items than `maxItems`, cut by relevance to the audience answer — never squeeze.
- **Machine-id slots** (fields named `id`, `code`): stable kebab/short tokens, no spaces, mirroring the example's shape.
- **Unit conventions are part of the spec.** When guidance states a convention (e.g. "percent values are FRACTIONS: 0.8 renders as 80.0%"), a value that ignores it validates fine and renders absurdly. If the guidance is silent, infer the convention from the example's magnitude before writing any number.

## Fidelity application (the intake answer)

- **Retain:** use repeatable kinds/sections up to their descriptor `repeats.max` / `maxItems`; prefer dropping adjectives over dropping facts; long source lists become multiple repeats of the list-bearing kind rather than truncated single slides/sections.
- **Condense:** fewest beats that keep the arc; each slide/section earns its place by advancing the story; merge source sections that make one point; the kept/cut list from Phase 3 is binding — don't smuggle cut material into stray slots.

## Honesty rules

- **Anomaly slot:** every template requires exactly one flagged anomaly/blocker/tension. It must be a REAL tension from the source (a limitation, an unresolved risk, an honest caveat). If the source is pure marketing with no stated tension, derive an honest one from what the source omits (e.g. a dependency, a maturity caveat) — and make sure the notice covers any inference.
- **Notice slot:** states data provenance verbatim-style, e.g. `Synthetic illustrative data — figures are not measurements` or `Content derived from <source>; unverified figures marked`. If ANY number in the fill is invented or extrapolated, the notice must say so.
- **Numbers:** prefer real figures from the source. An invented figure needs both a plausible magnitude AND coverage by the notice. Never invent quotes or attribute statements to real people/orgs.

## Geometry

None. Ever. Fills are content-only; templates auto-lay every node, lane, and connector. If a diagram-bearing template exposes optional geometry fields, leave them out — auto-layout is the contract, and hand geometry is how off-canvas bugs happen.

## Surface-specific notes

These sit on top of the surface-neutral rules above; apply the one that matches your compose tool.

### Dashboards (compose_dashboard)

- A dashboard reads as live monitoring, so it leans on synthetic time-series and figures. **Every invented series/figure must be covered by the notice slot** — the dashboard states plainly that its data is synthetic illustrative data, not measurements.
- **Anchor magnitudes to the skeleton examples.** A KPI or trend panel's craft (axis, scale, sparkline) was tuned around the example's magnitude and point count; keep synthetic series in the same shape (roughly the example's range and number of points) so the panels stay composed.
- Exactly one flagged anomaly is the one thing the viewer is meant to notice — make it a real tension, not decoration.

### Personal pages (compose_personal_page)

- **Real-person facts come ONLY from the provided source.** No invented biography, no plausible-sounding roles, dates, employers, or achievements. If the source doesn't state it, it doesn't go on the page.
- If the source is thin, keep the page thin (fewer repeats) rather than padding sections with fabricated life detail. A short honest page beats a full invented one.
- The notice/synthetic-mark still applies to any illustrative figures (e.g. demo telemetry), but it does not license inventing facts about the person.

### Technical explainers (compose_explainer) — fixed-slot topology

- The drawing is a **pinned node/edge structure**; your fill relabels it. Each node/edge must map to a real part of the source system. Do not invent parts to fill empty pins, and do not drop real parts because they don't fit — if the mapping fails, the template choice was wrong (go back to Phase 2), not the fill.
- Legend and annotation slots name and walk the SAME parts the drawing pins — keep labels consistent across drawing, legend, and annotations (a node called one thing in the drawing and another in the legend is a content bug).

### Project pages (compose_project_page) — pinned pipeline

- `ledger` pins a 4-stage pipeline; the same fixed-slot discipline as explainers applies — each stage must be claimed by a real phase of the work. If the work isn't a staged pipeline, that's a wrong-template signal.

## Validate-loop etiquette

Fix exactly what each finding names, content-side, and re-validate. Findings echo the slot path, the violated limit, and the guidance — read all three before editing. Three failed rounds means something structural is wrong (usually a narrative-map beat or a section that doesn't fit its kind/slot): go back one phase instead of brute-forcing round four.
