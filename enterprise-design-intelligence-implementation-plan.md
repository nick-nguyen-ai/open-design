# Enterprise Design Intelligence Platform Implementation Plan — Fable Edition (Revision 2)

> **Executor:** Fable 5, operating as enterprise product designer, motion director, data-visualisation specialist, and frontend architect. This revision resolves every decision the baseline plan deferred, replaces committee governance with a single-agent + single-approver model, and raises the design mandate: the output must survive a CBA board pack and still make the room look up.
>
> **For agentic workers:** use a task-by-task implementation workflow with isolated branches or worktrees, test-first development, review gates, and evidence-based completion. Every checklist item must be marked only after its acceptance evidence is recorded.
>
> **Working name:** `enterprise-design`
>
> **Decision locked:** The platform is **enterprise-neutral by default**, with an optional and replaceable CBA theme. CBA branding must never be embedded into component logic, sample content, or the core design language.
>
> **Governance model locked:** One executor (Fable) and one human approver (the repository owner). Every "reviewer" role in this document means Fable performing a structured self-review with recorded evidence; every "approver" role means the repository owner. There is no committee, no external brand authority, and no corporate approval body in the first release. Where the baseline plan said "corporation-approved", this revision names a concrete default.
>
> **Design mandate locked:** Two failure modes are equally fatal and must be tested against each other on every experience: (1) *"fancy but not usable at a bank"* and (2) *"safe but indistinguishable from a generic admin template."* Section 3.4 defines the Boardroom Test that every experience must pass, and Section 4.3 defines the platform's proprietary motion identity — animation must be unique to this system, not recognisable as a library default.
>
> **Repository root locked:** all code, configuration, documentation, and generated artefacts live inside `d:\Project\design-mcp\design-mcp-fable\` — this folder is the standalone workspace root (the `enterprise-design/` tree in Section 6 maps directly onto its contents). The dev server, all pnpm commands, and all scripts run from this folder. **No file outside this folder may be created, modified, or deleted**, with the sole exception of vendoring into an explicitly provided user/fixture repository during skill evaluation runs — and those fixture repositories should themselves live under `design-mcp-fable/tests/fixtures/` wherever possible.
>
> **Tooling locked:** MCP server work must be executed through the `mcp-server-dev` plugin — `mcp-server-dev:build-mcp-server` is the mandatory entry point for server scaffolding and tool design (first-slice MCP tasks and Phase 8), with this plan's locked decisions (stdio, read-only, SDK v1.x behind an adapter) supplied as pre-made answers to its interrogation. `mcp-server-dev:build-mcpb` is the packaging path for the optional MCPB release artefact (Section 26.4).
>
> **Plan baseline date:** 11 July 2026 (Revision 2, same date)

**Goal:** Build an enterprise-grade design intelligence platform consisting of a reusable design system, component and motion registry, 50 differentiated reference experiences, a searchable gallery, an MCP server, and an agent skill that recommends and composes context-appropriate UI and animation components for React + Vite + Tailwind projects.

**Architecture:** Use a component-first core governed by a set of distinct design grammars. The 50 reference experiences are compositions and validation fixtures, not the source of truth. A typed registry exposes components, motion behaviours, compatibility rules, sample references, and implementation guidance. The MCP server performs context normalisation, hybrid retrieval, compatibility-aware composition, validation, and implementation briefing; the agent skill performs all semantic interpretation and applies the resulting blueprint in a user repository (see Section 18.0 for the intelligence boundary).

**Tech Stack (decided, recorded as default ADRs — verify exact latest stable versions at implementation start and record in the ADR):**

- TypeScript (strict), React 19, Vite (latest stable major), Tailwind CSS v4 with `@tailwindcss/vite`.
- pnpm workspaces; no additional task runner unless a measured need appears.
- Vitest + Testing Library + Playwright + axe-core.
- Storybook (latest stable) as the component workbench.
- Zod v4 as the single schema source of truth; TypeScript types are inferred from Zod schemas, never duplicated by hand.
- Charts: **Apache ECharts behind the `data-viz` adapter** for workhorse analytical charts, plus **D3 modules (scale/shape/interpolate only, no d3-selection DOM ownership) for signature bespoke visuals**. No business component may import either library directly.
- Motion: **Motion for React (motion.dev, MIT) behind the `motion` adapter** plus CSS keyframes for token-level transitions. The adapter exposes only the platform's own motion tokens and named sequences (Section 4.3); raw library eases and spring defaults are prohibited in components.
- Lexical search: **MiniSearch (MIT)** wrapped by the `search` package.
- MCP: **official TypeScript SDK, latest supported stable production major (v1.x as of baseline date)** behind an internal adapter.

---

## 1. Executive Summary

The platform must solve two different problems without conflating them:

1. **Design supply:** provide a rich, original, corporate-suitable library of layouts, visualisations, diagrams, interaction patterns, and motion behaviours.
2. **Design application:** help an AI coding agent select and combine those assets based on the user's content, audience, purpose, technical constraints, and desired creative intensity.

The principal product is not the 50 templates. The principal product is the reusable design language, metadata registry, compatibility model, retrieval pipeline, and composition workflow. The 50 experiences serve five roles:

- Demonstrate the visual range.
- Supply realistic usage examples.
- Validate component composability.
- Produce retrieval and ranking test cases.
- Give users confidence before they apply components in their own repositories.

The platform must produce a clear “wow” effect through precision, hierarchy, typography, data storytelling, and purposeful motion—not through decorative excess. Every experience must remain credible in a banking or similarly regulated corporate environment.

---

## 2. Product Scope

### 2.1 In scope

- Enterprise-neutral design foundation.
- Optional CBA theme package implemented only through tokens and assets.
- Ten distinct design grammars.
- Reusable structural, content, analytical, diagram, chart, interaction, and motion components.
- Fifty complete reference experiences:
  - 10 dashboards.
  - 10 project pages.
  - 10 AI-oriented slide decks.
  - 10 personal internal home pages.
  - 10 standalone technical explainers.
- Gallery application with a dedicated unified landing and browse page for fast discovery of templates, components, design grammars, and recommended starting points.
- Component metadata, previews, code references, and usage guidance.
- Compatibility graph and composition rules.
- MCP server with tools, resources, and prompts.
- Agent skill that coordinates context analysis, retrieval, composition, validation, implementation, and final checks.
- Corporate-quality controls for accessibility, responsive behaviour, performance, security, privacy, licensing, and asset provenance.
- Automated and human-assisted quality gates.
- Local, static, and intranet-friendly deployment paths.
- Documentation and examples sufficient for another coding agent to use the platform without author assistance.

### 2.2 Explicitly out of scope for the first production release

- A general-purpose low-code visual editor.
- Real-time multi-user design collaboration.
- Figma import or export.
- Automatic publication into production repositories without review.
- Direct access to confidential business data.
- Runtime calls to external generative-image or animation services.
- A remote design marketplace.
- A full brand-governance approval system.
- Automatic replacement of business content with generated content.
- Autonomous modification of user repositories by the MCP server itself.
- Support for non-React frontend frameworks.
- Native PowerPoint file generation; slide decks are browser-based presentation experiences in the first release.

### 2.3 Core principle

The user owns the content. The system owns presentation recommendations. The system may identify missing content and propose placeholders semantically, but it must not fabricate project facts, metrics, decisions, risks, controls, dates, owners, or outcomes.

---

## 3. Success Criteria

### 3.1 Platform success metrics

The release is accepted only when all of the following are true:

- All 50 experiences build and render from the shared packages.
- At least 80% of visual UI code used by the 50 experiences comes from reusable packages rather than local bespoke components. **Measurement (locked):** the shared-code ratio is computed by `scripts/quality/reuse-report` as the percentage of JSX component instances in each experience's route trees whose component definition resolves to `packages/*`. Host elements (`div`, `section`, etc.) carrying only layout utility classes are excluded from both numerator and denominator. The report runs in CI and is stored per experience.
- Each experience uses at least one component also used by another category, proving cross-surface reuse.
- No two same-surface experiences have a similarity score above **0.65** under the similarity metric defined in Section 24.1 (weighted feature-vector similarity). The threshold and weights live in configuration; changing them requires an ADR entry.
- All reusable components have validated metadata and at least one preview state.
- Every component is discoverable through the registry.
- Every component records compatible surfaces, intents, audiences, density, motion level, accessibility properties, dependencies, and content requirements.
- Every sample records the components and design grammar it uses.
- The gallery landing page provides unified search and browsing across experiences, components, and design grammars, with shareable URL state, quick preview, comparison, and clear paths into the blueprint workflow.
- The gallery can filter, inspect, and preview both experiences and individual components.
- The MCP server returns schema-valid outputs for every tool.
- The retrieval evaluation set reaches agreed top-k relevance targets:
  - top-3 component category relevance of at least 90%.
  - top-5 business-intent relevance of at least 85%.
  - zero known hard-constraint violations in the acceptance dataset.
- The composition validator catches all seeded incompatibility fixtures.
- The agent skill can transform five representative content packs into working outputs, one for each surface type.
- Every acceptance scenario passes with reduced motion enabled.
- Every release build works without external runtime network calls unless explicitly configured.
- All packages pass lint, typecheck, unit tests, accessibility checks, and build checks.
- Critical Playwright journeys pass in Chromium and Microsoft Edge (default secondary browser per Section 22.1).
- All external assets and dependencies have recorded provenance and licence status.

### 3.2 User experience success criteria

A user with prepared content must be able to:

1. Open the gallery landing page and reach a relevant template or component within a small number of interactions using search, category shortcuts, filters, or recommendations.
2. Move seamlessly between template-level inspiration and component-level reuse without losing the active query or filters.
3. State the target design type and desired outcome in a single prompt.
4. Receive a short context interpretation and recommended design direction.
5. Receive a component-level blueprint rather than a single-template answer.
6. Understand why each component and motion behaviour was selected.
7. Apply the design without rewriting the business content.
8. Inspect alternatives when the first recommendation is unsuitable.
9. Generate a result that is responsive, accessible, and consistent with the target repository.
10. Re-run validation after editing content or structure.

### 3.3 Corporate suitability criteria

Every reference experience must demonstrate:

- Clear information hierarchy.
- Disciplined use of colour.
- Appropriate content density.
- Legible typography.
- Restrained and meaningful animation.
- Realistic enterprise content structures.
- No consumer-marketing gimmicks.
- No invented logos, confidential terms, or claims.
- No dependence on novelty effects to communicate core information.
- Print, screenshot, and meeting-room display suitability where relevant.

### 3.4 The Boardroom Test (release gate for every experience)

Every experience must pass all five checks, recorded in its Pass 2 review with screenshots:

1. **Ten-second read:** a first-time viewer at 1440×900 can state the page's single most important message within ten seconds, without interacting.
2. **Board-pack print:** a full-page screenshot dropped into a white A4 board pack still looks deliberate — hierarchy, alignment, and typographic rhythm survive with all motion and interactivity removed.
3. **Banker's veto:** an explicit reviewer question set — "Would a risk officer trust a decision made from this screen? Is any visual element optimised for delight at the expense of scrutiny? Could any animation be described as playful rather than precise?" A "yes" to either of the last two fails the check.
4. **Distinctiveness:** shown next to a stock admin-template screenshot of the same content, the experience is identifiable as belonging to this design system by at least three named, non-colour attributes (composition, typography behaviour, signature motion, data-ink treatment).
5. **Signature moment:** the experience contains exactly one deliberate signature moment (Section 4.3) — a choreographed reveal, transition, or data animation that a viewer would remember and describe — and that moment explains structure or meaning rather than decorating it. More than one competing moment fails the check as surely as none.

The Boardroom Test is how this plan operationalises "the CEO looks up": not spectacle, but the unmistakable impression that a senior design team shipped this on purpose.

---

## 4. Design Constitution

The design constitution is a machine-readable and human-readable set of rules that governs all components and samples.

### 4.1 Principles

1. **Clarity before spectacle.**
2. **Motion must explain state, hierarchy, sequence, causality, or focus.**
3. **Data visualisation must preserve analytical integrity.**
4. **Every decorative layer must survive a “remove it” test.**
5. **Corporate does not mean generic.**
6. **Originality comes from composition and art direction, not uncontrolled dependency use.**
7. **Accessibility is a design input, not a final audit.**
8. **The default output must work offline and without tracking.**
9. **Content is preserved unless the user explicitly authorises rewriting.**
10. **Themes never change component semantics or behaviour.**
11. **Every advanced visual effect requires a low-motion and low-power fallback.**
12. **Every component must explain when not to use it.**

### 4.2 Motion levels

Use a four-level motion scale:

- `0 — none`: instant state changes except essential feedback.
- `1 — restrained`: fades, short transforms, number transitions, simple chart reveals.
- `2 — expressive`: sequenced transitions, diagram paths, controlled scroll-linked reveals.
- `3 — immersive`: spatial transitions, advanced canvas/WebGL, narrative animation.

Default maximums:

| Surface | Default | Maximum without explicit request |
|---|---:|---:|
| Dashboard | 1 | 2 |
| Project page | 1 | 2 |
| Slide deck | 2 | 3 |
| Personal page | 2 | 3 |
| Technical explainer | 2 | 3 |

Every level above `0` must have a `prefers-reduced-motion` behaviour. Interactions may not require animation to convey information.

### 4.3 Motion identity — "Considered Weight" (locked)

Generic AI interfaces are recognisable by their motion defaults: uniform 300 ms ease-in-out fades, springy overshoot on everything, staggered card fly-ins. This platform ships a proprietary motion identity so its animation is identifiable even in a screen recording with the chrome cropped out.

**Character:** every element moves like a physical object with real mass being placed deliberately — nothing bounces, nothing floats, nothing loops idly. Motion always resolves to complete stillness. The emotional register is *precision under control*: the interface behaves like a well-run institution.

**Named easing tokens** (cubic-bézier values tuned during Phase 2, then frozen; raw library eases are banned in components):

- `--ease-settle` — fast arrival, long soft landing; the default for entrances.
- `--ease-lift` — brief anticipation before departure; the default for exits.
- `--ease-trace` — near-linear with a measured finish; reserved for line-drawing, path, and progress motion.
- `--ease-shift` — symmetric, unhurried; reserved for layout and theme changes.

**Duration scale:** `90 ms` (feedback), `180 ms` (state), `320 ms` (structure), `560 ms` (narrative). Nothing exceeds 560 ms except choreographed signature sequences, which are budgeted individually and never exceed 1 200 ms total.

**Named signature sequences** — implemented once in `packages/motion`, reused by grammar assignment (Section 9), each with a reduced-motion equivalent that preserves the same informational reveal order:

| Sequence | Behaviour | Natural home |
|---|---|---|
| `ledger-reveal` | Numeric and tabular content resolves from a neutral placeholder to final values in reading order, with a single settle — no counting-up theatrics; values tick once, like a ledger being ruled off | Dashboards, KPI walls |
| `horizon-sweep` | A single baseline draws across the viewport and content registers onto it from below, establishing the page's datum line | Executive pages, slide sections |
| `focus-cascade` | On selection, non-relevant regions recede in contrast and scale by one deliberate step while the selected thread gains weight — attention is reallocated, not decorated | Drill-downs, comparison |
| `data-ink-draw` | Chart marks draw along their own geometry (axes first, then series, then annotation) using `--ease-trace`, so the chart teaches its own reading order | All analytical charts |
| `thread-trace` | In diagrams, a path illuminates node-by-node along its true topology when traversed, leaving a faint persistent trail | Lineage, architecture, flows |
| `depth-shift` | Layered panes reposition with strict parallax hierarchy (background 0.25×, midground 0.5×, subject 1×) — used only in Signal Glass and Spatial Canvas grammars | Monitoring, system maps |
| `section-turn` | Slide and section transitions where the outgoing content yields structurally (compresses to its heading) before the incoming section builds — a document being paged, not a carousel | Slide decks, explainers |

**Rules:**

- Every experience declares its signature sequence in its manifest; the validator enforces exactly one per experience (`MOTION-002`).
- No component may define ad-hoc easings or durations; lint blocks literal `cubic-bezier`, `transition:` durations, and library ease names outside `packages/motion` (`MOTION-003`).
- Idle animation is prohibited on dashboards; any continuous motion elsewhere must be pausable and must stop when offscreen.
- Choreography order is semantic: structure → data → annotation → affordances. Random or purely positional stagger is prohibited.
- Reduced-motion mode replaces movement with sequenced opacity steps at the same semantic order and total duration ≤ 400 ms — it must never feel like a broken version of the full experience.

### 4.4 Content-density levels

- `low`: executive narrative, 1–3 primary messages per viewport.
- `medium`: balanced decision support, 4–8 primary items per viewport.
- `high`: specialist monitoring, dense filters, compact tables and charts.
- `adaptive`: changes by route or user-selected mode.

### 4.5 Audience modes

- `executive`
- `business`
- `risk-and-governance`
- `technical`
- `mixed`
- `personal-internal`

Audience is a retrieval feature and a presentation constraint. It affects information ordering, vocabulary, density, annotations, and allowed chart complexity.

---

## 5. Architecture Overview

```text
User prompt + content + repository context
                |
                v
       Agent skill orchestration
                |
                v
    MCP: analyse_design_context
                |
                v
      Normalised DesignContext
                |
       +--------+--------+
       |                 |
       v                 v
 Structured filters   Semantic retrieval
       |                 |
       +--------+--------+
                v
        Candidate components
                |
                v
     Compatibility graph + reranker
                |
                v
       MCP: compose_design
                |
                v
          DesignBlueprint
                |
                v
      MCP: validate_composition
                |
         pass / revise loop
                |
                v
 MCP: generate_implementation_brief
                |
                v
 Agent applies code in user repository
                |
                v
 build + test + visual + accessibility checks
```

### 5.1 Architectural boundaries

- **Design tokens** know nothing about React.
- **Themes** map semantic tokens to values; themes do not contain component code.
- **Components** consume semantic tokens and typed content props.
- **Motion primitives** are independent of business components.
- **Registry** stores metadata and references; it does not render UI.
- **Gallery** consumes registry and packages; it does not own component definitions.
- **Examples** compose shared components and contain only sample-specific content and layout glue.
- **MCP domain services** are transport-independent.
- **MCP transport** contains no ranking or design logic.
- **Skill** orchestrates; it does not duplicate registry or ranking logic.
- **Repository mutation** remains outside the MCP server.

### 5.2 Distribution model (locked)

How components reach a user's repository was undefined in the baseline plan. Decision: **source vendoring, shadcn-style. No npm publication in the first release.**

- Every component manifest records its complete source closure: component files, the token subset it consumes, the motion sequences it uses, and its in-repo package dependencies.
- `generate_implementation_brief` resolves that closure into concrete copy instructions: files to vendor into the user repository under `src/design-system/` (components, tokens CSS, motion primitives), each with a provenance header comment recording component ID, version, and platform commit.
- The agent skill performs the copying with its normal repository tools; the MCP server never writes files.
- Third-party dependencies of vendored components (ECharts, Motion) are declared in the brief as installation steps, subject to the target repository's constraint list; if prohibited, the brief must select the fallback component instead.
- Semantic versions in manifests exist for provenance and upgrade diffing (a future `migrate` capability), not for package resolution.
- Consequence for design: components must be vendorable — no reliance on monorepo-wide side effects, global providers beyond a single documented `DesignProvider`, or build plugins beyond Tailwind v4.

This choice keeps user repositories dependency-light, avoids running a private registry, and matches how coding agents actually integrate UI code.

---

## 6. Monorepo Structure

Use a pnpm workspace. A task runner may be added only if it is approved and provides measurable value.

The `enterprise-design/` node below is the **contents of `d:\Project\design-mcp\design-mcp-fable\`** — no nested wrapper folder is created; `package.json`, `pnpm-workspace.yaml`, `apps/`, `packages/`, etc. sit directly in `design-mcp-fable`. All commands run from that root, and nothing is written outside it.

```text
enterprise-design/
├─ apps/
│  ├─ gallery/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ routes/
│  │  │  ├─ features/
│  │  │  │  ├─ experience-browser/
│  │  │  │  ├─ component-browser/
│  │  │  │  ├─ blueprint-lab/
│  │  │  │  └─ quality-dashboard/
│  │  │  ├─ components/
│  │  │  └─ test/
│  │  └─ public/
│  └─ mcp-server/
│     ├─ src/
│     │  ├─ server/
│     │  ├─ transport/
│     │  ├─ tools/
│     │  ├─ resources/
│     │  ├─ prompts/
│     │  ├─ config/
│     │  └─ test/
│     └─ package.json
├─ packages/
│  ├─ contracts/
│  ├─ design-tokens/
│  ├─ themes/
│  ├─ primitives/
│  ├─ layouts/
│  ├─ content-components/
│  ├─ data-viz/
│  ├─ diagrams/
│  ├─ motion/
│  ├─ presentation/
│  ├─ registry/
│  ├─ search/
│  ├─ composition/
│  ├─ validator/
│  ├─ sample-data/
│  ├─ testing/
│  └─ eslint-config/
├─ experiences/
│  ├─ dashboards/
│  ├─ project-pages/
│  ├─ slide-decks/
│  ├─ personal-pages/
│  └─ explainers/
├─ skills/
│  └─ enterprise-design/
│     ├─ SKILL.md
│     ├─ references/
│     ├─ examples/
│     └─ evaluations/
├─ docs/
│  ├─ architecture/
│  ├─ design/
│  ├─ governance/
│  ├─ operations/
│  ├─ contribution/
│  └─ decisions/
├─ scripts/
│  ├─ registry/
│  ├─ quality/
│  ├─ screenshots/
│  └─ release/
├─ tests/
│  ├─ e2e/
│  ├─ accessibility/
│  ├─ visual/
│  ├─ retrieval/
│  ├─ composition/
│  └─ fixtures/
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ vite.shared.ts
└─ README.md
```

### 6.1 Package responsibilities

| Package | Responsibility |
|---|---|
| `contracts` | Shared TypeScript and schema contracts for components, metadata, MCP inputs, outputs, and validation. |
| `design-tokens` | Semantic token names, scales, CSS variable generation, and token tests. |
| `themes` | Enterprise-neutral themes and optional CBA token mappings. |
| `primitives` | Low-level accessible UI primitives. |
| `layouts` | Navigation shells, grids, split panes, narrative layouts, and canvases. |
| `content-components` | Hero, summary, status, recommendation, decision, evidence, and callout components. |
| `data-viz` | Chart adapters and analytical presentation components. |
| `diagrams` | Workflow, architecture, lineage, dependency, and process components. |
| `motion` | Motion tokens, primitives, transitions, reduced-motion logic, and sequencing. |
| `presentation` | Browser-based slide shell, presenter controls, transitions, notes, and print styles. |
| `registry` | Metadata ingestion, validation, indexing, lookup, and compatibility graph. |
| `search` | Hard filtering, semantic retrieval adapter, scoring, reranking, and evaluation. |
| `composition` | Blueprint construction and layout compatibility logic. |
| `validator` | Accessibility, compatibility, content, performance, and corporate-suitability rules. |
| `sample-data` | Synthetic enterprise data packs and typed fixture generators. |
| `testing` | Shared render helpers, accessibility utilities, screenshot helpers, and test fixtures. |

---

## 7. Core Contracts

Create these contracts first and treat them as stable interfaces.

### 7.1 Enumerations

```ts
export type SurfaceType =
  | "dashboard"
  | "project-page"
  | "slide-deck"
  | "personal-page"
  | "technical-explainer";

export type Audience =
  | "executive"
  | "business"
  | "risk-and-governance"
  | "technical"
  | "mixed"
  | "personal-internal";

export type ContentDensity = "low" | "medium" | "high" | "adaptive";
export type MotionLevel = 0 | 1 | 2 | 3;
export type ThemeMode = "light" | "dark" | "adaptive";
export type ApprovalState = "experimental" | "reviewed" | "approved" | "deprecated";
export type CorporateSuitability = "restricted" | "standard" | "expressive";
```

### 7.2 Design context

```ts
export interface DesignContext {
  requestId: string;
  surface: SurfaceType;
  businessIntent: string[];
  audience: Audience[];
  contentSummary: string;
  availableContent: ContentInventory;
  desiredTone: string[];
  density: ContentDensity;
  motionPreference: MotionLevel;
  themeMode: ThemeMode;
  corporateSuitability: CorporateSuitability;
  technicalConstraints: TechnicalConstraints;
  accessibilityRequirements: AccessibilityRequirements;
  requiredCapabilities: string[];
  prohibitedCapabilities: string[];
}

export interface ContentInventory {
  headings: string[];
  narrativeSections: number;
  kpis: number;
  tables: number;
  timeSeries: number;
  categories: number;
  processes: number;
  entities: number;
  decisions: number;
  risks: number;
  milestones: number;
  codeBlocks: number;
  citations: number;
  mediaAssets: number;
}

export interface TechnicalConstraints {
  framework: "react";
  buildTool: "vite";
  styling: "tailwind";
  externalRuntimeNetworkAllowed: boolean;
  approvedDependencies: string[];
  prohibitedDependencies: string[];
  targetBrowsers: string[];
  ssrRequired: boolean;
  staticExportRequired: boolean;
}

export interface AccessibilityRequirements {
  target: "WCAG-2.2-AA";
  reducedMotionRequired: true;
  keyboardRequired: true;
  screenReaderRequired: true;
  highContrastRequired: boolean;
}
```

### 7.3 Component manifest

```ts
export interface ComponentManifest {
  schemaVersion: "1.0";
  id: string;
  name: string;
  version: string;
  description: string;
  category: ComponentCategory;
  subcategory: string;
  sourcePath: string;
  exportName: string;
  previewRoute: string;
  designGrammars: string[];
  compatibleSurfaces: SurfaceType[];
  businessIntents: string[];
  audiences: Audience[];
  density: ContentDensity[];
  motionLevel: MotionLevel;
  corporateSuitability: CorporateSuitability[];
  themeModes: ThemeMode[];
  contentRequirements: ContentRequirements;
  dependencies: DependencyManifest[];
  compatibility: CompatibilityManifest;
  accessibility: AccessibilityManifest;
  performance: PerformanceManifest;
  provenance: ProvenanceManifest;
  approval: ApprovalManifest;
  tags: string[];
  searchText: string;
}

export type ComponentCategory =
  | "shell"
  | "navigation"
  | "layout"
  | "content"
  | "status"
  | "chart"
  | "diagram"
  | "table"
  | "interaction"
  | "motion"
  | "presentation"
  | "utility";

export interface ContentRequirements {
  requiredFields: string[];
  optionalFields: string[];
  minItems?: number;
  maxItems?: number;
  recommendedNarrativeLength?: string;
  acceptedDataShapes: string[];
  emptyStateSupported: boolean;
  loadingStateSupported: boolean;
  errorStateSupported: boolean;
}

export interface DependencyManifest {
  packageName: string;
  purpose: string;
  optional: boolean;
  adapter: string;
}

export interface CompatibilityManifest {
  worksWellWith: string[];
  conflictsWith: string[];
  requiresOneOf: string[];
  maxInstancesPerViewport?: number;
  layoutRequirements: string[];
  compositionRoles: CompositionRole[];
}

export type CompositionRole =
  | "shell"
  | "navigation"
  | "hero"
  | "summary"
  | "primary-visual"
  | "secondary-visual"
  | "detail"
  | "evidence"
  | "decision"
  | "footer"
  | "transition";

export interface AccessibilityManifest {
  keyboardAccessible: boolean;
  screenReaderLabels: boolean;
  nonColourEncoding: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  contrastTested: boolean;
  knownLimitations: string[];
}

export interface PerformanceManifest {
  renderingCost: "low" | "medium" | "high";
  bundleCostKbGzip: number;
  usesCanvas: boolean;
  usesWebGL: boolean;
  supportsLazyLoad: boolean;
  recommendedDataLimit?: number;
  fallbackComponentId?: string;
}

export interface ProvenanceManifest {
  author: string;
  assetSources: AssetSource[];
  licenceReviewed: boolean;
  generatedAssets: boolean;
  generatedAssetMethod?: string;
  reviewRecord: string;
}

export interface AssetSource {
  path: string;
  origin: "original" | "generated" | "licensed" | "internal-approved";
  licence: string;
  attributionRequired: boolean;
}

export interface ApprovalManifest {
  state: ApprovalState;
  reviewer: string;
  reviewedAt: string;
  qualityScore: number;
  notes: string[];
}
```

### 7.4 Design blueprint

```ts
export interface DesignBlueprint {
  schemaVersion: "1.0";
  blueprintId: string;
  title: string;
  rationale: string;
  surface: SurfaceType;
  audience: Audience[];
  grammarId: string;
  themeId: string;
  motionLevel: MotionLevel;
  density: ContentDensity;
  routes: RouteBlueprint[];
  globalComponents: ComponentPlacement[];
  tokens: TokenOverrides;
  responsiveStrategy: ResponsiveStrategy;
  accessibilityStrategy: AccessibilityStrategy;
  implementationNotes: string[];
  alternatives: BlueprintAlternative[];
  evidence: RecommendationEvidence[];
}

export interface RouteBlueprint {
  path: string;
  title: string;
  purpose: string;
  layoutComponentId: string;
  navigationComponentId?: string;
  sections: SectionBlueprint[];
}

export interface SectionBlueprint {
  id: string;
  purpose: string;
  order: number;
  componentPlacements: ComponentPlacement[];
  contentMapping: Record<string, string>;
  motionSequence?: MotionSequence;
}

export interface ComponentPlacement {
  componentId: string;
  variant: string;
  role: CompositionRole;
  region: string;
  priority: number;
  propsMapping: Record<string, string>;
  responsiveRules: string[];
  fallbackComponentId?: string;
}

export interface RecommendationEvidence {
  componentId: string;
  matchedIntents: string[];
  matchedConstraints: string[];
  score: number;
  explanation: string;
}
```

### 7.5 Validation result

```ts
export interface ValidationResult {
  valid: boolean;
  score: number;
  findings: ValidationFinding[];
  metrics: {
    accessibility: number;
    compatibility: number;
    corporateSuitability: number;
    contentCoverage: number;
    performance: number;
    originality: number;
  };
}

export interface ValidationFinding {
  ruleId: string;
  severity: "info" | "warning" | "error";
  path: string;
  message: string;
  remediation: string;
  componentIds: string[];
}
```

### 7.6 Supporting types (previously referenced but undefined)

```ts
export interface MotionSequence {
  sequenceId: string;            // one of the named signature sequences or a level-1 primitive
  trigger: "enter" | "select" | "navigate" | "data-change" | "scroll-section";
  order: string[];               // semantic choreography order: section/component IDs
  totalDurationMs: number;       // hard cap 1200 for signature sequences
  reducedMotionVariant: string;  // required, never empty
}

export interface TokenOverrides {
  // Only semantic token names may appear; raw values are rejected by the validator (THEME-001).
  colour?: Record<string, string>;
  typography?: Record<string, string>;
  density?: "compact" | "default" | "spacious";
}

export interface ResponsiveStrategy {
  breakpoints: Array<"sm" | "md" | "lg" | "xl">;
  reflowRules: string[];         // e.g. "split-pane collapses to stacked below md"
  densityReduction: string[];    // what is dropped or summarised at narrow widths
  touchAdjustments: string[];
}

export interface AccessibilityStrategy {
  landmarkPlan: string[];
  headingOutline: string[];
  focusOrderNotes: string[];
  liveRegions: string[];
  chartEquivalents: Record<string, string>; // chart placement id -> textual equivalent plan
}

export interface BlueprintAlternative {
  mode: "conservative" | "recommended" | "expressive";
  blueprintId: string;
  differenceSummary: string[];   // must contain structural differences, not theme swaps
}

export interface RankedComponent {
  componentId: string;
  role: CompositionRole;
  score: number;
  evidence: RecommendationEvidence;
  fallbackComponentId?: string;
}
```

### 7.7 Content-mapping path syntax (locked)

All `contentMapping` and `propsMapping` values use **dot-path references into the `ExperienceContentPack`** (or the user's normalised content pack at composition time): `narrative.overview`, `datasets.incidents`, `datasets.kpis[3].value`. Rules:

- Paths are validated against the content pack at composition time; an unresolvable path is a `CONTENT-001` error.
- A literal value is expressed as `literal:` prefix (`literal:View details`) and is only legal for UI chrome, never for business content — the validator flags literal business-looking values as `CONTENT-002` (fabricated-value placeholder).
- A deliberate gap is expressed as `missing:` prefix with a semantic description (`missing:q3-revenue-figure`); these surface in the brief as content the user must supply.

---

## 8. Theme and Brand Architecture

### 8.1 Theme hierarchy

```text
semantic contract
    |
    +-- enterprise-neutral-light
    +-- enterprise-neutral-dark
    +-- executive-light
    +-- technical-dark
    +-- optional-cba-light
    +-- optional-cba-dark
```

Build order (previously unassigned): `enterprise-neutral-light` and `enterprise-neutral-dark` in Phase 1; `executive-light` and `technical-dark` in Phase 5 alongside component-library completion; optional CBA themes only when approved token values exist, reviewed separately in Phase 10.

### 8.2 Rules

- Components reference semantic tokens such as `--surface-raised`, not palette values.
- The CBA theme package contains token values and approved assets only.
- No component imports from the CBA theme package.
- Sample content remains enterprise-neutral even when the CBA theme is active.
- The gallery displays a visible “demonstration theme” notice when optional brand themes are used.
- Theme switching must not change layout dimensions enough to cause reflow defects.
- Every theme must pass contrast checks independently.
- Typography fallbacks must use approved locally available fonts.
- No font is fetched from a public CDN at runtime.

### 8.3 Token groups

- Colour:
  - surfaces.
  - text.
  - borders.
  - focus.
  - statuses.
  - chart categorical.
  - chart sequential.
  - chart diverging.
  - diagram nodes and edges.
- Typography:
  - display.
  - heading.
  - body.
  - label.
  - mono.
  - numeric.
- Space and sizing.
- Radius.
- Elevation.
- Border.
- Motion duration and easing.
- Layout widths.
- Data-density scales.
- Z-index.
- Print values.

### 8.4 CBA theme governance

The optional theme is accepted only when:

- Approved token values and assets are provided by the authorised source.
- Brand assets have a provenance record.
- The theme is independently installable and removable.
- The platform can build with the CBA theme package excluded.
- No screenshot or sample is presented as an official CBA product.
- The internal deployment includes the appropriate disclaimer and ownership information.

---

## 9. Design Grammars

Create ten grammars. Each grammar must specify layout, typography, navigation, chart treatment, motion, iconography, surface treatment, and contraindications.

| ID | Name | Primary character | Strongest surfaces |
|---|---|---|---|
| `precision-grid` | Precision Grid | Dense, structured, exact | Dashboards, explainers |
| `executive-editorial` | Executive Editorial | Spacious, premium, narrative | Project pages, slides |
| `signal-glass` | Signal Glass | Layered, restrained depth | Monitoring, personal |
| `technical-blueprint` | Technical Blueprint | Architectural, annotated | Explainers, technical slides |
| `kinetic-intelligence` | Kinetic Intelligence | Sequenced data relationships | Slides, explainers |
| `calm-command` | Calm Command | Operational clarity | Dashboards |
| `spatial-canvas` | Spatial Canvas | Navigable system map | Personal, explainers |
| `monumental-type` | Monumental Type | Typography-led storytelling | Slides, landing pages |
| `living-system` | Living System | State and flow animation | Project pages, explainers |
| `research-notebook` | Research Notebook | Evidence and annotation | Personal, project, slides |

Each grammar must include:

```ts
export interface DesignGrammar {
  id: string;
  name: string;
  intent: string;
  layoutRules: string[];
  typographyRules: string[];
  navigationRules: string[];
  chartRules: string[];
  diagramRules: string[];
  motionRules: string[];
  signatureSequences: string[];  // which named sequences from Section 4.3 this grammar may use
  surfaceRules: string[];
  preferredComponents: string[];
  prohibitedPatterns: string[];
  accessibilityNotes: string[];
  exampleExperienceIds: string[];
}
```

Default signature-sequence assignment (tunable during Phase 2, then frozen):

| Grammar | Primary sequence | Permitted secondary |
|---|---|---|
| Precision Grid | `ledger-reveal` | `data-ink-draw` |
| Executive Editorial | `horizon-sweep` | `section-turn` |
| Signal Glass | `depth-shift` | `focus-cascade` |
| Technical Blueprint | `data-ink-draw` | `thread-trace` |
| Kinetic Intelligence | `focus-cascade` | `data-ink-draw` |
| Calm Command | `ledger-reveal` | `focus-cascade` |
| Spatial Canvas | `depth-shift` | `thread-trace` |
| Monumental Type | `horizon-sweep` | `section-turn` |
| Living System | `thread-trace` | `focus-cascade` |
| Research Notebook | `section-turn` | `data-ink-draw` |

### 9.1 Grammar differentiation test

For every pair of grammars, record at least five differentiators, at least one of which must be motion behaviour. A grammar fails review if its difference from another grammar is only palette and border radius.

---

## 10. Component Library Scope

### 10.1 Minimum component inventory

The first production release should contain approximately 90–120 reusable units, but no quota should force low-value duplication. The expected distribution is:

| Category | Target range |
|---|---:|
| Shells and navigation | 12–16 |
| Layouts | 12–16 |
| Content and decision components | 18–24 |
| Charts and analytical views | 18–24 |
| Diagrams and workflows | 10–14 |
| Motion primitives and sequences | 10–14 |
| Presentation-specific components | 8–12 |
| Utilities and states | 8–12 |

### 10.2 Required state coverage

Every interactive or data component must demonstrate:

- Default.
- Loading.
- Empty.
- Error.
- Partial data.
- Long labels.
- Large values.
- Keyboard focus.
- Reduced motion.
- Narrow viewport.
- Dark theme where supported.

### 10.3 Chart integrity requirements

- Axes, units, baselines, legends, and source notes are explicit.
- Truncated axes are forbidden unless disclosed.
- Colour is never the sole encoding for risk or status.
- Animation must not change the perceived result.
- Tooltips must have keyboard-accessible equivalents.
- Tables or summaries are available for charts used to communicate essential values.
- Large datasets use sampling, aggregation, virtualisation, or progressive rendering.
- Chart adapters normalise theme, accessibility, export, and interaction behaviour.
- The registry records the recommended maximum data volume.
- Every chart has a static-image or simplified fallback for print and reduced capability modes.

### 10.4 Diagram requirements

- Nodes and edges have stable semantic IDs.
- Layout can be deterministic for tests.
- Interactive diagrams expose a textual outline.
- Zoom and pan are optional enhancements, not required to access content.
- Complex diagrams include focus mode and progressive disclosure.
- Diagram animation can be paused or disabled.
- Architecture diagrams distinguish systems, processes, people, data, and controls through more than colour alone.

---

## 11. Reference Experience Catalogue

Each experience must have a unique design thesis, realistic synthetic content pack, component manifest, grammar assignment, and three-pass review record.

**Hosting model (locked):** experiences are **lazy route groups inside the gallery application**, not 50 separate Vite apps — one build, one dev server, shared chunks, and gallery previews render the real routes (in an iframe for full-screen isolation, as direct routes otherwise). Technical explainers additionally get a separate static-export build target (`scripts/release/export-explainer`) that produces a self-contained bundle per explainer, satisfying Section 11.5's standalone requirement without multiplying app shells.

### 11.1 Dashboards

1. `db-ai-risk-command-centre`
   - Audience: executive and risk.
   - Grammar: Calm Command.
   - Thesis: portfolio-level AI risk posture with progressive drill-down.
2. `db-model-monitoring-cockpit`
   - Audience: technical and model risk.
   - Grammar: Precision Grid.
   - Thesis: dense time-series monitoring with nested navigation.
3. `db-delivery-control-tower`
   - Audience: project leadership.
   - Grammar: Signal Glass.
   - Thesis: milestones, blockers, dependencies, and delivery confidence.
4. `db-portfolio-performance-explorer`
   - Audience: business.
   - Grammar: Executive Editorial.
   - Thesis: guided analytical storytelling rather than a card wall.
5. `db-data-quality-operations`
   - Audience: technical operations.
   - Grammar: Technical Blueprint.
   - Thesis: lineage-aware quality incidents and ownership.
6. `db-scenario-stress-simulator`
   - Audience: risk specialist.
   - Grammar: Kinetic Intelligence.
   - Thesis: compare scenarios and trace drivers.
7. `db-experiment-analysis-workspace`
   - Audience: data science.
   - Grammar: Research Notebook.
   - Thesis: hypotheses, experiment lineage, metrics, and evidence.
8. `db-incident-remediation-centre`
   - Audience: operations and governance.
   - Grammar: Living System.
   - Thesis: animated incident state and remediation workflow.
9. `db-dependency-network-explorer`
   - Audience: architecture.
   - Grammar: Spatial Canvas.
   - Thesis: network navigation with contextual side panels.
10. `db-regulatory-control-hub`
    - Audience: risk and governance.
    - Grammar: Monumental Type combined with Precision Grid.
    - Thesis: high-level control posture with evidence-backed detail.

### 11.2 Project pages

1. AI model validation hub.
2. Enterprise transformation programme.
3. Platform product launch.
4. Cloud migration programme.
5. Regulatory remediation programme.
6. Research and innovation initiative.
7. Model lifecycle workspace.
8. Vendor assessment project.
9. Data modernisation programme.
10. Operating model redesign.

Each project page must include a landing route, overview, scope, progress or status, evidence or report, resources, and at least one embedded analytical route.

### 11.3 Slide decks

1. AI strategy.
2. GenAI model validation report.
3. Technical architecture explanation.
4. Experiment results.
5. AI governance and controls.
6. Executive decision proposal.
7. Product vision.
8. Transformation roadmap.
9. Technical training.
10. Innovation showcase.

Each deck must include:

- Title.
- Section transition.
- Executive summary.
- Evidence or analytical slide.
- Diagram slide.
- Decision or recommendation slide.
- Closing slide.
- Presenter mode.
- Print/PDF stylesheet.
- Reduced-motion transition mode.

### 11.4 Personal internal pages

1. Data scientist studio.
2. Research and publication portfolio.
3. Internal AI tool laboratory.
4. Talks and presentation archive.
5. Career and project timeline.
6. Knowledge atlas.
7. AI experiment notebook.
8. Mentoring and tutorial hub.
9. Technical leadership portfolio.
10. Team contribution and impact page.

Every personal page must support modular content sections and clearly separate professional facts from illustrative sample content.

### 11.5 Technical explainers

1. System architecture.
2. Coding-agent implementation plan.
3. Agent workflow.
4. Algorithm explanation.
5. Migration plan.
6. Incident postmortem.
7. Architecture decision record.
8. API and integration contract.
9. Data lineage map.
10. Testing and validation strategy.

Each explainer must export as a standalone static bundle and support print or screenshot capture.

---

## 12. Sample Data and Content Policy

### 12.1 Data rules

- Use synthetic data only.
- Do not imitate real internal project names.
- Do not use real customer, employee, account, transaction, or model data.
- Include a visible synthetic-data label in gallery previews.
- Keep source fixtures deterministic.
- Seed random generators.
- Store scenario descriptions with each fixture.
- Include edge cases: missing values, delayed status, negative trends, long labels, and conflicting indicators.
- Use realistic magnitudes and temporal patterns without implying they are CBA figures.

### 12.2 Content pack format

```ts
export interface ExperienceContentPack {
  id: string;
  surface: SurfaceType;
  title: string;
  summary: string;
  audience: Audience[];
  narrative: Record<string, string>;
  datasets: Record<string, TypedDataset>;   // discriminated union, not unknown
  assets: string[];
  syntheticDataNotice: string;
  sourceNotes: string[];
  prohibitedClaims: string[];
}

// Every dataset is one of a closed set of shapes so components can declare
// acceptedDataShapes and the validator can type-check content mappings.
export type TypedDataset =
  | { shape: "time-series"; series: Array<{ id: string; label: string; points: Array<{ t: string; v: number }> }> }
  | { shape: "categorical"; categories: Array<{ id: string; label: string; value: number; status?: string }> }
  | { shape: "table"; columns: Array<{ id: string; label: string; kind: "text" | "number" | "date" | "status" }>; rows: Record<string, string | number>[] }
  | { shape: "kpi-set"; kpis: Array<{ id: string; label: string; value: number; unit?: string; delta?: number; target?: number }> }
  | { shape: "graph"; nodes: Array<{ id: string; label: string; kind: string }>; edges: Array<{ from: string; to: string; kind: string }> }
  | { shape: "hierarchy"; root: HierarchyNode }
  | { shape: "event-log"; events: Array<{ t: string; label: string; severity?: string; detail?: string }> };

export interface HierarchyNode { id: string; label: string; value?: number; children?: HierarchyNode[] }
```

### 12.3 Asset policy

- Assets must be original, generated with documented provenance, licensed, or internally approved.
- Pinterest and other inspiration sites may be used only for visual research, never as asset sources.
- No external asset is copied into the repository without a recorded licence.
- Generated assets must be meaningfully original and reviewed for logos, trademarks, sensitive imagery, and accidental text.
- Runtime hotlinking is prohibited.
- Every asset must have alt text or be marked decorative.
- Large assets must have optimised formats and size budgets.

---

## 13. Gallery Application

The gallery is the primary human entry point into the platform. It must function as a practical discovery tool, not merely a collection of screenshots. Users should be able to start from a business need, browse complete templates for inspiration, inspect reusable components, compare alternatives, and move into the blueprint workflow without understanding the underlying registry model.

Use **Template** as the user-facing term for a complete reference experience. Retain `Experience` as the internal domain term in manifests, schemas, file names, and APIs. The UI must explain this mapping once in the guide and avoid mixing the two terms on the same screen.

### 13.1 Unified landing and browse page

The `/` route must be a dedicated landing and discovery experience. `/browse` must expose the same browse state as a directly addressable route. The page must make templates and components equally discoverable while remaining visually calm and credible in an enterprise environment.

#### Primary user goals

The landing page must help a user:

1. Discover an appropriate starting point without knowing component names.
2. Browse all five template types quickly.
3. Search for a business intent such as “model monitoring,” “project update,” “AI strategy deck,” or “technical architecture.”
4. Switch from a complete template to the individual components used within it.
5. Compare shortlisted templates or components.
6. Open a quick preview without losing browse position.
7. Continue into the Blueprint Lab with the selected context pre-populated.
8. Copy a stable link that preserves the active query, filters, sort order, and browse mode.

#### Page structure

The landing page must contain the following regions in this order:

1. **Global header**
   - Product name and short enterprise-neutral value statement.
   - Primary navigation for Browse, Templates, Components, Grammars, Blueprint Lab, Quality, and Guide.
   - Theme control and reduced-motion control.
   - No account menu in the first release unless required by the deployment environment.

2. **Discovery hero**
   - A restrained headline focused on finding and composing suitable enterprise designs.
   - A prominent search and command field supporting natural-language intent, exact component names, tags, and keyboard shortcuts.
   - Suggested queries based on the five design types; suggestions must be static or registry-derived, not based on personal data.
   - Two clear actions: `Browse templates` and `Find components`.

3. **Browse-mode switcher**
   - Segmented options: `All`, `Templates`, `Components`, and `Design grammars`.
   - Switching mode must preserve compatible search and filter state.
   - The selected mode must be represented in the URL.

4. **Template-type shortcuts**
   - Five visually distinct entry cards for Dashboard, Project Page, Slide Deck, Personal Page, and Technical Explainer.
   - Each card must show the number of approved templates, a one-sentence use case, and a representative preview.
   - Selecting a card applies the matching surface filter rather than navigating to an unrelated bespoke page.

5. **Featured and recommended starting points**
   - Curated collections such as `Executive reporting`, `AI and model risk`, `Technical storytelling`, `Project delivery`, and `Personal impact`.
   - Recommendations are editorial or rule-based in the first release.
   - No opaque behavioural personalisation is permitted.
   - Every recommendation must show a short reason such as “good for executive audiences” or “supports high-density monitoring.”

6. **Unified result area**
   - Responsive grid and compact-list views.
   - Result cards must clearly distinguish Templates, Components, and Grammars.
   - Cards must show title, type, grammar, audience, density, motion level, approval state, and relevant tags without becoming visually crowded.
   - Template cards must show the principal pages or slides and key components used.
   - Component cards must show category, supported surfaces, required data shape, and rendering cost.
   - Result cards must support quick preview, open detail, compare, and use-in-blueprint actions.

7. **Shortlist and comparison tray**
   - Allow up to four items of the same entity type to be compared.
   - Template comparison must include surface, audience, grammar, density, motion, route or slide structure, accessibility status, and component composition.
   - Component comparison must include role, compatible surfaces, content requirements, dependencies, motion behaviour, rendering cost, and compatibility notes.
   - Mixed template/component comparison is not required in the first release.

8. **Recently viewed and saved items**
   - Store recently viewed and saved item identifiers locally in the browser by default.
   - Do not send this information to an analytics or recommendation service.
   - Provide a visible `Clear history` action.
   - The gallery must remain fully usable when local storage is unavailable.

9. **Blueprint call to action**
   - Allow a user to send a selected template, component shortlist, query, and active filters into the Blueprint Lab.
   - Treat the selected template only as inspiration; the resulting blueprint must still be composed at component level.
   - Explain this distinction in the interface to prevent users from assuming the system will copy a template unchanged.

#### Search behaviour

- Search across names, summaries, business intents, audiences, surface types, component roles, grammar descriptions, tags, chart types, diagram types, motion patterns, and “when to use” guidance.
- Support quoted exact matching and forgiving token matching.
- Provide type-ahead suggestions from the compiled registry.
- Debounce text input and perform search locally for the static gallery build.
- Rank exact names first, then hard-filter compatibility, then semantic or weighted metadata relevance.
- Highlight matched metadata without injecting raw HTML.
- Represent query, mode, filters, sort, page, and view density in URL parameters.
- Restore focus and scroll position after closing quick preview.
- Provide a clear-all action and removable filter chips.
- Display active result counts and explain when hard filters removed otherwise relevant items.

#### Quick preview

Quick preview must open as an accessible modal or side drawer and include:

- Live or poster preview.
- Concise design rationale.
- Primary audience and business intents.
- Components used or experiences using the component.
- Motion-level indicator and reduced-motion preview.
- Accessibility and approval summary.
- Actions to open details, compare, save, or use in Blueprint Lab.

Quick preview must trap focus correctly, close with Escape, restore focus to the source card, and remain usable at narrow widths.

#### Sorting and filtering

Supported sort options:

- Relevance.
- Curated order.
- Name.
- Recently added.
- Lowest rendering cost.
- Lowest motion intensity.
- Highest corporate suitability.

Filters must use the shared filter model defined in Section 13.5. On mobile and narrow enterprise laptop layouts, filters must move into a keyboard-accessible drawer with an explicit Apply action. Desktop filters may update immediately.

#### Empty, loading, and error states

- The initial static experience must render useful curated content before search indexing is ready.
- Loading states must preserve layout and avoid animated skeletons when reduced motion is enabled.
- Empty results must explain which filters caused the result and offer one-click relaxation of the narrowest filters.
- Search-index failure must fall back to basic registry filtering and alphabetical browsing.
- Preview failure must show the item metadata and a direct link to the detail page rather than a blank card.
- Broken manifests or missing preview assets must be surfaced in the Quality route and must not crash the landing page.

#### Accessibility and keyboard model

- `/` must have a single clear `h1`, skip link, landmark structure, and logical tab order.
- Search must have an accessible label and announce result-count changes without excessive live-region chatter.
- Browse-mode tabs must use the appropriate tab or segmented-control semantics.
- Grid cards must not contain nested interactive elements with ambiguous focus order.
- Comparison and saved-state changes must be announced to assistive technology.
- All discovery actions must be available without hover.
- Keyboard shortcuts must never override browser or assistive-technology defaults and must be documented in the Guide.

#### Performance requirements

- Do not load full live previews for every card on initial render.
- Use optimised poster frames and load interactive previews only on explicit user action.
- Virtualise or incrementally render large result sets when profiling demonstrates a need.
- Prefetch detail-page code and registry data on user intent, such as focus or sustained hover, rather than prefetching all 50 templates.
- Keep the landing route within the initial gallery JavaScript budget defined in Section 22.
- Search and filter interactions should complete within 100 ms at the expected first-release registry size on the approved baseline laptop.

#### Landing-page acceptance criteria

- A user can reach any approved template or component from `/` without using browser backtracking.
- A natural-language search returns a visibly relevant first page for every query in the landing-page evaluation fixture.
- Query and filter state survives page refresh and can be shared by URL.
- Quick preview preserves browse scroll and keyboard focus.
- Comparison works for two to four templates and for two to four components.
- Recently viewed and saved items do not create external network requests.
- The page passes keyboard, screen-reader, reduced-motion, responsive, visual-regression, and performance tests.
- The page remains useful when JavaScript search indexing fails or browser storage is unavailable.

### 13.2 Routes

```text
/
  dedicated landing page with unified search, category shortcuts, curated collections, and mixed browse results
/browse
  directly addressable unified browse state for templates, components, and grammars
/templates
  user-facing catalogue of all 50 reference templates; maps internally to experiences
/templates/:experienceId
  user-facing template detail route
/experiences
  optional internal or backward-compatible alias for /templates
/experiences/:experienceId
  optional internal or backward-compatible alias for /templates/:experienceId
/components
  component explorer
/components/:componentId
  preview, API, states, compatibility, examples
/grammars
  design grammar explorer
/grammars/:grammarId
  rules and examples
/blueprint-lab
  paste context and inspect composition results
/quality
  test and review status
/guide
  end-user and contributor guide
```

Aliases must use redirects or canonical metadata so the same content is not treated as separate catalogue entries.

### 13.3 Template detail page

Must show:

- Live preview.
- Full-screen preview.
- Viewport controls.
- Light/dark/theme controls.
- Motion-level and reduced-motion controls.
- Design thesis.
- Intended audience and scenarios.
- Inappropriate-use scenarios.
- Routes or slide list.
- Components used.
- Motion components used.
- Design grammar.
- Content pack.
- Accessibility report.
- Performance report.
- Three-pass review record.
- Implementation notes.
- Related templates.
- Alternative component suggestions.
- A clear action to use selected components or the template’s design direction in Blueprint Lab.

### 13.4 Component detail page

Must show:

- Interactive preview.
- Every required state.
- Props and accepted data shapes.
- Compatible surfaces and roles.
- Works-well-with and conflicts-with lists.
- Motion behaviour.
- Reduced-motion behaviour.
- Accessibility properties.
- Performance cost.
- Dependency information.
- Provenance.
- Source path and export name.
- Templates using the component.
- “When to use” and “when not to use.”
- Copyable MCP resource URI.
- A clear action to add the component to a Blueprint Lab shortlist.

### 13.5 Shared filters

- Surface.
- Entity type: template, component, or grammar.
- Audience.
- Business intent.
- Grammar.
- Component category.
- Density.
- Motion level.
- Corporate suitability.
- Theme mode.
- Rendering cost.
- Canvas/WebGL use.
- Print support.
- Approval state.
- Accessibility support.
- Data or content requirements.

The filter model must be implemented once and shared by the landing page, `/browse`, `/templates`, `/components`, and the Blueprint Lab candidate inspector. Each filter must define its URL representation, label, allowed values, compatibility rules, and empty-result relaxation priority.

### 13.6 Blueprint lab

The lab is an internal test interface, not a production authoring tool. **Execution model (locked):** the lab runs the `search`, `composition`, and `validator` packages entirely client-side in the static gallery build — those packages must therefore be browser-safe (no Node APIs). The lab ships as a lazy route chunk with its own budget (Section 22.1) and is never part of the landing-page bundle. In Phase 3 the lab route exists only as a stub that receives and persists a handoff selection; the full lab arrives in Phase 7.

It must:

1. Accept a content summary and constraints.
2. Accept an optional template direction or component shortlist from the landing page.
3. Show the normalised design context.
4. Show filtered and ranked candidates.
5. Explain scores.
6. Produce a blueprint.
7. Show validation findings.
8. Allow one-click alternative generation using controlled parameters.
9. Export blueprint JSON and implementation brief.
10. Never send pasted content to external services by default.

---

## 14. Registry Architecture

### 14.1 Source of truth

Use co-located manifest files:

```text
packages/data-viz/src/risk/KineticRiskHeatmap/
├─ KineticRiskHeatmap.tsx
├─ KineticRiskHeatmap.test.tsx
├─ KineticRiskHeatmap.stories.tsx
├─ KineticRiskHeatmap.manifest.ts
├─ KineticRiskHeatmap.fixtures.ts
└─ index.ts
```

A build script validates and compiles manifests into:

```text
packages/registry/generated/
├─ components.json
├─ experiences.json
├─ grammars.json
├─ motion-sequences.json
├─ compatibility.json
└─ search-documents.json
```

Generated files are committed only if corporate CI requires deterministic artefacts; otherwise they are built in CI and packaged.

### 14.2 Validation rules

Registry build fails when:

- An ID is duplicated.
- A source path or export does not exist.
- A referenced component does not exist.
- A compatibility relation is one-sided when the rule requires symmetry.
- A required state preview is missing.
- A component lacks reduced-motion metadata.
- An approved component lacks provenance.
- An experience references an unapproved component for production mode.
- A grammar lacks differentiation metadata.
- Search text is empty.
- A bundle-cost value is absent.
- A deprecation replacement is missing.

### 14.3 Versioning

- Component IDs are stable.
- Component package versions use semantic versioning.
- Manifest schema versions are explicit.
- Breaking prop changes require a major version.
- Deprecated components remain searchable but are excluded by default.
- Blueprint JSON records component versions.
- The validator warns when a blueprint uses an unavailable version.
- Migration notes are required for breaking changes.

---

## 15. Search and Recommendation Engine

### 15.1 Pipeline

1. Parse and validate request.
2. Build `DesignContext`.
3. Apply hard filters.
4. Generate lexical and semantic candidates.
5. Calculate metadata scores.
6. Apply compatibility-aware diversification.
7. Rerank candidates by composition role.
8. Generate explanations.
9. Return alternatives.

### 15.2 Hard filters

Remove components that violate:

- Surface compatibility.
- Prohibited dependencies.
- Runtime network policy.
- Required accessibility features.
- Corporate suitability ceiling.
- Theme support.
- Data shape.
- Rendering capability.
- Motion maximum.
- Approval state.
- Required layout conditions.

Hard constraints may never be overridden by semantic relevance.

### 15.3 Scoring model

Initial deterministic score:

```text
score =
  0.24 * business_intent_match
+ 0.16 * audience_match
+ 0.14 * surface_role_match
+ 0.10 * content_shape_match
+ 0.10 * design_tone_match
+ 0.08 * density_match
+ 0.07 * grammar_coherence
+ 0.05 * motion_match
+ 0.03 * performance_fit
+ 0.03 * reuse_confidence
- incompatibility_penalties
- redundancy_penalties
```

Weights must be configuration, not hard-coded throughout the codebase.

### 15.4 Semantic search modes

Support two adapters:

- `local-lexical`: deterministic token, synonym, and taxonomy search (MiniSearch + a curated business-intent synonym map); always available.
- `enterprise-embedding`: optional approved embedding index; enhancement only.

**Commitment (locked):** the Section 3 retrieval targets must be met by `local-lexical` alone; embeddings may improve but never carry the targets. Because this is the plan's riskiest assumption, the first execution slice (Section 35) includes a retrieval feasibility spike: 20 labelled requests against the slice's component set, scored before any expansion work begins. If the spike shows lexical retrieval structurally short of target, the fix is a richer controlled vocabulary (business-intent taxonomy, per-component `searchText` authoring standards) — recorded as an ADR — not a silent target reduction.

The embedding adapter receives only registry metadata and user-provided content that has been explicitly allowed by the host workflow.

### 15.5 Diversification

Use maximal marginal relevance or an equivalent deterministic strategy to prevent the top results from being near-duplicates. Diversity features include:

- Grammar.
- Component family.
- Layout role.
- Chart form.
- Motion pattern.
- Visual density.

### 15.6 Explanation

Each recommendation must state:

- Which content need it addresses.
- Which constraints it satisfies.
- Why it is preferable to a generic alternative.
- What data it requires.
- Any performance or accessibility caveat.
- Which fallback is available.

### 15.7 Evaluation set

Create at least 100 labelled design requests:

- 20 per surface.
- Multiple audiences.
- Low, medium, and high density.
- Motion levels 0–3.
- Requests with prohibited WebGL or external network.
- Requests with incomplete content.
- Requests where similar language maps to different surfaces.
- Requests where executive and technical audiences require different components.
- Negative examples that should retrieve no advanced motion.

Each case records:

- Expected component categories.
- Required components.
- Acceptable alternatives.
- Prohibited components.
- Expected grammar range.
- Hard constraints.
- Reviewer rationale.

---

## 16. Composition Engine

### 16.1 Composition stages

1. Select grammar and theme.
2. Select shell and navigation.
3. Create route or slide information architecture.
4. Map user content to sections.
5. Select components by role.
6. Check compatibility incrementally.
7. Define responsive behaviour.
8. Define motion sequence.
9. Add fallbacks.
10. Produce blueprint evidence.

### 16.2 Composition rules

- Exactly one primary shell per route.
- At most one dominant visual per viewport.
- No more than two high-render-cost components visible simultaneously without explicit approval.
- A primary visual requires a summary or accessible textual equivalent.
- Executive pages must not open with dense raw tables.
- Technical pages must not hide critical details behind animation-only interactions.
- Navigation depth greater than two requires breadcrumbs or an equivalent location indicator.
- Dashboard routes with more than six widgets require grouping or drill-down.
- Slide decks must have one narrative purpose per slide.
- Personal pages may use motion level 3 only on landing or showcase routes.
- Technical explainers may use spatial diagrams, but the reading sequence must remain clear.
- Mixed-grammar composition requires an explicit rationale and a compatibility pass.

### 16.3 Alternative blueprints

Generate up to three alternatives:

- `conservative`: lower motion and simpler structure.
- `recommended`: best balance.
- `expressive`: higher creative intensity within constraints.

Alternatives must not be trivial theme swaps.

---

## 17. Validator

### 17.1 Validation domains

- Schema.
- Registry references.
- Component compatibility.
- Route and information architecture.
- Content coverage.
- Accessibility.
- Motion.
- Performance.
- Responsive behaviour.
- Corporate suitability.
- Originality.
- Asset and dependency policy.
- Theme integrity.

### 17.2 Representative rule IDs

```text
SCHEMA-001 invalid blueprint
REG-001 unknown component
COMP-001 explicit component conflict
COMP-002 missing required companion
IA-001 excessive navigation depth
IA-002 multiple dominant visuals
CONTENT-001 required content unmapped
CONTENT-002 fabricated-value placeholder
A11Y-001 missing textual equivalent
A11Y-002 reduced-motion fallback absent
A11Y-003 keyboard interaction unsupported
MOTION-001 surface motion limit exceeded
MOTION-002 signature-moment count is not exactly one
MOTION-003 ad-hoc easing or duration outside the motion package
PERF-001 simultaneous high-cost visuals
PERF-002 missing lazy-load boundary
CORP-001 expressive component in restricted mode
CORP-002 unapproved theme asset
ORIG-001 excessive similarity to existing sample
ASSET-001 missing provenance
DEP-001 prohibited dependency
THEME-001 hard-coded brand value
```

### 17.3 Severity policy

- `error`: blueprint cannot be implemented.
- `warning`: implementation may proceed only with an explicit waiver.
- `info`: improvement recommendation.

### 17.4 Waivers

A waiver must record:

- Rule ID.
- Reason.
- Requester.
- Approver.
- Expiry or review date.
- Scope.
- Compensating control.

No waiver may bypass missing consent, confidential-data rules, or unlicensed assets.

---

## 18. MCP Server

### 18.0 Intelligence boundary (locked)

The baseline plan left a contradiction: the server may not initiate LLM sampling, yet `analyse_design_context` appeared to perform natural-language understanding. Resolution:

- **The calling agent (the skill) owns all semantic interpretation.** It reads the user's prompt and content, classifies content items, counts the content inventory, and extracts intent hints — it is an LLM; this is its job.
- **The server owns deterministic normalisation.** `analyse_design_context` validates the agent-supplied structure, fills defaults from surface rules, detects contradictions (e.g. executive audience + high density + motion 3), computes grammar recommendations from structured features only, and returns the canonical `DesignContext` with explicit `assumptions` for every field it defaulted.
- The server also runs cheap deterministic extraction (markdown heading counts, table/code-block detection, number density) purely as a **cross-check**: where its counts disagree materially with the agent's inventory, it flags the field in `assumptions` rather than trusting either side silently.
- Free-text fields that reach the server (`request`, `dissatisfaction`) are used only for lexical retrieval and audit context, never for hidden semantic inference the agent cannot reproduce.

This keeps the server deterministic, testable, and safe to run without model access, while placing judgement where the judgement engine already is.

### 18.1 Protocol decision

At implementation start, verify the official TypeScript SDK status and use the latest supported stable production major. The server's domain logic must sit behind an internal adapter so an SDK major upgrade changes transport and registration code, not the search or composition packages.

**Build tooling (locked):** server scaffolding and tool design are executed through the `mcp-server-dev:build-mcp-server` skill. This plan pre-answers its decision points — deployment model: local stdio; posture: read-only design service; schemas: Zod v4 from `packages/contracts`; SDK: stable v1.x behind the internal adapter. The skill's patterns govern tool naming, input validation, and error shaping; where a skill recommendation conflicts with a locked decision in this plan, the plan wins and the deviation is noted in ADR-001.

Baseline note for 11 July 2026: the official repository describes v2 as beta and v1.x as the supported production release until the planned stable v2 release. Record the final selection in `docs/decisions/ADR-001-mcp-sdk-version.md`.

### 18.2 Transport modes

Support:

- `stdio` for local coding agents.
- Streamable HTTP only when an approved internal deployment requires it.

Default production posture:

- Read-only design service.
- No repository write tool.
- No arbitrary filesystem access.
- No external web calls.
- No LLM sampling initiated by the server.
- No confidential content persistence.
- Structured audit logs without raw user content.

### 18.3 MCP tools

#### `analyse_design_context`

Input (revised per Section 18.0 — the agent supplies pre-extracted structure; raw text is optional audit/cross-check material):

```ts
{
  request: string;
  content?: string;
  surface: SurfaceType;
  audience?: Audience[];
  extractedInventory?: Partial<ContentInventory>; // agent-side extraction; server cross-checks
  intentHints?: string[];                         // agent-side intent classification
  repositoryConstraints?: Partial<TechnicalConstraints>;
  preferences?: {
    tone?: string[];
    density?: ContentDensity;
    motionLevel?: MotionLevel;
    themeMode?: ThemeMode;
    corporateSuitability?: CorporateSuitability;
  };
}
```

Output:

```ts
{
  context: DesignContext;
  missingContent: string[];
  assumptions: string[];
  recommendedGrammars: Array<{ id: string; score: number; reason: string }>;
}
```

#### `search_components`

Input:

```ts
{
  context: DesignContext;
  roles: CompositionRole[];
  limitPerRole: number;
  includeExperimental: boolean;
}
```

Output:

```ts
{
  candidates: Record<CompositionRole, RankedComponent[]>;
  rejectedSummary: Record<string, number>;
}
```

#### `get_component`

Input:

```ts
{
  componentId: string;
  includeSourceGuidance: boolean;
  includeExamples: boolean;
}
```

Output:

```ts
{
  manifest: ComponentManifest;
  usage: string;
  examples: string[];
  resourceUris: string[];
}
```

#### `compose_design`

Input:

```ts
{
  context: DesignContext;
  selectedComponentIds?: string[];
  alternativeMode: "conservative" | "recommended" | "expressive";
}
```

Output:

```ts
{
  blueprint: DesignBlueprint;
}
```

#### `validate_composition`

Input:

```ts
{
  blueprint: DesignBlueprint;
  validationProfile: "draft" | "corporate" | "release";
}
```

Output:

```ts
{
  result: ValidationResult;
}
```

#### `generate_implementation_brief`

Input:

```ts
{
  blueprint: DesignBlueprint;
  repositorySummary: {
    packageManager: string;
    sourceRoot: string;
    router: string;
    existingDependencies: string[];
    designSystemPresent: boolean;
  };
}
```

Output:

```ts
{
  brief: {
    summary: string;
    filesToCreate: string[];
    filesToModify: string[];
    imports: string[];
    contentMappings: Record<string, string>;
    implementationSteps: string[];
    verificationCommands: string[];
    rollbackPlan: string[];
  };
}
```

#### `suggest_alternatives`

Input:

```ts
{
  blueprint: DesignBlueprint;
  dissatisfaction: string;
  preserveComponentIds: string[];
  replaceComponentIds: string[];
}
```

Output:

```ts
{
  alternatives: DesignBlueprint[];
}
```

### 18.4 MCP resources

```text
enterprise-design://components/{componentId}
enterprise-design://experiences/{experienceId}
enterprise-design://grammars/{grammarId}
enterprise-design://motion/{sequenceId}
enterprise-design://guides/accessibility
enterprise-design://guides/motion
enterprise-design://guides/data-visualisation
enterprise-design://guides/corporate-suitability
enterprise-design://schemas/component-manifest
enterprise-design://schemas/design-blueprint
enterprise-design://quality/{entityType}/{entityId}
```

Resources expose version, MIME type, title, description, and approval status.

### 18.5 MCP prompts

- `design-dashboard`
- `design-project-page`
- `design-slide-deck`
- `design-personal-page`
- `design-technical-explainer`
- `review-existing-design`
- `make-design-more-corporate`
- `make-design-more-expressive`
- `replace-high-cost-components`

### 18.6 Error model

Every tool error returns:

```ts
{
  code:
    | "INVALID_INPUT"
    | "NO_MATCH"
    | "CONSTRAINT_CONFLICT"
    | "UNKNOWN_COMPONENT"
    | "INVALID_BLUEPRINT"
    | "REGISTRY_UNAVAILABLE"
    | "INTERNAL_ERROR";
  message: string;
  details: string[];
  remediation: string[];
  requestId: string;
}
```

Raw stack traces never leave the server in corporate mode.

---

## 19. Agent Skill

### 19.1 Skill objective

The skill behaves as an enterprise design director and implementation coordinator. It must use the MCP rather than memorising component IDs.

### 19.2 Required workflow

1. Inspect the user's request and repository.
2. Identify target surface.
3. Identify content that must be preserved.
4. Identify missing content without inventing facts.
5. Determine audience and corporate-suitability mode.
6. Call `analyse_design_context`.
7. Present material assumptions only when they affect correctness.
8. Call `search_components` by role.
9. Call `compose_design`.
10. Call `validate_composition`.
11. Resolve errors by changing the blueprint, not by ignoring findings.
12. Call `generate_implementation_brief`.
13. Apply the brief using the coding agent's normal repository tools.
14. Run build, typecheck, tests, accessibility, and responsive checks.
15. Compare the rendered result with the blueprint.
16. Run three iteration passes.
17. Provide a completion summary with evidence and remaining limitations.

### 19.3 Content-preservation policy

The skill must classify each user input as:

- `immutable-fact`
- `editable-copy`
- `data`
- `structural-hint`
- `design-preference`
- `unknown`

It may rewrite `editable-copy` only when explicitly asked. It must not alter `immutable-fact` or `data`.

### 19.4 Repository adaptation

The skill must:

- Reuse the repository's routing and state-management patterns.
- Avoid replacing the existing design system without permission.
- Avoid adding an unapproved dependency when an existing component can satisfy the need.
- Put generated integration components in a clearly named feature directory.
- Preserve existing lint, formatting, and test conventions.
- Avoid broad refactoring unrelated to the design task.
- Produce a rollback-safe set of commits.

### 19.5 Skill evaluation scenarios

Agent evaluations are expensive (each is a full agent session against a fixture repository), so they run nightly and before release, never per-PR. Five smoke scenarios (one per surface) form a fast subset runnable on demand.

Create at least 25 scenarios:

- Five per surface.
- One minimal-content request per surface.
- One strict low-motion request per surface.
- One high-density specialist request per applicable surface.
- One dependency-constrained repository per surface.
- One request to revise an existing design rather than create a new one.

Evaluate:

- Correct MCP tool order.
- Content preservation.
- Constraint adherence.
- Blueprint validity.
- Implementation success.
- Explanation quality.
- No invented business facts.

---

## 20. Security, Privacy, and Corporate Controls

### 20.1 Data handling

- Treat all user content as potentially confidential.
- Do not persist raw prompts or pasted content by default.
- Redact or hash request identifiers in logs.
- Log metadata such as tool, duration, status, and component IDs.
- Provide a configuration switch for zero-content logging.
- Do not send content to external embedding or analytics services.
- Store registry and synthetic sample data only.
- Document data flow and trust boundaries.
- Run the MCP server locally or in an approved internal environment.

### 20.2 Tool safety

- All tools validate inputs against schemas.
- Tool descriptions are explicit about read-only behaviour.
- No tool accepts arbitrary executable code.
- No tool accepts arbitrary filesystem paths.
- Resource URI parameters are validated against registry IDs.
- HTTP mode enforces authentication, origin/host checks, rate limits, request-size limits, and timeouts.
- Stdio mode validates environment configuration.
- Server logs never contain secrets.
- Dependency scanning and secret scanning run in CI.

### 20.3 Supply-chain controls

- Use a lockfile.
- Pin direct dependencies.
- Record dependency purpose and owner.
- Run licence scanning.
- Run vulnerability scanning.
- Avoid packages with unnecessary transitive dependency weight.
- Create adapters around charting, motion, and MCP SDK dependencies.
- No package post-install script is accepted without review.
- Generate a software bill of materials for release builds where the environment supports it.

### 20.4 Asset controls

- Block builds for missing provenance.
- Block unapproved remote URLs.
- Scan SVGs and HTML for scripts and external references.
- Sanitize any user-supplied HTML.
- Disallow inline event handlers in static content.
- Use a restrictive content security policy for deployed gallery builds.

---

## 21. Accessibility and Inclusive Design

Target WCAG 2.2 AA as the release baseline, with selected higher-level motion protections.

### 21.1 Mandatory checks

- Semantic landmarks.
- Logical headings.
- Keyboard operation.
- Visible focus.
- Focus not obscured.
- Text and non-text contrast.
- Reflow at narrow widths.
- Zoom support.
- Target size.
- Labels and instructions.
- Accessible names, roles, and values.
- Status announcements.
- Error identification.
- Alternative representations for charts and diagrams.
- Reduced motion.
- Pause/stop controls for non-essential continuous motion.
- No flashes above safe thresholds.
- No interaction that depends solely on drag, hover, or precise pointing.

### 21.2 Testing

- Automated axe checks for every component story and experience route.
- Keyboard journey tests.
- Screen-reader spot checks for representative complex components.
- High-contrast and forced-colours checks where supported.
- Reduced-motion screenshot suite.
- Manual chart and diagram textual-equivalent review.
- Accessibility report stored with every approved component and experience.

---

## 22. Performance and Runtime Budgets

### 22.1 Budgets

Set per-route budgets and enforce them in CI:

- Initial gallery route JavaScript: below 250 KB gzip, **excluding** lazy chunks, registry data, and the search index.
- Registry JSON + search index: below 300 KB gzip combined, loaded lazily after first paint; the landing page renders curated static content before the index arrives (Section 13.1 already requires this).
- Blueprint Lab lazy chunk (search + composition + validator packages): below 400 KB gzip.
- Standard experience initial route: below 350 KB gzip.
- Heavy visualisation routes: below 500 KB gzip with lazy-loaded heavy dependencies (the ECharts chunk is always lazy).
- No single uncompressed image above 1 MB without documented justification.
- No animation may cause sustained main-thread blocking; signature sequences must hold 60 fps on the baseline device, verified with a Playwright trace on a throttled profile.
- Core routes must remain usable on an enterprise laptop without a discrete GPU.
- WebGL experiences must provide a non-WebGL fallback.
- Slide transitions must remain smooth on the approved baseline device.

**Baseline device and browsers (default, replace only with evidence):** a mid-range corporate laptop profile — Playwright with 4× CPU throttling, 1440×900 — in Chromium and Microsoft Edge (the default corporation-approved secondary browser).

### 22.2 Techniques

- Route-level splitting.
- Component-level lazy loading for heavy charts and diagrams.
- Deterministic server-free static data.
- Memoisation only where profiling shows value.
- Virtualised long tables.
- Reduced data density at narrow viewports.
- Prefer CSS transforms and opacity for motion.
- Pause offscreen animations.
- Avoid continuous background animation in dashboards.
- Use static poster frames for complex motion previews.

---

## 23. Three-Pass Iteration Framework

Every component and experience must pass all three reviews.

**Review execution model (locked):** all three passes are performed by Fable as structured self-reviews in a *separate session from the one that built the artefact*, working only from the rendered output, screenshots, and checklists — not from memory of writing the code. Each pass produces a `ReviewRecord` (schema below) committed under `docs/reviews/`. The human approver spot-checks: every anchor experience in full, and a random 20% sample of each expansion batch. A human rejection of a sampled experience fails the whole batch's review credibility and triggers re-review of that batch.

```ts
export interface ReviewRecord {
  entityId: string;
  pass: 1 | 2 | 3;
  reviewedAt: string;
  sessionIsolated: boolean;        // must be true
  checklist: Array<{ item: string; result: "pass" | "fail" | "n/a"; evidence: string }>;
  boardroomTest?: Array<{ check: string; result: "pass" | "fail"; note: string }>; // pass 2 only
  screenshots: string[];
  issuesFound: string[];
  changesMade: string[];
  outcome: "approved" | "revise";
}
```

### Pass 1 — Information and usability

Review:

- Intended user and decision.
- Information hierarchy.
- Navigation.
- Readability.
- Content completeness.
- Chart appropriateness.
- Empty and failure states.
- Responsive structure.

Evidence:

- Review checklist.
- Screenshots at three viewports.
- Issues found and changes made.
- Reviewer sign-off.

### Pass 2 — Visual and motion direction

Review:

- Distinctiveness.
- Grammar coherence.
- Typography.
- Colour discipline.
- Spacing.
- Visual rhythm.
- Motion purpose.
- Signature moment: present, single, memorable, meaning-bearing (Section 3.4 check 5).
- Motion identity compliance: only platform easing tokens and named sequences (Section 4.3).
- Reduced-motion equivalence.
- The full Boardroom Test (Section 3.4), all five checks recorded.
- Opportunities to simplify.
- Opportunities to create a stronger focal idea.

Evidence:

- Before/after screenshots.
- Motion recording where applicable.
- Similarity comparison against existing experiences.
- Updated quality score.

### Pass 3 — Engineering and governance

Review:

- Build and typecheck.
- Tests.
- Accessibility.
- Performance.
- Dependencies.
- Asset provenance.
- Security.
- Long content.
- Data edge cases.
- Print/screenshot behaviour.
- Theme switching.
- Browser compatibility.

Evidence:

- CI run.
- Accessibility report.
- Performance report.
- Dependency and asset report.
- Final reviewer sign-off.

### Acceptance rule

An experience cannot be marked complete if any review record contains an unresolved error or an undocumented warning.

---

## 24. Originality and Similarity Controls

### 24.1 Similarity features and metric (locked)

**Metric:** each experience is represented as a feature vector of the attributes below, extracted automatically from its manifest and blueprint by `scripts/quality/similarity-report`. Pairwise similarity is a weighted Gower coefficient: categorical features score 1 on exact match, set-valued features use Jaccard overlap, numeric features use normalised absolute difference. Weights: structural features (shell, navigation, section topology, grid) 2×; visual features (typography profile, palette profile, surface treatment, hero composition) 1.5×; content-mix features (chart forms, diagram forms, density, route count) 1×; motion features (signature sequence, motion profile) 1.5×. **Same-surface threshold: similarity ≤ 0.65. Cross-surface threshold: ≤ 0.80.** Weights and thresholds live in `scripts/quality/similarity.config.ts`; changes require an ADR.

Represent each experience using:

- Shell type.
- Navigation position and behaviour.
- Section topology.
- Grid structure.
- Typography family and scale profile.
- Palette profile.
- Surface treatment.
- Dominant chart forms.
- Diagram forms.
- Motion sequence.
- Density.
- Grammar.
- Hero composition.
- Card usage.
- Route count.

### 24.2 Review rule

- Run automated feature similarity.
- Generate side-by-side contact sheets.
- Require manual review of the five nearest neighbours.
- Reject experiences that differ primarily by colour or content.
- Require a written design thesis for each experience.
- Require at least three structural differentiators from every same-category nearest neighbour.

---

## 25. Test Strategy

### 25.1 Unit tests

- Token generation.
- Theme completeness.
- Manifest validation.
- Registry lookup.
- Compatibility graph.
- Hard filters.
- Scoring.
- Diversification.
- Blueprint construction.
- Validator rules.
- MCP input and output schemas.
- Content-preservation classifier.
- Utility hooks and reducers.

### 25.2 Component tests

- Rendering.
- Accessible names.
- Keyboard interaction.
- State variants.
- Reduced motion.
- Theme switching.
- Long labels.
- Error boundaries.
- Data limits.
- Fallback selection.

### 25.3 Integration tests

- Registry build from package manifests.
- Search through compiled registry.
- Compose and validate a blueprint.
- MCP tool call to domain service.
- Gallery landing page from the compiled registry and search index.
- Shared URL filter state across landing, template, component, and Blueprint Lab routes.
- Gallery detail page from registry data.
- Experience route using shared packages.
- Skill fixture from request to implementation brief.

### 25.4 End-to-end tests

Critical journeys:

1. Open the landing page, search across all entity types, and switch between Templates, Components, and Grammars without losing compatible state.
2. Browse template-type shortcuts and filter by surface.
3. Open quick preview, close it, and verify scroll position and keyboard focus are restored.
4. Compare two to four templates and two to four components.
5. Save and clear local recently viewed or shortlisted items without external network requests.
6. Share and reload a `/browse` URL containing query, mode, filters, sort, and view state.
7. Send a template direction and component shortlist from the landing page into Blueprint Lab.
8. Inspect a component and view all states.
9. Use Blueprint Lab to analyse a request.
10. Generate and validate a blueprint.
11. Export a blueprint and implementation brief.
12. Open every template route.
13. Navigate every slide deck.
14. Toggle reduced motion and themes.
15. Use keyboard-only navigation.
16. Load static explainers directly by URL.
17. Simulate unavailable local storage and failed search-index loading and verify graceful fallback behaviour.

### 25.5 Visual regression

Capture:

- Desktop 1440×900.
- Laptop 1280×800.
- Tablet 768×1024.
- Mobile 390×844 where the surface supports mobile.
- Reduced motion.
- Light and dark.
- Optional CBA theme only in approved internal CI.

Dynamic charts must use deterministic fixtures and frozen clocks.

### 25.6 Retrieval tests

- Precision at k.
- Recall of required categories.
- Hard-constraint violation rate.
- Diversity.
- Explanation correctness.
- Stability for identical requests.
- Sensitivity to audience and motion changes.
- No-match behaviour.

### 25.7 Composition tests

- Valid role coverage.
- Conflict detection.
- Missing companion detection.
- Performance limit detection.
- Navigation depth.
- Content coverage.
- Alternative blueprint distinction.
- Responsive fallback presence.

---

## 26. CI/CD and Release

### 26.1 Pull-request pipeline (tiered — affected scope only)

The baseline plan ran everything on every PR; at 50 experiences × 4 viewports × theme × motion variants that is hours of CI per change. Locked tiering:

Always on every PR (fast, full-repo):

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test            # unit + component tests, affected-first ordering
pnpm registry:validate
pnpm build
pnpm quality:assets
pnpm quality:dependencies
```

Scoped to affected packages/experiences on the PR (determined by workspace dependency graph):

```bash
pnpm test:a11y      --filter=affected
pnpm test:visual    --filter=affected
pnpm test:e2e       --project=chromium --grep=affected-journeys
```

Full-repo on every PR only when cheap and load-bearing:

```bash
pnpm test:retrieval     # runs against the compiled registry; minutes, not hours
pnpm test:composition
```

### 26.2 Main-branch and nightly pipeline

In addition, on merge to main and nightly:

- Full visual, a11y, and e2e matrices across all experiences.
- Full browser matrix (Chromium + Edge).
- Performance budgets and 60 fps motion traces.
- Full similarity and reuse reports.
- Gallery static deployment.
- MCP package build.
- Skill evaluation suite (nightly only — agent evaluations are expensive; see Section 19.5).
- SBOM and release artefacts.
- Broken-link and resource-URI checks.
- Full screenshot catalogue.

### 26.3 Deployment targets

Support:

- Static gallery on an approved internal static host.
- Local gallery build.
- Optional Netlify deployment for non-confidential external demonstration only.
- MCP stdio package for local agent configuration.
- Approved internal Streamable HTTP deployment when required.

The build must not assume Netlify-specific APIs.

### 26.4 Release artefacts

- Gallery bundle.
- MCP server package.
- Optional MCPB bundle (`.mcpb`) for zero-setup local installation, packaged via `mcp-server-dev:build-mcpb`; nice-to-have, not release-blocking.
- Component packages.
- Registry JSON bundle.
- Skill directory.
- Release notes.
- Migration notes.
- Quality report.
- Asset and dependency manifest.
- Installation guide.
- Demo content packs.

---

## 27. Implementation Phases

**Commitment model (locked):** the committed scope is the first execution slice (Section 35), which cuts vertically through Phases 1–3 and thin slices of 4, 7, 8, and 9. Phases beyond the slice are planned but re-approved by the human approver after the slice ships, using slice evidence (retrieval spike results, reuse ratio, Boardroom Test outcomes). Indicative effort weighting for expectation-setting — Foundation (P0–P3) ~20%, anchors and library (P4–P5) ~30%, expansion (P6) ~25%, intelligence + MCP + skill (P7–P9) ~15%, hardening (P10) ~10%. The single largest schedule risk is P6; it is explicitly cuttable to 25–30 experiences without invalidating the platform, and that decision point is scheduled at the end of P5.

## Phase 0 — Decision ratification and governance baseline

### Outcome

All decisions this revision pre-made are ratified (or consciously overturned) by the human approver, recorded as ADRs, before any component code exists. Phase 0 is now a short ratification pass, not a discovery project — there is no committee to consult.

### Tasks

- [ ] Ratify the executor/approver model (Fable executes and self-reviews with evidence; owner approves; sampling rules in Section 23).
- [ ] Ratify the default ADRs written into this revision, verifying latest stable versions at ratification time:
  - ADR-001 MCP SDK and build tooling: official TypeScript SDK, stable v1.x behind an internal adapter; server built via the `mcp-server-dev:build-mcp-server` skill (Section 18.1).
  - ADR-002 Charts: Apache ECharts behind adapter + D3 modules for signature visuals.
  - ADR-003 Motion: Motion for React behind adapter + CSS keyframes; motion identity per Section 4.3.
  - ADR-004 Workbench: Storybook.
  - ADR-005 Search: MiniSearch lexical baseline; embeddings optional post-release.
  - ADR-006 Deployment: static gallery build + local MCP stdio; Netlify demo optional.
  - ADR-007 Distribution: source vendoring per Section 5.2.
  - ADR-008 Schema: Zod v4 as single source of truth.
- [ ] Record content-classification and logging rules (defaults in Section 20 stand unless overridden).
- [ ] Record that the optional CBA theme is deferred until approved token values exist; the platform must build without it from day one.
- [ ] Create the design constitution document (Section 4, including the motion identity) as a versioned artefact.
- [ ] Create quality scorecards and the ReviewRecord template (Section 23).
- [ ] Create the initial risk register from Section 29.

### Acceptance

- Every ADR is ratified or replaced, with a one-line rationale each.
- No material dependency, hosting, brand, privacy, or browser question remains implicit.
- Optional CBA branding can be excluded entirely.

---

## Phase 1 — Workspace, contracts, tokens, and quality harness

### Outcome

A buildable monorepo with stable contracts and automated validation.

### Tasks

- [ ] Create pnpm workspace and base TypeScript configuration.
- [ ] Create shared lint and formatting configuration.
- [ ] Configure strict TypeScript.
- [ ] Create `packages/contracts`.
- [ ] Implement all schemas listed in Section 7.
- [ ] Create schema round-trip and invalid-fixture tests.
- [ ] Create `packages/design-tokens`.
- [ ] Define semantic token contract.
- [ ] Generate CSS variables and TypeScript token types.
- [ ] Create enterprise-neutral light and dark themes.
- [ ] Create theme completeness and contrast tests.
- [ ] Create empty optional CBA theme adapter with no unapproved values.
- [ ] Create `packages/testing`.
- [ ] Configure Vitest, Testing Library, Playwright, and accessibility helpers.
- [ ] Create CI skeleton.
- [ ] Create registry validation CLI skeleton.
- [ ] Create documentation site structure and contribution guide.

### Acceptance

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass.
- Invalid contracts fail with actionable messages.
- Themes can switch without component code.
- The repository contains no CBA values or assets except approved theme inputs.

---

## Phase 2 — Design grammars and foundational primitives

### Outcome

Ten machine-readable grammars and the low-level components needed to compose higher-level experiences.

### Tasks

- [ ] Write grammar specifications and contraindications.
- [ ] Implement grammar schema and registry.
- [ ] Build typography specimens.
- [ ] Build colour and chart-palette specimens.
- [ ] Build motion-level specimens.
- [ ] Build accessible button, link, input, tabs, disclosure, dialog, tooltip, and menu primitives.
- [ ] Build skeleton, empty, error, and status primitives.
- [ ] Build focus and reduced-motion utilities.
- [ ] Build responsive container, grid, stack, cluster, split, and sidebar primitives.
- [ ] Create component workbench stories for every state.
- [ ] Run pairwise grammar differentiation review.
- [ ] Approve at least six grammars before anchor experiences; the remaining four may be refined during anchor work but must be approved before expansion.

### Acceptance

- Each grammar has five or more differences from every neighbouring grammar.
- All primitives pass automated accessibility tests.
- Motion-level controls work globally.
- No primitive depends on the optional CBA theme.

---

## Phase 3 — Registry, metadata, and gallery foundation

### Outcome

Components and experiences can be registered, validated, found, and previewed.

### Tasks

- [ ] Implement co-located manifest pattern.
- [ ] Implement registry compiler.
- [ ] Implement compatibility graph.
- [ ] Implement manifest validation rules.
- [ ] Implement experience and grammar manifests.
- [ ] Create gallery application shell.
- [ ] Create the dedicated `/` landing page and `/browse` unified discovery route.
- [ ] Implement the shared search index, URL-state model, browse-mode switcher, category shortcuts, curated collections, quick preview, comparison tray, and local-only saved/recent state.
- [ ] Create template browser using the user-facing Template terminology while retaining Experience in internal contracts.
- [ ] Create component browser.
- [ ] Create grammar explorer.
- [ ] Create detail-page layouts.
- [ ] Add viewport, theme, and reduced-motion controls.
- [ ] Add registry quality dashboard.
- [ ] Add `/guide` foundation.
- [ ] Add route and resource-link tests.

### Acceptance

- A sample component appears automatically in the gallery from its manifest.
- Invalid references block the build.
- Registry data has deterministic ordering.
- Component and template routes are directly addressable.
- The landing page can search, filter, preview, compare, save locally, deep-link, and hand a selection to the Blueprint Lab **stub route**, which persists the handoff payload for the full lab delivered in Phase 7.
- Landing-page discovery works with search indexing disabled and with browser storage unavailable.
- The quality dashboard exposes missing approvals and metadata.

---

## Phase 4 — Ten anchor experiences

### Outcome

Two exceptional, structurally different experiences per surface, establishing the visual and technical range.

### Anchor set

- Dashboard:
  - AI risk command centre.
  - Model monitoring cockpit.
- Project page:
  - AI model validation hub.
  - Enterprise transformation programme.
- Slide deck:
  - AI strategy.
  - Technical architecture explanation.
- Personal page:
  - Data scientist studio.
  - Knowledge atlas.
- Explainer:
  - Agent workflow.
  - System architecture.

### Workflow for each anchor

- [ ] Write design thesis.
- [ ] Create content pack.
- [ ] Choose primary grammar.
- [ ] Sketch information architecture.
- [ ] Identify reusable components before page-local code.
- [ ] Implement missing shared components test-first.
- [ ] Compose experience.
- [ ] Add manifest and gallery entry.
- [ ] Run Pass 1.
- [ ] Resolve Pass 1 findings.
- [ ] Run Pass 2.
- [ ] Resolve Pass 2 findings.
- [ ] Run Pass 3.
- [ ] Resolve Pass 3 findings.
- [ ] Record screenshots, scores, and approval.
- [ ] Update grammar rules based on evidence.
- [ ] Add retrieval evaluation cases derived from the experience.

### Acceptance

- Ten anchors pass all quality gates.
- At least 50 shared components exist.
- Anchors demonstrate all ten grammars or document why a grammar is deferred to expansion.
- Same-surface anchors are structurally distinct.
- No anchor depends on a runtime external service.

---

## Phase 5 — Component library completion

### Outcome

A sufficient reusable catalogue to compose the remaining 40 experiences without creating isolated one-offs.

### Tasks

- [ ] Audit component gaps from anchor builds.
- [ ] Complete structural shell and navigation catalogue.
- [ ] Complete content and decision components.
- [ ] Complete chart adapter and chart catalogue.
- [ ] Complete diagram adapter and diagram catalogue.
- [ ] Complete motion primitives and sequences.
- [ ] Complete browser-slide presentation package.
- [ ] Add state coverage.
- [ ] Add performance metadata and fallbacks.
- [ ] Add provenance and approval records.
- [ ] Add component-level visual regression.
- [ ] Build `executive-light` and `technical-dark` themes (Section 8.1 build order).
- [ ] Freeze manifest schema version 1.0. Before the freeze, the schema may change freely; every pre-freeze breaking change must ship with a codemod or compiler migration that updates all in-repo manifests in the same commit, so earlier phases never hold stale manifests.
- [ ] Publish internal alpha package set.
- [ ] **Decision point:** with reuse and similarity evidence from anchors, the approver confirms Phase 6 scope — full 40 expansion experiences or the reduced 25–30 set (Section 27 commitment model).

### Acceptance

- All component categories meet functional coverage needs.
- Every approved component has all required metadata.
- Every high-cost component has a lazy-load strategy and fallback.
- At least 80% of anchor UI code is shared.

---

## Phase 6 — Forty expansion experiences

### Outcome

The complete 50-experience gallery with strong diversity and reuse.

### Batch order

1. Remaining dashboards.
2. Remaining project pages.
3. Remaining technical explainers.
4. Remaining slide decks.
5. Remaining personal pages.

This order establishes analytical and technical building blocks before the most expressive compositions.

### Tasks per batch

- [ ] Approve eight design theses.
- [ ] Run similarity pre-check against existing catalogue.
- [ ] Create eight content packs.
- [ ] Compose from approved shared components.
- [ ] Add only components that represent reusable missing capability.
- [ ] Run registry and reuse report.
- [ ] Run three-pass review for every experience.
- [ ] Run batch similarity report.
- [ ] Replace near-duplicate structures.
- [ ] Add retrieval evaluation cases.
- [ ] Approve batch before starting the next category.

### Acceptance

- 50 experiences complete.
- Each experience has a unique thesis and review record.
- Shared-code ratio remains at least 80%.
- Similarity controls pass.
- All routes build and render.
- Gallery filters expose meaningful diversity across grammar, density, motion, and audience.

---

## Phase 7 — Search, ranking, composition, and validator

### Outcome

Deterministic recommendation and blueprint generation work independently of MCP.

### Tasks

- [ ] Implement lexical index.
- [ ] Implement synonym and taxonomy mapping.
- [ ] Implement hard-filter engine.
- [ ] Implement configurable scoring.
- [ ] Implement diversification.
- [ ] Implement optional embedding adapter interface.
- [ ] Implement candidate explanations.
- [ ] Build labelled retrieval dataset.
- [ ] Implement retrieval metrics.
- [ ] Implement composition engine.
- [ ] Implement route and section planner.
- [ ] Implement compatibility-aware selection.
- [ ] Implement responsive and fallback planning.
- [ ] Implement alternative blueprints.
- [ ] Implement validator rule engine.
- [ ] Implement all critical validator rules.
- [ ] Create seeded invalid blueprint fixtures.
- [ ] Build blueprint lab using domain packages.
- [ ] Tune weights using the labelled dataset.
- [ ] Freeze scoring configuration for release candidate.

### Acceptance

- Retrieval metrics meet Section 3 targets.
- No hard-constraint violation occurs in the acceptance dataset.
- All seeded invalid compositions are caught.
- Blueprint lab works without MCP.
- Explanations accurately reference metadata and constraints.

---

## Phase 8 — MCP server

### Outcome

The design intelligence domain services are available through stable, schema-validated MCP interfaces.

### Tasks

- [ ] Record SDK decision in ADR.
- [ ] Invoke `mcp-server-dev:build-mcp-server` to drive server scaffolding and tool design, supplying this plan's locked decisions as its inputs (Section 18.1).
- [ ] Implement SDK adapter.
- [ ] Implement stdio transport.
- [ ] Register resources.
- [ ] Register prompts.
- [ ] Implement `analyse_design_context`.
- [ ] Implement `search_components`.
- [ ] Implement `get_component`.
- [ ] Implement `compose_design`.
- [ ] Implement `validate_composition`.
- [ ] Implement `generate_implementation_brief`.
- [ ] Implement `suggest_alternatives`.
- [ ] Implement structured errors.
- [ ] Implement content-safe logging.
- [ ] Implement request limits and timeouts.
- [ ] Add MCP protocol integration tests.
- [ ] Add a self-verifying demo client.
- [ ] Add optional HTTP transport behind a feature flag.
- [ ] Perform security review.

### Acceptance

- Every tool advertises and returns schema-valid structures.
- Stdio demo client completes a full workflow.
- Invalid input cannot crash the server.
- Logs contain no raw content in corporate mode.
- HTTP transport is disabled by default.
- Server has no repository mutation capability.

---

## Phase 9 — Agent skill

### Outcome

A coding agent can use one natural-language request to create or revise a design using the MCP server and verify the implementation.

### Tasks

- [ ] Write `SKILL.md`.
- [ ] Define trigger conditions.
- [ ] Define content-preservation procedure.
- [ ] Define repository-inspection procedure.
- [ ] Define MCP tool sequence.
- [ ] Define blueprint validation loop.
- [ ] Define implementation and rollback procedure.
- [ ] Define three-pass review procedure.
- [ ] Add examples for all five surfaces.
- [ ] Add examples for design revision.
- [ ] Create 25 skill evaluation scenarios.
- [ ] Run evaluations against clean fixture repositories.
- [ ] Fix tool-order, content, and constraint failures.
- [ ] Publish skill installation guide.

### Acceptance

- At least five end-to-end fixture implementations pass, one per surface.
- No evaluation introduces fabricated facts.
- The skill always validates before implementation.
- The skill respects repository dependency constraints.
- The skill records verification evidence.

---

## Phase 10 — Hardening, pilot, and release

### Outcome

A documented release suitable for controlled internal pilot.

### Tasks

- [ ] Run full test matrix.
- [ ] Run accessibility audit.
- [ ] Run performance audit.
- [ ] Run security and licence scans.
- [ ] Run asset provenance audit.
- [ ] Run all 50 three-pass record checks.
- [ ] Run retrieval and skill evaluation suites.
- [ ] Review optional CBA theme separately.
- [ ] Produce quality report.
- [ ] Produce installation and operations guide.
- [ ] Produce contributor guide.
- [ ] Produce component-authoring guide.
- [ ] Produce design-review guide.
- [ ] Select pilot users across dashboard, project, slides, personal, and explainer use cases.
- [ ] Collect structured pilot feedback.
- [ ] Fix release-blocking findings.
- [ ] Tag release candidate.
- [ ] Obtain product, engineering, accessibility, security, and brand approvals as applicable.
- [ ] Publish release.

### Acceptance

- No critical or high-severity issue remains open.
- All release artefacts are reproducible.
- Pilot users can complete workflows without author assistance.
- Known limitations are documented.
- Rollback and support ownership are clear.

---

## 28. Fable Execution Protocol

The implementation prompt given to Fable should enforce the following operating rules.

### 28.1 Role statement

> You are Fable 5 operating as a world-class enterprise product designer, motion director, data-visualisation specialist, frontend architect, accessibility practitioner, and design-system engineer. Your work must be recognisably more refined, original, and context-aware than generic AI-generated interfaces. The bar is concrete: every experience passes the Boardroom Test (Section 3.4) — a bank CEO pauses on it, and no banker can dismiss it as "fancy but not usable here." Distinctiveness comes from composition, typography, data storytelling, and the Considered Weight motion identity (Section 4.3) — never from decorative excess. Visual ambition is required, but clarity, corporate suitability, reuse, and engineering integrity are non-negotiable.

### 28.2 Execution rules

- Work phase by phase.
- The two failure modes are symmetric: reject work that is fancy-but-unbankable and work that is safe-but-generic with equal severity. Every Pass 2 review records evidence against both.
- Use only the platform's easing tokens and named signature sequences; if a design idea needs motion the identity cannot express, extend `packages/motion` deliberately (new named sequence + ADR note), never inline.
- Give every experience exactly one signature moment, chosen for meaning.
- Do not begin 50 experience implementations before the contracts, registry, grammars, and quality harness exist.
- Keep the enterprise-neutral theme as the default.
- Treat the optional CBA theme as a removable adapter.
- Do not copy third-party visual assets.
- Do not use external services at runtime.
- Do not invent business facts.
- Prefer shared components; justify new experience-local components.
- Run tests before declaring a task complete.
- Record screenshots and review evidence.
- Complete three distinct review passes.
- Never mark a phase complete with failing checks.
- Commit in small coherent units.
- Maintain a decision log.
- Maintain a risk log.
- Maintain a completion matrix for all 50 experiences.
- Surface blockers with evidence rather than silently changing requirements.
- Do not substitute polished mockups for functioning components and routes.

### 28.3 Required status artefacts

```text
docs/status/
├─ phase-status.md
├─ experience-matrix.md
├─ component-coverage.md
├─ quality-gates.md
├─ risks.md
└─ decisions.md
```

### 28.4 Experience matrix columns

- ID.
- Category.
- Design thesis.
- Grammar.
- Components.
- Reuse percentage.
- Motion level.
- Pass 1.
- Pass 2.
- Pass 3.
- Accessibility.
- Performance.
- Similarity.
- Approval.
- Known limitations.

---

## 29. Risk Register

| Risk | Impact | Mitigation | Early warning |
|---|---|---|---|
| Fifty experiences become bespoke | High | Shared-code threshold, registry-first workflow, component audit | Rising local component count |
| Visual outputs converge | High | Grammars, similarity tests, batch reviews | Same shell/chart/hero repeated |
| Corporate designs become dull | High | Design theses, expressive modes, typography and data storytelling | Review scores high on safety but low on originality |
| Designs become too artistic | High | Corporate suitability modes, surface motion caps, audience rules | Executive scenarios fail usability review |
| Metadata becomes inconsistent | High | Typed manifests, build-time validation, controlled vocabularies | Free-text tags proliferate |
| Search retrieves attractive but incompatible parts | High | Hard filters and compatibility graph | Validator rejects many top results |
| Embeddings are unavailable internally | Medium | Deterministic lexical engine as baseline | Search implementation blocked on service access |
| Heavy animation performs poorly | High | Motion budgets, fallbacks, lazy loading | Long tasks and dropped frames |
| Chart library lock-in | Medium | Adapter layer | Business components import library directly |
| MCP SDK changes | Medium | SDK adapter and ADR | Domain logic imports SDK types |
| Confidential content leaks | Critical | Local processing, no raw logging, no external calls | Logs contain prompt text |
| CBA branding is misused | High | Optional isolated theme and approval gate | Brand assets appear in core packages |
| Unlicensed assets enter gallery | High | Provenance schema and build gate | Assets lack source records |
| Agent fabricates content | High | Preservation classifier and skill tests | Generated metrics or dates appear |
| Gallery succeeds but skill fails | High | End-to-end fixture repositories | MCP outputs are not implementation-ready |
| Too many dependencies block adoption | High | Dependency allowlist and adapters | Package count and bundle size increase |
| Accessibility is deferred | High | Story-level tests and review pass 3 | Late audit finds systemic issues |
| Plan is too large for autonomous execution | High | Phase gates and anchor-first strategy | Fable starts multiple phases simultaneously |
| Static explainers break when copied | Medium | Self-contained export tests | Direct URL or offline tests fail |
| Slide decks are visually strong but unusable | Medium | Presenter, keyboard, print, and reduced-motion requirements | Navigation or PDF capture fails |
| Registry versions drift from code | High | Co-located manifests and build compiler | Broken source paths |
| Quality metrics are gamed | Medium | Isolated-session self-review, human sampling per Section 23 | Scores pass but sampled reviews reject outputs |
| Lexical retrieval cannot reach relevance targets | High | Slice-stage feasibility spike, controlled intent taxonomy, searchText authoring standards | Spike scores below target on ≥3 of 20 requests |
| Motion identity drifts into library defaults | High | Easing/duration lint (MOTION-003), motion specimens, Pass 2 identity check | `cubic-bezier` literals or library ease names appear outside packages/motion |
| Self-review inflates quality | High | Reviews run in sessions isolated from authorship; 20% human sampling with batch-fail rule | Sampled human review disagrees with recorded pass |
| Vendored components break in user repos | High | Slice-stage end-to-end vendoring fixture; components designed for source portability (Section 5.2) | Fixture implementation needs manual patching |

---

## 30. Operational Model

### 30.1 Ownership (single-maintainer model, locked)

There is no committee. Ownership maps to two parties:

- **Fable (executor):** design system, component library, data visualisation, motion identity, accessibility implementation, MCP server, skill, documentation, and all review evidence.
- **Repository owner (approver):** product direction, release approval, waiver approval, brand-theme acceptance, security sign-off, and the sampled human reviews defined in Section 23.

The ten ownership areas from the baseline plan survive as **sections of `docs/status/quality-gates.md`** so nothing loses a named checkpoint, but each is answerable by one of the two parties above.

### 30.2 Contribution flow

1. Contributor proposes capability.
2. Reviewer confirms it is reusable.
3. Contributor creates contract and manifest.
4. Contributor writes tests.
5. Contributor implements component and states.
6. Contributor adds provenance.
7. Contributor adds gallery preview.
8. Automated quality gates run.
9. Design and engineering review occur.
10. Approval state is updated.

### 30.3 Deprecation

- Mark deprecated in manifest.
- Provide replacement.
- Warn in gallery and MCP.
- Exclude from new recommendations.
- Keep for one major release unless security requires immediate removal.
- Provide migration examples.

---

## 31. Documentation Deliverables

### User documentation

- Landing-page browsing guide covering search, filters, template/component terminology, comparison, saved items, deep links, and Blueprint Lab handoff.
- Platform overview.
- Choosing a surface.
- Using gallery filters.
- Reading component metadata.
- Using blueprint lab.
- Installing MCP server.
- Installing skill.
- Example prompts.
- Content-preparation guide.
- Troubleshooting.
- Privacy statement.

### Contributor documentation

- Architecture.
- Package boundaries.
- Creating a component.
- Creating a chart.
- Creating a motion pattern.
- Creating an experience.
- Writing manifests.
- Adding grammar rules.
- Writing validator rules.
- Adding retrieval evaluation cases.
- Running visual tests.
- Asset and licence process.
- Release process.

### Governance documentation

- Design constitution.
- Corporate suitability.
- Accessibility.
- Security and privacy.
- Brand theme rules.
- Dependency policy.
- Logging policy.
- Waiver process.
- Quality score interpretation.

---

## 32. Final Acceptance Checklist

### Foundation

- [ ] Enterprise-neutral default is complete.
- [ ] Optional CBA theme is isolated and removable.
- [ ] Contracts are versioned and validated.
- [ ] Ten grammars are approved.
- [ ] Component registry is complete.
- [ ] Provenance is complete.

### Components

- [ ] Required component coverage exists.
- [ ] Every approved component has state coverage.
- [ ] Every motion component has reduced-motion behaviour.
- [ ] Every analytical component has an accessible equivalent.
- [ ] High-cost components have fallbacks.
- [ ] No component hard-codes brand values.

### Experiences

- [ ] 10 dashboards approved.
- [ ] 10 project pages approved.
- [ ] 10 slide decks approved.
- [ ] 10 personal pages approved.
- [ ] 10 technical explainers approved.
- [ ] All 50 have three review records.
- [ ] Similarity tests pass.
- [ ] Shared-code target passes.

### Gallery

- [ ] Dedicated landing page and unified `/browse` experience complete.
- [ ] Unified registry search, URL-state persistence, category shortcuts, quick preview, comparison, local saved/recent state, and Blueprint Lab handoff complete.
- [ ] Template browser complete.
- [ ] Component browser complete.
- [ ] Grammar explorer complete.
- [ ] Blueprint lab complete.
- [ ] Quality dashboard complete.
- [ ] `/guide` complete.
- [ ] Static and internal deployment builds complete.

### Intelligence layer

- [ ] Hard filters complete.
- [ ] Ranking complete.
- [ ] Diversification complete.
- [ ] Composition complete.
- [ ] Validator complete.
- [ ] Evaluation targets met.
- [ ] Explanations are evidence-based.

### MCP and skill

- [ ] MCP tools complete.
- [ ] MCP resources complete.
- [ ] MCP prompts complete.
- [ ] Stdio workflow passes.
- [ ] HTTP mode secured or disabled.
- [ ] Skill complete.
- [ ] Skill evaluations pass.
- [ ] No repository write capability exists in MCP.
- [ ] No content fabrication occurs in acceptance tests.

### Quality and governance

- [ ] Accessibility target passes.
- [ ] Performance budgets pass.
- [ ] Security review passes.
- [ ] Licence review passes.
- [ ] Asset provenance passes.
- [ ] Logging contains no raw confidential content.
- [ ] Documentation complete.
- [ ] Pilot feedback resolved.
- [ ] Release approvals recorded.

---

## 33. Post-Release Roadmap

Only consider these after the first production release is stable:

1. Feedback-driven personalisation of ranking weights.
2. Approved enterprise embedding service.
3. Figma handoff or token export.
4. PowerPoint export.
5. Additional frontend adapters.
6. Curated team-specific component collections.
7. Usage analytics with privacy-preserving aggregation.
8. Automated screenshot-to-component gap analysis.
9. Governance workflow for design approvals.
10. Component health and adoption dashboards.
11. Multilingual content layouts.
12. Automated migration between component versions.

---

## 34. Official Reference Baseline

The implementation team should re-check these sources at project start and record the versions used:

- Model Context Protocol specification: https://modelcontextprotocol.io/specification/
- Official MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Tailwind CSS Vite installation: https://tailwindcss.com/docs/installation/using-vite
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

MCP tools, resources, and prompts should follow the official protocol model. Security controls must preserve user consent, data privacy, and safe tool operation. Accessibility implementation must include visible focus, adequate contrast, keyboard access, responsive reflow, target sizing, and the ability to disable non-essential motion.

---

## 35. First Execution Slice (the committed scope)

Do not start with all 50 experiences. The slice below is the **committed** scope of this plan (Section 27); everything after it is re-approved on slice evidence. It includes:

- Workspace and contracts (Zod-first).
- Enterprise-neutral light and dark themes.
- The Considered Weight motion identity: all four easing tokens, the duration scale, and **three fully built signature sequences** (`ledger-reveal`, `data-ink-draw`, `horizon-sweep`) with reduced-motion variants and Storybook specimens — the motion identity is slice-critical because it is the hardest thing to retrofit and the clearest early proof of "not generic".
- Four approved grammars:
  - Precision Grid.
  - Executive Editorial.
  - Calm Command.
  - Technical Blueprint.
- Twelve reusable components:
  - Two shells.
  - Two navigation systems.
  - Two content components.
  - Three charts (through the ECharts adapter, using `data-ink-draw`).
  - Two diagrams.
  - One additional motion primitive.
- Registry compiler.
- Minimal gallery (landing stub + component browser + the two anchor previews).
- Two anchors:
  - Model monitoring dashboard.
  - System architecture explainer.
- Minimal deterministic search **plus the retrieval feasibility spike** (Section 15.4): 20 labelled requests scored against targets, results recorded before expansion is approved.
- `search_components` and `get_component` MCP tools over stdio, scaffolded via `mcp-server-dev:build-mcp-server` (Section 18.1).
- One skill evaluation fixture, run end to end: request → retrieval → brief → vendored implementation in a clean fixture repo (proving the Section 5.2 distribution model).

Slice acceptance adds two design gates to the baseline's functional gate:

1. Both anchors pass the full Boardroom Test (Section 3.4) with recorded evidence.
2. A 30-second screen recording of each anchor is distinguishable from a stock admin template by motion alone — the Considered Weight identity is visibly present.

The slice is accepted only when a user request can retrieve components, inspect metadata, render both anchor experiences, receive a valid implementation brief, and have that brief successfully vendored into a fixture repository.

---

# End of Plan
