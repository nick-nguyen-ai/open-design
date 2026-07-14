/**
 * Deck-composer skill run (ledger T33) — the OpenWiki MCP outcome.
 *
 * Drives the REAL MCP path end to end for the OpenWiki intro brief: it spawns
 * the stdio server (exactly like `demo-client.ts` / `sample-outcome.ts`), calls
 * `compose_slide_deck` with the GA-announcement brief from the skill run's
 * intake (styleHint art-directed — the recorded intake answer), asserts the
 * deterministic selection is `deck-product-launch` (The T-Minus), then calls
 * `validate_fill` with the JSON-serialized OpenWiki fill and asserts it is
 * `valid: true`. The COMPLETE raw tool responses are written to
 * `docs/superpowers/specs/openwiki-sample/mcp-outcome.json` as committed
 * evidence.
 *
 * Prints a PASS/FAIL summary and exits non-zero on any failure.
 *
 * Run: `corepack pnpm --filter mcp-server openwiki`
 */
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ComposeSlideDeckOutput, ValidateFillOutput } from './schemas.js';
import { openwikiFill } from '../../../experiences/slide-decks/sample-openwiki/fill.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, 'index.ts');

/** The skill run's brief (fresh topic — LangChain OpenWiki GA + pilot rollout). */
const CONTENT_BRIEF =
  'Introduce OpenWiki, the just-released open-source agent for repo documentation — announce the launch and stage the countdown to rolling it out across our repositories: readiness gates, day-0 runbook, adoption targets.';

/** DesignContext-lite from the recorded intake answers (see openwiki-sample/source-context.md). */
const CONTEXT = {
  surface: 'slide-deck' as const,
  audience: ['mixed' as const],
  businessIntent: ['announce-product-release'],
  corporateSuitability: 'standard' as const,
  motionPreference: 2 as const,
  styleHint: 'art-directed' as const,
};

const EXPECTED_TEMPLATE_ID = 'tminus';
const EXPECTED_EXPERIENCE_ID = 'deck-product-launch';
/** validate_fill accepts the experienceId form of the template handle. */
const VALIDATE_TEMPLATE_HANDLE = 'deck-product-launch';

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

  const client = new Client({ name: 'design-mcp-openwiki-client', version: '0.1.0' });
  await client.connect(transport);

  let composeResult: CallToolResult | undefined;
  let validateResult: CallToolResult | undefined;

  try {
    // 1. compose_slide_deck for the OpenWiki brief → expect deck-product-launch (The T-Minus).
    composeResult = (await client.callTool({
      name: 'compose_slide_deck',
      arguments: { context: CONTEXT, contentBrief: CONTENT_BRIEF },
    })) as CallToolResult;

    const composeOut = ComposeSlideDeckOutput.safeParse(composeResult.structuredContent);
    check('compose_slide_deck not isError', composeResult.isError !== true);
    check(
      'compose_slide_deck structuredContent is a valid ComposeSlideDeckOutput',
      composeOut.success,
      composeOut.success ? '' : composeOut.error.message,
    );
    check(
      `compose_slide_deck → ${EXPECTED_EXPERIENCE_ID} (${EXPECTED_TEMPLATE_ID})`,
      composeOut.success &&
        composeOut.data.worldTemplateId === EXPECTED_TEMPLATE_ID &&
        composeOut.data.experienceId === EXPECTED_EXPERIENCE_ID,
      composeOut.success ? `${composeOut.data.worldTemplateId} / ${composeOut.data.experienceId}` : '',
    );
    check(
      'compose_slide_deck fill skeleton carries slide kinds + craft guarantees',
      composeOut.success &&
        composeOut.data.fillSkeleton.slideKinds.length > 0 &&
        composeOut.data.fillSkeleton.craftGuarantees.length > 0,
      composeOut.success ? `${composeOut.data.fillSkeleton.slideKinds.length} slide kinds` : '',
    );

    // 2. validate_fill with the JSON-serialized OpenWiki fill → expect valid:true.
    const serializedFill = JSON.parse(JSON.stringify(openwikiFill)) as unknown;
    validateResult = (await client.callTool({
      name: 'validate_fill',
      arguments: { worldTemplateId: VALIDATE_TEMPLATE_HANDLE, fill: serializedFill },
    })) as CallToolResult;

    const validateOut = ValidateFillOutput.safeParse(validateResult.structuredContent);
    check('validate_fill not isError', validateResult.isError !== true);
    check(
      'validate_fill structuredContent is a valid ValidateFillOutput',
      validateOut.success,
      validateOut.success ? '' : validateOut.error.message,
    );
    check(
      'validate_fill(OpenWiki fill) valid=true, no findings',
      validateOut.success && validateOut.data.valid === true && validateOut.data.findings.length === 0,
      validateOut.success
        ? `valid=${validateOut.data.valid}, ${validateOut.data.findings.length} findings`
        : '',
    );
  } finally {
    await client.close();
  }

  // Write the COMPLETE raw tool responses as committed evidence.
  const outDir = path.resolve(here, '../../../docs/superpowers/specs/openwiki-sample');
  mkdirSync(outDir, { recursive: true });
  const outcome = {
    generatedAt: new Date().toISOString(),
    brief: CONTENT_BRIEF,
    context: CONTEXT,
    validateTemplateHandle: VALIDATE_TEMPLATE_HANDLE,
    compose: {
      tool: 'compose_slide_deck',
      arguments: { context: CONTEXT, contentBrief: CONTENT_BRIEF },
      raw: composeResult,
      structuredContent: composeResult?.structuredContent,
      text: composeResult ? textPayload(composeResult) : undefined,
    },
    validate: {
      tool: 'validate_fill',
      arguments: { worldTemplateId: VALIDATE_TEMPLATE_HANDLE, fill: openwikiFill },
      raw: validateResult,
      structuredContent: validateResult?.structuredContent,
      text: validateResult ? textPayload(validateResult) : undefined,
    },
    checks,
  };
  const outPath = path.join(outDir, 'mcp-outcome.json');
  writeFileSync(outPath, `${JSON.stringify(outcome, null, 2)}\n`, 'utf8');

  const failures = checks.filter((c) => !c.pass);
  console.log('\n=== MCP OpenWiki outcome ===');
  for (const c of checks) {
    console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  (${c.detail})` : ''}`);
  }
  console.log(`\nEvidence written: ${outPath}`);
  console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'}: ${checks.length - failures.length}/${checks.length} checks passed`);
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error: unknown) => {
  console.error(`openwiki-outcome fatal: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  process.exit(1);
});
