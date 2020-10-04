import * as fs from 'fs';
import * as path from 'path';
import { generateSchema } from './generate-schema';
import { generateActionSchema } from './generate-action-schema';

const saveSchema = (result: unknown, fileName: string) => {
  if (process.env.NODE_ENV === 'test') return;
  fs.writeFileSync(
    path.resolve('../data/' + fileName + '.json'),
    JSON.stringify(result, null, 2),
  );
};

export const generateAllSchema = (
  typePath = path.resolve('../../typings/schema-types.ts'),
) => {
  const screenshotOptionSchema = generateSchema({
    excludeProps: ['path'],
    path: typePath,
    type: 'PlaywrightScreenshotOptionSchema',
  });
  saveSchema(screenshotOptionSchema, 'screenshot-option-schema');

  const browserOptionSchema = generateSchema({
    excludeProps: ['extraHTTPHeaders', 'logger'],
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

if (process.env.NODE_ENV !== 'test') {
  generateAllSchema();
}
