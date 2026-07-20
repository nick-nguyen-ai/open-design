# Source Note: Harness Engineering

*A one-page primer on the discipline of building the scaffolding around AI coding agents.*
Compiled 2026-07-19.

## Definition

**Harness engineering** is the practice of designing everything around an AI model — instructions, tool interfaces, memory, sandboxes, verification checks, gates, cost limits, and logging — so that a raw LLM becomes a dependable agent that completes real tasks. Birgitta Böckeler (Thoughtworks) frames the harness plainly as **"everything in an AI agent except the model itself."** It is deliberately *not* prompting and *not* model training: it is the surrounding software system — the "outer loop" — that governs how the model is fed, constrained, and corrected.

The load-bearing claim of the field: **"A decent model with a great harness beats a great model with a bad harness."** (Addy Osmani)

## Why it matters: the "harness gap"

The observed capability of an agent is largely a property of its scaffolding, not the underlying weights. Osmani cites Terminal Bench 2.0 data where the same model (Claude Opus 4.6) scored very differently across harnesses, and an example where an engineer moved an agent from Top 30 to Top 5 **by changing only the harness**. The corollary: for workflow-heavy tasks, a strong harness around a mid-tier model can outperform a weak harness around a stronger one. "The gap between what today's models can do and what you see them doing is largely a harness gap."

## Core components

Böckeler organizes the harness as a cybernetic control system with two halves:

- **Guides (feedforward controls)** — shape behavior *before* action to raise the odds of a good first attempt: architectural docs, `AGENTS.md`/`CLAUDE.md` rulebooks, bootstrap scripts, curated tool interfaces, context delivery.
- **Sensors (feedback controls)** — observe results *after* action to enable self-correction, working best when signals are optimized for LLM consumption.

Each executes in one of two modes:

- **Computational** — deterministic and fast: tests, linters, type checkers, CI gates.
- **Inferential** — AI-based semantic judgment: slower, richer (e.g. LLM-as-judge).

A production harness is commonly described in ~five layers: **tool orchestration, verification loops, context/memory, guardrails, and observability.**

## Key patterns

- **Plan–Execute–Verify (PEV):** decompose into an explicit plan, execute against it, then verify output against both the plan and external quality criteria — verification as a structured feedback loop rather than a hope.
- **Verification via three feedback types** (per Anthropic): rules-based (tests/linters/type checkers), visual (screenshots via headless browser for UI work), and LLM-as-judge (a separate subagent grades the output).
- **Gates and permissions:** deterministic outer-harness constraints must back up model compliance to be reliable at scale. Claude Code, for example, gates tool capabilities independently with staged trust, per-call permission checks, and explicit confirmation for high-risk operations.
- **The Ratchet Principle:** every agent mistake becomes a permanent signal — a failure begets a new rule or hook (e.g. "never comment out tests" → a pre-commit grep hook). Each line of a mature `AGENTS.md` traces back to a specific failure, turning debugging into continuous system hardening.
- **Long-horizon work:** planner/executor and planner/evaluator splits, context compaction and tool-call offloading, memory files, and context resets for multi-session continuity.

## Maturity frontier

Böckeler notes the discipline is uneven: the **maintainability harness** (code-quality controls) is most developed, the **architecture-fitness harness** is emerging, and the **behavior harness** (functional correctness) remains largely unsolved. A guiding principle for the human's role: a good harness "should not necessarily aim to fully eliminate human input, but to direct it to where our input is most important."

## Sources

- Birgitta Böckeler — [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html) (martinfowler.com)
- Addy Osmani — [Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/)
- Augment Code — [Harness Engineering for AI Coding Agents](https://www.augmentcode.com/guides/harness-engineering-ai-coding-agents)
- Databricks — [What is an AI Agent Harness?](https://www.databricks.com/blog/ai-harness)
- LangChain — [The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)
- Faros AI — [Harness Engineering: Making AI Coding Agents Work in 2026](https://www.faros.ai/blog/harness-engineering)
- [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) (curated list: tools, evals, memory, MCP, permissions, observability)
