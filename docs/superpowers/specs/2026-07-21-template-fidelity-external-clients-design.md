# Template fidelity + external-client rendering — design spec

Date: 2026-07-21
Status: draft, awaiting review

## Problem

The current skill + MCP design keeps all HTML in this repo: MCP tools return
selection data and fill contracts (JSON only), and rendering happens by
scaffolding a route in the gallery app. Two consequences:

1. **External clients can't render anything.** A client outside this repo gets
   a `worldTemplateId` and a fill skeleton it has no code for.
2. **There is no dial between "the template's exact design" and "the skill's
   own design".** The skill either uses a repo template verbatim (in-repo) or
   invents freely (nothing today).

Naive fix — returning built HTML inline from tools — would blow up the main
agent's context window (a built experience is hundreds of KB and tool results
land in the conversation). The design below never moves HTML or source through
the agent's context; everything travels **by reference**.

## The knob: `templateFidelity`

A per-run setting accepted by the compose tools and honoured by the skill.
Named for direction-clarity: high fidelity = faithful to the template.
("Creativity level" was rejected: "high creativity" would read as *more*
freedom while the intended default meant *less*.)

| Value | Server returns | Skill behaviour |
|---|---|---|
| `strict` (default) | Contract **plus** a reference manifest: resource URIs (with byte sizes) for the template's design-bearing source files (~~and its built example bundle~~ - DESCOPED, see "Implementation reconciliation") | Reproduce the reference design: port the real HTML/CSS into the client's target, adjusting only for content and consistency with the client's existing design |
| `free` | Contract only (today's behaviour: skeleton, guidance, rationale) | Use the template's *idea* (structure, register, magnitudes); design the visuals itself |

- Default is `strict`. The skill asks the user once per run whether to change
  it — skipped when the request already states a preference.
- A middle `guided` level (design tokens + layout description, no code) is
  deliberately **out of scope** until real use demands it.

## The three skill workflows

All three default to `strict` and use the same by-reference mechanics.
AUDIT (the existing third route) is untouched.

### 1. ADAPT (new route)

User has an existing artifact (deck, page, …) in their own project; the skill
restyles it with OpenDesign — **whole or partial** scope (all slides vs.
named slides).

- MCP's role is selection: compose tools score templates against the
  artifact's content/intent exactly as they do for briefs today.
- Before porting, the skill builds an explicit mapping: existing slide/section
  → template section (a planning phase, no new tool).
- Partial scope is allowed for a client's own artifact. The in-repo
  "one experience = one world-template" invariant does **not** apply to client
  documents, but the skill must flag the design-consistency risk when only
  part of an artifact adopts the template (warning, not a hard rule).

### 2. BORROW (extended to external clients)

User reuses an identified part of a live world via its `data-part-id`.

- Today the skill reads repo files directly — impossible externally. New tool
  **`get_part_reference`**: resolves a part ID
  (`<experienceId>/<section>[/<part>]`) to a manifest of resource URIs for
  that part's source slice — the component TSX, its CSS, and enough section
  context to port it. Structured error for unknown IDs.
- At `strict`, the skill fetches and ports that code. At `free`, the server
  returns only the part's description/intent and the skill reinterprets it.
- No human supplies file paths; the server owns code location.

### 3. COMPOSE (e2e, extended)

Today's compose workflow plus:

- Compose tools accept `templateFidelity`; at `strict` the response includes
  the reference manifest for the selected template (and for alternatives, on
  request only — not by default).
- New tool **`render_experience`**: `worldTemplateId` + validated fill →
  builds a **full standalone static bundle** via Vite (JS, CSS, fonts;
  interactive navigation and motion work as on the `/demo` route) → returns a
  resource link + metadata (entry URI, total bytes, file count, build time).
  The bundle serves external clients that want a ready-made artifact, and
  doubles as the visual reference at `strict`.
- The primary `strict` deliverable for an external client remains the
  **ported** HTML the skill authors in the client's own project; the rendered
  bundle is available for clients that just want to display the result as-is.

## New MCP surface (summary)

| Addition | Kind | Purpose |
|---|---|---|
| `templateFidelity` param | compose tools input | selects contract-only vs. contract + reference manifest |
| Reference manifest | compose tools output (strict) | resource URIs + byte sizes for the template's design-bearing source files (example bundle descoped); never inline content |
| `render_experience` | new tool | build standalone bundle for a (template, fill) pair; return resource link + metadata |
| `get_part_reference` | new tool | resolve `data-part-id` → resource URIs of the part's source slice |
| Resources capability | server feature | serve `opendesign://` URIs: template source files, part slices, rendered bundles. The server currently registers only tools. |

Resource URI scheme (one root, three namespaces):

```
opendesign://templates/<worldTemplateId>/source/<file>
opendesign://parts/<experienceId>/<file>
opendesign://renders/<renderId>/<file>        (entry: index.html)
```

(The parts URI originally declared `<experienceId>/<section>[/<part>]/<file>`.
The section/part segments carried no routing information - a file is located by
experience id and relative path alone - so the shipped scheme drops them. The
part id still names the part in `get_part_reference`'s INPUT; it just never
appears in a resource URI.)

Renders are content-addressed or id-stamped per call and are ephemeral build
artifacts (a bounded on-disk cache, e.g. last N renders; exact eviction is an
implementation detail).

## Context discipline (applies to skill and server)

1. Tools return **pointers + small metadata**, never file contents inline.
2. Clients read resources file-by-file, only what they need.
3. In the skill, at `strict`, the **main agent never reads reference code**:
   an authoring subagent fetches the resources, does the port, writes output
   files. The main agent handles selection, mapping, validation findings, and
   screenshot review only.

## Skill restructure

- `SKILL.md` routing gains ADAPT; triggers: "restyle / redesign my existing
  deck with …", "apply this template to my slides", partial forms ("just
  slides 3–5").
- New `workflows/adapt.md`; `workflows/compose.md` and `workflows/borrow.md`
  gain a fidelity branch and the subagent porting pattern.
- Shared reference: `references/porting.md` — how to port template code
  faithfully (asset handling, class/token renaming, consistency adjustments,
  what "adjust for content" does and does not allow).
- The per-run fidelity question (AskUserQuestion, default strict) lives in
  each workflow's opening phase.

## Error handling

- `render_experience` build failure → structured error with the build log
  tail (bounded) and remediation; never a partial bundle.
- `get_part_reference` unknown part → `NOT_FOUND` with nearest-ID
  suggestions (same pattern as existing tools).
- Resource read of an evicted render → `NOT_FOUND` with remediation
  "re-run render_experience".

## Testing

- Unit: fidelity param parsing/default; manifest contents for a known
  template; part-ID resolution incl. unknown/ambiguous IDs.
- Integration: `render_experience` on one small template — bundle builds,
  entry resource serves, metadata accurate; resource reads round-trip.
- Skill-side: compose at `free` (existing sample-outcome path) unchanged —
  regression guard that `strict` additions are additive.

## Implementation reconciliation (2026-07-21, post-final-fix-wave)

Where the shipped code and this spec diverged, the implementation's choice is
the better one and this spec has been corrected to match it. Authority:
`apps/mcp-server/src/schemas.ts`, `src/resources.ts`, `src/reference-files.ts`,
`src/tools/compose-core.ts`, `src/tools/render-experience.ts`.

1. **Parts URI shape** - corrected above to
   `opendesign://parts/<experienceId>/<file>`.
2. **Built example bundle: DESCOPED.** Nothing anywhere references a
   per-template prebuilt example. Renders are per call
   (`render_experience`), so the strict manifest carries source-file URIs
   only. The `/live/<experienceId>` gallery route remains the visual
   reference for a template.
3. **Manifest is design-bearing files only.** `isDesignBearingFile()` in
   `reference-files.ts` admits `.tsx` / `.ts` / `.css` and excludes
   `content.ts`, `*fill.ts` and `*.manifest.ts`. `buildReference` in
   `compose-core.ts` and `get_part_reference` both apply it, so a strict port
   is never handed the source world's shipped editorial copy. This aligns the
   feature with the repo's "borrow structure, never shipped content"
   invariant.
4. **`render_experience` output shape.** As shipped
   (`RenderExperienceOutput`): `renderId`, `entryUri`, **`outDir`** (absolute
   path of the built bundle on the SERVER filesystem - the retrieval path
   whenever the client shares a filesystem with the server, which stdio always
   does; the bundle is built with relative asset URLs so a copied directory
   opens from `file://`), `files` (pointers, **capped at 50**, `index.html`
   always first), **`fileCount`** (total emitted), **`filesTruncated`**,
   `totalBytes` (over ALL emitted files, not just the listed ones), and
   `buildMs`. The spec's "resource link + metadata (entry URI, total bytes,
   file count, build time)" is preserved; `outDir` and the cap were added
   because a ~117-file bundle is neither pointer-sized nor practically
   retrievable one `resources/read` at a time.

## Out of scope

- `guided` fidelity level.
- HTTP hosting of renders (MCP resources only for now).
- MCP Apps / inline-UI delivery.
- Any change to AUDIT.
