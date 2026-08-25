import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

function findPackageJsonPath(startDir: string) {
  let currentDir = startDir;

  while (currentDir !== path.dirname(currentDir)) {
    const packagePath = path.join(currentDir, 'package.json');

    try {
      require.resolve(packagePath);
      return packagePath;
    } catch {
      // Keep walking up until we reach the repository root.
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error('Cannot find package.json');
}

export function getVersion() {
  const packagePath = findPackageJsonPath(process.cwd());

  const { version } = require(packagePath) as { version: string };

  return version.split('.')[0].toString();
}
