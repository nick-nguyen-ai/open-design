# Grammar specimen run — precision-grid — 2026-07-21

Three attempts. Attempt 1 (pin `deck-ai-governance-and-controls`) blocked — kept below as
history. Attempt 2 (pin `quarter`) validated in 2 rounds but was **retired by the
independent screenshot judge** on honest-copy grounds — kept below as history with the
verdict. Attempt 3 (pin `cockpit`, precision-grid's dashboard template) **shipped the
validated fill** — see the final section; `fill.json` / `validate-outcome.json` now hold
the cockpit run.

---

# ATTEMPT 1 (history) — deck-ai-governance-and-controls

**Outcome: BLOCKED, reported honestly (no fill.json / validate-outcome.json — none would be true).**
Per GUIDANCE.md §3g ("never force a bad fit silently") and the compose doctrine ("a design
flaw found mid-run is template work: stop, report"), this run stops at the compose call and
documents exactly why, with the evidence needed to unblock it.

## Intake record

- Surface: slide-deck (given) · Audience: mixed (engineers + design-minded PMs)
- Fidelity: CONDENSE — fewest slides keeping the 10-beat opendesign-intro arc
- Pin: `deck-ai-governance-and-controls` (precision-grid's example deck, per
  `packages/registry/data/grammars/precision-grid.grammar.manifest.ts`)
- Context: businessIntent `[explain-design-system, enable-adoption]`, corporateSuitability
  `standard`, motionPreference 1
- Source: GUIDANCE.md, docs/borrow-a-part.md, docs/superpowers/specs/design-audit-pilot/RUN-LOG.md;
  narrative map from docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md

## The blocker

`compose_slide_deck` with the required pin returned **UNKNOWN_TEMPLATE** (full result in
`mcp-outcome.json`): `deck-ai-governance-and-controls` is not a live slide-deck template.
Repo cross-check confirms the server registry is current, not stale:

- The world dir (`experiences/slide-decks/deck-ai-governance-and-controls/`) contains only
  `ControlFramePage.tsx`, `content.ts`, `frame.css`, and the experience manifest. There is
  **no `*.worldtemplate.manifest.ts` and no `*-fill.ts`** — the world was shipped hand-built
  (commit b912c15) and never templatized (GUIDANCE §6b ingestion chain never ran on it).
- `packages/registry/generated/world-templates.json` publishes exactly the 8 slide-deck
  templates the error lists; this world is absent.
- Its `content.ts` is shipped editorial content baked into typed `Frame` objects — the
  opposite of the fill/template split, so there is no descriptor contract for
  `validate_fill` to enforce and no fillSkeleton to author against.

Unblocking is **template work** (scaffold-template → extract Template.tsx from
ControlFramePage.tsx under the parity oracle → FILL_SCHEMA + SECTIONS in lockstep →
certify to 0 findings → part-id anchors + LivePartIds entry). That is explicitly out of
scope for a compose run and forbidden here (no edits outside this evidence dir).

Note the deeper tension: the precision-grid grammar manifest itself says *"Never used for
slide decks — the grid density fights a presentation viewing distance"* under
`surfaceRules`, yet its only slide-deck example is this world. The grammar-tab-specimens
design (docs/superpowers/specs/2026-07-21-grammar-tab-specimens-design.md §6) assumes all
10 offline grammars can be composed via the COMPOSE route — for precision-grid that
assumption fails today.

## Draft slide map (UNVALIDATED — a head start for whoever templatizes the world)

The Control Frame's frame kinds (cover, principles, matrix, zoom×3, escalation, closing —
8 frames shipped) would hold the 10-beat arc at CONDENSE like this:

1. cover — "OpenDesign — one system, five surfaces" — beat 1. Cover kicker/title/subtitle
   is the public specimen frame; strongest honest line of the content.
2. principles — division-of-labor doctrine + skill↔MCP handshake — beats 3+4 merged.
3. matrix — THE CONTROL MATRIX recast as the quality matrix: compose-pipeline stages
   (intake → select → author → validate → render → verify) × gate families (contracts,
   certifier, part-IDs, render budgets, evidence); 65-world estate in the caption — beats
   5+6. The single GAP cell = the one REAL anomaly: descriptor caps vs rendered budgets
   disagree on dgm-circuit (validate_fill passes copy the template then ellipsizes —
   opendesign-intro-sample RUN-LOG, template-work observations).
4. zoom (column) — the COMPOSE route end-to-end — beat 2.
5. zoom (row) — BORROW and the public `data-part-id` contract — beat 7 (compare) folded in.
6. zoom (row) — AUDIT + the quality loop; the pilot's real catch (529px scrollWidth at
   375px on T-Minus, 2026-07-18) — beat 6.
7. escalation — timeline as maturity staircase: hand-built → contracts → MCP tools →
   pilots (Jul 15 / Jul 18) → 65 live — beat 9.
8. closing — obligations as takeaways + ask — beat 10.

Kept: beats 1–7, 9, 10. Cut: beat 8 (lexicon) as a standalone slide — terms fold into
principles/zoom captions; environment gotchas, git hygiene, certifier CLI invocations
(same cuts as the sibling runs). All numbers trace: 65 worlds (brief), 5 surfaces
(GUIDANCE §1), Jul 15 (borrow-a-part.md), Jul 18 + 529px/375px (design-audit-pilot
RUN-LOG). Notice slot would state: content derived from repo docs and pilot run logs,
2026-07; control-matrix cell statuses illustrative.

## Fit note (honest)

Strong on paper: a governance deck maps the quality loop and gate list unusually well —
the matrix-with-one-GAP is a near-perfect vehicle for the honesty rule, and the zoom
frames mirror the three routes. But the fit is unrealized: the template contract does not
exist, and the grammar's own surfaceRules disclaim slide decks. Recommend either (a)
templatizing the Control Frame first (separate task), or (b) amending the specimen plan
for precision-grid to shoot its dashboard exemplar (`db-model-monitoring-cockpit`, a
published template) — with the content-held-constant caveat noted on the card.

## Scaffold facts (as they actually exist)

- (a) World dir: `experiences/slide-decks/deck-ai-governance-and-controls/`. **No fill
  schema exists** — there is no `*-fill.ts`, hence no `FILL_SCHEMA`/`SECTIONS` exports.
  Content module: `experiences/slide-decks/deck-ai-governance-and-controls/content.ts`
  (imported in-world as `./content.js`), exporting `FRAMEWORK`, `LIFECYCLE`, `FAMILIES`,
  `MATRIX`, `GAP_COORD`, `CONTROL_COUNT`, `GAP_COUNT`, `EXCEPTION_COUNT`, `STATUS_GLYPH`,
  `STATUS_LABEL`, `FRAMES`, `FRAME_COUNT`, `frameNumberForId`, and types `ControlStatus`,
  `Cell`, `Frame` (`CoverFrame` | `PrinciplesFrame` | `MatrixFrame` | `ZoomFrame` |
  `EscalationFrame` | `ClosingFrame`). Component: **default export `ControlFramePage`**
  from `experiences/slide-decks/deck-ai-governance-and-controls/ControlFramePage.tsx` —
  a page, not a fill-driven template (no `SHIPPED_FILL` indirection).
- (b) Component root `data-testid`: **`live-control-frame`** (on `.cf-root`,
  ControlFramePage.tsx:416). Also notable: `control-matrix`, `frame-counter`,
  `frame-section`.
- (c) Mood: **no worldtemplate descriptor exists** (mood is a descriptor field). The world
  is **dark** by art direction — "near-black field", monochrome + single signal amber
  (file docblock and approval notes).
- (d) Slide count of this run's fill: **none authored** (blocked pre-skeleton). The
  shipped world has **8 frames** (`FRAME_COUNT`); the draft map above also lands on 8.

---

# ATTEMPT 2 (history — validated, then retired by the judge) — quarter (deck-quarterly-business-review), "The Quarter"

Coordinator redirect: precision-grid's live world-template is `quarter`
(experienceId `deck-quarterly-business-review`, grammarId `precision-grid` in both its
experience and worldtemplate manifests). Re-ran steps 3–6 with `pinTemplateId: "quarter"`,
same context and contentBrief. `mcp-outcome.json` holds both attempts.

## Intake record

- Surface: slide-deck (given) · Audience: mixed (engineers + design-minded PMs)
- Fidelity: CONDENSE — the 10-beat opendesign-intro arc folded into the template's 11
  fixed sections (each repeats 1..1; the slide count is the template's, not a choice)
- Pin: `quarter` · Context: businessIntent `[explain-design-system, enable-adoption]`,
  corporateSuitability `standard`, motionPreference 1 (template locks motionLevel 1, light)
- Reframe: the QBR anatomy is repurposed as a **design-platform programme review** of the
  OpenDesign estate at the July 2026 close ("JUL 2026"), declared openly in dataNotes[3]

## Slide map (kind — title/content — source beats)

1. title — COVER: "OpenDesign" / "JUL 2026 · One system, five surfaces" / lead "One
   system, five surfaces, 65 live worlds — craft in templates, content in fills, gates on
   everything." — beat 1 (the shipping specimen frame)
2. agenda — 5 numbered sections: The system / The estate / The routes / Quality / Outlook
   — the arc itself
3. summary — 4 sentences: doctrine, estate scale, three proof runs, the flag named
   verbatim — beats 3, 4, 6 merged
4. kpi — 65 live worlds · 5 surfaces · 0 certifier findings · 1 open critical
   (OFF-TRACK) + vs-plan table — beats 1, 5, 6
5. trend — live worlds by date, Jul 12 → Jul 21 (30 → 65) — beat 9 (timeline)
6. segment — worlds by surface 25/10/10/10/10, headline "Where the sixty-five worlds
   live." — beat 5 (estate)
7. winsLosses — wins: borrow pilot Jul 15, audit pilot Jul 18, compose sample Jul 19;
   losses: T-Minus mobile critical, descriptor cap drift, zones auto-router — beats 2, 6,
   7 (the three routes shown by their proof runs and honest misses)
8. pipeline — composability funnel: 65 live / 12 MCP templates / 8 deck templates /
   3 part-ID pilots — beats 5, 7 (division of labor as coverage)
9. risks — 4 real risks from GUIDANCE + run logs (T-Minus F1, cap drift, parallel
   sessions, CRLF smudge) — beat 6
10. priorities — close the critical, align caps with budgets, extend part-IDs, grow the
    template bench — beat 10 (the ask)
11. appendix — dataNotes: what is synthetic (interpolated trend midpoints, plan column),
    what traces, the reframe declaration — honesty layer

## Kept / cut

Kept: beats 1, 2, 5, 6, 7, 9, 10 fully; 3+4 (doctrine + handshake) compressed into
summary sentence 1 and agenda 01. Cut: beat 8 (lexicon) — no list-of-terms kind exists in
this template; terms appear in running copy instead. Also cut (as in the sibling runs):
environment gotchas beyond the two risk rows, git hygiene detail, certifier CLI
invocations, reading list.

## Honesty ledger

- Anomaly (exactly one): `1 CRITICAL OPEN — T-MINUS MOBILE F1` — the audit pilot's REAL
  catch (design-audit-pilot RUN-LOG, 2026-07-18: 375px viewport, scrollWidth ≈ 529px,
  template work on deck-product-launch, deliberately not hot-patched). Off-track KPI
  "Open critical findings" = 1 vs target 0; echoed verbatim in summary sentence 4.
- Notice: `PARTLY SYNTHETIC FIGURES — SEE DATA NOTES` on every footer rule; dataNotes[0]
  names the two synthetic elements: the trend's interpolated midpoints and the vs-plan
  "plan" column. Everything else traces: 65 worlds + 25/10/10/10/10 split (compiled
  registry experiences.json), 5 surfaces (GUIDANCE §1), 30+ (GUIDANCE §1), 12 templates /
  8 deck templates (world-templates.json + the attempt-1 error's own list), 3 pilots +
  Jul 15 (borrow-a-part.md), Jul 18 + 529px/375px (design-audit-pilot RUN-LOG), Jul 19 +
  round-one-clean + ten slides (opendesign-intro-sample RUN-LOG), 4 drifting slots
  (same RUN-LOG's template-work observations), Jul 12 (Control Frame approval date).
- No real company, customer, or revenue figure anywhere; no geometry authored.

## Validate loop (validate-outcome.json)

- Round 1: `valid: false`, 9 findings, all rule `renderBudget` — wins/losses notes and
  three risk mitigations exceeded the shipped magnitude ×1.25 budgets (78/72/98). Fixed
  exactly those nine slots, nothing else.
- Round 2: `valid: true`, 0 findings. **2 rounds of a 3-round budget.**
- Client-side lockstep: `FILL_SCHEMA` (QuarterFill Zod) safeParse OK before round 1 and
  after the round-1 edits (tsx import of quarter-fill.ts; catches refinements MCP's
  descriptor envelope does not, e.g. the exactly-one-off-track rule).
- fill.json is byte-for-byte the object that passed round 2.

## Fit note (honest)

Genuinely good bones, with seams: the KPI-with-one-flag, risks, priorities, and appendix
kinds hold the quality-loop content *better* than the diagram-first dgm templates did —
the honesty rules are native here. The trend and segment kinds took the timeline and
estate beats naturally (worlds-over-time, worlds-by-surface). The seams: "wins/losses"
and "pipeline" are sales vocabulary — the mapping to proof-runs/known-misses and the
templatization funnel is fair but the template's fixed row shape (deals / value /
coverage) forces terse, slightly coded cells ("borrowable", "1 niggle"); and the
title-bar tag renders "JUL 2026 · QBR" — template chrome that mislabels a programme
review as a QBR. Beat 8 (lexicon) has no home. Pinned score was only 2 (zero audience
overlap — the template targets executive/business, this brief says mixed), consistent
with precision-grid's own surfaceRule that decks are not its home turf. Verdict: the
strongest available precision-grid vehicle today, and an honest specimen — but a
templatized Control Frame would fit this content's governance register better.

## Scaffold facts (quarter world)

- (a) World dir: `experiences/slide-decks/deck-quarterly-business-review/`. Fill schema
  module: `experiences/slide-decks/deck-quarterly-business-review/quarter-fill.ts`
  (in-world import `./quarter-fill.js`) — exports `QuarterFill` (Zod object schema and
  the inferred `type QuarterFill`), `QUARTER_SECTIONS: SectionSpec[]`, certifier aliases
  `FILL_SCHEMA` (= QuarterFill) and `SECTIONS` (= QUARTER_SECTIONS), plus
  `QUARTER_GUIDANCE: string[]`. Template component: **default export `QuarterTemplate`**
  from `experiences/slide-decks/deck-quarterly-business-review/QuarterTemplate.tsx`,
  props `{ fill: QuarterFill }`. Shipped fill: `content.ts` exports `quarterFill` +
  alias `SHIPPED_FILL`; thin wrapper `QuarterPage.tsx` hands `quarterFill` to the
  template.
- (b) Component root `data-testid`: **`live-quarter`** (on `.q-root`,
  QuarterTemplate.tsx:638). Also: `summary-anomaly`, `kpi-anomaly`, `deck-section`,
  `quarter-counter`.
- (c) Mood: **light** (deck-quarterly-business-review.worldtemplate.manifest.ts:20,
  `mood: 'light'`; craft guarantee "the mood is locked light").
- (d) Slide count of this fill: **11** (title, agenda, summary, kpi, trend, segment,
  winsLosses, pipeline, risks, priorities, appendix — all sections repeat exactly once).

---

# ATTEMPT 2 postscript — the judge verdict that retired the quarter fill

The quarter fill validated (2 rounds) but the independent screenshot judge failed the
RENDER on honest-copy grounds this run's own fit note had flagged as a seam:
`QuarterTemplate.tsx` hardcodes the revenue conceit — line 426 titles the trend
"Revenue, N quarters." and lines 179/223/457 format values as "$NM" — so the fill's
world-counts (65 live worlds, 30→65 trend) rendered as dollar figures regardless of
content. That is a false statement of fact in pixels, unfixable content-side (fills may
not touch template TSX/CSS). Per the compose workflow, wrong template fit → back to
selection. The quarter fill text is preserved in mcp-outcome.json attempt2 history and
the section above; fill.json/validate-outcome.json were overwritten by attempt 3.
Template-work observation (reported, not patched): the quarter world hardcodes editorial
units in chrome — the same "descriptor validates what the render mislabels" class as the
dgm-circuit cap drift.

---

# ATTEMPT 3 (shipped) — cockpit (db-model-monitoring-cockpit), "The Cockpit"

precision-grid's other live world-template — its home surface (the grammar's own
surfaceRules name dashboards as primary). Pinned `cockpit` via `compose_dashboard`;
score 4 shown for transparency (audienceOverlap 0 + intentMatch 3 + corporateFit 1).

## Intake record

- Surface: dashboard · Audience: mixed · Pin: `cockpit`
- Context: businessIntent `[monitor-design-system-quality, communicate-adoption]`,
  corporateSuitability `standard`, motionPreference 1 (template locks motion 1, dark)
- Frame: an operations view of the OpenDesign estate — the template fleet under a
  drift watch. Contacts = the 12 MCP-published world-templates; sectors = the 5
  surfaces; the one breach = the REAL open critical (T-Minus, audit pilot Jul 18).
- Pre-authoring chrome check (the quarter lesson): the template hardcodes "PSI 30D" /
  "LIMIT" / "OWNER" / "LAST RETRAIN" watchlist headers and derives "<name> PSI" trend
  labels. Response: the radial metric IS authored as a synthetic PSI-style drift index
  (0–0.34 scale), declared in watch.dataNotice — no real figure is re-unit-ed by chrome;
  every real fact lives in authored-text slots (statement, log, register facts, KPIs).

## Section map (7 sections, each 1..1)

1. watch — chrome: "OPENDESIGN ESTATE COMMAND · QUALITY WATCH · EST. 2026", ENV GALLERY,
   PER COMMIT cadence, notice "SYNTHETIC DRIFT INDEX & TIMES · EVENTS TRACE TO RUN LOGS"
2. statement (TOP-VIEWPORT SPECIMEN FRAME) — kicker "THE OPENDESIGN ESTATE WATCH ·
   JUL 2026"; lines "Sixty-five worlds. Five surfaces. One doctrine." / "Twelve templates
   on the scope. Gates green." / "One deck is why this room is lit."; subline "TMINUS
   CROSSED F1 AT 375PX · SCROLLWIDTH 529PX · AUDIT 2026-07-18 · TEMPLATE WORK OPEN"
3. scope — thresholds 0.10 watch / 0.25 breach; caption names tminus past the limit and
   dgm-circuit + quarter on the watch band; encoding "RADIUS = DRIFT INDEX · SECTOR =
   SURFACE"
4. fleet — 5 surface sectors; 12 contacts = the 12 published templates, owner = each
   world's real grammarId, exactly one breach (tminus 0.31), two watch (dgm-circuit 0.16
   cap drift; quarter 0.14 hardcoded-conceit — this run's own finding), nine stable
5. dossier — tminus: 40 daily synthetic drift points (2026-06-12..07-21) first crossing
   0.25 on 2026-07-18 (the audit date); finding-class contributions (F1 overflow 0.19 the
   real one); register facts all real (529px, t-minus.css:153, remedy, not hot-patched)
6. log — 6 events newest-first, all real: judge returns quarter fill (Jul 21), estate at
   65 (Jul 21), compose clean (Jul 19), cap drift logged (Jul 19), audit catch (Jul 18,
   danger), borrow pilot ships (Jul 15)
7. instruments — Estate gauges: Live worlds 65 · Surfaces 5 · MCP templates 12 ·
   Certifier findings 0 · Open critical findings 1 (off-track)

## Honesty ledger

- Anomaly (exactly one breach): tminus — the audit pilot's real catch; echoed in the
  hero subline, the watchlist breach row, and the dossier.
- Synthetic and declared (watch.dataNotice + both chart source notes): the drift-index
  values themselves, the daily trend series, the finding-class decomposition weights,
  and log times-of-day. Real and traced: 65 worlds + 5 surfaces (registry), 12 templates
  and their ids (world-templates.json), each template's grammar owner (experience
  manifests), 0 certifier findings (GUIDANCE DoD), 1 open critical + 529px/375px +
  t-minus.css:153 (design-audit-pilot RUN-LOG), Jul 15/18/19 dates (run logs), cap-drift
  and judge events (opendesign-intro RUN-LOG + this run), certify date 2026-07-21 (main
  green at close per GUIDANCE).
- No geometry authored; scope layout is template-owned.

## Validate loop

- Client-side: per-slot cap assertion script (all OK) + CockpitFill Zod safeParse OK.
- MCP round 1: `valid: true`, 0 findings. **1 round of 3.**

## Fit note (honest)

The best fit of the three attempts by a distance — a dashboard is precision-grid's home
surface and the cockpit's anatomy maps almost 1:1: fleet-under-watch = template estate,
single-breach craft rule = the one real open critical, overnight log = the run-log
culture, gauges = the estate KPIs. Remaining seams, stated plainly: the "PSI 30D" and
"LAST RETRAIN" table headers are model-risk vocabulary applied to templates (the index
is declared synthetic, but the header words are template chrome we cannot re-label);
and the intro's narrative beats (COMPOSE flow walkthrough, lexicon, division-of-labor
diagram) compress into the statement + log rather than getting dedicated panels — this
is an operations view of the system, not a tour of it.

## Scaffold facts (cockpit world)

- (a) World dir: `experiences/dashboards/db-model-monitoring-cockpit/`. Fill schema
  module: `experiences/dashboards/db-model-monitoring-cockpit/cockpit-fill.ts` (in-world
  import `./cockpit-fill.js`) — exports `CockpitFill` (Zod object schema and the inferred
  `type CockpitFill`), `COCKPIT_SECTIONS: SectionSpec[]`, certifier aliases `FILL_SCHEMA`
  (= CockpitFill) and `SECTIONS` (= COCKPIT_SECTIONS), `COCKPIT_GUIDANCE: string[]`, and
  types `CockpitSector`, `CockpitFleetModel`, `CockpitContactStatus`. Template component:
  **default export `CockpitTemplate`** from
  `experiences/dashboards/db-model-monitoring-cockpit/CockpitTemplate.tsx`, props
  `{ fill: CockpitFill }` (imports the bespoke `DriftScope.tsx`). Thin wrapper:
  default export `CockpitPage` from `CockpitPage.tsx`.
- (b) Component root `data-testid`: **`live-cockpit`** (CockpitTemplate.tsx:254). Also:
  `watch-clock`, `fleet-watchlist`.
- (c) Mood: **dark** (locked; worldtemplate descriptor + craft guarantee "the mood is
  locked dark").
- (d) Sections: 7 (watch, statement, scope, fleet, dossier, log, instruments).
