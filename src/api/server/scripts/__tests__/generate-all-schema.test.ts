import { generateAllSchema } from '../generate-all-schema';
import { resolve } from 'path';
import * as fs from 'fs';

const basePath = resolve('./src/api');

describe('generate-action-schema', () => {
  it('should be match', () => {
    const allSchema = generateAllSchema(
      resolve(`${basePath}/typings/schema-types.ts`),
    );

    const actionSchemaExpected = JSON.parse(
      fs.readFileSync(
        resolve(`${basePath}/server/data/action-schema.json`),
        'utf8',
      ),
    );
    expect(allSchema.actionSchema).toMatchObject(actionSchemaExpected);

    const screenshotOptionsSchemaExpected = JSON.parse(
      fs.readFileSync(
        resolve(`${basePath}/server/data/screenshot-option-schema.json`),
        'utf8',
      ),
    );
    expect(allSchema.screenshotOptionSchema).toMatchObject(
      screenshotOptionsSchemaExpected,
    );

    const browserOptionsSchemaExpected = JSON.parse(
      fs.readFileSync(
        resolve(`${basePath}/server/data/browser-option-schema.json`),
        'utf8',
      ),
    );
    expect(allSchema.browserOptionSchema).toMatchObject(
      browserOptionsSchemaExpected,
    );
  });
});
