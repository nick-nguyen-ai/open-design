# OpenWiki deck — source context + run log (deck-composer skill, ledger T33)

Skill run of `.claude/skills/deck-composer` on 2026-07-14. Sources fetched and
distilled the same day (figures as of July 2026).

## Sources

1. Blog: https://www.langchain.com/blog/introducing-openwiki-an-open-source-agent-for-repo-documentation
2. Repo: https://github.com/langchain-ai/openwiki

### Distilled source facts (all deck content traces here)

- OpenWiki = open-source agent + CLI that generates and maintains documentation
  for codebases; built on DeepAgents; MIT license; ~10.9k GitHub stars; 84.7%
  TypeScript.
- Problem: docs fall out of date fast in large repos; coding agents need
  contextual understanding — stale docs become wrong code.
- Pipeline: generates a repo wiki as interconnected pages in `openwiki/`;
  updates agent instruction files (`AGENTS.md`, `CLAUDE.md`) with SHORT wiki
  references (avoids context bloat; agents retrieve pages on demand); runs via
  scheduled GitHub Action; uses git diffs between runs to update only what
  changed.
- Two modes: **Code mode** (repository documentation) and **Personal mode**
  (local brain wiki in `~/.openwiki/wiki/` with connectors: Git repos, Notion,
  Gmail, X/Twitter, Web Search, Hacker News).
- CLI: `npm install -g openwiki` (or pnpm); `openwiki --init` (prompts for
  provider + API key); `openwiki --update`; `openwiki "query"`; `openwiki -p`
  one-shot; `openwiki auth <provider>`; `openwiki ingest`.
- Providers: OpenAI, Anthropic, OpenRouter, Fireworks, Baseten, NVIDIA NIM,
  OpenAI-compatible endpoints. Config in `~/.openwiki/.env`
  (`OPENWIKI_PROVIDER`, `OPENWIKI_MODEL_ID`, `OPENWIKI_PROVIDER_RETRY_ATTEMPTS`).
- CI/CD: GitHub Actions, GitLab CI, Bitbucket Pipelines. LangSmith tracing
  optional.

## Intake answers (Phase 1 — recorded; user delegated the run)

| Question | Answer | Basis |
| --- | --- | --- |
| Fidelity | **Condense** | Blog + README → one intro deck; arc over completeness |
| Audience | **Mixed** (engineering + executive) | "Introduce OpenWiki" to an org deciding to adopt |
| Technical depth | Medium-high | Real CLI commands and mechanics belong on the slides |
| Timing | ~10 slides | Matches the template's 10 fixed slide kinds |
| Style | **Art-directed** | Fable showcase (goal condition) |

## Phase 2 — compose

Context: `{ surface: slide-deck, audience: [mixed], businessIntent:
[announce-product-release], corporateSuitability: standard, motionPreference: 2,
styleHint: art-directed }`. Brief: OpenWiki GA announcement + pilot rollout
countdown. Raw tool outputs: `mcp-outcome.json` (written by
`corepack pnpm --filter mcp-server openwiki`). Selected: **tminus /
deck-product-launch** — a product-GA brief is the template's home ground; fit is
strong, no override needed.

## Phase 3 — narrative map (condense)

Frame: the honest way an org introduces a just-released OSS tool — "OpenWiki is
live (T-0 happened); here is our countdown to switching it on across our
repos." Intro content is pure source; rollout mechanics are the README's own
commands; invented figures are day-30 targets covered by the notice.

| Slide | Kind | Beat | Source |
| --- | --- | --- | --- |
| 1 | title | Docs that keep themselves current — countdown to adoption | blog framing |
| 2 | one-sentence | What OpenWiki is + stars/license/providers facts | blog + repo stats |
| 3 | thesis | Stale docs are a broken build (agents read them now) | blog problem stmt |
| 4 | readiness | Adoption gates; flagged: no named reviewer for generated pages | README mechanics + honest gap |
| 5 | comms | GA comms that already happened + our internal rollout comms | blog/GitHub/npm facts |
| 6 | pricing | Modes as tiers: Code mode (focus) / Personal mode / BYO model | README modes + providers |
| 7 | runbook | Pilot day-0: install → init → build → wire → REVIEW GATE → schedule | README quickstart, verbatim commands |
| 8 | risk | Abort triggers (accuracy, CI failures, spend) + one-commit rollback | README config + plain-files design |
| 9 | metrics | Stars (real) + day-30 pilot targets (synthetic, noticed) | repo stats + targets |
| 10 | closing | GO — one amber gate: name the reviewing owners | arc resolution |

Kept: what/problem/pipeline/modes/CLI/providers/license/stars/agent-file wiring.
Cut (condense): ngrok tunnel, macOS LaunchAgents/log paths, onboarding.json,
INSTRUCTIONS.md, per-connector detail (one line), GitLab/Bitbucket (GitHub
Action named only), LangSmith tracing.

## Honesty ledger

- Real: stars 10.9k, MIT, providers list, all CLI commands, both modes, wiki/
  agent-file mechanics, plain-files rollback property.
- Derived-honest tension (anomaly): agent-written pages ship unreviewed unless
  a human owner is named — the true adoption risk the sources don't dwell on.
- Synthetic (covered by notice `PUBLIC LANGCHAIN SOURCES + SYNTHETIC TARGETS`):
  pilot repo count, day-30 targets, runbook clock times, abort thresholds.
