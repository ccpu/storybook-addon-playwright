import {
  createProgram,
  SchemaGenerator,
  createParser,
  createFormatter,
  Config,
  Definition,
} from 'ts-to-json';
import { Mouse } from 'playwright-core';
import { join } from 'path';
import { ActionSchemaList } from '../../../typings';
import { getConfigs } from '../configs';
import { PageMethodKeys } from './typings/playwright-page';

type MouseKeys = keyof Mouse;

const selectedPageKeys: PageMethodKeys[] = [
  'click',
  'dblclick',
  'fill',
  'focus',
  'hover',
  'hover',
  'press',
  'scrollSelector',
  'waitForSelector',
  'waitForTimeout',
  'dragDropSelector',
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

export let _schema: ActionSchemaList = undefined;

export const generateSchema = (path: string) => {
  const type = 'PlaywrightPage';

  const pageMethods = getConfigs().pageMethods;
  if (pageMethods) {
    selectedKeys = [...new Set(selectedKeys.concat(pageMethods))];
  }

  const config: Config = {
    encodeRefs: false,
    expose: 'none',
    handleUnknownTypes: true,
    includeProps: selectedKeys,
    jsDoc: 'extended',
    maxDepth: 5,
    path: path,
    skipParseFiles: ['lib.dom.d.ts'],
    skipParseTypes: ['HTMLElementTagNameMap[K]', 'Promise', 'JSHandle'],
    skipTypeCheck: true,
    topRef: true,
    type,
  };

  const program = createProgram(config);

  const generator: SchemaGenerator = new SchemaGenerator(
    program,
    createParser(program, config),
    createFormatter(config),
  );

  const result = generator.createSchema(type);

  return (result.definitions[type] as Definition)
    .properties as ActionSchemaList;
};

export const getActionsSchema = (path?: string) => {
  if (!path) path = join(__dirname, '/typings/playwright-page.d.ts');

  if (!_schema) _schema = generateSchema(path);

  const customSchema = getConfigs().customActionSchema;

  if (customSchema) {
    _schema = { ..._schema, ...customSchema };
  }
  return _schema;
};
