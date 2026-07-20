---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

**Location:** save to `D:\Project\design-mcp\handoff\` (never the OS temp directory — it must survive cleanup and be findable next session). If the user's arguments include an explicit path, that path wins.

**One file per session:** name it `<YYYY-MM-DD>-<session-name>.md`, where session-name is the user's `/rename` title if the session has one. With no custom name, use `<YYYY-MM-DD>-<short-topic-slug>-<first-8-chars-of-session-id>.md` — the slug keeps it readable, the id suffix guarantees two unnamed same-day sessions can't overwrite each other (find the session id as the most recently active `claude-<id>` folder under `.harness\memory\episodic\sessions\` — this session's own tool calls keep it freshest). If this session already wrote a handoff, overwrite that same file — re-running /handoff updates the session's snapshot, it does not create siblings.

**Pruning:** handoffs go stale fast and mislead fresh agents. After writing, if older per-session handoffs exist whose unique content is already captured in durable artifacts, tell the user which ones look superseded and offer to delete them (don't delete without asking). Keep at most the latest 2–3.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs, the project-state memory, `handoff/dogfood-gaps-*.md`, the SDD ledger). Reference them by path or URL instead — a handoff is a snapshot and pointer map, not a second copy of the truth.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
