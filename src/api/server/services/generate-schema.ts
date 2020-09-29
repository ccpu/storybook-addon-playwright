import {
  createProgram,
  SchemaGenerator,
  createParser,
  createFormatter,
  Config,
  Definition,
} from 'ts-to-json';
import { join } from 'path';
import objHash from 'object-hash';

export const cachedSchema = {};

export const generateSchema = (options?: Partial<Config>) => {
  const hash = objHash(options);

  if (!options.path) {
    options.path = join(__dirname, '/typings/app-types.d.ts');
  }

  if (cachedSchema[hash]) {
    return cachedSchema[hash];
  }

  const config: Config = {
    allowArbitraryDataTypes: true,
    encodeRefs: false,
    expose: 'none',
    funcParamMaxDepth: 5,
    handleUnknownTypes: true,
    jsDoc: 'extended',
    maxDepth: 3,
    skipParseFiles: ['lib.dom.d.ts'],
    skipParseTypes: ['HTMLElementTagNameMap[K]', 'Promise', 'JSHandle'],
    skipTypeCheck: true,
    topRef: true,
    ...options,
  };

  const program = createProgram(config);

  const generator: SchemaGenerator = new SchemaGenerator(
    program,
    createParser(program, config),
    createFormatter(config),
  );

  const result = generator.createSchema(config.type);

  const props = (result.definitions[config.type] as Definition)
    .properties as Definition;

  cachedSchema[hash] = props;

  return props;
};
