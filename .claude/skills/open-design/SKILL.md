---
name: open-design
description: Use for any design work in this repo. Three routes — (a) COMPOSE, turning source content (docs, notes, URLs, briefs) into a finished rendered experience (slide deck, dashboard, project page, personal page, technical explainer) via the enterprise-design MCP server; (b) BORROW, reusing the UI or animation of a part of a live world identified by a data-part-id from the gallery's part inspector; (c) AUDIT, grading an existing experience or route for design quality. Triggers on "create/make/build a slide deck / presentation / dashboard / project page / profile page / explainer from …", "Borrow part <experienceId>/<section>[/<part>] …", "audit/review the design of …", and any request naming the retired experience-composer, deck-composer, or design-borrow skills (this skill replaced all three).
---

# Open Design

One skill, three workflows. Read the ONE workflow file that matches the request and follow it exactly — the workflow files are the skill; this page only routes.

## Route

- **COMPOSE** — the request turns source content into a NEW experience ("make a deck from these notes", "build a dashboard from this doc") → read and follow `workflows/compose.md`.
- **BORROW** — the request reuses an identified part of an existing world (a part ID like `deck-cloud-migration/waves/swimlanes`, or "that diagram / animation / treatment from <world>") → read and follow `workflows/borrow.md`.
- **AUDIT** — the request grades existing design without changing it ("audit / review / check the quality of <route or experience>") → read and follow `workflows/audit.md`.

Requests phrased against the retired skill names route the same way: experience-composer / deck-composer → COMPOSE, design-borrow → BORROW.

**Ambiguous requests.** "Rebuild X like Y" is a compose that wants a borrow: run COMPOSE first, then BORROW the named part into the result. If the route is genuinely unclear, ask one question before reading any workflow.

The repo-wide craft principles and the full verification procedure live in the
root **`DESIGN.md`** — every route's "done" is defined there (Part 2); the gate
list it references is `references/quality-gates.md`.

## Invariants (hold on every route)

1. **Never edit shipped template/world source to satisfy a run.** A design flaw found mid-run is template work — report it, don't patch around it. (BORROW additionally proves this with a `git status` gate on the source directory.)
2. **No slop ships.** Every route that emits visual output runs the pre-emit self-critique and the relevant gates from `references/quality-gates.md` before handing anything back. AUDIT uses the same gate list as its rubric, so "done" means the same thing everywhere.
3. **Honest output.** Never fabricate data, metrics, or biography to fill a layout; provenance notices state what is synthetic. If a fit is bad, say so — never force it silently.
