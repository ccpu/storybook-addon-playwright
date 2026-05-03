import path from 'path';
import { spawn, type ChildProcess } from 'child_process';
import { rm } from 'fs/promises';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = '9002';
const EXTRA_PORTS_TO_CLEAN = ['9003'];
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
let buildSuccessCount = 0;

function log(message: string) {
  process.stdout.write(`[start-dev] ${message}\n`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function runCommand(command: string, args: string[]): Promise<string> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true,
    });

    let output = '';
    child.stdout?.on('data', (chunk: Buffer | string) => {
      output += chunk.toString();
    });

    child.on('error', () => resolve(''));
    child.on('exit', () => resolve(output));
  });
}

async function killProcessTree(pid: number) {
  if (!Number.isFinite(pid)) return;

  if (process.platform === 'win32') {
    await runCommand('taskkill', ['/pid', String(pid), '/t', '/f']);
    return;
  }

  process.kill(pid, 'SIGTERM');
}

async function getPidsListeningOnPort(port: string): Promise<number[]> {
  if (process.platform === 'win32') {
    const output = await runCommand('netstat', ['-ano', '-p', 'tcp']);
    const pids = new Set<number>();

    for (const line of output.split(/\r?\n/)) {
      if (!line.includes('LISTENING')) continue;
      if (!line.includes(`:${port}`)) continue;
      const columns = line.trim().split(/\s+/);
      const pid = Number(columns[columns.length - 1]);
      if (Number.isFinite(pid)) pids.add(pid);
    }

    return [...pids];
  }

  const output = await runCommand('lsof', ['-ti', `:${port}`]);
  return output
    .split(/\r?\n/)
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
}

async function cleanupStorybookPorts() {
  const ports = [PORT, ...EXTRA_PORTS_TO_CLEAN];

  for (const port of ports) {
    const pids = await getPidsListeningOnPort(port);
    const filteredPids = pids.filter((pid) => pid !== process.pid);
    if (!filteredPids.length) continue;

    log(
      `terminating stale process(es) on port ${port}: ${filteredPids.join(
        ', ',
      )}`,
    );

    await Promise.all(filteredPids.map((pid) => killProcessTree(pid)));
  }
}

async function waitForStorybookPortsToBeFree() {
  const ports = [PORT, ...EXTRA_PORTS_TO_CLEAN];

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const pidsByPort = await Promise.all(
      ports.map(async (port) => {
        const pids = await getPidsListeningOnPort(port);
        const filteredPids = pids.filter((pid) => pid !== process.pid);
        return { port, pids: filteredPids };
      }),
    );

    const occupied = pidsByPort.filter((entry) => entry.pids.length > 0);

    if (!occupied.length) {
      return;
    }

    if (attempt === 0) {
      log('waiting for Storybook ports to be released...');
    }

    await delay(200);
  }

  await cleanupStorybookPorts();
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
        buildSuccessCount += 1;

        // tsup config builds manager + node targets; wait for both successes
        // before starting/restarting Storybook so dist artifacts are complete.
        if (buildSuccessCount >= 2) {
          buildSuccessCount = 0;
          hasSuccessfulBuild = true;
          scheduleRestart();
        }
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

async function startStorybook() {
  await cleanupStorybookPorts();
  await waitForStorybookPortsToBeFree();

  const storybookEnv = {
    ...process.env,
    STORYBOOK_DISABLE_TELEMETRY: '1',
  };

  storybookChild = spawn(
    NODE_BIN,
    [
      STORYBOOK_BIN,
      'dev',
      '-p',
      PORT,
      '--no-open',
      '--ci',
      '--disable-telemetry',
    ],
    {
      cwd: ROOT,
      env: storybookEnv,
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
      void startStorybook();
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
    await startStorybook();
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
  const watchEnv = { ...process.env };

  if (process.platform === 'win32') {
    // Mapped/network drives on Windows can miss fs events; polling is more reliable.
    watchEnv.CHOKIDAR_USEPOLLING ??= '1';
    watchEnv.CHOKIDAR_INTERVAL ??= '250';
    log('using polling file watcher for tsup (Windows)');
  }

  tsupChild = spawn(NODE_BIN, [TSUP_BIN, '--watch', 'src'], {
    cwd: ROOT,
    env: watchEnv,
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
