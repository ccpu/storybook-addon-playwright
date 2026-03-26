/**
 * Dev-mode storybook launcher with automatic restart.
 *
 * Usage:  node .storybook/start-dev.js
 *   or:   npm run start:storybook:dev
 *
 * How it works:
 *  1. chokidar watches src/ for any .ts/.tsx change.
 *  2. After a 300ms debounce the current storybook child process is killed.
 *  3. A new storybook process is spawned.
 *  4. Storybook 8 builds the manager with esbuild at startup.  main.js
 *     configures managerEntries to point directly at src/register.tsx so esbuild
 *     compiles all TypeScript source fresh — NO separate `tsc` build step needed
 *     for manager/UI changes.  The esbuild outdir is wiped before each build.
 *  5. The live-reload-client.js loses the SSE connection when the server dies.
 *     It polls every second until the new server is ready, then auto-reloads.
 *
 * Note: server-side changes (src/api/server/**) are loaded from dist/ by the
 * middleware.  Run `npm run watch` alongside this script if you edit those files.
 */

const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const STORYBOOK_CMD =
  process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : 'npm';
const STORYBOOK_ARGS =
  process.platform === 'win32'
    ? ['/d', '/s', '/c', 'npm run start:storybook']
    : ['run', 'start:storybook'];

let child = null;
let restartTimer = null;
let isRestarting = false;
let isShuttingDown = false;

function stopChild() {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null) {
      child = null;
      resolve();
      return;
    }

    const currentChild = child;
    const finish = () => {
      if (child === currentChild) {
        child = null;
      }
      resolve();
    };

    currentChild.once('exit', finish);

    if (process.platform === 'win32') {
      const killer = spawn(
        'taskkill',
        ['/pid', String(currentChild.pid), '/t', '/f'],
        {
          stdio: 'ignore',
          windowsHide: true,
        },
      );

      killer.on('exit', () => {
        // `taskkill` exit code is not reliable for our use case; the child exit
        // event is the source of truth and resolves the promise.
      });
      return;
    }

    currentChild.kill('SIGTERM');
  });
}

function start() {
  child = spawn(STORYBOOK_CMD, STORYBOOK_ARGS, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
    windowsHide: false,
  });

  child.on('exit', (code, signal) => {
    if (isShuttingDown) {
      process.exit(0);
      return;
    }

    if (isRestarting) {
      isRestarting = false;
      start();
      return;
    }

    // If storybook exits on its own, propagate the exit code.
    if (code !== null) {
      process.exit(code);
    }
  });
}

async function restart() {
  console.log('\n[start-dev] src/ changed – restarting storybook…\n');
  if (!child) {
    start();
    return;
  }

  if (isRestarting) {
    return;
  }

  isRestarting = true;
  await stopChild();
}

function scheduleRestart() {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(restart, 300);
}

// Watch src/ — ignore .d.ts declaration files and test files
chokidar
  .watch(SRC, {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored: [/\.d\.ts$/, /__tests__/, /\.test\./],
  })
  .on('add', scheduleRestart)
  .on('change', scheduleRestart)
  .on('unlink', scheduleRestart);

process.on('SIGINT', () => {
  isShuttingDown = true;
  stopChild();
});

process.on('SIGTERM', () => {
  isShuttingDown = true;
  stopChild();
});

console.log('[start-dev] watching src/ for changes…');
start();
