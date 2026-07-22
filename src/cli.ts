#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { runPropsToArgsMigration } from './api/server/migration/props-to-args-migration';

const DEFAULT_STORYBOOK_URL = 'http://localhost:6006';
const TRPC_PATH = '/__storybook_playwright/trpc/screenshot.testScreenshots';
const HTTP_NOT_FOUND = 404;
const ARGV_START_INDEX = 2;

const usage =
  'Usage:\n' +
  '  storybook-addon-playwright migrate props-to-args\n' +
  '  storybook-addon-playwright props-to-args\n' +
  '  storybook-addon-playwright generate <file.playwright.json> [--story <storyId>] [--all] [--url <origin>]\n' +
  '\n' +
  '`generate` produces the baseline images for screenshots you have already\n' +
  'authored in a *.stories.playwright.json file. It requires a running Storybook\n' +
  'dev server with this addon (that is where the browser and config live).';

function isPropsToArgsCommand(args: string[]) {
  const [first, second] = args;

  return first === 'props-to-args' || (first === 'migrate' && second === 'props-to-args');
}

interface GenerateArgs {
  filePath?: string;
  storyId?: string;
  all: boolean;
  url: string;
}

function parseGenerateArgs(args: string[]): GenerateArgs {
  const result: GenerateArgs = { all: false, url: DEFAULT_STORYBOOK_URL };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--all') {
      result.all = true;
    } else if (arg === '--story') {
      result.storyId = args[++i];
    } else if (arg === '--url') {
      result.url = args[++i] || DEFAULT_STORYBOOK_URL;
    } else if (!arg.startsWith('--') && result.filePath === undefined) {
      result.filePath = arg;
    }
  }

  return result;
}

/** Repo-root-relative POSIX path — the form the addon matches server-side. */
function normalizeFilePath(filePath: string): string {
  const relative = path.isAbsolute(filePath)
    ? path.relative(process.cwd(), filePath)
    : filePath;

  return relative.replace(/\\/g, '/');
}

/**
 * Printed when the dev server is unreachable. This is a normal state (Storybook
 * simply is not running), NOT a failure to debug — so `generate` exits 0. The
 * message tells an AI agent to stop here and hand the manual steps to the user
 * instead of trying to start Storybook or retrying.
 */
function printStorybookNotRunning(url: string) {
  console.log(
    [
      `Storybook is not reachable at ${url}, so no images were generated.`,
      '',
      'This is expected when Storybook is not running — it is NOT an error to fix,',
      'and there is no headless way to generate images without it. Do not try to',
      'start Storybook or retry automatically.',
      '',
      'Assistant: stop here and give the user these steps; do not attempt recovery.',
      '',
      'To generate the baseline images, the user should:',
      "  1. Start Storybook:  npm run storybook   (or this project's storybook script)",
      '  2. Open the story in the browser.',
      '  3. In the "Playwright" addon panel, select the screenshot and click Save',
      '     (or simply re-run this command once Storybook is running).',
    ].join('\n'),
  );
}

interface ImageDiffResult {
  added?: boolean;
  pass?: boolean;
  storyId?: string;
  screenshotIdentifier?: string;
}

function unwrapTrpcData(payload: unknown): ImageDiffResult[] {
  const single = Array.isArray(payload) ? payload[0] : payload;
  const data = (single as { result?: { data?: unknown } })?.result?.data;

  return Array.isArray(data) ? (data as ImageDiffResult[]) : [];
}

function reportResults(results: ImageDiffResult[], filePath: string): number {
  if (results.length === 0) {
    console.log(
      `No screenshots were generated for "${filePath}".\n` +
        'Check that the path is correct (relative to the Storybook project root) and\n' +
        'that the file contains screenshot definitions.',
    );
    return 0;
  }

  const added = results.filter((r) => r.added);
  const failed = results.filter((r) => !r.added && r.pass === false);
  const label = (r: ImageDiffResult) =>
    r.screenshotIdentifier || r.storyId || 'screenshot';

  if (added.length) {
    console.log(`Generated ${added.length} new baseline image(s):`);
    added.forEach((r) => console.log(`  + ${label(r)}`));
  }

  const matched = results.length - added.length;
  if (matched > 0) {
    console.log(
      `${matched} screenshot(s) already had a baseline (compared, not overwritten).`,
    );
  }

  if (failed.length) {
    console.log(`${failed.length} screenshot(s) did NOT match their existing baseline:`);
    failed.forEach((r) => console.log(`  ! ${label(r)}`));
    console.log(
      'These already have a baseline — delete it (or use the addon panel) to re-record.',
    );
    return 1;
  }

  return 0;
}

async function runGenerate(rawArgs: string[]): Promise<number> {
  const options = parseGenerateArgs(rawArgs);

  if (!options.filePath && !options.all) {
    console.log(usage);
    return 1;
  }

  const filePath = options.filePath ? normalizeFilePath(options.filePath) : '';
  const endpoint = `${options.url.replace(/\/+$/, '')}${TRPC_PATH}`;

  const input = {
    filePath,
    requestType: options.all ? 'all' : options.storyId ? 'story' : 'file',
    storyId: options.storyId ?? '',
  };

  let response: Response;

  try {
    response = await fetch(endpoint, {
      body: JSON.stringify(input),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
  } catch {
    // Connection refused / DNS failure → the dev server is not running.
    printStorybookNotRunning(options.url);
    return 0;
  }

  if (response.status === HTTP_NOT_FOUND) {
    console.log(
      `Storybook is running at ${options.url}, but the addon endpoint was not found.\n` +
        'Make sure storybook-addon-playwright is registered in .storybook/main and its\n' +
        'middleware is loaded, then try again.',
    );
    return 0;
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error(`Screenshot generation failed (HTTP ${response.status}).\n${body}`);
    return 1;
  }

  const payload = (await response.json().catch(() => null)) as unknown;

  return reportResults(unwrapTrpcData(payload), options.filePath ?? '*');
}

export function runCli(args: string[]): number | Promise<number> {
  if (isPropsToArgsCommand(args)) {
    const result = runPropsToArgsMigration();
    console.log(
      `Scanned ${result.scannedFiles} file(s), updated ${result.changedFiles.length} file(s).`,
    );

    if (result.changedFiles.length) {
      console.log(result.changedFiles.join('\n'));
    }

    return 0;
  }

  if (args[0] === 'generate') {
    return runGenerate(args.slice(1));
  }

  console.log(usage);
  return 1;
}

if (require.main === module) {
  Promise.resolve(runCli(process.argv.slice(ARGV_START_INDEX))).then((code) => {
    process.exitCode = code;
  });
}
