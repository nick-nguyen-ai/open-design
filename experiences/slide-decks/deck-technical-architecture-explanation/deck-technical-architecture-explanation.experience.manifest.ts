import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-technical-architecture-explanation",
  surface: "slide-deck",
  title: "Technical Architecture Explanation",
  designThesis: "Explains a system's architecture the way an as-built drawing does: layer by layer, annotated, never all at once.",
  grammarId: "technical-blueprint",
  audiences: ["technical"],
  businessIntents: ["explain-system-architecture","onboard-technical-audience"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/decks/technical-architecture-explanation",
      "title": "Opening & Summary",
      "purpose": "Title slide and architecture summary"
    },
    {
      "path": "/decks/technical-architecture-explanation/evidence",
      "title": "Diagram",
      "purpose": "Layered architecture diagram walkthrough"
    },
    {
      "path": "/decks/technical-architecture-explanation/decision",
      "title": "Decision & Close",
      "purpose": "Architectural trade-offs and closing slide"
    }
  ],
  tags: ["architecture","technical","slide-deck"],
  whenToUse: "Use when onboarding a technical audience to a system's architecture and the diagram itself is the main content.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 90,
    "notes": [
      "Live build shipped (task 17): 'The Sectional' at /live/deck-technical-architecture-explanation — the decision platform explained the way engineers cut a building: an eight-sheet TRUE CYANOTYPE set (pale line work on saturated Prussian blue, explicitly the inverse of exp-system-architecture's pale Drawing Office, whose drawing number EDI-ARCH-004 is cross-referenced in every title block). Sheets carry real numbers: A-000 cover with drawing index, A-100 general notes, A-101 site plan (systems as building masses, third-party ground hatched), A-201 elevation of the service topology, A-301 SECTION B–B — the money sheet: one decision request cut open vertically, five latency storeys with drawn budgets vs pencilled p95 measure lines, the feature-store storey RED-PENCILLED +26ms over budget as RFI-114 (the anomaly) — A-401 interface detail with drafting callouts (contract, retry, idempotency, budget), A-402 load schedule as drafted exhibit FIG A-401.2 (CategoryBarChart), A-901 revision history. Every sheet carries a mini title block (project, sheet no., NTS, drawn/checked initials, SYNTHETIC DEMO) and a SCHEDULE OF PARTS as its accessible mirror. Keyboard-driven (arrows/Home/End, S jumps to the section), ?slide= deep links, print drops blue to white and line work to ink.",
      "Licence reviewed: self-hosted OFL fonts only (Inter Variable, IBM Plex Mono); all figures synthetic demonstration data at realistic institutional magnitudes; no real institution or vendor implied."
    ]
  },
});
