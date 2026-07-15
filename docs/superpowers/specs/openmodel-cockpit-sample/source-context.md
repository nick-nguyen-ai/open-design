# Openmodel Cockpit — source context + run log (experience-composer skill)

Five-surface quality test, DASHBOARD surface. The Cockpit world-template
(`db-model-monitoring-cockpit`) composed via `compose_dashboard`; CONTENT ONLY
authored against `CockpitFill`. Story: an ML-platform team's overnight drift
watch over the fleet of OPEN-WEIGHT models they serve in production.

## Sources

Model NAMES and their open-weight licences are real, public releases (drawn from
the assistant's knowledge; all shipped and widely deployed by early 2026). ALL
drift metrics are synthetic illustrative.

| # | Model | Real fact used |
| --- | --- | --- |
| 1 | Llama 3.3 70B | Meta open-weight instruct model |
| 2 | Qwen2.5-72B | Alibaba Qwen2.5 open-weight |
| 3 | Mistral Small 3 | Mistral open-weight (Apache-2.0) |
| 4 | Qwen2.5-Coder-32B | Alibaba code model; the 32B-Instruct is Apache-2.0 (the breaching model) |
| 5 | DeepSeek-V3 | DeepSeek open-weight MoE |
| 6 | Mixtral 8x22B | Mistral open-weight MoE (Apache-2.0) |
| 7 | Gemma 2 27B | Google open-weight |
| 8 | Phi-4 | Microsoft open-weight (MIT) |
| 9 | BGE-M3 | BAAI open-weight embedding model |
| 10 | Nomic Embed v1.5 | Nomic open-weight embedding model (Apache-2.0) |

Only ONE license is asserted on the page (the breaching model's register entry:
`OPEN-WEIGHT · APACHE-2.0 · HF: Qwen/Qwen2.5-Coder-32B`) — the 32B-Instruct
Coder model is Apache-2.0. Every other model appears by name + synthetic metric
only; no per-model license claim is printed.

## Intake answers (Phase 1)

| Question | Answer | Basis |
| --- | --- | --- |
| Fidelity | **n/a — dashboard** | A live-monitoring surface, not a source-condensing narrative |
| Audience | **Engineering leadership** | ML-platform / SRE decision-makers reading a night watch |
| Depth | **Metric-level** | Per-model PSI, thresholds, feature contributions, incident log |
| Style | **Art-directed** | Given by the world (mood dark, grammar precision-grid) |
| Surface | **Dashboard** | Given — Cockpit world-template via compose_dashboard |

## Phase 2 — compose

Context: `{ surface: dashboard, audience: [technical, risk-and-governance],
businessIntent: [monitor-model-health, detect-drift-early], style: art-directed,
mood: dark }`. Selected: **cockpit / db-model-monitoring-cockpit** — a model-drift
night-watch brief is the template's home ground; strong fit, no override.

## Section map (one line per section — the facts it carries)

| Section | Kind | Carries |
| --- | --- | --- |
| watch | chrome | Command line, PROD env, 30s cadence, 03:12:47 UTC clock, required provenance notice, keyboard hint |
| statement | hero | 10 models / 9 in envelope / the 10th (code desk) past its limit; breach subline |
| scope + thresholds | instrument | Watch 0.10, breach 0.25; accessible caption naming Qwen2.5-Coder-32B at PSI 0.291; encoding legend |
| fleet | watchlist | 4 deployment sectors (chat/code/batch/embeddings); 10 models with sector, PSI, status, owner, last refresh; exactly one breach |
| dossier | breach dossier | 90-day PSI trend crossing 0.25 on 2026-07-13; 6 feature drivers (sum = 0.291 composite); 11 register facts incl. root cause |
| log | incident feed | 6 overnight events, newest first, matching the breach story (persist → root cause → retrain queued) |
| instruments | gauges | 4 fleet KPIs: models in envelope 9/10, overnight alerts 4, p99 214ms, GPU util 71.6% |

## Internal consistency (numbers that must agree)

- Fleet size **10** = models array length; stated in statement, scope caption,
  fleet bandSub ("10 CONTACTS"), table caption, and the "10/10 reporting" log.
- **4** deployment sectors = sectors array length; stated in scope caption.
- Breaching model **Qwen2.5-Coder-32B** PSI **0.291**: fleet table = scope
  caption = dossier trend endpoint (2026-07-14) = "PSI 0.291" log line.
- Status split: 1 breach + 3 watch (Qwen2.5-72B, DeepSeek-V3, Gemma 2 27B) + 6
  stable. "Models in envelope" **9** (= not-breach) with target 10; statement
  "Nine sit inside their drift envelopes"; "Overnight alerts" **4** (watch+breach).
- Breach timeline: crossed 0.250 on the daily window at **2026-07-13**; declared
  22:40 (subline "22:40 MON", register "2026-07-13 22:40"); **29 H in breach** as
  of the 03:12 watch (subline, scope callout); SLA 72 H → **43 H remaining**
  (72 − 29).
- Feature contributions sum to the composite PSI: 0.079 + 0.068 + 0.054 + 0.041
  + 0.033 + 0.016 = **0.291**.

## Honesty ledger

- **Real:** the ten model names; the one printed license (Qwen2.5-Coder-32B
  Apache-2.0). Nothing else on the page is claimed as measured.
- **Synthetic illustrative (declared):** every PSI value, both thresholds, the
  90-day trend series, all six feature contributions, the incident log, the four
  gauges, owners, serving config, dates, and clock. Declared in
  `watch.dataNotice` = `REAL MODEL NAMES · SYNTHETIC DRIFT METRICS —
  ILLUSTRATIVE` (printed in hero + footer) and echoed in both chart source notes
  (`Real model, synthetic metrics — illustrative.`).
- **Flagged anomaly (required, exactly one):** Qwen2.5-Coder-32B in breach —
  presented as a plausible operational drift (an upstream agent-harness revision
  changed the prompt mix on the code desk: longer prompts, deeper multi-turn, a
  Rust-request surge), not decoration. The whole dossier and log tell its story.
