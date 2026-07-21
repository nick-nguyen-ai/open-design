/**
 * open-design COMPOSE output - grammar-specimen bake-off fill (same
 * opendesign-intro content as the dgm decks), validated by validate_fill +
 * FILL_SCHEMA. Evidence: docs/superpowers/specs/grammar-specimens/.
 * NOT a catalogue template. GENERATED from the evidence dir's fill.json.
 */
import { FILL_SCHEMA, type TMinusFill } from '../deck-product-launch/tminus-fill.js';

export const specMonumentalTypeFill: TMinusFill = FILL_SCHEMA.parse({
  "deck": {
    "code": "OD-INTRO",
    "world": "OPENDESIGN",
    "product": "OPENDESIGN",
    "programme": "ONE DESIGN SYSTEM · FIVE SURFACES",
    "war": "GALLERY ESTATE · 65 LIVE WORLDS",
    "notice": "SOURCED FROM REPO DOCS & PILOT RUN LOGS · 2026-07"
  },
  "cover": {
    "line1": "Every template",
    "line2": "is a live world.",
    "standfirst": "One design system, five surfaces, 65 live worlds. Templates carry the craft, typed fills carry the content, and MCP tools hold the line between them. This deck walks the machine end to end."
  },
  "oneSentence": {
    "lead": "The system in one sentence",
    "sentence": "OpenDesign compiles one design system into five composable surfaces — slide decks, dashboards, project pages, personal pages, technical explainers — rendered as 65 live worlds in a browsable gallery.",
    "facts": [
      {
        "stat": "5 surfaces",
        "cap": "decks, dashboards, pages, explainers"
      },
      {
        "stat": "65 worlds",
        "cap": "live, full-bleed, borrowable"
      },
      {
        "stat": "3 routes",
        "cap": "COMPOSE · BORROW · AUDIT"
      }
    ]
  },
  "thesis": {
    "line1": "Templates carry craft.",
    "line2": "Fills carry content.",
    "standfirst": "The whole architecture is division of labor. A world-template owns layout, color, motion and geometry; a typed fill owns every editorial word. During a compose run you never write CSS — a design flaw found mid-run is template work: stop and report. The certifier's leak scan keeps editorial text out of templates, so the split stays honest."
  },
  "headlines": {
    "readiness": "Five gates. Four green — the audit lit one amber.",
    "comms": "The handshake: who speaks when a doc becomes a deck.",
    "pricing": "Three routes, priced in edits to shipped worlds: zero.",
    "runbook": "One compose run, intake to shipped pixels.",
    "risk": "What stops a run — and what may never be patched.",
    "metrics": "Five numbers hold the whole system."
  },
  "gates": [
    {
      "id": "certifier",
      "label": "Certifier — all worlds",
      "status": "success",
      "description": "Descriptor, fill schema and SECTIONS in lockstep; a leak scan bans editorial text in templates; 0 findings to ship."
    },
    {
      "id": "part-ids",
      "label": "Part-ID contract",
      "status": "success",
      "description": "data-part-id anchors are a public borrow contract, held by static checks plus exact per-world part lists."
    },
    {
      "id": "validate-fill",
      "label": "validate_fill loop",
      "status": "success",
      "description": "Slot caps, item bounds and craft rules enforced on every composed fill; content-side fixes only, max 3 rounds."
    },
    {
      "id": "e2e-drive",
      "label": "Drive the real thing",
      "status": "success",
      "description": "Green units are not enough: the borrow pilot's one real bug passed 7 unit tests and fell to a single e2e click."
    },
    {
      "id": "audit-mobile",
      "label": "T-Minus mobile chrome",
      "status": "warning",
      "description": "The Jul 18 audit pilot found this very template scrolls to 529px at a 375px viewport — template work, reported not patched."
    }
  ],
  "anomalyLabel": "T-MINUS MOBILE CHROME — 529PX AT 375PX",
  "anomalyNote": "a template fix (collapse the centre chrome cell, clip the root) is logged as template work; no fill may hot-patch it.",
  "comms": [
    {
      "id": "skill",
      "channel": "open-design skill",
      "moment": "intake",
      "detail": "routes the run — at most three questions; source docs and audience fix fidelity."
    },
    {
      "id": "compose",
      "channel": "MCP compose tool",
      "moment": "one call",
      "detail": "deterministically scores every template and returns the winner's fill skeleton."
    },
    {
      "id": "author",
      "channel": "fill author",
      "moment": "authoring",
      "detail": "writes content only, slot by slot, against the skeleton's caps and guidance."
    },
    {
      "id": "validate",
      "channel": "validate_fill",
      "moment": "max 3 rounds",
      "detail": "echoes slot path, violated limit and guidance until the contract holds."
    },
    {
      "id": "gallery",
      "channel": "gallery",
      "moment": "/demo route",
      "detail": "renders the fill through the shipped template; the pixels are the truth."
    }
  ],
  "pricing": [
    {
      "id": "compose",
      "name": "COMPOSE",
      "price": "1 MCP call",
      "unit": "per experience",
      "includes": "source docs in, template selected, fill validated, /demo route out",
      "feature": true
    },
    {
      "id": "borrow",
      "name": "BORROW",
      "price": "1 part-id",
      "unit": "per lifted part",
      "includes": "resolve, classify, slice, adapt, verify; source world stays untouched",
      "feature": false
    },
    {
      "id": "audit",
      "name": "AUDIT",
      "price": "0 edits",
      "unit": "per graded target",
      "includes": "severity punch list against the gates; findings reported, never patched",
      "feature": false
    }
  ],
  "runbook": [
    {
      "id": "intake",
      "time": "STEP 1",
      "label": "Intake",
      "detail": "at most three questions — audience, fidelity, surface; answers bind."
    },
    {
      "id": "select",
      "time": "STEP 2",
      "label": "Select",
      "detail": "one compose call scores every template; the winner is deterministic."
    },
    {
      "id": "author",
      "time": "STEP 3",
      "label": "Author",
      "detail": "content only, slot by slot; limits are hard, examples set register."
    },
    {
      "id": "validate",
      "time": "STEP 4",
      "label": "Validate",
      "gate": true,
      "detail": "validate_fill loops, max 3 rounds; findings name slot, limit, guidance."
    },
    {
      "id": "scaffold",
      "time": "STEP 5",
      "label": "Scaffold",
      "detail": "a /demo route mounts the fill; demo outputs never join the catalogue."
    },
    {
      "id": "verify",
      "time": "STEP 6",
      "label": "Verify rig",
      "detail": "mechanical gates pre-answered — overflow probes, motion, contrast."
    },
    {
      "id": "judge",
      "time": "STEP 7",
      "label": "Judge",
      "detail": "a fresh-context screenshot judge grades the rendered frames."
    },
    {
      "id": "ship",
      "time": "STEP 8",
      "label": "Ship",
      "detail": "evidence directory plus honest run log; weak fits are said out loud."
    }
  ],
  "runbookNote": "The one go/no-go is validation: three failed rounds means the narrative map is wrong — go back a phase, never brute-force round four. Everything before the /demo scaffold is reversible, and even after it the honesty rule lets the run stop and report template work.",
  "aborts": [
    {
      "id": "certify",
      "metric": "certifier findings",
      "threshold": "> 0",
      "action": "the world does not ship; fix the contract, never loosen the test quietly"
    },
    {
      "id": "rounds",
      "metric": "validate_fill rounds",
      "threshold": "> 3",
      "action": "structural misfit — go back one phase instead of forcing round four"
    },
    {
      "id": "flaw",
      "metric": "design flaw found mid-run",
      "threshold": "any",
      "action": "template work: stop and report; fills never write CSS, layout or motion"
    },
    {
      "id": "scroll",
      "metric": "horizontal scroll at 375px",
      "threshold": "scrollWidth > clientWidth",
      "action": "critical finding — reported against the template, as in the Jul 18 audit"
    }
  ],
  "rollbackNote": "Rollback is git-shaped: a borrow run must leave the source world's git status empty, demo routes never enter the catalogue, and a stopped compose run leaves nothing behind but its evidence directory — shipped worlds are untouched by contract.",
  "metrics": [
    {
      "id": "worlds",
      "label": "live worlds in the gallery",
      "value": 65,
      "unit": "count",
      "status": "on-track"
    },
    {
      "id": "surfaces",
      "label": "composable surfaces",
      "value": 5,
      "unit": "count",
      "status": "neutral"
    },
    {
      "id": "routes",
      "label": "design routes: compose, borrow, audit",
      "value": 3,
      "unit": "count",
      "status": "neutral"
    },
    {
      "id": "certify",
      "label": "certifier findings allowed on main",
      "value": 0,
      "unit": "count",
      "status": "on-track"
    },
    {
      "id": "rounds",
      "label": "validate_fill rounds, maximum",
      "value": 3,
      "unit": "count",
      "status": "neutral"
    }
  ],
  "metricsNote": "Every figure traces: 65 worlds and 5 surfaces from the repo docs, 3 routes from the open-design skill, 0 findings and the 3-round cap from the certifier and compose contracts.",
  "closing": {
    "word": "GREEN",
    "line": "Leave the estate greener than you found it.",
    "detail": "One gate stays amber on this very template: the mobile-chrome defect the Jul 18 audit found. Clearing it is template work — a deliberate commit, not a fill-side patch.",
    "decisions": [
      "Compose the next internal deck from source docs — one MCP call, content-only authoring.",
      "Borrow one shipped part via its data-part-id instead of rebuilding the treatment.",
      "Run the AUDIT route on one live route and file the severity-ranked punch list.",
      "Schedule the T-Minus mobile-chrome fix as template work under its parity oracle."
    ]
  }
});
