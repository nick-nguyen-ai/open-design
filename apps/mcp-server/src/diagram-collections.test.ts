/**
 * Diagram-collections MCP surface tests: the five families' 40 components are
 * discoverable through the real server (search + get), with the compiled
 * registry as the only wiring — no server code changes.
 *
 * Steering tests for the five `dgm-*` deck world-templates land with the
 * templates (plan Task 16) and extend this file.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ComponentManifest } from '@enterprise-design/contracts';
import { createServer } from './server.js';
import { loadRegistryData } from './registry-data.js';
import { createLogger } from './logger.js';
import { ComposeSlideDeckOutput, SearchComponentsOutput } from './schemas.js';

const registry = loadRegistryData();

const FAMILIES = ['sketchnote', 'blueprint', 'circuit', 'isometric', 'gazette'] as const;
const KINDS = ['flow', 'sequence', 'layers', 'zones', 'cycle', 'compare', 'cells', 'timeline'] as const;

interface Harness {
  client: Client;
  close: () => Promise<void>;
}

async function makeHarness(): Promise<Harness> {
  const logger = createLogger({ write: () => undefined });
  const server = createServer(registry, logger);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'dgm-test-client', version: '0.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

function textPayload(result: CallToolResult): unknown {
  const first = result.content[0];
  if (!first || first.type !== 'text') return undefined;
  return JSON.parse(first.text);
}

describe('diagram collections in the MCP registry', () => {
  let h: Harness;
  beforeEach(async () => {
    h = await makeHarness();
  });
  afterEach(async () => {
    await h.close();
  });

  it('the compiled registry carries exactly the 40 comp.dgm.* components', () => {
    const dgm = registry.components.filter((c) => c.id.startsWith('comp.dgm.'));
    expect(dgm).toHaveLength(40);
    const ids = new Set(dgm.map((c) => c.id));
    for (const family of FAMILIES)
      for (const kind of KINDS) expect(ids.has(`comp.dgm.${family}.${kind}`)).toBe(true);
    // every one is approved and spans all five surfaces
    for (const manifest of dgm) {
      expect(manifest.approval.state).toBe('approved');
      expect(manifest.compatibleSurfaces).toHaveLength(5);
    }
  });

  it('search_components surfaces the sketchnote sequence renderer for a hand-drawn query', async () => {
    const result = (await h.client.callTool({
      name: 'search_components',
      arguments: { query: 'hand drawn sequence diagram sticky notes' },
    })) as CallToolResult;
    const payload = SearchComponentsOutput.parse(textPayload(result));
    const ids = payload.results.map((r) => r.id);
    expect(ids).toContain('comp.dgm.sketchnote.sequence');
  });

  it('search_components surfaces the circuit family for a neon dark architecture query', async () => {
    const result = (await h.client.callTool({
      name: 'search_components',
      arguments: { query: 'neon dark glowing architecture board' },
    })) as CallToolResult;
    const payload = SearchComponentsOutput.parse(textPayload(result));
    expect(payload.results.some((r) => r.id.startsWith('comp.dgm.circuit.'))).toBe(true);
  });

  it('get_component returns a contract-valid manifest for comp.dgm.isometric.layers', async () => {
    const result = (await h.client.callTool({
      name: 'get_component',
      arguments: { componentId: 'comp.dgm.isometric.layers' },
    })) as CallToolResult;
    const manifest = ComponentManifest.parse(textPayload(result));
    expect(manifest.exportName).toBe('IsometricLayers');
    expect(manifest.designGrammars).toEqual(['isometric-studio']);
  });

  it.each([
    [
      'dgm-sketchnote',
      ['technical', 'mixed'],
      ['teach-protocol-walkthrough'],
      'Teach how the TLS handshake actually works, step by step, as a warm whiteboard walkthrough for engineers.',
    ],
    [
      'dgm-blueprint',
      ['technical', 'risk-and-governance'],
      ['document-system-rails', 'specify-integration'],
      'Specify the payment rails end to end: document every integration wire from authorisation to settlement as an engineering sheet.',
    ],
    [
      'dgm-circuit',
      ['technical', 'mixed'],
      ['scale-architecture-story', 'plan-capacity-growth'],
      'Tell the scale story of growing to a million users: capacity growth, caches, replicas, and queues on a live board.',
    ],
    [
      'dgm-isometric',
      ['mixed', 'business'],
      ['tour-platform-anatomy', 'onboard-into-infrastructure'],
      'Onboard new joiners with a tour of the Kubernetes platform anatomy — control plane, nodes, and workloads as a diorama.',
    ],
    [
      'dgm-gazette',
      ['business', 'technical'],
      ['publish-field-guide', 'compare-technique-tradeoffs'],
      'Publish a field guide to caching: compare the technique tradeoffs of strategies and eviction policies as an edited manual.',
    ],
  ] as const)('compose_slide_deck steers %s deterministically by intent', async (templateId, audience, businessIntent, contentBrief) => {
    const result = (await h.client.callTool({
      name: 'compose_slide_deck',
      arguments: {
        context: {
          surface: 'slide-deck',
          audience,
          businessIntent,
          corporateSuitability: 'expressive',
          motionPreference: 2,
        },
        contentBrief,
      },
    })) as CallToolResult;
    const payload = ComposeSlideDeckOutput.parse(textPayload(result));
    expect(payload.worldTemplateId).toBe(templateId);
    const slotNames = payload.fillSkeleton.sections.flatMap((s) => s.slots.map((slot) => slot.spec.name));
    expect(slotNames).toEqual(expect.arrayContaining(['deck.notice', 'flow.nodes', 'timeline.eras', 'close.signoff']));
  });

  it('the five family grammars are compiled with their component rosters', () => {
    const byId = new Map(registry.domain.grammars.map((g) => [g.id, g]));
    for (const [grammarId, family] of [
      ['sketchnote-journal', 'sketchnote'],
      ['drafting-board', 'blueprint'],
      ['neon-circuit', 'circuit'],
      ['isometric-studio', 'isometric'],
      ['print-gazette', 'gazette'],
    ] as const) {
      const grammar = byId.get(grammarId);
      expect(grammar, grammarId).toBeDefined();
      expect(grammar!.preferredComponents).toEqual(KINDS.map((kind) => `comp.dgm.${family}.${kind}`));
    }
  });
});
