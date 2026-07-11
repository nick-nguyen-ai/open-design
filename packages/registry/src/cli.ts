import process from 'node:process';
import { compileRegistry, defaultOutDir } from './compile.js';
import type { CompileResult, Diagnostic } from './types.js';

type Command = 'build' | 'validate';

interface CliArgs {
  command: Command;
  cwd: string;
}

function parseArgs(argv: string[]): CliArgs {
  const command = argv[0];
  if (command !== 'build' && command !== 'validate') {
    process.stderr.write(`Usage: registry <build|validate> [--cwd <dir>]\n`);
    process.exit(2);
  }
  let cwd = process.cwd();
  for (let i = 1; i < argv.length; i += 1) {
    if (argv[i] === '--cwd') {
      const value = argv[i + 1];
      if (value === undefined) {
        process.stderr.write(`--cwd requires a directory argument\n`);
        process.exit(2);
      }
      cwd = value;
      i += 1;
    }
  }
  return { command, cwd };
}

function formatDiagnostic(diagnostic: Diagnostic): string {
  const marker = diagnostic.severity === 'error' ? 'ERROR' : 'WARN ';
  const where = diagnostic.path ?? diagnostic.entityId ?? '';
  const suffix = where.length > 0 ? ` (${where})` : '';
  return `  ${marker} [${diagnostic.ruleId}] ${diagnostic.message}${suffix}`;
}

function report(command: Command, result: CompileResult, outDir: string): void {
  const lines: string[] = [];
  lines.push(
    `registry:${command} — ${result.components.length} component(s), ${result.experiences.length} experience(s), ` +
      `${result.grammars.length} grammar(s), ${result.motionSequences.length} motion sequence(s), ` +
      `${result.searchDocuments.length} search document(s)`,
  );

  const errors = result.diagnostics.filter((d) => d.severity === 'error');
  const warnings = result.diagnostics.filter((d) => d.severity === 'warning');
  for (const diagnostic of [...errors, ...warnings]) lines.push(formatDiagnostic(diagnostic));

  lines.push(`${result.errorCount} error(s), ${result.warningCount} warning(s)`);
  if (command === 'build' && result.ok) lines.push(`Wrote artefacts to ${outDir}`);
  process.stdout.write(`${lines.join('\n')}\n`);
}

async function main(): Promise<void> {
  const { command, cwd } = parseArgs(process.argv.slice(2));
  const outDir = defaultOutDir(cwd);
  const result = await compileRegistry({ cwd, write: command === 'build' });
  report(command, result, outDir);
  process.exit(result.ok ? 0 : 1);
}

void main();
