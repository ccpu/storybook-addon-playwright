import path from 'path';
import { spawn, type ChildProcess } from 'child_process';
import { rm } from 'fs/promises';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = '9002';
const NODE_BIN = process.execPath;
const STORYBOOK_BIN = path.join(
  ROOT,
  'node_modules',
  'storybook',
  'bin',
  'index.cjs',
);
const TSUP_BIN = path.join(
  ROOT,
  'node_modules',
  'tsup',
  'dist',
  'cli-default.js',
);

let storybookChild: ChildProcess | null = null;
let tsupChild: ChildProcess | null = null;
let restartTimer: ReturnType<typeof setTimeout> | null = null;
let isRestarting = false;
let isShuttingDown = false;
let hasSuccessfulBuild = false;

function log(message: string) {
  process.stdout.write(`[start-dev] ${message}\n`);
}

function pipeWithBuildDetection(stream: NodeJS.ReadableStream | null) {
  if (!stream) return;

  let buffer = '';
  stream.on('data', (chunk: Buffer | string) => {
    const text = chunk.toString();
    process.stdout.write(text);
    buffer += text;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.includes('Build success')) {
        hasSuccessfulBuild = true;
        scheduleRestart();
      }
    }
  });
}

function stopStorybook(): Promise<void> {
  return new Promise((resolve) => {
    if (!storybookChild || storybookChild.exitCode !== null) {
      storybookChild = null;
      resolve();
      return;
    }

    const currentChild = storybookChild;
    const finish = () => {
      if (storybookChild === currentChild) storybookChild = null;
      resolve();
    };

    currentChild.once('exit', finish);

    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(currentChild.pid), '/t', '/f'], {
        stdio: 'ignore',
        windowsHide: true,
      });
      return;
    }

    currentChild.kill('SIGTERM');
  });
}

function startStorybook() {
  storybookChild = spawn(
    NODE_BIN,
    [STORYBOOK_BIN, 'dev', '-p', PORT, '--no-open', '--ci'],
    {
      cwd: ROOT,
      stdio: 'inherit',
      shell: false,
      windowsHide: false,
    },
  );

  storybookChild.on('exit', (code) => {
    if (isShuttingDown) {
      process.exit(0);
      return;
    }
    if (isRestarting) {
      isRestarting = false;
      startStorybook();
      return;
    }
    if (code !== null) process.exit(code);
  });
}

async function restartStorybook() {
  if (!hasSuccessfulBuild) {
    return;
  }

  if (!storybookChild) {
    log('tsup build finished, starting Storybook...');
    startStorybook();
    return;
  }

  log('addon rebuild finished, restarting Storybook...');
  if (isRestarting) return;
  isRestarting = true;
  await rm(path.join(ROOT, 'node_modules', '.cache', 'storybook'), {
    recursive: true,
    force: true,
  }).catch(() => {});
  await stopStorybook();
}

function scheduleRestart() {
  if (restartTimer) clearTimeout(restartTimer);
  restartTimer = setTimeout(restartStorybook, 300);
}

function stopTsup(): Promise<void> {
  return new Promise((resolve) => {
    if (!tsupChild || tsupChild.exitCode !== null) {
      tsupChild = null;
      resolve();
      return;
    }

    tsupChild.once('exit', () => {
      tsupChild = null;
      resolve();
    });

    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(tsupChild.pid), '/t', '/f'], {
        stdio: 'ignore',
        windowsHide: true,
      });
      return;
    }

    tsupChild.kill('SIGTERM');
  });
}

function startTsup() {
  tsupChild = spawn(NODE_BIN, [TSUP_BIN, '--watch'], {
    cwd: ROOT,
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
    windowsHide: false,
  });

  pipeWithBuildDetection(tsupChild.stdout);
  pipeWithBuildDetection(tsupChild.stderr);

  tsupChild.on('exit', (code) => {
    if (isShuttingDown) {
      process.exit(0);
      return;
    }

    if (code !== 0 && code !== null) {
      process.exit(code);
    }
  });
}

process.on('SIGINT', () => {
  isShuttingDown = true;
  Promise.all([stopStorybook(), stopTsup()]).finally(() => process.exit(0));
});

process.on('SIGTERM', () => {
  isShuttingDown = true;
  Promise.all([stopStorybook(), stopTsup()]).finally(() => process.exit(0));
});

log('starting tsup watch and Storybook dev server...');
startTsup();
