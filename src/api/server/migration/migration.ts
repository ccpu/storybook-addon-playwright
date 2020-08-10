import path from 'path';
import glob from 'fast-glob';
import { readFileSync } from 'jsonfile';
import { getStoryPlaywrightFileInfo, saveStoryFile } from '../utils';
import { migrateToV1 } from './migration-v1';
import { migrationV2 } from './migration-v2';
import { getVersion } from '../utils';

export const migrateFile = (file: string, version: string) => {
  let data = readFileSync(file);

  console.log(`\nMigrating ${path.parse(file).name} to v${version}...`);

  if (!data.version) {
    data = migrateToV1(data, '1');
  }

  if (data.version === '1') {
    data = migrationV2(data, '2');
  }

  return data;
};

export const migration = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = getVersion();

  console.log('\nMigrating to v' + version + ' ...');

  const files = glob.sync(['**/*.playwright.json', '!node_modules/**']);

  files.forEach((file) => {
    const fileInfo = getStoryPlaywrightFileInfo(file);
    const data = migrateFile(file, version);
    if (data) {
      saveStoryFile(fileInfo, data);
    }
  });

  console.log(`\nEnd of migration.`);
};
