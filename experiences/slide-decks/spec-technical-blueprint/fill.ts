/**
 * open-design COMPOSE output - grammar-specimen bake-off fill (same
 * opendesign-intro content as the dgm decks), validated by validate_fill +
 * FILL_SCHEMA. Evidence: docs/superpowers/specs/grammar-specimens/.
 * NOT a catalogue template. GENERATED from the evidence dir's fill.json.
 */
import { FILL_SCHEMA, type CutoverFill } from '../deck-cloud-migration/cutover-fill.js';

export const specTechnicalBlueprintFill: CutoverFill = FILL_SCHEMA.parse({
  "deck": {
    "code": "OPENDESIGN-INTRO",
    "world": "OpenDesign",
    "file": "opendesign-estate.drawio",
    "rev": "rev 1",
    "programme": "ONE DESIGN SYSTEM · FIVE SURFACES",
    "editors": "CLAUDE AGENTS · OPEN-DESIGN SKILL",
    "notice": "Synthetic estate — drawn from repo docs, Jul 2026"
  },
  "thesis": {
    "line1": "One design system.",
    "line2": "Five surfaces. One fixed point.",
    "standfirst": "OpenDesign compiles one design system into five surfaces and 65 live gallery worlds. Templates carry all the craft; typed fills carry all the content; MCP tools compose the two. This file cuts the estate open around the one box that never moves: the craft."
  },
  "estateNotes": {
    "current": "The estate today, hand-built: a live world welds editorial into its page TSX. It is catalogued, but compose finds no template to pin. Selected: the craft box — the fixed point.",
    "target": "The same estate templatized: content moves into a typed fill, the descriptor compiles into the registry, MCP composes, the skill authors. The craft box stays put — and stays human."
  },
  "headlines": {
    "delta": "Templatizing: what moves, what dies, what refuses to move.",
    "waves": "Five waves from hand craft to a composed estate.",
    "cutover": "A COMPOSE run, intake to evidence — one gate in the middle.",
    "sync": "Nothing ships until every gate agrees.",
    "rollback": "When the gate fails: three rounds, then stop and report.",
    "risk": "The register: two open template items, one bug caught, one gap."
  },
  "nodes": [
    {
      "id": "craft",
      "label": "World craft",
      "kind": "app",
      "zone": "onprem",
      "disposition": "stays",
      "locked": true,
      "badge": "CRAFT STAYS HUMAN — no machine edits"
    },
    {
      "id": "editorial",
      "label": "Editorial content",
      "kind": "data",
      "zone": "cloud",
      "disposition": "refactor"
    },
    {
      "id": "schema",
      "label": "Fill schema",
      "kind": "data",
      "zone": "cloud",
      "disposition": "refactor"
    },
    {
      "id": "descriptor",
      "label": "World-template descriptor",
      "kind": "data",
      "zone": "cloud",
      "disposition": "replatform"
    },
    {
      "id": "registry",
      "label": "Registry JSON",
      "kind": "data",
      "zone": "cloud",
      "disposition": "replatform"
    },
    {
      "id": "mcp",
      "label": "enterprise-design MCP",
      "kind": "integration",
      "zone": "cloud",
      "disposition": "rehost"
    },
    {
      "id": "skill",
      "label": "open-design skill",
      "kind": "integration",
      "zone": "cloud",
      "disposition": "rehost"
    },
    {
      "id": "gallery",
      "label": "Gallery /live + /demo",
      "kind": "app",
      "zone": "cloud",
      "disposition": "rehost"
    }
  ],
  "currentFocus": "craft",
  "targetFocus": "editorial",
  "currentEdges": [
    {
      "id": "c1",
      "from": "editorial",
      "to": "craft",
      "label": "welded in tsx"
    },
    {
      "id": "c2",
      "from": "craft",
      "to": "gallery",
      "label": "live"
    },
    {
      "id": "c3",
      "from": "descriptor",
      "to": "registry",
      "label": "catalogue"
    },
    {
      "id": "c4",
      "from": "registry",
      "to": "mcp",
      "label": "nothing to pin"
    },
    {
      "id": "c5",
      "from": "skill",
      "to": "mcp",
      "label": "none"
    }
  ],
  "targetEdges": [
    {
      "id": "t1",
      "from": "descriptor",
      "to": "registry"
    },
    {
      "id": "t2",
      "from": "registry",
      "to": "mcp",
      "label": "search/compose"
    },
    {
      "id": "t3",
      "from": "mcp",
      "to": "skill",
      "label": "skeleton"
    },
    {
      "id": "t4",
      "from": "skill",
      "to": "editorial",
      "label": "authors"
    },
    {
      "id": "t5",
      "from": "editorial",
      "to": "schema",
      "label": "zod lock"
    },
    {
      "id": "t6",
      "from": "schema",
      "to": "craft",
      "label": "typed fill"
    },
    {
      "id": "t7",
      "from": "craft",
      "to": "gallery",
      "label": "demo"
    }
  ],
  "delta": {
    "moves": [
      {
        "system": "Editorial content",
        "note": "Out of page TSX into a typed, source-traced fill."
      },
      {
        "system": "Content shape",
        "note": "Becomes FILL_SCHEMA + SECTIONS, certifier-locked."
      },
      {
        "system": "Template selection",
        "note": "Hand taste → a deterministic audience/intent scorer."
      },
      {
        "system": "Orchestration",
        "note": "Into the skill: COMPOSE, BORROW, AUDIT routes."
      }
    ],
    "dies": [
      {
        "system": "Hardcoded copy",
        "note": "The leak scan fails editorial text left in templates."
      },
      {
        "system": "Copy-paste reuse",
        "note": "BORROW adapts a part by data-part-id — no duplicates."
      },
      {
        "system": "Eyeball review",
        "note": "AUDIT grades against gates: punch list, zero edits."
      }
    ],
    "stays": [
      {
        "system": "World craft — TSX + CSS",
        "note": "Layout, colour, motion stay human — flaws mean stop, report."
      }
    ]
  },
  "waves": [
    {
      "id": "w1",
      "name": "Hand-built worlds",
      "when": "hand era",
      "chips": [
        {
          "label": "bespoke pages",
          "kind": "app"
        },
        {
          "label": "experience manifests",
          "kind": "data"
        }
      ],
      "note": "Worlds authored end-to-end by hand set the craft bar; content and craft share one file."
    },
    {
      "id": "w2",
      "name": "Contracts + certifier",
      "when": "contracts era",
      "chips": [
        {
          "label": "WorldTemplateDescriptor",
          "kind": "data"
        },
        {
          "label": "FILL_SCHEMA + SECTIONS",
          "kind": "data"
        },
        {
          "label": "certifier CLI",
          "kind": "integration"
        }
      ],
      "note": "Zod contracts split craft from content; the certifier holds them in lockstep."
    },
    {
      "id": "w3",
      "name": "MCP compose tools",
      "when": "compose era",
      "chips": [
        {
          "label": "compose_slide_deck",
          "kind": "integration"
        },
        {
          "label": "validate_fill",
          "kind": "integration"
        },
        {
          "label": "fill skeletons",
          "kind": "data"
        }
      ],
      "note": "One deterministic call returns template + skeleton; findings echo slot and limit."
    },
    {
      "id": "w4",
      "name": "Pilot runs",
      "when": "Jul 15–19, 2026",
      "chips": [
        {
          "label": "borrow pilot",
          "kind": "integration"
        },
        {
          "label": "audit pilot",
          "kind": "integration"
        },
        {
          "label": "compose intro deck",
          "kind": "app"
        }
      ],
      "note": "BORROW Jul 15, AUDIT Jul 18 (one real catch), COMPOSE Jul 19 — evidence logged."
    },
    {
      "id": "w5",
      "name": "The estate today",
      "when": "today",
      "chips": [
        {
          "label": "65 live worlds",
          "kind": "app"
        },
        {
          "label": "5 surfaces",
          "kind": "app"
        },
        {
          "label": "8 deck templates",
          "kind": "data"
        }
      ],
      "note": "Five surfaces, 65 worlds; the same intro renders in every grammar."
    }
  ],
  "cutoverFlow": {
    "nodes": [
      {
        "id": "intake",
        "label": "Intake — 3 questions max",
        "kind": "start"
      },
      {
        "id": "call",
        "label": "Compose → skeleton",
        "kind": "process"
      },
      {
        "id": "author",
        "label": "Author every slot from source",
        "kind": "process"
      },
      {
        "id": "gate",
        "label": "validate OK?",
        "kind": "decision"
      },
      {
        "id": "demo",
        "label": "Scaffold demo + verify rig",
        "kind": "process"
      },
      {
        "id": "ship",
        "label": "Judge → ship",
        "kind": "end"
      },
      {
        "id": "revise",
        "label": "Fix slot, max 3 rounds",
        "kind": "end"
      }
    ],
    "edges": [
      {
        "id": "i1",
        "from": "intake",
        "to": "call"
      },
      {
        "id": "i2",
        "from": "call",
        "to": "author"
      },
      {
        "id": "i3",
        "from": "author",
        "to": "gate"
      },
      {
        "id": "i4",
        "from": "gate",
        "to": "demo",
        "label": "valid"
      },
      {
        "id": "i5",
        "from": "demo",
        "to": "ship"
      },
      {
        "id": "i6",
        "from": "gate",
        "to": "revise",
        "label": "findings"
      }
    ]
  },
  "syncPlan": [
    {
      "id": "g1",
      "stage": "registry:build",
      "detail": "Manifests recompile into generated JSON — the registry the MCP tools read."
    },
    {
      "id": "g2",
      "stage": "typecheck + lint",
      "detail": "Zero errors; the hooks rules are strict by design."
    },
    {
      "id": "g3",
      "stage": "unit suites",
      "detail": "Full vitest run; pretest rebuilds the registry so contracts are fresh."
    },
    {
      "id": "g4",
      "stage": "certify",
      "detail": "Zero findings per world: lockstep, slot limits, leak scan."
    },
    {
      "id": "g5",
      "stage": "gallery build + e2e",
      "detail": "42+ Playwright specs against a fresh build, never stale dist."
    },
    {
      "id": "g6",
      "stage": "drive the real thing",
      "detail": "Click the real route: one bug shipped past 7 green tests."
    }
  ],
  "rollback": {
    "nodes": [
      {
        "id": "r0",
        "label": "validate_fill gate",
        "tone": "root"
      },
      {
        "id": "r1",
        "label": "Valid → scaffold the demo route",
        "tone": "ok"
      },
      {
        "id": "r2",
        "label": "Findings → fix the named slot only",
        "tone": "abort"
      },
      {
        "id": "r3",
        "label": "3 fails → back a phase",
        "tone": "abort"
      },
      {
        "id": "r4",
        "label": "Template flaw → report",
        "tone": "abort"
      }
    ],
    "edges": [
      {
        "from": "r0",
        "to": "r1"
      },
      {
        "from": "r0",
        "to": "r2"
      },
      {
        "from": "r2",
        "to": "r3"
      },
      {
        "from": "r3",
        "to": "r4"
      }
    ],
    "note": "The loop fixes content, never craft: each finding names its slot, limit and guidance. Three failed rounds means the narrative map is wrong — go back a phase. A template defect found mid-run is template work — reported, never patched."
  },
  "risks": [
    {
      "id": "k1",
      "label": "T-Minus mobile chrome (audit catch)",
      "status": "warning",
      "description": "The audit pilot's real find: at 375px the deck scrolls to ~529px — template work on deck-product-launch, reported, not patched."
    },
    {
      "id": "k2",
      "label": "Descriptor caps vs render budgets",
      "status": "warning",
      "description": "On dgm-circuit several slots validate above what the render shows without ellipsis — the contract and the pixels should agree."
    },
    {
      "id": "k3",
      "label": "Green tests, real bug",
      "status": "success",
      "description": "The borrow inspector button occluded a deck control; only a full e2e click caught it. Fixed by moving the button."
    },
    {
      "id": "k4",
      "label": "Compose coverage: 8 deck templates",
      "status": "info",
      "description": "65 worlds, but only eight deck templates are live compose targets — this run's pinned first choice wasn't one yet."
    }
  ],
  "signoff": {
    "title": "Sign the doctrine, then compose.",
    "detail": "This review signs one split: templates own the craft, fills own the content, tools own the selection. Adopt it and any source doc becomes a deck, a dashboard or a page — in this grammar or any of the others rendering this same intro.",
    "approvals": [
      {
        "role": "Engineers",
        "decision": "Compose via the skill; never hand-edit shipped TSX/CSS."
      },
      {
        "role": "Design-minded PMs",
        "decision": "Pick from top-3 alternatives; each previews live."
      },
      {
        "role": "Template authors",
        "decision": "Own the craft bar: grammars enter as worlds first."
      }
    ]
  }
});
