import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-budget-planning',
  surface: 'slide-deck',
  title: 'Budget Planning',
  designThesis:
    'Renders an annual budget as the deliberately conventional deck a finance team makes in PowerPoint — a bridge from last year to this, an allocation by function, headcount and cost detail, scenarios, and a sign-off block — executed flawlessly, and built around one commanding, keyboard-operable waterfall that forces the eye to the single line nobody can yet defend: cloud egress, up 38% and unresolved.',
  grammarId: 'precision-grid',
  audiences: ['executive', 'risk-and-governance'],
  businessIntents: ['plan-annual-budget', 'secure-budget-approval'],
  density: 'medium',
  motionLevel: 1,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'standard',
  componentsUsed: ['comp.category-bar-chart'],
  routes: [
    {
      path: '/decks/budget-planning',
      title: 'Context & the bridge',
      purpose: 'Title, last-year vs this-year context, and the FY26→FY27 waterfall',
    },
    {
      path: '/decks/budget-planning/allocation',
      title: 'Allocation & detail',
      purpose: 'Allocation by function, the headcount plan, cost detail, and the flagged egress line',
    },
    {
      path: '/decks/budget-planning/approval',
      title: 'Structure, scenarios & sign-off',
      purpose: 'Capex vs opex, the three scenarios, and the approval sign-off block',
    },
  ],
  tags: ['budget', 'allocation', 'finance', 'slide-deck'],
  whenToUse:
    'Use to walk a finance committee through an annual budget when the shape should be immediately familiar — a bridge, an allocation, scenarios, a sign-off — and one cost line has to be named and ring-fenced rather than absorbed.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 93,
    notes: [
      "Live build shipped (batch-2 decks F): 'The Allocation' at /live/deck-budget-planning — ten deliberately conventional light slides with an oxblood title bar, a 12-column content zone, and a footer rule (page number · confidentiality · synthetic notice). The commanding visual is a bespoke local-SVG waterfall bridging a $61.4M FY26 baseline to a $68.9M FY27 request; each bar is a keyboard-operable target that pins a mono readout (aria-live), with a visually-hidden step/delta/running-total table mirror. Also renders a comp.category-bar-chart allocation-by-function, a headcount table, a cost-detail table, capex/opex, and three scenarios. The egress anomaly (CLOUD EGRESS +38% YOY — UNRESOLVED) is oxblood on the waterfall bar and flagged in the cost table. ?slide= deep links, print stylesheet, stepped reduced-motion.",
    ],
  },
});
