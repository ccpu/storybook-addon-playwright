#!/usr/bin/env node

import { runPropsToArgsMigration } from './api/server/migration/props-to-args-migration';

const usage =
  'Usage: storybook-addon-playwright migrate props-to-args\n' +
  '   or: storybook-addon-playwright props-to-args';

const isPropsToArgsCommand = (args: string[]) => {
  const [first, second] = args;

  return (
    first === 'props-to-args' ||
    (first === 'migrate' && second === 'props-to-args')
  );
};

export const runCli = (args: string[]) => {
  if (!isPropsToArgsCommand(args)) {
    console.log(usage);
    return 1;
  }

  const result = runPropsToArgsMigration();
  console.log(
    `Scanned ${result.scannedFiles} file(s), updated ${result.changedFiles.length} file(s).`,
  );

  if (result.changedFiles.length) {
    console.log(result.changedFiles.join('\n'));
  }

  return 0;
};

if (require.main === module) {
  process.exitCode = runCli(process.argv.slice(2));
}
