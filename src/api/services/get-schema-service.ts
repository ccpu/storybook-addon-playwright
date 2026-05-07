import browserOptionSchema from '../server/data/browser-option-schema.json';
import screenshotOptionSchema from '../server/data/screenshot-option-schema.json';

export type SchemaName = 'browser-options' | 'screenshot-options';

export function getSchemaService(schemaName: SchemaName) {
  if (schemaName === 'browser-options') {
    return browserOptionSchema;
  }
  if (schemaName === 'screenshot-options') {
    return screenshotOptionSchema;
  }
  return undefined;
}
