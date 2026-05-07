import path from 'node:path';

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

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = (require(packagePath).version as string).split('.')[0].toString();

  return version;
}
