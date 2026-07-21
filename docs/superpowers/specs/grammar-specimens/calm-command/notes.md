# grammar-specimen compose run — calm-command — 2026-07-21

Route: open-design COMPOSE (dashboard) · Outcome: **BLOCKED — no calm-command world-template exists; no fill authored.**
Evidence: `mcp-outcome.json` (the one compose call, verbatim error). No `fill.json` / `validate-outcome.json` — there was
no skeleton to author against, and fabricating a validate run against the wrong template would violate the honesty rule.

## Intake record

- Source content: `GUIDANCE.md`, `docs/borrow-a-part.md`, `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`,
  `docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md` (the 10-beat sibling-deck narrative) — all read in full.
- Framing: honest OPERATIONS VIEW of the OpenDesign system itself (65 live worlds, 5 surfaces, quality-gate pass rates,
  audit findings, compose-run activity); synthetic series to be declared in the notice slot.
- Target per the brief and the plan (`docs/superpowers/plans/2026-07-21-grammar-tab-specimens.md`, Task 6):
  pin `db-ai-risk-command-centre`, the grammar's strongest-surface world.
- Fill-authoring reference read; slot discipline / honesty rules / one-real-anomaly / no-geometry all accepted as binding.

## What happened

`compose_dashboard` with `pinTemplateId: "db-ai-risk-command-centre"` returned **UNKNOWN_TEMPLATE**:
"not a live dashboard template. Live dashboard templates: cockpit (db-model-monitoring-cockpit)."

Verified against source (not just the registry, which could have been stale):

- `experiences/dashboards/db-ai-risk-command-centre/` contains only `MorningBriefPage.tsx`, `content.ts`,
  `morning-brief.css`, and the experience manifest. **No `*.worldtemplate.manifest.ts`, no fill schema
  (`FILL_SCHEMA`/`SECTIONS`), no extracted `*Template.tsx`.** It is a hand-built shipped world, not a template.
- Repo-wide, exactly 12 `*.worldtemplate.manifest.ts` files exist; the only dashboard one is
  `db-model-monitoring-cockpit` (template id `cockpit`), grammar **precision-grid**.
- No world-template on ANY surface carries `grammarId: 'calm-command'`. The grammar's four example worlds
  (`db-ai-risk-command-centre`, `home-mentoring-tutorial-hub`, `proj-operating-model-redesign`,
  `proj-regulatory-remediation-programme`) are all non-templatized.

## Why no workaround was taken

- **Composing on `cockpit` (the only dashboard template) was rejected**: its grammar is precision-grid. The bake-off's
  entire point is per-grammar pixels; shipping precision-grid pixels as the calm-command specimen would falsify the
  comparison. Honesty rule > completion.
- **Templatizing `db-ai-risk-command-centre` is template work** (extract Template.tsx, author FILL_SCHEMA + SECTIONS +
  descriptor, certify, parity oracles) — explicitly out of scope for a compose run (GUIDANCE §1 doctrine: "A design flaw
  found mid-run is template work: stop, report") and outside this run's write boundary (evidence dir only).
- The plan itself anticipated this exact case (Task 6, calm-command row): *"if the compose route cannot target the
  grammar, leave the example fallback and flag in the run log."* This note is that flag. The gallery's
  `GrammarSpecimen` fallback (first example screenshot: `db-ai-risk-command-centre`) keeps the card image-bearing —
  and that fallback IS genuine calm-command pixels (The Morning Brief), so the tab stays honest without a specimen jpg.

## Section map / kept-cut list

Not applicable — no skeleton was returned, so no sections were authored. The planned mapping (for whoever templatizes
the world) was: KPI row — 65 live worlds · 5 surfaces · quality-gate pass rate (synthetic) · open findings (1 minor,
per audit pilot after the critical is template work); trend panel — compose/borrow/audit run activity (synthetic,
anchored to Jul 15 / Jul 18 / Jul 19 real run dates); breakdown — worlds per surface; status/anomaly — the REAL
validate_fill transport issue from `opendesign-intro-sample/RUN-LOG.md` (harness serialized `fill` as a string →
"(root) Fill must be an object" → domain-function fallback) as the single flagged anomaly; notice — synthetic/illustrative
declaration covering every invented series.

## Fit note (honest)

Content-to-surface fit was never the problem — an operations view of the design system maps naturally onto a
calm-command risk dashboard (hero posture statement = estate health, ledger rows = surfaces, one anomaly = the
transport tension). The blocker is purely contractual: the grammar has zero composable templates. Fit of the fallback:
the example screenshot shown in the gallery is authentic calm-command craft, but it renders the world's own shipped
content (fictional "Meridian Group" bank brief), NOT the shared bake-off content — so calm-command remains the one
grammar where the comparison content differs. Templatizing The Morning Brief is the fix.

## Scaffold facts (as found — recorded for the eventual templatization)

- **World directory:** `experiences/dashboards/db-ai-risk-command-centre/`
- **Fill schema:** none exists. `content.ts` exports typed shipped content (interfaces such as `BriefFigure`,
  `AppetiteState`, `ActionState`) but no `FILL_SCHEMA`/`SECTIONS` and there is no `<id>-fill.ts`.
- **Template component:** none extracted. The page is `MorningBriefPage.tsx` (default export `MorningBriefPage`),
  craft and content wiring in one file plus `morning-brief.css`.
- **Root `data-testid`:** `live-morning-brief` (on `.mb-root`).
- **Mood:** locked **light** — warm paper broadsheet (`--mb-paper: #f7f4ec`, ink `#211d15`), per the file docstring
  ("motion level 1; locked light") and the CSS. No worldtemplate descriptor exists to carry a `mood` field.
- **Grammar manifest:** `packages/registry/data/grammars/calm-command.grammar.manifest.ts` (surfaceRules confirm
  dashboards are the grammar's primary home; signature `ledger-reveal`, motion ceiling level 1).
