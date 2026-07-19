# Screenshot judge — the fresh-context adversarial pass

The measured cost of self-grading: the opendesign-intro compose run's author
scored its own render E4; the independent AUDIT pass on the same pixels said
E3 and surfaced two findings the author had waved through. The judge exists to
buy that delta on every run, cheaply.

## The contract

- **Who:** a FRESH subagent (general-purpose or Explore), never the session
  that authored the fill/borrow. Dispatch it via the Agent tool.
- **What it receives — and nothing else:**
  1. the run's screenshots (the 1440 evidence set; include 1280/375 when the
     run touched layout),
  2. `references/quality-gates.md` (the rubric),
  3. `DESIGN.md` Part 1 (the principles).
  It must NOT receive the fill, the brief, the source content, or any account
  of what the author intended — the judge grades what a stranger sees.
- **What it returns:**
  1. the six-axis pre-emit scores (P/H/E/S/R/V, 1–5, quality-gates.md table),
  2. findings in the severity-ladder format
     (`severity · tell-name · screenshot region · one-line fix`),
  3. `pass-with-intent` notes where a hit is deliberate craft.

## The dispatch prompt (fill the brackets, change nothing else)

> You are grading rendered design screenshots against a rubric. You know
> nothing about the intent behind them; grade only what you see, as a
> skeptical design lead would. Read
> `.claude/skills/open-design/references/quality-gates.md` and `DESIGN.md`
> (Part 1) in the repo at [repo root], then examine the screenshots at
> [paths]. Return: (1) the six-axis scores 1–5 with one sentence each,
> (2) every gate finding in the severity-ladder format, (3) pass-with-intent
> notes. Do not soften scores because something might be intentional — mark
> it pass-with-intent only when the deliberateness is visible in the design
> itself.

## Acting on the verdict

- Any axis **< 3**, or any **critical/major** finding → revise (fill-side via
  the validate loop; template-side gets reported as template work) and
  re-judge. Two rounds is normal.
- A **third** failed round means the template/brief fit is wrong — go back to
  selection instead of polishing.
- The judge's scores go in the run log AS the run's scores (replacing
  self-scores). The author still runs the content-fit read and the
  honest-copy sweep — the judge cannot check provenance or source fidelity,
  since it never sees the source.

## What stays with the author

Template-leak detection (requires knowing what was authored), the honest-copy
sweep (requires the source), `pass-with-intent` confirmation when the intent
lives outside the pixels (e.g. a deliberately plain register documented in the
brief) — the author may annotate the judge's findings but never lower its
scores.
