# Slicing and adapting a part

The mechanics behind Phases 2–3. The source templates are single ~400–1200-line
files with no module boundary per part, so the slice is a *closure walk*, not a
file copy.

## 1. Transitive helper collection

Start from the anchored JSX element. Collect, in order:

1. **Local components** it renders (`<Build>`, `<SelectionHandles>`, `<EstateDiagram>`-style) — defined in the same file above the template body.
2. **Functions** those call (layout engines like `autoGridLayout`, geometry helpers like `orth`, formatters).
3. **Consts and types** any of the above reference (`NODE_W`, `ESTATE_VIEW`, ink palettes, `Record` maps).
4. Repeat until no new identifier resolves locally. Anything that resolves to a package import goes on the import list instead.

Practical method: paste the subtree into the target, let `tsc` name every
missing identifier, and pull each one over — repeat until clean. Trim helpers
that were only needed for source-content derivations you are not borrowing.

## 2. CSS block extraction

For every `className` in the final slice (after helper collection):

- Copy that class's rule blocks from the source CSS — *all* of them, including
  descendant/state selectors (`.cu-build.is-active`, `.cu-lane:hover`).
- Copy any `@keyframes` those rules reference.
- Copy the `@media (prefers-reduced-motion: reduce)` overrides for those
  classes — reduced-motion behaviour is part of the part.
- Copy `@media` size variants for those classes.

Do NOT copy the source's root/layout scaffolding (`.cu-root`, page grid) —
the target already has its own.

## 3. Prefix rename checklist

Each world uses a short CSS prefix (`cu-`, `ck-`, `st-`, …). After copying:

- [ ] Rename the prefix on every copied class in the CSS file.
- [ ] Rename the same classes in the copied JSX (`className` strings, including
      template-literal class builders).
- [ ] Rename CSS custom properties carrying the prefix (`--cu-i` → `--<tgt>-i`)
      in both CSS and inline `style={{ ['--cu-i' as string]: i }}` sites.
- [ ] Grep the target directory for the OLD prefix afterwards — zero hits.

## 4. Colour and token policy

| What you find in the slice | What to do |
|---|---|
| `var(--token-*)` / semantic theme tokens | Keep as-is — they re-resolve in the target's locked mood. |
| Raw art-layer values (hex/rgba in an `INK` map or CSS) | Re-tune to the target's mood and palette. Source and target moods are in `LIVE_PAGES` (`apps/gallery/src/routes/LiveExperience.tsx`). A light-mood part borrowed into a dark world needs its raw inks flipped deliberately — do it in one `INK`-style map, not scattered. |
| Package-component colours (props like `colors={[...]}`) | Supply target-appropriate values; never hardcode inside the package. |

## 5. Animation notes

- The staple pattern is a stagger wrapper (`Build` + `--cu-i` custom property +
  a CSS transition/keyframe driven by that index). Borrow all three legs:
  wrapper component, index property, CSS rule.
- Keep the `useMotionPreference()` gate exactly as the source has it; if the
  source gates via a `data-reduced` attribute on the root, reproduce that
  attribute on the target's root or rewire the copied CSS to the target's
  existing reduced-motion signal.
- Deck-driven animations (keyed to `data-state="active"`) only fire inside a
  deck shell using `useDeckNavigation` — borrowing one into a non-deck surface
  means re-triggering it from mount or scroll instead; say so in the run notes.
