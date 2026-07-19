# Quality gates — pre-emit critique + slop gates + anti-pattern ladder

Distilled from Hallmark (github nutlope/hallmark, MIT, Together AI), re-phrased for this
repo's stack: React/TSX worlds under `experiences/`, per-world prefixed CSS, semantic
theme tokens (`@enterprise-design/themes`), locked per-world moods
(`apps/gallery/src/data/live.ts`), motion gated by `useMotionPreference()` +
`[data-reduced]` + `@media (prefers-reduced-motion: reduce)`.

This file is the GATE LIST; the step-by-step procedure that runs it — the
verify rig, the findings table, the judge dispatch — is Part 2 of the root
`DESIGN.md`. Gates marked ⚙ below are automated by the rig's DOM probes
(`scripts/probes.mjs`): F1 root overflow, text overflow/ellipsis, text overlap,
and the C1 contrast math (with `unverifiable` over images/gradients).

Who runs what:
- **COMPOSE Phase 6** — pre-emit critique + honest-copy gates (the template owns the visual gates).
- **BORROW Phase 4** — pre-emit critique + the adaptation-sensitive gates (contrast, motion collapse, token discipline).
- **AUDIT** — the full list is the rubric; findings use the severity ladder at the bottom.
- **Authoring a new world/template** (batch recipe in the handoffs) — the full list, before the screenshot-judge step.

## Pre-emit self-critique — run BEFORE the gate sweep

Score the planned/rendered output 1–5 on six axes. **Any axis < 3 triggers a revision pass
before the gates and before the user sees anything.** Two passes is normal; needing a third
means the brief/template fit is wrong — re-read the brief instead of polishing. Record the
six scores in the run log (e.g. `critique: P5 H4 E5 S4 R5 V4`).

| # | Axis | What you're scoring |
|---|---|---|
| **P** | **Philosophy** | Is there a clear *why* — a position the design takes? Or is it just a layout? |
| **H** | **Hierarchy** | Can a reader tell in 2 seconds what's primary / secondary / tertiary? |
| **E** | **Execution** | Are the details in spec — rule weights, accent footprint, focus rings, contrast — or is there sloppiness even though the bones are right? |
| **S** | **Specificity** | Does this look like *this content* — or like a generic page that could be anyone's? |
| **R** | **Restraint** | Is everything earning its place? No decoration, redundancy, or padding-for-padding's-sake? |
| **V** | **Variety** | Does this share a structural fingerprint with a sibling world/demo? Structural distance counts; colour-swaps don't. |

## Gates

Every answer must be **no**. A "yes" is a finding: fix it (COMPOSE/BORROW/authoring) or
report it (AUDIT). Gates marked ⚙ are mechanically checkable (grep/measure); the rest are
visual — judge on the rendered screenshot, not on the source.

### A. Visual tells (critical — these READ as AI output)

- A1 ⚙ Is the display font Inter, Roboto, Open Sans, Poppins, Lato, or a system default used AS the display voice? (Body use of a workhorse face is fine; a personality-free display face is the tell.)
- A2 ⚙ Is there a purple→blue / cyan→magenta gradient anywhere — including a `background-clip: text` gradient headline? Gradient text is banned outright.
- A3 Is there a 3-equal-column card grid with icon-above-heading tiles?
- A4 Is any card nested inside another card?
- A5 Is the hero "centred-everything" — eyebrow, title, lede AND CTA all stacked on one centred axis (or a full-viewport centred hero)? At most two centred elements; break alignment for the rest.
- A6 ⚙ Is pure `#000` or pure `#fff` used as a base surface colour? Tint neutrals toward the world's anchor hue.
- A7 Does the accent colour cover more than ~5% of any single viewport? Accent is emphasis, not fill.
- A8 ⚙ Is any heading or display type italic — including a single italicised `<em>` word inside an upright headline? Headers are roman; emphasis comes from weight, accent colour, or a drawn underline. Italic lives only in running body copy (deliberate handwriting faces like Caveat used as annotation, not as headings, are exempt).
- A9 ⚙ Does the page use more than three distinct font families? (Same family at multiple weights = one. Mono counts as a family when used outside code.) The third face is an outlier register — wordmark / hero stat / pull quote — used in at most two slots.
- A10 Is there an emoji glyph (✨🚀⚡🔥🎯✅) as a feature/step/tier icon, or two+ icon styles mixed on one page?
- A11 Did we hand-draw fake UI chrome — a mock browser bar (traffic-light dots + URL pill), fake phone frame, fake terminal/IDE window around content? Use a real screenshot in a `<figure>`, or let the content stand alone.
- A12 Is there a decorative element with no semantic anchor in the content (random ornament, floating cursor, meaningless corner numeral)? Decoration must be motivated by the world's fiction or the content.
- A13 Are sections separated ONLY by identical whitespace — no rule, ornament, or surface shift anywhere — so every section has the same rhythm?
- A14 Is a section eyebrow/number/label rendered in a column BESIDE its heading on the same row? Eyebrow (when used at all) stacks in the same column, directly above the heading.

### B. Microinteractions

- B1 ⚙ `transition: all` / `transition-all` anywhere? Name the properties.
- B2 ⚙ A uniform hover-scale (`scale(1.05)`-style) applied across multiple unrelated elements?
- B3 ⚙ Bouncy/overshoot easing (`cubic-bezier(0.34, 1.56, …)`) on UI state changes — buttons, panels, tooltips? Overshoot is for physical/playful moments only.
- B4 ⚙ Animating `width`, `height`, `top`, `left`, `margin`, or `padding`? Use transform/opacity.
- B5 More than one hover effect on the same element at once (translate + scale + shadow + colour)?
- B6 ⚙ Does any focus ring fade/animate in? Focus indicators appear instantly.
- B7 ⚙ Is any `transform`/`animation` NOT covered by both the world's `[data-reduced]` gating AND `@media (prefers-reduced-motion: reduce)`? Every motion needs a reduced alternative. (House rule — stricter than Hallmark.)
- B8 Auto-rotating content without pause-on-hover-and-focus? (WCAG 2.2.2.)
- B9 Scroll-triggered fade-up applied to everything uniformly instead of a few deliberate moments?

### C. Contrast & readability (the failures that actually ship)

Compute pairs, don't eyeball: for every `(color, background)` pair, WCAG 2.1 ratio (or APCA).
Quick pre-check: if OKLCH lightness difference < 50%, the pair probably fails 4.5:1.

- C1 ⚙ Does any body text (<24px regular / <18px bold) fall below 4.5:1 against its *computed* background? Large text, icons, and focus rings below 3:1? Watch the classic miss: text inheriting `color` inside a panel that switched surface.
- C2 ⚙ Button/chip text within ~5% lightness AND ~0.05 chroma of its own fill (the black-on-black bug — the accent surface got `color: ink` instead of the paired ink-on-accent token)?
- C3 ⚙ Any section/panel with a dark surface (< 50% OKLCH lightness) that does NOT flip its text colour in the same rule (or a wrapping parent)? A class that sets a dark `background` must set a light `color` beside it.
- C4 ⚙ Any prose container narrower than 45ch or wider than 75ch?

### D. States & tokens

- D1 ⚙ Does any interactive element lack `:focus-visible`, `:active`, or `:disabled` styling? Minimum shipped set: default + hover + focus-visible + active + disabled.
- D2 ⚙ Do input/select fields shift `border-width` between states, build the focus ring from `border` instead of `outline`, sit at a different height than their sibling button, or signal disabled by opacity alone?
- D3 ⚙ Any colour value or `font-family` declared outside the world's token/variable block? Mid-render hex improvisation is the tell — lift new values into the CSS-variable block at the top of the world's stylesheet and reference them.
- D4 ⚙ Any spacing value off the world's scale (arbitrary `padding: 17px`)?
- D5 ⚙ `z-index: 9999`-style escalation instead of the app's layer scale?

### E. Honest content

- E1 Does the page carry any quantitative claim ("10× faster", "trusted by 50,000 teams", "99.9% uptime") that the source did not supply? Replace with a real fact, an explicit placeholder, or restructure — a stat layout with decorative stats is slop. A bare number is never the sole headline; pair figures with words that say what they mean.
- E2 Is fictional data presented without the SYNTHETIC provenance notice (house rule: notice in hero AND footer)? Deliberate world-fiction (e.g. the Meridian bank) is fine *because* the notice covers it; lazy filler ("Jane Doe", "Acme") that isn't part of the fiction is not.
- E3 For real-person pages: does any biographical fact lack a source in the provided material?

### F. Layout safety & responsiveness (test at 320 / 375 / 768 / 1280×800)

- F1 ⚙ Horizontal scroll at any width 320–1920px? Root fix: `overflow-x: clip` (not `hidden` — `clip` preserves `position: sticky`) on both `html` and `body`.
- F2 ⚙ Any image-bearing grid track declared `1fr` instead of `minmax(0, 1fr)`? Bare `1fr` inherits the image's intrinsic min-width and blows out phones.
- F3 ⚙ Display-size headings without `overflow-wrap: anywhere; min-width: 0` (long compound words overflow otherwise)?
- F4 Any button/nav/tab/CTA label wrapping to two lines at any width? Shorten the label or `white-space: nowrap` — clickable text never wraps.
- F5 ⚙ A second `position: sticky; top: 0` element on a page that already has a sticky nav? Offset it below the nav (`top: var(--nav-height)`) and give the nav the higher z-index.
- F6 ⚙ All-caps display text with `line-height` below 1.0 (cap-collision on wrap)? Floor is 1.0; 1.02–1.08 recommended.
- F7 On a 1280×800 viewport, does the hero's essential content (headline, lede, primary action, visual focal point) overflow the fold, or does the fold slice a headline in half? Right-size the display clamp / lede length / padding — without shrinking a hero that already fits.

## Severity ladder (AUDIT findings use these names)

- **critical — ships as slop:** purple-gradient hero · gradient text · 3-column icon-tile grid · card-in-card · centred-everything hero · pure-black/white surfaces · ink-on-ink contrast failure (C1–C3) · fabricated metric (E1) · missing provenance on synthetic data (E2) · horizontal scroll (F1) · re-drawn UI chrome (A11).
- **major — looks AI-generated:** italic headers · eyebrow-beside-heading · icon tells (A10) · `transition: all` · bouncy UI easing · uniform hover-scale · missing focus/active/disabled states · token improvisation (D3) · two-line clickable text · hero overflows the fold · uniform scroll-fade.
- **minor — taste:** straight quotes · `--` for em-dash · `...` for ellipsis · off-scale spacing · `z-index: 9999` · every section padded identically.

Findings format (AUDIT): `severity · tell-name · file:line (or screenshot region) · one-line fix`.
