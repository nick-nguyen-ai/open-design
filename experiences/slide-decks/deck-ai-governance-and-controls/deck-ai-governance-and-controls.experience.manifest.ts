import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-ai-governance-and-controls",
  surface: "slide-deck",
  title: "AI Governance and Controls",
  designThesis: "Lays out the control framework with the same exactness a regulator would expect in a submission, not a marketing deck.",
  grammarId: "precision-grid",
  audiences: ["risk-and-governance"],
  businessIntents: ["present-control-framework","support-regulatory-submission"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.status-list","comp.flow-diagram"],
  routes: [
    {
      "path": "/decks/ai-governance-and-controls",
      "title": "Opening & Summary",
      "purpose": "Title slide and control-framework summary"
    },
    {
      "path": "/decks/ai-governance-and-controls/evidence",
      "title": "Control Evidence",
      "purpose": "Control-by-control evidence"
    },
    {
      "path": "/decks/ai-governance-and-controls/decision",
      "title": "Decision & Close",
      "purpose": "Attestation and closing slide"
    }
  ],
  tags: ["governance","controls","slide-deck"],
  whenToUse: "Use when presenting an AI control framework to a body that will hold the presenter to every claim on the slide.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-12",
    "qualityScore": 93,
    "notes": [
      "Live build shipped (task 15): 'The Control Frame' at /live/deck-ai-governance-and-controls — Swiss-precision governance on a near-black field over a hairline modular grid, Inter grotesque, monochrome with a single signal amber. The commanding visual is THE CONTROL MATRIX rendered as a real accessible table (six lifecycle stages by five control families, 30 controls) with one acknowledged GAP cell (fairness monitoring in production, dashed amber, REMEDIATION Q3) as the deliberate anomaly. The deck then navigates its own matrix, zooming into a column (three lines of defence) and two rows (the approval gate, the monitoring obligations) with a locator minimap, then a bespoke escalation staircase and closing obligations. Keyboard-driven (arrows/Home/End, M jumps to the matrix), ?slide= deep links, print stylesheet. The matrix table is the accessible mirror.",
      "Licence reviewed: self-hosted OFL fonts only (Inter Variable, IBM Plex Mono); all control ids, owners and statuses synthetic demonstration data; no real framework reproduced."
    ]
  },
});
