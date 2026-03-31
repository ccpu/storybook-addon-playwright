import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const hasExplicitTarget = args.some((arg) => {
  if (!arg || arg.startsWith('-')) return false;
  return /[\\/]/.test(arg) || /\.(?:[cm]?[jt]sx?)$/i.test(arg);
});

const vitestArgs = ['exec', 'vitest', 'run'];

if (!hasExplicitTarget) {
  vitestArgs.push('--coverage');
}

vitestArgs.push(...args);

const result = spawnSync('pnpm', vitestArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exitCode = result.status ?? 1;