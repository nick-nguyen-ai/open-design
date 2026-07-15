# Agent-Evals Ledger — source context (experience-composer, PROJECT-PAGE sample)

Authoring run for the five-surface MCP quality test. Surface is GIVEN
(project-page); the world-template is `proj-ai-model-validation-hub` ("The
Validation Ledger"), the only PROJECT-PAGE world in the catalogue. This sample
re-fills that template's fixed-slot pipeline with a fresh story — an AGENT
EVALUATION PROGRAMME — that maps honestly onto the pinned four-stage anatomy.
Sources fetched 2026-07-15.

## Sources (methodology grounding — real; cited for the anatomy, not the numbers)

1. NIST AI RMF 1.0 + Generative AI Profile (NIST AI 600-1, 2024-07-26) — the
   GOVERN / MAP / MEASURE / MANAGE loop and the "Measure" function's internal
   evaluation + external red-teaming of GenAI systems (prompt injection, data
   leakage, content safety).
   https://www.nist.gov/itl/ai-risk-management-framework
   (Gen-AI profile PDF: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
2. Bank of England / PRA SS1/23 — Model Risk Management Principles for banks:
   Principle 1 model tiering (rigour commensurate with tier), Principle 4
   INDEPENDENT validation (review independent of development; initial +
   periodic). Applied by analogy to agentic AI put through pre-production
   evaluation.
   https://www.bankofengland.co.uk/prudential-regulation/publication/2023/may/model-risk-management-principles-for-banks-ss
3. OWASP Top 10 for LLM Applications (2025) — LLM01 Prompt Injection ranked #1;
   distinction between DIRECT and INDIRECT injection (instructions planted in
   ingested content: poisoned PDFs, tickets, documents); defence-in-depth,
   least-privilege tooling, human approval for high-risk actions, regular
   adversarial testing. This grounds the stalled agent's failure pattern.
   https://owasp.org/www-project-top-10-for-large-language-model-applications/
4. Public agent-eval frameworks/benchmarks named as the challenge-stage harness:
   SWE-bench / SWE-bench Verified (autonomous issue resolution), AgentBench
   (LLM-as-agent capability), AgentDojo (resilience against prompt-injection
   attacks). Cited as the KIND of eval the programme runs; no benchmark scores
   are reproduced.
   https://www.swebench.com/  ·  https://github.com/THUDM/AgentBench  ·  https://agentdojo.spylab.ai/

Methodology (loop, independent validation, tiering, red-team + capability evals,
indirect prompt injection) is REAL and traces to the four sources above. All
programme CONTENTS — agent names, dates, throughput counts, findings counts, the
stalled item — are SYNTHETIC ILLUSTRATIVE. Agent names are deliberately
internal-style (`dispute-resolution-agent`, `kyc-refresh-agent`, …); none is a
real product. `office.editionLine` and both chart source-notes declare the
synthetic provenance plainly.

## Intake answers (Phase 1)

| Question | Answer | Basis |
| --- | --- | --- |
| Surface | **Project-page** (GIVEN) | five-surface test assignment |
| World-template | **ledger** (`proj-ai-model-validation-hub`) | only project-page world; fixed 4-stage pipeline fits a staged eval programme |
| Fidelity | **Condense** | one period's ledger; arc (nine in flight, one stalled) over completeness |
| Audience | **Engineering + risk leadership** | a platform team's evaluation office reporting to risk governance |
| Depth | **Programme-level** | pipeline posture, not per-agent eval transcripts |
| Style / mood | **Art-directed / light** (locked) | mirrors the world manifest (`mood: 'light'`) |

## Stage mapping check (pinned ids → this story)

The template PINS four stage ids; a fill relabels but cannot add a column. The
agent-evaluation programme maps 1:1:

| Pinned id | This programme's stage | Exit rule (relabelled) | flowKind |
| --- | --- | --- | --- |
| `intake` | Use-case registered, eval harness scoped | Use-case registered, harness scoped | start |
| `challenge` | Red-team + capability evals | Red-team findings closed, evals passed | process |
| `review` | Independent review (indep. of the build team) | All findings closed or accepted | decision |
| `sign-off` | Go-live approval by committee | Committee go-live decision recorded | end |

Throughput exhibit is pinned to two series ids `intake` / `signed-off` — here
"agents entering evaluation" vs "agents cleared to go-live". Every
`pipeline.models[].stage` is one of the four pinned ids. Exactly one model
carries `status: 'stalled'` with a stall note.

## Section map (all seven template kinds filled)

| Section | Content |
| --- | --- |
| office | Platform-office identity; RAG AMBER (one agent stalled in challenge); required synthetic-data editionLine |
| hero | Thesis ("An agent is a claim / until the evals say otherwise."); subline naming the stalled agent; five programme facts |
| pipeline | Four relabelled stages + nine agents in flight; `dispute-resolution-agent` the single stalled item |
| table | Band furniture + accessible caption for the §2 textual mirror |
| posture | 4 KPIs (scope, cleared-YTD, median cycle, red-team findings closed) + throughput exhibit (12 periods) |
| outcomes | Six recent dispositions (approved / conditions / rejected) on other agents |
| decisions | Five decision-log entries + five programme-wire items, both leading with the stall |

## The stalled item (real pattern, synthetic instance)

`dispute-resolution-agent` (tier 1) — held **34 days in red-team challenge**
against a **20-day stall threshold**. Reason: the red-team found INDIRECT
prompt-injection paths via customer-uploaded dispute files that reach the agent's
refund tool (OWASP LLM01, indirect-injection class), and there is **no named
remediation owner** for the injection paths — so it cannot meet the challenge
exit rule ("red-team findings closed"). This one story is told coherently across
the hero subline, the ledger stall note, the RAG reason, the mirror-table flag,
the decision log (escalated to platform sponsor), and the programme wire. It is
a genuine, current agentic-AI failure mode, not decoration.

## Honesty ledger

- **Real (methodology):** NIST AI RMF measure/red-team loop; PRA SS1/23
  independent validation + tiering; OWASP LLM01 direct vs indirect prompt
  injection; SWE-bench / AgentBench / AgentDojo as the eval harness kind.
- **Synthetic illustrative (covered by `PLATFORM OFFICE · SYNTHETIC
  ILLUSTRATIVE DATA` + both chart source-notes):** all agent names, versions,
  owners, dates, days-in-stage, target sign-off dates, throughput series,
  findings counts, KPI values, decision-log and wire entries, and the specific
  stalled instance.
- **Anomaly (required, exactly one):** `dispute-resolution-agent` stalled — a
  real unresolved-risk pattern (unowned prompt-injection remediation), not
  marketing.
- No real person, product, or organisation is quoted or named; validator/owner
  initials are synthetic.

## Count consistency

Nine agents on the ledger (1 intake · 3 challenge incl. the stalled one · 3
review · 2 sign-off) = hero fact "ON THE LEDGER 9", pipeline bandSub "NINE
AGENTS IN FLIGHT", table bandSub "9 ENTRIES", a11y caption "nine in-flight
agents". Stalled = 1 everywhere. Scope 24 / cleared YTD 9 / median cycle 41 days
match between hero facts and posture KPIs. Throughput = 12 periods per series,
intake ahead of sign-off (backlog = area between the lines, per the caption).
