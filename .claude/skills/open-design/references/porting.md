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
