import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { compileRegistry } from './compile.js';

const here = path.dirname(fileURLToPath(import.meta.url));
// packages/registry/src -> repo root
const REPO_ROOT = path.resolve(here, '..', '..', '..');

/**
 * Catalogue integrity test (task 8): `compileRegistry` over the REAL
 * workspace (not a fixture) must discover exactly the 50 experiences, 10
 * grammars, 3 motion sequences, and 5 components authored across tasks 1-8,
 * with zero diagnostics, and every cross-manifest reference must resolve.
 */
describe('catalogue integrity — compileRegistry over the real workspace', () => {
  it('discovers exactly 50 experiences, 10 grammars, 3 motion sequences, 5 components, 0 errors', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });

    expect(result.diagnostics).toEqual([]);
    expect(result.errorCount).toBe(0);
    expect(result.warningCount).toBe(0);
    expect(result.ok).toBe(true);

    expect(result.components).toHaveLength(5);
    expect(result.grammars).toHaveLength(10);
    expect(result.motionSequences).toHaveLength(3);
    expect(result.experiences).toHaveLength(59);
  });

  it('discovers the 5 real component ids', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    expect(result.components.map((c) => c.id).sort()).toEqual([
      'comp.category-bar-chart',
      'comp.flow-diagram',
      'comp.kpi-tile',
      'comp.status-list',
      'comp.trend-chart',
    ]);
  });

  it('discovers the 3 real motion sequence ids', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    expect(result.motionSequences.map((m) => m.sequenceId).sort()).toEqual([
      'data-ink-draw',
      'horizon-sweep',
      'ledger-reveal',
    ]);
  });

  it('discovers all 10 grammar ids', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    expect(result.grammars.map((g) => g.id).sort()).toEqual([
      'calm-command',
      'executive-editorial',
      'kinetic-intelligence',
      'living-system',
      'monumental-type',
      'precision-grid',
      'research-notebook',
      'signal-glass',
      'spatial-canvas',
      'technical-blueprint',
    ]);
  });

  it('every experience id carries its category-stable prefix', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    const bySurface = new Map<string, string[]>();
    for (const experience of result.experiences) {
      const list = bySurface.get(experience.surface) ?? [];
      list.push(experience.id);
      bySurface.set(experience.surface, list);
    }
    expect(bySurface.get('dashboard')?.every((id) => id.startsWith('db-'))).toBe(true);
    expect(bySurface.get('dashboard')).toHaveLength(10);
    expect(bySurface.get('project-page')?.every((id) => id.startsWith('proj-'))).toBe(true);
    expect(bySurface.get('project-page')).toHaveLength(10);
    expect(bySurface.get('slide-deck')?.every((id) => id.startsWith('deck-'))).toBe(true);
    expect(bySurface.get('slide-deck')).toHaveLength(19);
    expect(bySurface.get('personal-page')?.every((id) => id.startsWith('home-'))).toBe(true);
    expect(bySurface.get('personal-page')).toHaveLength(10);
    expect(bySurface.get('technical-explainer')?.every((id) => id.startsWith('exp-'))).toBe(true);
    expect(bySurface.get('technical-explainer')).toHaveLength(10);
  });

  it('spot-checks the five approved live experiences — one per surface', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    const byId = new Map(result.experiences.map((e) => [e.id, e]));

    const cockpit = byId.get('db-model-monitoring-cockpit');
    expect(cockpit).toBeDefined();
    expect(cockpit?.grammarId).toBe('precision-grid');
    expect(cockpit?.surface).toBe('dashboard');
    expect(cockpit?.approval.state).toBe('approved');
    expect(cockpit?.componentsUsed).toEqual(
      expect.arrayContaining(['comp.trend-chart', 'comp.category-bar-chart', 'comp.status-list']),
    );

    const architecture = byId.get('exp-system-architecture');
    expect(architecture).toBeDefined();
    expect(architecture?.grammarId).toBe('technical-blueprint');
    expect(architecture?.surface).toBe('technical-explainer');
    expect(architecture?.approval.state).toBe('approved');
    expect(architecture?.componentsUsed).toEqual(expect.arrayContaining(['comp.flow-diagram']));

    const deck = byId.get('deck-ai-strategy');
    expect(deck).toBeDefined();
    expect(deck?.surface).toBe('slide-deck');
    expect(deck?.approval.state).toBe('approved');
    expect(deck?.componentsUsed).toEqual(expect.arrayContaining(['comp.trend-chart']));

    const validationHub = byId.get('proj-ai-model-validation-hub');
    expect(validationHub).toBeDefined();
    expect(validationHub?.surface).toBe('project-page');
    expect(validationHub?.approval.state).toBe('approved');
    expect(validationHub?.componentsUsed).toEqual(
      expect.arrayContaining(['comp.status-list', 'comp.trend-chart', 'comp.flow-diagram']),
    );

    const studio = byId.get('home-data-scientist-studio');
    expect(studio).toBeDefined();
    expect(studio?.surface).toBe('personal-page');
    expect(studio?.approval.state).toBe('approved');
    expect(studio?.componentsUsed).toEqual(
      expect.arrayContaining(['comp.status-list', 'comp.trend-chart']),
    );

    // Exactly these thirty-two experiences are approved: the original five
    // live worlds (one per surface), the three slide-deck worlds from the
    // task-15 deck batch, the three from the task-16 deck batch (The River, The
    // Readout, The Gallery Floor), the three from the task-17 deck batch that
    // complete all ten catalogue decks (The Manifesto, The Sectional, The Field
    // Manual), the three personal pages from the task-18 batch (The Annual
    // Letter, The Bench Journal, The Greenhouse), the three personal pages from
    // the task-19 batch (The Line, The Dawn Wall, The Reading Room), the three
    // personal pages from the task-20 batch that complete all ten personal pages
    // (The Atlas, The Specimen Book, The Playbill), the three batch-2 deck
    // worlds D (The Planning Wall, The Preprint, The Campaign Room), the three
    // batch-2 deck worlds E (T-Minus, The Whiteboard, The Cutover), and the
    // three batch-2 deck worlds F — the PowerPoint-familiar three (The Quarter,
    // The Straight Pitch, The Allocation). Everything else remains
    // reviewed/experimental.
    const approvedIds = result.experiences.filter((e) => e.approval.state === 'approved').map((e) => e.id);
    expect(approvedIds.sort()).toEqual([
      'db-model-monitoring-cockpit',
      'deck-ai-governance-and-controls',
      'deck-ai-strategy',
      'deck-budget-planning',
      'deck-cloud-migration',
      'deck-executive-decision-proposal',
      'deck-experiment-results',
      'deck-genai-model-validation-report',
      'deck-innovation-showcase',
      'deck-marketing-campaign',
      'deck-product-launch',
      'deck-product-vision',
      'deck-project-kickoff',
      'deck-quarterly-business-review',
      'deck-research-discussion',
      'deck-sales-pitch',
      'deck-team-retrospective',
      'deck-technical-architecture-explanation',
      'deck-technical-training',
      'deck-transformation-roadmap',
      'exp-system-architecture',
      'home-ai-experiment-notebook',
      'home-career-project-timeline',
      'home-data-scientist-studio',
      'home-internal-ai-tool-laboratory',
      'home-knowledge-atlas',
      'home-mentoring-tutorial-hub',
      'home-research-publication-portfolio',
      'home-talks-presentation-archive',
      'home-team-contribution-impact-page',
      'home-technical-leadership-portfolio',
      'proj-ai-model-validation-hub',
    ]);
  });

  it('every experience uses at least one real component id and a real signature sequence', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    const componentIds = new Set(result.components.map((c) => c.id));
    const motionIds = new Set(result.motionSequences.map((m) => m.sequenceId));
    const grammarIds = new Set(result.grammars.map((g) => g.id));

    for (const experience of result.experiences) {
      expect(experience.componentsUsed.length).toBeGreaterThan(0);
      for (const componentId of experience.componentsUsed) {
        expect(componentIds.has(componentId)).toBe(true);
      }
      expect(motionIds.has(experience.signatureSequence)).toBe(true);
      expect(grammarIds.has(experience.grammarId)).toBe(true);
    }
  });

  it('every experience respects the §4.2 motion-level cap for its surface', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    const caps: Record<string, number> = {
      dashboard: 2,
      'project-page': 2,
      'slide-deck': 3,
      'personal-page': 3,
      'technical-explainer': 3,
    };
    for (const experience of result.experiences) {
      expect(experience.motionLevel).toBeLessThanOrEqual(caps[experience.surface] ?? 3);
    }
  });

  it('every grammar signatureSequences entry resolves to a real motion sequence', async () => {
    const result = await compileRegistry({ cwd: REPO_ROOT });
    const motionIds = new Set(result.motionSequences.map((m) => m.sequenceId));
    for (const grammar of result.grammars) {
      expect(grammar.signatureSequences.length).toBeGreaterThan(0);
      for (const sequenceId of grammar.signatureSequences) {
        expect(motionIds.has(sequenceId)).toBe(true);
      }
    }
  });

  it('produces byte-identical artefacts across re-runs (deterministic)', async () => {
    const first = await compileRegistry({ cwd: REPO_ROOT });
    const second = await compileRegistry({ cwd: REPO_ROOT });
    expect(JSON.stringify(second.experiences)).toBe(JSON.stringify(first.experiences));
    expect(JSON.stringify(second.grammars)).toBe(JSON.stringify(first.grammars));
    expect(JSON.stringify(second.motionSequences)).toBe(JSON.stringify(first.motionSequences));
    expect(JSON.stringify(second.components)).toBe(JSON.stringify(first.components));
  });
});
