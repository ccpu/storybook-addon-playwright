import * as fs from 'fs';
import * as path from 'path';

import { generateActionSchema } from './generate-action-schema';
import { generateSchema } from './generate-schema';

/**
 * Generates all Playwright JSON schema files consumed by src/api/server/data.
 */

const DEFAULT_TYPE_FILE = path.resolve(
  __dirname,
  '../../src/api/typings/schema-types.ts',
);
const DATA_OUTPUT_DIR = path.resolve(__dirname, '../../src/api/server/data');

const saveSchema = (result: unknown, fileName: string) => {
  if (process.env.NODE_ENV === 'test') return;

  fs.mkdirSync(DATA_OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.resolve(DATA_OUTPUT_DIR, fileName + '.json'),
    JSON.stringify(result, null, 2),
    'utf8',
  );
};

export const generateAllSchema = (typePath = DEFAULT_TYPE_FILE) => {
  const screenshotOptionSchema = generateSchema({
    excludeProps: ['path'],
    path: typePath,
    type: 'PlaywrightScreenshotOptionSchema',
  });
  saveSchema(screenshotOptionSchema, 'screenshot-option-schema');

  const browserOptionSchema = generateSchema({
    excludeProps: ['extraHTTPHeaders', 'logger'],
    excludeRootProps: ['_recordVideos'],
    path: typePath,
    type: 'PlaywrightBrowserContextOptionSchema',
  });
  saveSchema(browserOptionSchema, 'browser-option-schema');

  const actionSchema = generateActionSchema(typePath);
  saveSchema(actionSchema, 'action-schema');

  return {
    actionSchema,
    browserOptionSchema,
    screenshotOptionSchema,
  };
};

if (require.main === module) {
  generateAllSchema();
}
