import { Mouse } from 'playwright-core';
import { ActionSchemaList } from '../../../typings';
import { getConfigs } from '../configs';
import { PageMethodKeys } from './typings/app-types';
import { generateSchema } from './generate-schema';

type MouseKeys = keyof Mouse;

const selectedPageKeys: PageMethodKeys[] = [
  'click',
  'dblclick',
  'fill',
  'focus',
  'hover',
  'hover',
  'press',
  'type',
  'scrollSelector',
  'waitForSelector',
  'waitForTimeout',
  'dragDropSelector',
  'takeScreenshot',
  'takeScreenshotOptions',
  'setSelectorSize',
  'clearInput',
  'mouseDownOnSelector',
  'mouseMoveToSelector',
  'selectorMouseWheel',
];

const selectedMouseKeys: MouseKeys[] = [
  'click',
  'dblclick',
  'down',
  'move',
  'up',
];

let selectedKeys = [
  ...selectedPageKeys,
  ...selectedMouseKeys.map((x) => 'mouse.' + x),
] as string[];

export const getSchema = (path: string) => {
  const pageMethods = getConfigs().pageMethods;
  if (pageMethods) {
    selectedKeys = [...new Set(selectedKeys.concat(pageMethods))];
  }

  const result = generateSchema({
    includeProps: selectedKeys,
    path,
    type: 'PlaywrightPage',
  });

  return result as ActionSchemaList;
};

export const getActionsSchema = (path?: string) => {
  let schema = getSchema(path);

  const customSchema = getConfigs().customActionSchema;

  if (customSchema) {
    schema = { ...schema, ...customSchema };
  }
  return schema;
};
