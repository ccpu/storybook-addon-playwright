import * as fs from 'fs';
import * as path from 'path';
import type { Mouse, Touchscreen } from 'playwright';

import type { PageMethodKeys } from '../../src/api';
import { generateSchema } from './generate-schema';

/**
 * Builds and optionally writes the Playwright action schema used by the API layer.
 */

const DEFAULT_TYPE_FILE = path.resolve(
  __dirname,
  '../../src/api/typings/schema-types.ts',
);
const DATA_OUTPUT_DIR = path.resolve(__dirname, '../../src/api/server/data');
const ACTION_SCHEMA_FILE = path.resolve(DATA_OUTPUT_DIR, 'action-schema.json');

type MouseKeys = keyof Mouse;
type TouchscreenKeys = keyof Touchscreen;

const selectedPageKeys: PageMethodKeys[] = [
  'click',
  'dblclick',
  'fill',
  'focus',
  'hover',
  'hover',
  'press',
  'type',
  'check',
  'uncheck',
  'scrollSelector',
  'waitForSelector',
  'waitForTimeout',
  'dragDropSelector',
  'takeElementScreenshot',
  'takeScreenshot',
  'takeScreenshotAll',
  'takeScreenshotOptions',
  'setSelectorSize',
  'clearInput',
  'mouseDownOnSelector',
  'mouseMoveToSelector',
  'selectorMouseWheel',
  'keyboard',
  'touchMove',
  'touchStart',
  'touchCancel',
  'touchEnd',
  'touchFromTo',
  'mouseFromTo',
];

const selectedMouseKeys: MouseKeys[] = ['click', 'dblclick', 'down', 'move', 'up'];

const selectedTouchProp: TouchscreenKeys[] = ['tap'];

const selectedKeys = [
  ...selectedPageKeys,
  ...selectedMouseKeys.map((x) => 'mouse.' + x),
  ...selectedTouchProp.map((x) => 'touchscreen.' + x),
] as string[];

export const generateActionSchema = (typePath = DEFAULT_TYPE_FILE) => {
  const result = generateSchema({
    includeProps: selectedKeys,
    path: typePath,
    type: 'PlaywrightPage',
  });
  return result;
};

export const saveActionSchema = (typePath = DEFAULT_TYPE_FILE) => {
  if (process.env.NODE_ENV === 'test') return undefined;

  const actionSchema = generateActionSchema(typePath);

  fs.mkdirSync(DATA_OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(ACTION_SCHEMA_FILE, JSON.stringify(actionSchema, null, 2), 'utf8');

  return actionSchema;
};

if (require.main === module) {
  saveActionSchema();
}
