---
name: open-design
description: Use for any design work in this repo. Four routes — (a) COMPOSE, turning source content (docs, notes, URLs, briefs) into a finished rendered experience (slide deck, dashboard, project page, personal page, technical explainer) via the enterprise-design MCP server; (b) BORROW, reusing the UI or animation of a part of a live world identified by a data-part-id from the gallery's part inspector; (c) AUDIT, grading an existing experience or route for design quality; (d) ADAPT, restyling a user's existing artifact (deck, page, document) with an OpenDesign template, whole or partial. Triggers on "create/make/build a slide deck / presentation / dashboard / project page / profile page / explainer from …", "Borrow part <experienceId>/<section>[/<part>] …", "audit/review the design of …", "restyle/redesign my existing deck/page with …", "apply this template to my slides", and any request naming the retired experience-composer, deck-composer, or design-borrow skills (this skill replaced all three).
---

# Open Design

One skill, four workflows. Read the ONE workflow file that matches the request and follow it exactly — the workflow files are the skill; this page only routes.

## Route

- **COMPOSE** — the request turns source content into a NEW experience ("make a deck from these notes", "build a dashboard from this doc") → read and follow `workflows/compose.md`.
- **ADAPT** - the request restyles an EXISTING artifact (the user's own deck, page, …) with OpenDesign, whole or partial ("restyle my deck with …", "apply this template to slides 3–5") → read and follow `workflows/adapt.md`.
- **BORROW** — the request reuses an identified part of an existing world (a part ID like `deck-cloud-migration/waves/swimlanes`, or "that diagram / animation / treatment from <world>") → read and follow `workflows/borrow.md`.
- **AUDIT** — the request grades existing design without changing it ("audit / review / check the quality of <route or experience>") → read and follow `workflows/audit.md`.

Requests phrased against the retired skill names route the same way: experience-composer / deck-composer → COMPOSE, design-borrow → BORROW.

**Ambiguous requests.** "Rebuild X like Y" splits on what X is: X is an in-repo catalogue world or fresh source content → COMPOSE first, then BORROW the named part of Y into the result; X is the user's OWN existing artifact (their deck, page, document) → ADAPT, with Y as the template to select. If the route is genuinely unclear, ask one question before reading any workflow.

The repo-wide craft principles and the full verification procedure live in the
root **`DESIGN.md`** — every route's "done" is defined there (Part 2); the gate
list it references is `references/quality-gates.md`.

## Invariants (hold on every route)

1. **Never edit shipped template/world source to satisfy a run.** A design flaw found mid-run is template work — report it, don't patch around it. (BORROW additionally proves this with a `git status` gate on the source directory.)
2. **No slop ships.** Every route that emits visual output runs the pre-emit self-critique and the relevant gates from `references/quality-gates.md` before handing anything back. AUDIT uses the same gate list as its rubric, so "done" means the same thing everywhere.
3. **Honest output.** Never fabricate data, metrics, or biography to fill a layout; provenance notices state what is synthetic. If a fit is bad, say so — never force it silently.
