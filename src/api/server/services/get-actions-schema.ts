import {
  createProgram,
  SchemaGenerator,
  createParser,
  createFormatter,
  Config,
  Definition,
} from 'ts-to-json';
import { Page, Mouse } from 'playwright-core';
import { join } from 'path';
import { ActionSchemaList } from '../../../typings';
import { getConfigs } from '../configs';

type MouseKeys = keyof Mouse;

type PageKeys = keyof Page;

const selectedPageKeys: PageKeys[] = [
  'click',
  'dblclick',
  'fill',
  'focus',
  'hover',
  'hover',
  'press',
  'waitForSelector',
  'waitForTimeout',
];

const selectedMouseKeys: MouseKeys[] = [
  'click',
  'dblclick',
  'down',
  'move',
  'up',
];

const selectedKeys = [
  ...selectedPageKeys,
  ...selectedMouseKeys.map((x) => 'mouse.' + x),
] as string[];

let _schema: ActionSchemaList;

export const generateSchema = (path: string) => {
  const type = 'PlaywrightPage';
  const config: Config = {
    encodeRefs: false,
    expose: 'none',
    handleUnknownTypes: true,
    includeProps: selectedKeys,
    jsDoc: 'extended',
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

export const getActionsSchema = (path: string) => {
  if (!path) join(__dirname, '/typings/playwright-page.d.ts');

  if (!_schema) _schema = generateSchema(path);

  const customSchema = getConfigs().customActionSchema;

  if (customSchema) {
    _schema = { ..._schema, ...customSchema };
  }
  return _schema;
};
