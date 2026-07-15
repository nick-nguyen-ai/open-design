# GitLab Q1 FY27 QBR — sample run source context (experience-composer, Task 12 sample 1/5)

**Surface:** slide-deck · **Run date:** 2026-07-15 · **Autonomous run** (controller executes the skill; intake answers recorded below)

## Sources (public)

- GitLab Q1 FY2027 earnings release, June 2, 2026 — stocktitan.net/news/GTLB/git-lab-reports-first-quarter-fiscal-year-2027-financial-fjep546esip5.html
- GitLab Q1 FY2027 earnings call transcript (Motley Fool, June 3, 2026) — fool.com/earnings/call-transcripts/2026/06/03/gitlab-gtlb-q1-2027-earnings-transcript/
- GitLab Q4/FY2026 results + initial FY27 outlook (March 3, 2026) — ir.gitlab.com + finance.yahoo.com summaries
- GitLab 10-Q (quarter ended 2026-04-30) revenue disaggregation via stocktitan/yahoo summaries

## Source facts used

- Q1 FY27 (ended 2026-04-30): revenue **$264.2M, +23% YoY** (Q1 FY26: $214.5M); subscription $239.3M; non-GAAP operating margin **14%** (prior year 12%); GAAP margin (6)%; adjusted FCF $146.7M; operating cash flow $149.2M.
- Customers: **1,519 at $100K+ ARR (+18% YoY)**; 10,831 at $5K+ (+7%); **NRR 117%**; total RPO $1.1B (+18%); **cRPO $724.1M (+24%)**.
- Guidance: initial Q1 revenue outlook ~**$256.4M** (March 3 outlook); Q1 beat guidance by ~4 points. Q2 FY27 guide **$272–274M**; FY27 guide raised to **$1,112–1,118M** (initial $1,099–1,118M); FY27 non-GAAP op income $135–141M (initial $129–137M).
- Restructuring: **14% workforce reduction** (~350 people), exit 22 countries; $30–35M pre-tax charges, ~$19M in Q2.
- The negative line: **self-managed subscription revenue flat QoQ for the first time since IPO**; price-sensitive cohort (~20% of ARR) under pressure; "more seat contraction than anticipated" (layoffs + M&A); gross retention above 90% but pressured.
- AI: Duo Agent Platform paid consumption run rate ≈ **$20M** in first full quarter; DAP attached to 4 of top-10 deals; Ultimate = 57% of ARR; code pushes +49% YoY; new logo growth +30%; highest first-order count in 10 quarters.
- Named wins (from the earnings call): **Zillow Group** (2,000+ engineers to Dedicated, DAP pilot), **CSL Limited** (multiyear Ultimate + DAP), a **top-10 US bank** (DAP pilot, 1.5h saved per developer task).
- Revenue history: Q4 FY25 $211.4M; FY26 quarterly $214.5M / $236.0M / [Q3 derived: $244.3M = $955.2M FY26 total − other three] / $260.4M.
- Segments (10-Q disaggregation): self-managed subscription **$151.1M**, SaaS **$88.2M**, license & other **$24.9M**.
- CEO Bill Staples: "The agentic era is creating structural tailwinds for GitLab." / "The opportunity ahead is massive and speed matters."

## Intake answers (recorded)

| Question | Answer |
|---|---|
| Fidelity | Condense — an earnings pack distilled to an 11-slide QBR |
| Audience | Executive |
| Technical depth | Financial/business level; product metrics only where they explain the numbers |
| Timing | ~10-minute board read |
| Style | Conventional (deliberately PowerPoint-familiar QBR anatomy) |
| Surface | Given: slide deck |

## Compose

Context: `{surface:'slide-deck', audience:['executive'], businessIntent:['review-quarterly-performance','report-financial-results'], corporateSuitability:'restricted', motionPreference:1, styleHint:'conventional'}`; brief: GitLab's Q1 FY27 quarter in review — beat and raise, with one honest flag. Expected selection: **quarter** (The Quarter, deck-quarterly-business-review). Scripted outcome: `apps/mcp-server/src/gitlab-qbr-outcome.ts` (fallback path per skill Phase 0).

## Narrative map (recorded outline, autonomous run)

1. title — cover: GitLab Q1 FY27, lead names the through-line (beat + first flat self-managed quarter)
2. agenda — 5 sections
3. summary — 4 sentences; sentence 3 names the flag (anomaly = SELF-MANAGED FLAT QOQ — FIRST SINCE IPO)
4. kpi — revenue / non-GAAP margin / $100K+ customers / self-managed QoQ (flagged); vs-plan table vs March outlook
5. trend — 6 quarters of revenue, $M
6. segment — self-managed sub / SaaS / license & other (real 10-Q split; no plan targets — not disclosed)
7. winsLosses — 3 real named wins vs 3 honest pressure lines
8. pipeline — ILLUSTRATIVE (GitLab does not disclose pipeline); declared in notice + note + dataNotes
9. risks — cohort contraction / restructuring execution / AI competition
10. priorities — DAP scale, restructuring landing, self-managed stabilisation, enterprise expansion
11. appendix — dataNotes (provenance, Q3 derivation, guidance basis)

Kept/cut: cut GAAP net loss detail, FCF/OCF detail (margin tile carries profitability), $5K cohort, RPO total (cRPO kept in vs-plan). Honesty ledger: every figure real from filings EXCEPT the pipeline table (illustrative, declared three times); Q3 FY26 derived; plan column uses the initial March outlook.
