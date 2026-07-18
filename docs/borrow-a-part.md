# Borrow a part

Component-level "inspect element" for the live worlds: every notable part of a
pilot template carries a stable ID, the gallery reveals it on click, and the
`design` skill (BORROW route) turns that ID into an adapted copy of the part's code in
another experience. It complements the MCP compose pipeline — compose fills a
*whole* template with content; borrow lifts *one* visual/animation treatment
across templates.

## The ID scheme (public contract)

```
data-part-id="<experienceId>/<sectionKind>[/<partName>]"
```

- Segment 1 is the experience directory name (`deck-cloud-migration`).
- Segment 2 is the section kind (a deck slide kind or a page region — the same
  vocabulary as descriptor `sections`).
- Segment 3 (optional) names a distinctive part inside the section
  (`estate-diagram`, `swimlanes`).

IDs are anchored as attributes in the template source so they travel with the
code. They are a **public contract**: the inspector surfaces them and the
skill resolves them, so renaming/removing one is a deliberate change that must
update `apps/gallery/src/routes/LivePartIds.test.tsx` in the same commit.

Curated granularity: section roots plus each borrow-worthy part — roughly
5–15 IDs per world. Repeated children (cards in a list) never carry IDs; the
container does.

## Enforcement

- `apps/gallery/src/test/part-ids-static.test.ts` — walks every
  `experiences/**/*.tsx`: IDs well-formed, rooted in their own experience
  directory, literals unique per experience, template literals with a static
  experience prefix. (Shaped to fold into `packages/registry/src/certify.ts`
  as a `part-ids` check when coverage grows beyond the pilots.)
- `apps/gallery/src/routes/LivePartIds.test.tsx` — renders each contracted
  world and asserts the exact part list.

## The inspector

`apps/gallery/src/components/PartInspector.tsx`, mounted once in `App.tsx`,
self-gated to `/live/*` and `/demo/*`. Floating toggle bottom-right (default
OFF; `?inspect=1` arms it on entry). While ON: hover highlights the nearest
anchored part, click selects it (the click is swallowed, devtools-style) and a
popover shows the ID plus a one-click copy of:

```
Borrow part <id> using the design skill.
```

Escape exits; arrow-key deck navigation keeps working. Zero per-template
wiring — templates only carry attributes.

## The skill

`.claude/skills/design/workflows/borrow.md` (one route of the `design` skill) — Resolve → Classify → Slice → Adapt → Verify.
Hard boundaries: never edit the source world; borrow structure/animation,
never shipped content; repo-internal only; no cross-experience imports.
Registered `comp.*` components are imported, not copied. Proof run:
`/demo/borrow-pilot` + `docs/superpowers/specs/borrow-pilot/`.

## Pilot coverage (2026-07-15)

| World | Parts |
|---|---|
| `deck-cloud-migration` | 10 section roots + estate diagrams ×2, swimlanes, flow-frame, rollback-tree |
| `db-model-monitoring-cockpit` | watch (+clock), statement, scope, fleet (+table), dossier (+trend-panel), log, instruments |
| `home-data-scientist-studio` | chrome, hero, bench (+now-card, drift-chart), shelf (+cards), constellation (+skill-map), notes, log |

## Later: descriptor-side listing

When part IDs extend beyond the pilots, add an optional
`parts: { id, description }[]` to `WorldTemplateDescriptor` (schemaVersion
1.2), compile it through `packages/registry` into `world-templates.json`, and
let the MCP server list borrowable parts per template. DOM + tests stay the
source of truth until then.
