/**
 * The Showcase registry: everything the MCP server + skills have composed,
 * each rendered live at `/demo/<slug>`. These are CONTENT-ONLY fills through
 * world templates (plus two pipeline demos) — the craft belongs to the source
 * template, the content to the sample. `samples.test.ts` locks each slug to a
 * real route in `App.tsx`.
 */

export type SampleTool =
  | 'compose_slide_deck'
  | 'compose_design'
  | 'design skill (compose)'
  | 'design skill (borrow)';

export interface ShowcaseSample {
  /** Demo route slug — the live page is `/demo/<slug>`. */
  slug: string;
  /** Preview image key — `public/previews/<previewId>.jpg`. */
  previewId: string;
  title: string;
  /** One-line story: what the content is. */
  description: string;
  /** What made it. */
  tool: SampleTool;
  /** The world template it was composed into (experience id), if any. */
  sourceExperienceId?: string;
  /** Human name of the source world, for the caption. */
  sourceName?: string;
  surface: 'Slide deck' | 'Dashboard' | 'Explainer' | 'Project page' | 'Personal page';
}

export const SHOWCASE_SAMPLES: readonly ShowcaseSample[] = [
  {
    slug: 'gitlab-qbr',
    previewId: 'demo-gitlab-qbr',
    title: 'GitLab — quarterly business review',
    description:
      'A Q1 FY27 board review built from GitLab’s public filings, composed into "The Quarter" deck.',
    tool: 'design skill (compose)',
    sourceExperienceId: 'deck-quarterly-business-review',
    sourceName: 'The Quarter',
    surface: 'Slide deck',
  },
  {
    slug: 'openmodel-cockpit',
    previewId: 'demo-openmodel-cockpit',
    title: 'OpenModel — overnight drift watch',
    description:
      'An ML-platform team’s fleet of open-weight models under overnight watch, in "The Cockpit" dashboard.',
    tool: 'design skill (compose)',
    sourceExperienceId: 'db-model-monitoring-cockpit',
    sourceName: 'The Cockpit',
    surface: 'Dashboard',
  },
  {
    slug: 'moderation-stack',
    previewId: 'demo-moderation-stack',
    title: 'A content-moderation stack, explained',
    description:
      'A real-time trust-&-safety decisioning pipeline staged as "The Drawing Office" signed engineering drawing.',
    tool: 'design skill (compose)',
    sourceExperienceId: 'exp-system-architecture',
    sourceName: 'The Drawing Office',
    surface: 'Explainer',
  },
  {
    slug: 'agent-evals',
    previewId: 'demo-agent-evals',
    title: 'Agent evaluation programme',
    description:
      'An agent-evals programme recorded as evidence, challengers, and sign-offs in "The Validation Ledger".',
    tool: 'design skill (compose)',
    sourceExperienceId: 'proj-ai-model-validation-hub',
    sourceName: 'The Validation Ledger',
    surface: 'Project page',
  },
  {
    slug: 'ml-career',
    previewId: 'demo-ml-career',
    title: 'An ML career, drawn as one line',
    description:
      'A personal page that walks a decade of ML work as a single continuous timeline, in "The Line".',
    tool: 'design skill (compose)',
    sourceExperienceId: 'home-career-project-timeline',
    sourceName: 'The Line',
    surface: 'Personal page',
  },
  {
    slug: 'openwiki',
    previewId: 'demo-openwiki',
    title: 'Introducing LangChain OpenWiki',
    description:
      'A launch countdown for an open documentation project, composed into "The T-Minus" deck.',
    tool: 'design skill (compose)',
    sourceExperienceId: 'deck-product-launch',
    sourceName: 'The T-Minus',
    surface: 'Slide deck',
  },
  {
    slug: 'mcp-sample',
    previewId: 'demo-mcp-sample',
    title: 'Payments retry pipeline — cloud cutover',
    description:
      'A payments team’s Q3 migration plan composed by the MCP server into "The Cutover" working file.',
    tool: 'compose_slide_deck',
    sourceExperienceId: 'deck-cloud-migration',
    sourceName: 'The Cutover',
    surface: 'Slide deck',
  },
  {
    slug: 'https-handshake',
    previewId: 'demo-https-handshake',
    title: 'How HTTPS actually works',
    description:
      'The TLS 1.3 handshake, certificates, and session keys as a whiteboard walkthrough, in the sketchnote diagram deck.',
    tool: 'compose_slide_deck',
    sourceExperienceId: 'deck-dgm-sketchnote',
    sourceName: 'Field Notebook',
    surface: 'Slide deck',
  },
  {
    slug: 'payment-rails',
    previewId: 'demo-payment-rails',
    title: 'How a card payment moves',
    description:
      'Authorisation, clearing, and settlement drawn as engineering sheets, in the blueprint diagram deck.',
    tool: 'compose_slide_deck',
    sourceExperienceId: 'deck-dgm-blueprint',
    sourceName: 'Drafting Board',
    surface: 'Slide deck',
  },
  {
    slug: 'million-users',
    previewId: 'demo-million-users',
    title: 'Scaling to a million users',
    description:
      'Load balancers, caches, replicas, and queues as a glowing system story, in the circuit diagram deck.',
    tool: 'compose_slide_deck',
    sourceExperienceId: 'deck-dgm-circuit',
    sourceName: 'Lit Board',
    surface: 'Slide deck',
  },
  {
    slug: 'kubernetes-anatomy',
    previewId: 'demo-kubernetes-anatomy',
    title: 'Kubernetes, walkable',
    description:
      'Control plane, nodes, pods, and services as 2.5D dioramas for new joiners, in the isometric diagram deck.',
    tool: 'compose_slide_deck',
    sourceExperienceId: 'deck-dgm-isometric',
    sourceName: 'Studio Floor',
    surface: 'Slide deck',
  },
  {
    slug: 'caching-field-guide',
    previewId: 'demo-caching-field-guide',
    title: 'A field guide to caching',
    description:
      'Strategies, eviction, and failure modes edited like a printed manual, in the gazette diagram deck.',
    tool: 'compose_slide_deck',
    sourceExperienceId: 'deck-dgm-gazette',
    sourceName: 'Gazette',
    surface: 'Slide deck',
  },
  {
    slug: 'deepagents',
    previewId: 'demo-deepagents',
    title: 'LangChain deep agents, explained',
    description:
      'An explainer deck assembled from registered components by the compose_design blueprint pipeline.',
    tool: 'compose_design',
    surface: 'Slide deck',
  },
  {
    slug: 'borrow-pilot',
    previewId: 'demo-borrow-pilot',
    title: 'The borrow-a-part rollout',
    description:
      'One part — the Cutover deck’s swimlane board — borrowed by part ID and re-inked for a new page.',
    tool: 'design skill (borrow)',
    sourceExperienceId: 'deck-cloud-migration',
    sourceName: 'The Cutover (waves/swimlanes part)',
    surface: 'Slide deck',
  },
];

/** Route for a sample's live rendering. */
export function sampleRoute(sample: ShowcaseSample): string {
  return `/demo/${sample.slug}`;
}
