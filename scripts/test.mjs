import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

// Ensure dist/trpc stub mocks exist so CJS require() in middleware.js resolves
// without needing a full build. These are tiny stubs that prevent the real
// router/context (which pull in native deps like sharp) from loading.
const trpcDir = 'dist/trpc';
if (!existsSync(trpcDir)) mkdirSync(trpcDir, { recursive: true });
if (!existsSync(`${trpcDir}/router.js`))
  writeFileSync(
    `${trpcDir}/router.js`,
    'module.exports={appRouter:{_def:{}}};',
  );
if (!existsSync(`${trpcDir}/context.js`))
  writeFileSync(
    `${trpcDir}/context.js`,
    'module.exports={createContext:function(){return{}}};',
  );

const args = process.argv.slice(2);

// Run main test suite (vmThreads pool – fast)
const vitestArgs = ['exec', 'vitest', 'run', ...args];
const main = spawnSync('pnpm', vitestArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

// Run middleware.test.js separately in forks pool because it relies on a
// Module._load patch for CJS require() interception that only works in forks.
const mw = spawnSync(
  'pnpm',
  ['exec', 'vitest', 'run', '--config', 'vitest.middleware.config.ts'],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

process.exitCode = (main.status || 0) | (mw.status || 0);
