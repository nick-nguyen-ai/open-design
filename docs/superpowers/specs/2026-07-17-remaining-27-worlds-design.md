# The remaining 27 worlds — design matrix

Goal: every catalogue specification becomes a LIVE world. After this batch the
gallery has **65/65 live templates** — no more "Catalogue specification" plates.

## Ground rules

- **Precedent**: batch-2 deck pattern — each world ships as a live art-directed
  page (`<Name>Page.tsx` + `content.ts` + `<name>.css`), NOT (yet) an MCP
  world-template. Templatization stays a later, per-world decision via the
  scaffolder + certifier, so the locked canonical-brief steering matrix is
  untouched by this batch.
- **Borrow contract from day one**: every world carries 5–15 `data-part-id`
  anchors (`<experienceId>/<section>[/<part>]`), registered in
  `LivePartIds.test.tsx` `PART_ID_WORLDS`. The static scan
  (`part-ids-static.test.ts`) covers them automatically.
- **The approved manifest is the brief**: each world honors its shipped
  `grammarId`, `density`, `motionLevel`, `signatureSequence`, audiences, and
  corporate register. The manifest is not edited to fit the design; the design
  serves the manifest.
- **Diversity is the point**: no two worlds share a place-metaphor, and each
  surface mixes expressive worlds with deliberately plain, print-calm ones for
  non-technical and old-school readers (marked SIMPLE below).
- Synthetic-data provenance notice on every world. Reduced motion honored
  (`useMotionPreference`). Locked mood per world; moods balanced per surface.
- Wiring checklist per world: `LIVE_EXPERIENCE_IDS` → `LIVE_PAGES` (mood) →
  `PART_ID_WORLDS` → LiveWorlds batch smoke test → `shoot-previews.mjs`
  `LIVE_IDS` → committed `public/previews/<id>.jpg`.

## Dashboards (9)

| World | Place | Mood | Design commitment |
|---|---|---|---|
| db-ai-risk-command-centre | **The Morning Brief** | light | A bank-boardroom risk brief printed before the market opens: one monumental serif posture statement ("Contained."), then a calm ledger of risk domains that each unfold to model-level evidence. calm-command · ledger-reveal. SIMPLE |
| db-delivery-control-tower | **The Departures Board** | dark | Programme workstreams as flights on a split-flap departures board — ON TIME / DELAYED / HOLDING — over layered signal-glass panels; blockers are ground stops. signal-glass · horizon-sweep |
| db-regulatory-control-hub | **The Registry** | light | A supervisory filing hall: the control posture headlined in monumental figures (247/251 EFFECTIVE), backed by a precision grid of control families like a filing index, evidence one level down. precision-grid · ledger-reveal. SIMPLE |
| db-data-quality-operations | **The Water Works** | light | Pipelines as an as-built utility schematic; quality incidents are red-line markups pinned to the exact junction that failed, routed to the accountable owner's stamp. technical-blueprint · data-ink-draw |
| db-dependency-network-explorer | **The Interchange** | dark | A transit-authority network map at night: domains are lines, services are stations; selecting a station opens its dossier side panel with blast-radius trace. spatial-canvas · horizon-sweep |
| db-experiment-analysis-workspace | **The Lab Bench** | light | A gridded lab notebook held to publication standard: hypothesis cards taped in, run tables, SUPPORTED/REFUTED evidence stamps, lineage from hypothesis to verdict. research-notebook · data-ink-draw |
| db-incident-remediation-centre | **The Triage Bay** | dark | A ward monitor for incidents: each incident a patient with vitals and a treatment path through triage → containment → remediation → review lanes; one critical case lit. living-system · data-ink-draw |
| db-portfolio-performance-explorer | **The Long Read** | light | Portfolio performance as a magazine feature: pull-quote numbers, inline figures, a guided argument from headline to drivers — explains *why* it moved. executive-editorial · horizon-sweep. SIMPLE |
| db-scenario-stress-simulator | **The Wind Tunnel** | dark | Stress scenarios as instrumented test runs side by side; driver traces show which inputs actually move the outcome; amber instrumentation on dark. kinetic-intelligence · data-ink-draw |

## Technical explainers (9)

| World | Place | Mood | Design commitment |
|---|---|---|---|
| exp-api-integration-contract | **The Counterparty Agreement** | light | The API contract typeset as a bilateral agreement: numbered clauses, endpoint schedules as annexes, error-handling as remedies, version history as amendments, signature block. precision-grid · ledger-reveal. SIMPLE |
| exp-architecture-decision-record | **The Minute Book** | light | The decision as board minutes: context read into the record, options considered (rejected ones struck through, legibly), the resolution, and consequences minuted with owners. executive-editorial · ledger-reveal. SIMPLE |
| exp-coding-agent-implementation-plan | **The Work Order** | light | A manufacturing traveler: tasks as numbered operations with acceptance criteria, QA stamp boxes, and routing — exact enough that the agent and the reviewer read the same card. precision-grid · ledger-reveal |
| exp-agent-workflow | **The Signal Box** | dark | A railway interlocking diagram: agent states are track blocks, transitions are switches, a live token walks the route; the lever frame lists guards per transition. living-system · data-ink-draw |
| exp-algorithm-explanation | **The Assembly Line** | light | The algorithm as a workshop line: the same work-piece (real data) shown entering and leaving every station, so each transformation is visible before the next begins. kinetic-intelligence · data-ink-draw |
| exp-data-lineage-map | **The River Atlas** | light | Lineage as a watershed atlas plate: sources are springs, transforms are locks and confluences, consumption is the delta; every reach navigable, provenance answered by tracing upstream. spatial-canvas · horizon-sweep |
| exp-incident-postmortem | **The Inquiry** | light | An accident-investigation dossier: the flight-recorder timeline trace, numbered findings, a causal chain exhibit, and an action register — every claim attributable. research-notebook · horizon-sweep |
| exp-migration-plan | **The Lock Sequence** | dark | The migration as a canal lock sequence lifting the system from current to target elevation, chamber by chamber; rollback points are drain gates on each chamber. technical-blueprint · horizon-sweep |
| exp-testing-validation-strategy | **The Test Stand** | dark | Coverage as layered glass panes — unit, integration, validation — each pane inspectable with its own evidence readout; claims are lit only where evidence exists. signal-glass · horizon-sweep |

## Project pages (9)

| World | Place | Mood | Design commitment |
|---|---|---|---|
| proj-enterprise-transformation-programme | **The Annual Report** | light | The transformation as an audited annual report: chairman's-letter narrative, committed outcomes as line-item statements with variance, benefits realisation as notes to the accounts. executive-editorial · horizon-sweep. SIMPLE |
| proj-operating-model-redesign | **The Charter** | light | The new operating model as articles of a charter: each decision an article with rationale and a transition seal (IN FORCE / TRANSITIONING), read calmly, never re-litigated. calm-command · ledger-reveal. SIMPLE |
| proj-regulatory-remediation-programme | **The Undertakings Register** | light | Every commitment a numbered undertaking against its regulator deadline; status lozenges with zero ambiguity, evidence line per undertaking, on-time record charted. calm-command · ledger-reveal. SIMPLE |
| proj-cloud-migration-programme | **The Slipway** | dark | A shipyard board: workloads are vessels moving dry dock → slipway → open water, dependency lines are mooring ropes; cutover risk read per vessel. technical-blueprint · data-ink-draw |
| proj-data-modernisation-programme | **The Town Plan** | light | The target data estate as an urban masterplan: domains are districts, sequencing is construction phasing on the plan, progress is district-by-district occupancy. spatial-canvas · horizon-sweep |
| proj-platform-product-launch | **The Marquee** | dark | Opening night: the launch statement in marquee-scale type with warm bulb glow; behind the curtain, the readiness checklist and workstream call sheet. monumental-type · horizon-sweep |
| proj-model-lifecycle-workspace | **The Foundry** | dark | Models as castings moving through the foundry — pattern shop (develop), proof house (validate), production floor (deploy), archive (retire) — each transition stamped. living-system · data-ink-draw |
| proj-research-innovation-initiative | **The Bet Book** | light | Research bets as a shared betting book: each bet a spread with the hypothesis, the stake, evidence entries as they land, and the next experiment on the slip. research-notebook · data-ink-draw |
| proj-vendor-assessment | **The Weighing Room** | light | Vendor decision as a weighing room: risk, commercial, and technical lenses as acetate overlays on the same vendors; no single lens may dominate — the balance is the interface. signal-glass · horizon-sweep |

Moods: dashboards 5L/4D, explainers 6L/3D, project pages 6L/3D → 17 light / 10 dark.

## Quality bar (per world, before its batch commits)

1. Distinct at a glance from every other world in its surface (preview strip check).
2. Composed, legible, and information-true at 1280×800 (the preview crop) and at full height.
3. Locked mood, provenance notice, reduced-motion clean, axe-clean on landing view.
4. Part IDs read as a borrower's menu: section roots + the 1–3 genuinely covetable parts.
