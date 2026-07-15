/**
 * Experience-composer goal test (ledger Task 12) — the five-surface sample run.
 *
 * Drives the REAL MCP path end to end once per surface: spawns the stdio server
 * (exactly like `demo-client.ts`), calls the surface's compose tool with the
 * recorded intake context + fresh brief, asserts the deterministic selection,
 * then calls `validate_fill` with the JSON-serialized authored fill and asserts
 * `valid: true`. The COMPLETE raw tool responses are written per sample to
 * `docs/superpowers/specs/<evidence-dir>/mcp-outcome.json` as committed evidence.
 *
 * Prints a PASS/FAIL summary and exits non-zero on any failure.
 *
 * Run: `corepack pnpm --filter mcp-server goalsamples`
 */
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ComposeSlideDeckOutput, ValidateFillOutput } from './schemas.js';
import { gitlabQbrFill } from '../../../experiences/slide-decks/sample-gitlab-qbr/fill.js';
import { openmodelCockpitFill } from '../../../experiences/dashboards/sample-openmodel-cockpit/fill.js';
import { moderationStackFill } from '../../../experiences/explainers/sample-moderation-stack/fill.js';
import { agentEvalsFill } from '../../../experiences/project-pages/sample-agent-evals/fill.js';
import { mlCareerFill } from '../../../experiences/personal-pages/sample-ml-career/fill.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, 'index.ts');

interface SampleSpec {
  slug: string;
  evidenceDir: string;
  tool: string;
  expectTemplateId: string;
  expectExperienceId: string;
  context: Record<string, unknown>;
  brief: string;
  fill: unknown;
}

/** The five goal-test samples — contexts from each run's recorded intake answers. */
const SAMPLES: SampleSpec[] = [
  {
    slug: 'gitlab-qbr',
    evidenceDir: 'gitlab-qbr-sample',
    tool: 'compose_slide_deck',
    expectTemplateId: 'quarter',
    expectExperienceId: 'deck-quarterly-business-review',
    context: {
      surface: 'slide-deck',
      audience: ['executive', 'business'],
      businessIntent: ['review-quarterly-performance', 'report-financial-results'],
      corporateSuitability: 'restricted',
      motionPreference: 1,
      styleHint: 'conventional',
    },
    brief:
      'GitLab Q1 FY27 quarterly business review for the board from public filings: a fourth straight revenue beat and a raised full-year guide, one honest flag — self-managed flat quarter on quarter for the first time since IPO — named enterprise wins, pipeline coverage, risks, and next-quarter priorities.',
    fill: gitlabQbrFill,
  },
  {
    slug: 'openmodel-cockpit',
    evidenceDir: 'openmodel-cockpit-sample',
    tool: 'compose_dashboard',
    expectTemplateId: 'cockpit',
    expectExperienceId: 'db-model-monitoring-cockpit',
    context: {
      surface: 'dashboard',
      audience: ['technical'],
      businessIntent: ['monitor-model-health', 'detect-drift-early'],
      corporateSuitability: 'standard',
      motionPreference: 1,
    },
    brief:
      'A drift-watch dashboard for the open-weight model fleet we serve in production: every model plotted by population stability index against its breach limit, the one breaching model flagged with its trend history and feature-level drivers, and the overnight incident log.',
    fill: openmodelCockpitFill,
  },
  {
    slug: 'moderation-stack',
    evidenceDir: 'moderation-explainer-sample',
    tool: 'compose_explainer',
    expectTemplateId: 'drawing-office',
    expectExperienceId: 'exp-system-architecture',
    context: {
      surface: 'technical-explainer',
      audience: ['technical', 'mixed'],
      businessIntent: ['support-architecture-review', 'onboard-new-engineers'],
      corporateSuitability: 'standard',
      motionPreference: 2,
    },
    brief:
      'One legible as-built drawing of our real-time trust-and-safety moderation stack: reports and the content firehose in, classifier serving with its model registry, the policy engine deciding, the enforcement log, quality watch, and the human review queue — with the review queue named honestly as the capacity constraint.',
    fill: moderationStackFill,
  },
  {
    slug: 'agent-evals',
    evidenceDir: 'agent-evals-ledger-sample',
    tool: 'compose_project_page',
    expectTemplateId: 'ledger',
    expectExperienceId: 'proj-ai-model-validation-hub',
    context: {
      surface: 'project-page',
      audience: ['technical', 'risk-and-governance'],
      businessIntent: ['track-sign-off-status', 'centralise-validation-evidence'],
      corporateSuitability: 'restricted',
      motionPreference: 1,
    },
    brief:
      'The agent-evaluation programme hub: every LLM agent on the pre-production pipeline from intake through red-team challenge and independent review to sign-off, the one agent stalled past its threshold flagged up front, recent outcomes on file, and the decision log.',
    fill: agentEvalsFill,
  },
  {
    slug: 'ml-career',
    evidenceDir: 'ml-career-line-sample',
    tool: 'compose_personal_page',
    expectTemplateId: 'the-line',
    expectExperienceId: 'home-career-project-timeline',
    context: {
      surface: 'personal-page',
      audience: ['personal-internal'],
      businessIntent: ['showcase-career-trajectory', 'connect-projects-to-outcomes'],
      corporateSuitability: 'standard',
      motionPreference: 3,
    },
    brief:
      'A personal page telling an applied-ML career as one continuous line riding the field’s real epochs — deep learning, transformers, LLMs, agents — stations with shipped outcomes, promotions where the line steps up, and the one deliberate reversal out of management back to the tools.',
    fill: mlCareerFill,
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

/** Parse the `content[].text` JSON fallback that every tool response carries. */
function textPayload(result: CallToolResult): unknown {
  const first = result.content[0];
  if (!first || first.type !== 'text') return undefined;
  return JSON.parse(first.text);
}

async function main(): Promise<void> {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['--import', 'tsx', serverEntry],
    cwd: path.resolve(here, '..'),
    stderr: 'pipe',
  });

  const client = new Client({ name: 'design-mcp-goal-samples-client', version: '0.1.0' });
  await client.connect(transport);

  try {
    for (const sample of SAMPLES) {
      const composeResult = (await client.callTool({
        name: sample.tool,
        arguments: { context: sample.context, contentBrief: sample.brief },
      })) as CallToolResult;

      const composeOut = ComposeSlideDeckOutput.safeParse(composeResult.structuredContent);
      check(`[${sample.slug}] ${sample.tool} not isError`, composeResult.isError !== true);
      check(
        `[${sample.slug}] compose output parses`,
        composeOut.success,
        composeOut.success ? '' : composeOut.error.message,
      );
      check(
        `[${sample.slug}] selection → ${sample.expectExperienceId} (${sample.expectTemplateId})`,
        composeOut.success &&
          composeOut.data.worldTemplateId === sample.expectTemplateId &&
          composeOut.data.experienceId === sample.expectExperienceId,
        composeOut.success ? `${composeOut.data.worldTemplateId} / ${composeOut.data.experienceId}` : '',
      );
      check(
        `[${sample.slug}] skeleton carries sections + craft guarantees`,
        composeOut.success &&
          composeOut.data.fillSkeleton.sections.length > 0 &&
          composeOut.data.fillSkeleton.craftGuarantees.length > 0,
        composeOut.success ? `${composeOut.data.fillSkeleton.sections.length} sections` : '',
      );

      const serializedFill = JSON.parse(JSON.stringify(sample.fill)) as unknown;
      const validateResult = (await client.callTool({
        name: 'validate_fill',
        arguments: { worldTemplateId: sample.expectExperienceId, fill: serializedFill },
      })) as CallToolResult;

      const validateOut = ValidateFillOutput.safeParse(validateResult.structuredContent);
      check(`[${sample.slug}] validate_fill not isError`, validateResult.isError !== true);
      check(
        `[${sample.slug}] validate_fill valid=true, no findings`,
        validateOut.success && validateOut.data.valid === true && validateOut.data.findings.length === 0,
        validateOut.success
          ? `valid=${validateOut.data.valid}, ${validateOut.data.findings.length} findings`
          : '',
      );

      // Write the COMPLETE raw tool responses as committed evidence, per sample.
      const outDir = path.resolve(here, '../../../docs/superpowers/specs', sample.evidenceDir);
      mkdirSync(outDir, { recursive: true });
      const outcome = {
        generatedAt: new Date().toISOString(),
        sample: sample.slug,
        brief: sample.brief,
        context: sample.context,
        compose: {
          tool: sample.tool,
          arguments: { context: sample.context, contentBrief: sample.brief },
          structuredContent: composeResult.structuredContent,
          text: textPayload(composeResult),
        },
        validate: {
          tool: 'validate_fill',
          arguments: { worldTemplateId: sample.expectExperienceId },
          structuredContent: validateResult.structuredContent,
          text: textPayload(validateResult),
        },
        checks: checks.filter((c) => c.name.startsWith(`[${sample.slug}]`)),
      };
      writeFileSync(path.join(outDir, 'mcp-outcome.json'), `${JSON.stringify(outcome, null, 2)}\n`, 'utf8');
    }
  } finally {
    await client.close();
  }

  const failures = checks.filter((c) => !c.pass);
  console.log('\n=== Goal-test five-sample outcome ===');
  for (const c of checks) {
    console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  (${c.detail})` : ''}`);
  }
  console.log(`\n${failures.length === 0 ? 'PASS' : 'FAIL'}: ${checks.length - failures.length}/${checks.length} checks passed`);
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error: unknown) => {
  console.error(`goal-samples-outcome fatal: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  process.exit(1);
});
