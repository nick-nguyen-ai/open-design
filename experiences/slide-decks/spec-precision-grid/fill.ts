/**
 * open-design COMPOSE output - grammar-specimen bake-off fill (same
 * opendesign-intro content as the dgm decks), validated by validate_fill +
 * FILL_SCHEMA. Evidence: docs/superpowers/specs/grammar-specimens/.
 * NOT a catalogue template. GENERATED from the evidence dir's fill.json.
 */
import { FILL_SCHEMA, type QuarterFill } from '../deck-quarterly-business-review/quarter-fill.js';

export const specPrecisionGridFill: QuarterFill = FILL_SCHEMA.parse({
  "deck": {
    "title": "OpenDesign",
    "org": "OPENDESIGN PLATFORM",
    "period": "JUL 2026 · One system, five surfaces",
    "periodShort": "JUL 2026",
    "confidentiality": "INTERNAL — ENGINEERING & DESIGN DISTRIBUTION",
    "notice": "PARTLY SYNTHETIC FIGURES — SEE DATA NOTES"
  },
  "headlines": {
    "segment": "Where the sixty-five worlds live."
  },
  "agenda": [
    {
      "no": "01",
      "title": "The system",
      "detail": "One design system, five surfaces; craft in templates, content in typed fills."
    },
    {
      "no": "02",
      "title": "The estate",
      "detail": "65 live worlds: the growth line since mid-July and where they live by surface."
    },
    {
      "no": "03",
      "title": "The routes",
      "detail": "COMPOSE, BORROW, AUDIT — wins, honest losses, and the templatization pipeline."
    },
    {
      "no": "04",
      "title": "Quality",
      "detail": "The gate loop, the open risks, and the one number we flag rather than hide."
    },
    {
      "no": "05",
      "title": "Outlook",
      "detail": "Four priorities that close the gaps before the next review."
    }
  ],
  "summary": {
    "lead": "One system, five surfaces, 65 live worlds — craft in templates, content in fills, gates on everything.",
    "sentences": [
      "The doctrine held all quarter: world-templates carry the craft, typed fills carry the content, and the MCP compose tools select templates deterministically — no fill run wrote a line of CSS.",
      "The estate closed at 65 live worlds across five surfaces, with 12 MCP-published world-templates and the certifier at zero findings across all of them.",
      "All three routes shipped proof runs: borrow (Jul 15, three pilot worlds), audit (Jul 18), and compose (Jul 19, a ten-slide deck that validated clean in round one).",
      "The audit route earned its keep on day one — 1 CRITICAL OPEN — T-MINUS MOBILE F1: a real 375px overflow in a shipped deck template, reported as template work, not hot-patched, still open."
    ]
  },
  "anomalyLabel": "1 CRITICAL OPEN — T-MINUS MOBILE F1",
  "kpis": [
    {
      "id": "live-worlds",
      "label": "Live worlds",
      "value": 65,
      "unit": "count",
      "target": 65,
      "status": "on-track"
    },
    {
      "id": "surfaces",
      "label": "Surfaces",
      "value": 5,
      "unit": "count",
      "target": 5,
      "status": "on-track"
    },
    {
      "id": "certifier-findings",
      "label": "Certifier findings",
      "value": 0,
      "unit": "count",
      "target": 0,
      "deltaGoodDirection": "down",
      "status": "on-track"
    },
    {
      "id": "open-criticals",
      "label": "Open critical findings",
      "value": 1,
      "unit": "count",
      "target": 0,
      "deltaGoodDirection": "down",
      "status": "off-track"
    }
  ],
  "kpiNote": "Estate health at the July close: three gates hold; the audit pilot's one critical remains open as template work.",
  "kpiVsPlan": [
    {
      "metric": "Live worlds",
      "actual": "65",
      "plan": "65",
      "delta": "0"
    },
    {
      "metric": "Surfaces",
      "actual": "5",
      "plan": "5",
      "delta": "0"
    },
    {
      "metric": "Certifier findings",
      "actual": "0",
      "plan": "0",
      "delta": "0"
    },
    {
      "metric": "Critical findings",
      "actual": "1",
      "plan": "0",
      "delta": "+1"
    }
  ],
  "revenueSeries": {
    "id": "live-worlds",
    "label": "Live worlds",
    "points": [
      {
        "x": "Jul 12",
        "y": 30
      },
      {
        "x": "Jul 14",
        "y": 34
      },
      {
        "x": "Jul 15",
        "y": 38
      },
      {
        "x": "Jul 16",
        "y": 44
      },
      {
        "x": "Jul 17",
        "y": 52
      },
      {
        "x": "Jul 18",
        "y": 58
      },
      {
        "x": "Jul 19",
        "y": 62
      },
      {
        "x": "Jul 21",
        "y": 65
      }
    ]
  },
  "revenueNote": "Live worlds by date. Endpoints trace (GUIDANCE's 30+, the 65-world close); intermediate counts are interpolated — see data notes.",
  "segments": [
    {
      "id": "slide-decks",
      "category": "Slide decks",
      "value": 25
    },
    {
      "id": "dashboards",
      "category": "Dashboards",
      "value": 10
    },
    {
      "id": "explainers",
      "category": "Explainers",
      "value": 10
    },
    {
      "id": "project-pages",
      "category": "Project pages",
      "value": 10
    },
    {
      "id": "personal-pages",
      "category": "Personal pages",
      "value": 10
    }
  ],
  "segmentNote": "Worlds by surface, from the compiled registry (25+10+10+10+10 = 65). The one open critical lives in a slide-deck template's chrome, not in any fill.",
  "wins": [
    {
      "name": "Borrow pilot",
      "value": "Jul 15",
      "note": "Three worlds anchored with part IDs; /demo/borrow-pilot shipped green."
    },
    {
      "name": "Audit pilot",
      "value": "Jul 18",
      "note": "First outing caught a real template defect; declined to hot-patch."
    },
    {
      "name": "Compose sample",
      "value": "Jul 19",
      "note": "Ten-slide intro deck; validate_fill clean in round one."
    }
  ],
  "losses": [
    {
      "name": "T-Minus mobile chrome",
      "value": "1 critical",
      "note": "375px viewport scrolls to 529px; open template work."
    },
    {
      "name": "Descriptor cap drift",
      "value": "4 slots",
      "note": "Caps admit copy the render ellipsizes; contract vs pixels."
    },
    {
      "name": "Zones auto-router",
      "value": "1 niggle",
      "note": "Link labels can land on unrelated nodes; caption carries it."
    }
  ],
  "pipeline": [
    {
      "stage": "Live worlds",
      "deals": 65,
      "value": "5 surfaces",
      "coverage": "65/65"
    },
    {
      "stage": "MCP templates",
      "deals": 12,
      "value": "5 surfaces",
      "coverage": "12/65"
    },
    {
      "stage": "Deck templates",
      "deals": 8,
      "value": "1 surface",
      "coverage": "8/25"
    },
    {
      "stage": "Part-ID pilots",
      "deals": 3,
      "value": "borrowable",
      "coverage": "3/65"
    }
  ],
  "pipelineNote": "Composability funnel: 12 of 65 worlds are MCP-composable today and 3 carry borrow anchors — the templatization backlog is the pipeline.",
  "risks": [
    {
      "risk": "T-Minus mobile critical (F1) open",
      "severity": "High",
      "mitigation": "Template work scoped on deck-product-launch; audit contract forbids hot-patching."
    },
    {
      "risk": "Descriptor caps exceed render budgets",
      "severity": "Medium",
      "mitigation": "Tighten dgm-circuit caps or budgets so contract and pixels agree; template work."
    },
    {
      "risk": "Parallel sessions outrun any plan",
      "severity": "Medium",
      "mitigation": "Re-verify from source before acting; pretest rebuilds the registry automatically."
    },
    {
      "risk": "CRLF smudge breaks parity tests",
      "severity": "Low",
      "mitigation": "Re-run the token and theme CSS generators; adopt .gitattributes eol=lf if it bites twice."
    }
  ],
  "priorities": [
    {
      "no": "01",
      "title": "Close the T-Minus critical",
      "detail": "Collapse the centre chrome cell below ~30rem and clip the deck root at 375px; re-shoot the audit evidence once fixed."
    },
    {
      "no": "02",
      "title": "Align caps with render budgets",
      "detail": "Make the dgm-circuit descriptor and its pixels agree on the four drifting slots, so validate_fill passes only what renders whole."
    },
    {
      "no": "03",
      "title": "Extend part-ID coverage",
      "detail": "Grow beyond the three pilots; fold the part-ids check into the certifier and add the descriptor-side parts listing."
    },
    {
      "no": "04",
      "title": "Grow the template bench",
      "detail": "Publish more of the 65 worlds as MCP-composable templates — 12 today; precision-grid still lacks a governance-deck template."
    }
  ],
  "dataNotes": [
    "Partly synthetic: the trend's intermediate world counts and the plan column are illustrative; every endpoint, date, and gate figure traces to repo docs and run logs (2026-07).",
    "Estate: 65 experiences across 5 surfaces (25/10/10/10/10) from the compiled registry; 12 MCP-published world-templates, 8 of them slide decks.",
    "Quality events: borrow pilot 2026-07-15 (three worlds); audit pilot 2026-07-18 (one critical: T-Minus 375px scrollWidth 529px); compose sample 2026-07-19 (round-one clean).",
    "No real company, customer, or revenue figure appears; the QBR anatomy is repurposed as a design-platform programme review."
  ]
});
