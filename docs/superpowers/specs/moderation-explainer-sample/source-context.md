# Moderation-stack explainer — source context + run log (experience-composer skill)

Five-surface quality test, the **TECHNICAL-EXPLAINER** sample. Skill run authored
CONTENT ONLY into the shipped "The Drawing Office" world-template
(`exp-system-architecture`), which carries the whole craft. Sources fetched and
distilled 2026-07-15.

## Sources

1. DesignGurus — "System Design Case Study: How to Design a Real-Time AI Content
   Moderation System at Scale":
   https://designgurus.substack.com/p/system-design-case-study-how-to-design-7c1
2. "QUEST: Queue Simulation for Content Moderation at Scale" (arXiv 2103.16816):
   https://arxiv.org/pdf/2103.16816 — the human review queue as the constrained,
   priority-scheduled resource.

The **pattern** is real and publicly documented; every capacity/latency **figure**
in the fill is SYNTHETIC ILLUSTRATIVE (not a measurement), covered by
`sheet.dataNotice` and `figure.source`.

### Distilled pattern facts (all fill content traces here)

- A real-time content-moderation decisioning stack is a staged pipeline: user
  reports + a content stream enter at a public edge; events are mirrored to a
  firehose and materialised as signals; a classifier serving fleet (loading signed
  artefacts from a model registry) scores each item; a policy/rules engine turns
  scores into an enforcement decision (allow / remove / escalate); the decision is
  written to an append-only enforcement log; a quality/drift watch samples the log;
  and borderline / appealed / sampled items land in a human review queue.
- Decision engine combines classifier score with context (account history, reach,
  policy) against per-category thresholds: high confidence → auto-action, medium →
  human review, low → allow.
- **The human review queue is the classic constraint.** Automation scales with
  hardware; human reviewers do not. Review value is severity-aware and priority-
  scheduled (QUEST); when report volume rises the queue is where backlog and SLA
  breach appear first. This is the honest, documented bottleneck — chosen as the
  template's single `constrained` part.

## Intake answers (Phase 1)

| Question | Answer | Basis |
| --- | --- | --- |
| Surface | **technical-explainer** (given) | Five-surface test assignment |
| Audience | **Engineers** | Architecture onboarding / review readers |
| Technical depth | **Architectural** | As-built general arrangement; parts, connections, budgets |
| Fidelity | Condense-to-fit | Pattern → one fixed-slot sheet; arc over completeness |
| Style / mood | Art-directed / **light** | Inherited from the drawing-office world-template manifest |

## Phase 2 — template selection

Only TECHNICAL-EXPLAINER world-template available and a 1:1 fit: a staged
system-architecture pattern maps onto the drawing-office fixed-slot topology. No
override needed. The template is FIXED-SLOT — the fill relabels a pinned drawing;
it cannot change structure. The mapping below was verified BEFORE authoring.

## Topology mapping check (pinned id → claimed system part)

Every pinned node and edge is claimed by a real part of the documented pattern; no
pin is invented-to-fill, no real part is dropped. Edge `from`/`to` endpoints are
template-fixed and were NOT changed — only relabelled.

### Nodes (10/10)

| Pinned id | kind | Claimed system part |
| --- | --- | --- |
| edge-gateway | start | Content intake gateway (public edge: reports + content stream in) |
| decision-api | process | Moderation decision API (assembles a classify request) |
| stream-ingest | data | Content event firehose (mirrors intake events) |
| feature-store | data | Signal store (features, hashes, account/reporter signals) |
| model-serving | process | Classifier serving fleet (evaluates champion models) |
| policy-engine | decision | Policy & rules engine (score → enforcement decision) |
| decision-log | data | Enforcement log (append-only decision record) |
| drift-watch | process | Quality & drift watch (samples the log) |
| model-registry | data | Classifier registry (signed artefacts serving loads from) |
| **case-review** | end | **Human review queue — the `constrained` part** |

### Edges (10/10) — endpoints fixed, labels only

| Pinned id | from → to (fixed) | Claimed connection |
| --- | --- | --- |
| e-edge-api | edge-gateway → decision-api | intake traffic |
| e-edge-ingest | edge-gateway → stream-ingest | event mirror to the firehose |
| e-ingest-fs | stream-ingest → feature-store | signals materialised (5 s lag) |
| e-api-serving | decision-api → model-serving | classify request |
| e-fs-serving | feature-store → model-serving | signal read (≤ 15 ms p50) |
| e-registry-serving | model-registry → model-serving | signed classifiers deployed |
| e-serving-policy | model-serving → policy-engine | classifier scores |
| e-policy-log | policy-engine → decision-log | action + rationale |
| e-log-drift | decision-log → drift-watch | sampled windows |
| e-drift-case | drift-watch → case-review | escalations to the review queue |

### Zones (3/3) & dimensions (2/2)

| Pinned id | Claimed |
| --- | --- |
| channel-dmz | Intake edge — public ingest |
| core-zone | Restricted decisioning core (NOTE 1: trust boundary) |
| oversight | Oversight — review-desk cadence |
| hot-path (dim) | Hot path ≤ 220 ms p99, intake to action |
| durable-record (dim) | Action to enforcement log ≤ 300 ms p99 |

**Constraint choice:** `case-review` (human review queue) carries the single
`emphasis: 'constrained'`. Coherence across slots: NOTE 3 (critical) = queue at
86% of rated throughput; FIG 4.1's only sub-floor tier = "Human review queue" at
14% headroom (floor 25%); narrative §04 (`hostsFigure: true`) tells the review-
capacity story; Revision B hold point tracks added reviewer capacity.

## Section map (fixed-slot → content)

| Section kind | Content |
| --- | --- |
| sheet | TS-ARCH-007 title block, revision table (P1/P2/A), synthetic dataNotice |
| masthead | "Moderation is a promise about what stays up." + lede |
| drawing | 10 relabelled parts, 10 connections, 3 zones, 2 dimension budgets, NOTE 3 flag |
| notes | 4 general notes; NOTE 3 critical (review-queue constraint) |
| narrative | 01 Context · 02 Decision path · 03 Signals & models · **04 Review capacity (hostsFigure)** · 05 Failure modes |
| figure | FIG 4.1 — review & decision headroom by stage; 6 tiers; review queue sub-floor |

## Honesty ledger

- **Real (pattern):** the staged pipeline, the score→policy→log→watch→review flow,
  the auto-action / human-review / allow threshold split, and the human review
  queue being the constrained resource — all from the two public sources.
- **Constraint (honest, documented):** the human review queue is the true
  bottleneck of this pattern (review capacity vs. report volume), not a
  decorative anomaly.
- **Synthetic — covered by `SYNTHETIC ILLUSTRATIVE DATA · FIGURES ARE NOT
  MEASUREMENTS` (dataNotice) and the FIG 4.1 source note:** all latency budgets
  (220 ms / 300 ms / 15 ms / 5 s lag), the 86% throughput / Q3 SLA figures, the
  headroom percentages and 25% floor, retention windows, drawing/record numbers,
  and the drawn/checked names. No real person, org, or measurement is asserted.
