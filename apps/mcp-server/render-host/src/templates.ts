import type { ComponentType } from 'react';

export interface RenderTemplate {
  load: () => Promise<{ default: ComponentType<{ fill: never }> }>;
  /**
   * The template's canonical mood, locked on `document.documentElement` before
   * render. Mirrors the gallery's `LIVE_PAGES[experienceId].mood` - live pages
   * are single-mood art-directed, so the shared token-consuming components must
   * render in that mood regardless of any host theme toggle.
   */
  theme?: 'dark' | 'light';
}

/**
 * worldTemplateId -> renderable template component.
 *
 * Keep in sync with `packages/registry/generated/world-templates.json`; every
 * template component takes a single `fill` prop and imports its own fonts and
 * art-layer CSS, so nothing else has to be wired here.
 */
export const TEMPLATES: Record<string, RenderTemplate> = {
  cockpit: {
    load: () =>
      import('../../../../experiences/dashboards/db-model-monitoring-cockpit/CockpitTemplate.js'),
    theme: 'dark',
  },
  cutover: {
    load: () => import('../../../../experiences/slide-decks/deck-cloud-migration/CutoverTemplate.js'),
    theme: 'light',
  },
  'dgm-blueprint': {
    load: () =>
      import('../../../../experiences/slide-decks/deck-dgm-blueprint/BlueprintDeckTemplate.js'),
    theme: 'dark',
  },
  'dgm-circuit': {
    load: () =>
      import('../../../../experiences/slide-decks/deck-dgm-circuit/CircuitDeckTemplate.js'),
    theme: 'dark',
  },
  'dgm-gazette': {
    load: () =>
      import('../../../../experiences/slide-decks/deck-dgm-gazette/GazetteDeckTemplate.js'),
    theme: 'light',
  },
  'dgm-isometric': {
    load: () =>
      import('../../../../experiences/slide-decks/deck-dgm-isometric/IsometricDeckTemplate.js'),
    theme: 'light',
  },
  'dgm-sketchnote': {
    load: () =>
      import('../../../../experiences/slide-decks/deck-dgm-sketchnote/SketchnoteDeckTemplate.js'),
    theme: 'light',
  },
  'drawing-office': {
    load: () =>
      import('../../../../experiences/explainers/exp-system-architecture/DrawingOfficeTemplate.js'),
    theme: 'light',
  },
  ledger: {
    load: () =>
      import(
        '../../../../experiences/project-pages/proj-ai-model-validation-hub/LedgerTemplate.js'
      ),
    theme: 'light',
  },
  quarter: {
    load: () =>
      import(
        '../../../../experiences/slide-decks/deck-quarterly-business-review/QuarterTemplate.js'
      ),
    theme: 'light',
  },
  'the-line': {
    load: () =>
      import(
        '../../../../experiences/personal-pages/home-career-project-timeline/TheLineTemplate.js'
      ),
    theme: 'dark',
  },
  tminus: {
    load: () => import('../../../../experiences/slide-decks/deck-product-launch/TMinusTemplate.js'),
    theme: 'dark',
  },
};
