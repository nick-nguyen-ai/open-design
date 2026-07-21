# ADAPT workflow - restyle an existing artifact with OpenDesign

The user already has a design (deck, page, document) OUTSIDE this repo's
catalogue; this workflow re-skins it with an OpenDesign template - the whole
artifact or a named part of it ("just slides 3–5"). Division of labor is the
same as COMPOSE: MCP selects the template and owns the contract; the
template code owns the craft; you own content mapping and judgment.

## Phase 0 - Fidelity

Ask once (skip if the request already states it), default strict:
`templateFidelity` - **strict**: port the selected template's real code onto
the existing content, adjusting only for content and consistency with the
client's surrounding design. **free**: take the template's structure/register
as guidance and restyle in your own design language.

## Phase 1 - Read the artifact

Inventory the existing artifact: sections/slides, content per section, any
design system it already follows. For PARTIAL scope, confirm exactly which
sections are in scope, and record what the out-of-scope sections look like -
the consistency warning in Phase 4 needs it.

## Phase 2 - Select via MCP

Call the surface's compose tool with a context built from the artifact
(audience, intent, suitability) and a contentBrief summarizing its content.
Present alternatives exactly as COMPOSE Phase 2 does (one AskUserQuestion,
winner recommended). At strict fidelity the response carries `reference`
(source-file URIs + sizes) - do NOT fetch any of them yourself.

## Phase 3 - Mapping

Write an explicit mapping: existing section/slide → template section, one
line each, with kept/cut/moved content noted. Sections with no real content
behind them are cut, not padded. Show the user the mapping before porting.

## Phase 4 - Port (strict) or restyle (free)

- **strict**: follow `references/porting.md` - dispatch the porting subagent
  with the reference manifest, the mapping, and the artifact content. The
  main agent never reads template source.
- **free**: restyle in place using the fill skeleton's structure and
  guidance as the brief; no template code involved.
- **Partial scope**: after the port, flag the consistency seam explicitly -
  "slides 3–5 now follow <template>; 1–2 and 6 keep the old design" - as a
  warning with a recommendation (adopt fully, or align tokens), never a
  silent mix. This is a warning, not a blocker: the catalogue invariant
  ("one experience = one world-template") binds catalogue worlds, not the
  client's own document.

## Phase 5 - Verify

Render/preview the artifact in its own environment, screenshot in-scope
sections, run the pre-emit self-critique from `references/quality-gates.md`,
and report: what changed, the mapping, the consistency note, screenshots.
