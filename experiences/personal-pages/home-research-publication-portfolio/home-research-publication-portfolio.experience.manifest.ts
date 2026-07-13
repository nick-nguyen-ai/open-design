import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-research-publication-portfolio",
  surface: "personal-page",
  title: "Research and Publication Portfolio",
  designThesis: "Presents a research portfolio with the typographic confidence of a publication list that deserves to be read, not scrolled past.",
  grammarId: "monumental-type",
  audiences: ["personal-internal","technical"],
  businessIntents: ["showcase-publications","build-research-credibility"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.status-list","comp.kpi-tile"],
  routes: [
    {
      "path": "/people/research-publication-portfolio",
      "title": "Portfolio",
      "purpose": "Publication and research portfolio"
    },
    {
      "path": "/people/research-publication-portfolio/archive",
      "title": "Archive",
      "purpose": "Full publication archive"
    }
  ],
  tags: ["personal","research","publications"],
  whenToUse: "Use when a researcher's publication list is itself the credibility statement and deserves a typographically confident presentation.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 91,
    "notes": [
      "Live build shipped (task 20): 'The Specimen Book' at /live/home-research-publication-portfolio — a researcher's publications set as a type foundry's specimen book, and the catalogue's ONLY colourless world (ink black, near-white, grades of grey, no accent hue at all — that is its signature). Each paper is a SPECIMEN whose title is set in a different optical cut of the variable house face (opsz/wght/SOFT/WONK/italic axes of Fraunces), with foundry-style metadata in mono beneath, the abstract as small print, and a 'what survived' honesty note. One specimen carries RETRACTED — SEE ERRATUM, set with the same care as the triumphs (the anomaly). Supporting: a colophon (h-index stated plainly in mono), a citations-over-time exhibit rendered as a restrained GREY figure whose series are told apart by line style and weight rather than colour, a reviewing/service register, and a 'what I wish I had written' reading list crediting five papers by others. LedgerReveal resolves each specimen in reading order; reduced-motion keeps the order, opacity-only. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE · SYNTHETIC mark in chrome."
    ]
  },
});
