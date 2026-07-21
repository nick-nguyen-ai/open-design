# Porting reference - strict-fidelity code porting

Rules for reproducing a template/part's design outside this repo, used by
COMPOSE (external clients), ADAPT, and BORROW at `templateFidelity: strict`.

## Context discipline (non-negotiable)

The ORCHESTRATING agent never reads reference source. It handles selection,
mapping, validation findings, and screenshot review only. All code reading
and porting happens in ONE dispatched subagent per port:

- Give the subagent: the reference manifest (URIs + sizes), the content /
  fill / mapping, the target location, and this file.
- The subagent fetches resources ONE AT A TIME via resources/read, largest
  files only as needed, ports, writes output files, and reports back a file
  list + a ≤20-line summary - never the code itself.
- **If the subagent cannot read MCP resources directly** (whether a dispatched
  subagent gets a callable resources/read affordance is host- and
  version-dependent; some hosts surface resources only as user-turn
  mentions), do NOT dead-end: the orchestrator fetches on its behalf and
  attaches the file to the subagent's turn, still ONE file at a time and the
  largest only when the port actually needs them. The context rule above is
  unchanged - the orchestrator passes each file straight through and never
  reads the reference source into its own context wholesale.
- **On an IN-REPO run there is no fetch at all**: the source is on disk under
  `experiences/<surface>/<experienceId>/`, so hand the subagent the paths.

## What the manifest contains (and what it does not)

The strict reference manifest (`reference.sourceFiles` from a compose call,
and the `files` from `get_part_reference`) lists DESIGN-BEARING files only:
`.tsx` / `.ts` / `.css`, minus the experience's shipped editorial content
(`content.ts`, which exports its SHIPPED_FILL - the actual words) and its
registry metadata (`*.manifest.ts`). Those two are deliberately withheld, so a
port that reproduces the design has nothing of the source world's copy to
reproduce. Write the target's own words from the target's own content; if a
slot's copy seems to be missing from the reference, that is the withholding
working, not a gap to go hunting for.

The world's `*fill.ts` IS listed and you should read it: it is the Zod fill
schema, the section specs and the guidance list - the type contract the
template imports (`import type { ... } from './<world>-fill.js'`), carrying no
editorial values. It tells you the shape each section expects; you supply the
words.

## What "faithful" means

- Keep: layout structure, spacing rhythm, type scale/weights, color roles,
  motion character, component composition - the design's identity.
- Adjust ONLY for: (a) the actual content (counts within the template's
  bounds, real copy), (b) consistency with the client's surroundings -
  token/font substitutions when the host mandates them, class-name
  prefixing to avoid collisions, asset-path rewrites.
- Never: invent new sections, restyle "improvements", drop the template's
  a11y affordances (visually-hidden outlines, aria labels, reduced-motion
  branches - port them all).

## Mechanics

- CSS travels with markup: a part's look is inseparable from its
  stylesheet - port the relevant rules, renamed under one namespace prefix.
- Fonts: the template's font imports name the design; if the client cannot
  load them, document the substitution in the report.
- React → other targets: reproduce the DOM the component RENDERS (read the
  JSX + the CSS), not the React mechanics; interactive behaviour is ported
  only when the target supports it, and its absence is reported.
- Provenance: the ported output carries a comment naming the source
  template/part id and the port date.
