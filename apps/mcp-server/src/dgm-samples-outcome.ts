/**
 * Diagram-collections goal test — the five grammar-tour sample runs.
 *
 * Drives the REAL MCP path end to end once per family: spawns the stdio
 * server (exactly like `demo-client.ts`), calls `compose_slide_deck` with the
 * run's recorded intake context + fresh brief, asserts the deterministic
 * selection of that family's `dgm-*` template, then calls `validate_fill`
 * with the JSON-serialized authored fill and asserts `valid: true`. The
 * COMPLETE raw tool responses are written per sample to
 * `docs/superpowers/specs/diagram-collections/<slug>/mcp-outcome.json` as
 * committed evidence.
 *
 * Prints a PASS/FAIL summary and exits non-zero on any failure.
 *
 * Run: `corepack pnpm --filter mcp-server dgmsamples`
 */
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ComposeSlideDeckOutput, ValidateFillOutput } from './schemas.js';
import { httpsHandshakeFill } from '../../../experiences/slide-decks/demo-dgm-https-handshake/fill.js';
import { paymentRailsFill } from '../../../experiences/slide-decks/demo-dgm-payment-rails/fill.js';
import { millionUsersFill } from '../../../experiences/slide-decks/demo-dgm-million-users/fill.js';
import { kubernetesAnatomyFill } from '../../../experiences/slide-decks/demo-dgm-kubernetes-anatomy/fill.js';
import { cachingFieldGuideFill } from '../../../experiences/slide-decks/demo-dgm-caching-field-guide/fill.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, 'index.ts');
const evidenceRoot = path.resolve(here, '../../../docs/superpowers/specs/diagram-collections');

interface SampleSpec {
  slug: string;
  expectTemplateId: string;
  expectExperienceId: string;
  context: Record<string, unknown>;
  brief: string;
  fill: unknown;
}

/** The five goal-test samples — contexts from each run's recorded intake answers. */
const SAMPLES: SampleSpec[] = [
  {
    slug: 'https-handshake',
    expectTemplateId: 'dgm-sketchnote',
    expectExperienceId: 'deck-dgm-sketchnote',
    context: {
      surface: 'slide-deck',
      audience: ['technical', 'mixed'],
      businessIntent: ['teach-protocol-walkthrough'],
      corporateSuitability: 'expressive',
      motionPreference: 2,
    },
    brief:
      'Teach how HTTPS actually works — the TLS 1.3 handshake, certificates and trust, session keys — step by step, as a warm whiteboard walkthrough for engineers.',
    fill: httpsHandshakeFill,
  },
  {
    slug: 'payment-rails',
    expectTemplateId: 'dgm-blueprint',
    expectExperienceId: 'deck-dgm-blueprint',
    context: {
      surface: 'slide-deck',
      audience: ['technical', 'risk-and-governance'],
      businessIntent: ['document-system-rails', 'specify-integration'],
      corporateSuitability: 'expressive',
      motionPreference: 2,
    },
    brief:
      'Specify how a card payment actually moves — authorisation, clearing, settlement — documenting every integration wire from tap to merchant payout as an engineering sheet for a payments platform team.',
    fill: paymentRailsFill,
  },
  {
    slug: 'million-users',
    expectTemplateId: 'dgm-circuit',
    expectExperienceId: 'deck-dgm-circuit',
    context: {
      surface: 'slide-deck',
      audience: ['technical', 'mixed'],
      businessIntent: ['scale-architecture-story', 'plan-capacity-growth'],
      corporateSuitability: 'expressive',
      motionPreference: 2,
    },
    brief:
      'Tell the scale story of an app growing to its first million users: capacity growth one bottleneck at a time — load balancers, caches, read replicas, and queues — on a live board.',
    fill: millionUsersFill,
  },
  {
    slug: 'kubernetes-anatomy',
    expectTemplateId: 'dgm-isometric',
    expectExperienceId: 'deck-dgm-isometric',
    context: {
      surface: 'slide-deck',
      audience: ['mixed', 'business'],
      businessIntent: ['tour-platform-anatomy', 'onboard-into-infrastructure'],
      corporateSuitability: 'expressive',
      motionPreference: 2,
    },
    brief:
      'Onboard new joiners with a tour of the Kubernetes platform anatomy — control plane, nodes, pods, services, and the reconcile loop — as walkable dioramas.',
    fill: kubernetesAnatomyFill,
  },
  {
    slug: 'caching-field-guide',
    expectTemplateId: 'dgm-gazette',
    expectExperienceId: 'deck-dgm-gazette',
    context: {
      surface: 'slide-deck',
      audience: ['business', 'technical'],
      businessIntent: ['publish-field-guide', 'compare-technique-tradeoffs'],
      corporateSuitability: 'expressive',
      motionPreference: 2,
    },
    brief:
      'Publish a field guide to caching: compare the technique tradeoffs of strategies, eviction policies, and failure modes as an edited, permanent-feeling manual.',
    fill: cachingFieldGuideFill,
  },
];

interface Check {
  name: string;
  pass: boolean;
  detail: string;
}
const checks: Check[] = [];
function check(name: string, pass: boolean, detail = ''): void {
  checks.push({ name, pass, detail });
}

function textPayload(result: CallToolResult): unknown {
  const first = result.content[0];
  if (!first || first.type !== 'text') return undefined;
  return JSON.parse(first.text);
}

async function main(): Promise<void> {
  const transport = new StdioClientTransport({
    command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['tsx', serverEntry],
    cwd: path.resolve(here, '..'),
    stderr: 'ignore',
  });
  const client = new Client({ name: 'dgm-samples-outcome', version: '1.0.0' });
  await client.connect(transport);

  try {
    for (const sample of SAMPLES) {
      const composeRaw = (await client.callTool({
        name: 'compose_slide_deck',
        arguments: { context: sample.context, contentBrief: sample.brief },
      })) as CallToolResult;
      const compose = ComposeSlideDeckOutput.safeParse(textPayload(composeRaw));
      check(`${sample.slug}: compose parses`, compose.success, compose.success ? '' : String(compose.error));
      if (compose.success) {
        check(
          `${sample.slug}: selects ${sample.expectTemplateId}`,
          compose.data.worldTemplateId === sample.expectTemplateId,
          `got ${compose.data.worldTemplateId}`,
        );
        check(
          `${sample.slug}: experience ${sample.expectExperienceId}`,
          compose.data.experienceId === sample.expectExperienceId,
          `got ${compose.data.experienceId}`,
        );
      }

      const validateRaw = (await client.callTool({
        name: 'validate_fill',
        arguments: {
          worldTemplateId: sample.expectExperienceId,
          fill: JSON.parse(JSON.stringify(sample.fill)) as Record<string, unknown>,
        },
      })) as CallToolResult;
      const validate = ValidateFillOutput.safeParse(textPayload(validateRaw));
      check(`${sample.slug}: validate parses`, validate.success, validate.success ? '' : String(validate.error));
      if (validate.success) {
        check(
          `${sample.slug}: fill valid`,
          validate.data.valid,
          validate.data.valid ? '' : JSON.stringify(validate.data.findings),
        );
      }

      const outDir = path.join(evidenceRoot, sample.slug);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(
        path.join(outDir, 'mcp-outcome.json'),
        `${JSON.stringify(
          {
            brief: sample.brief,
            context: sample.context,
            compose: textPayload(composeRaw),
            validate: textPayload(validateRaw),
          },
          null,
          2,
        )}\n`,
        'utf8',
      );
    }
  } finally {
    await client.close();
  }

  let failed = 0;
  for (const c of checks) {
    if (!c.pass) failed += 1;
    process.stdout.write(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? ` — ${c.detail}` : ''}\n`);
  }
  process.stdout.write(`\n${checks.length - failed}/${checks.length} checks passed\n`);
  if (failed > 0) process.exitCode = 1;
}

await main();
