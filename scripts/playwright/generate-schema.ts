import {
  Config,
  Definition,
  SchemaGenerator,
  createFormatter,
  createParser,
  createProgram,
} from 'ts-to-json';

/**
 * Creates a schema property map for a specific TypeScript type.
 * Other Playwright schema scripts use this to build JSON payloads.
 */
export const generateSchema = (options?: Partial<Config>) => {
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

  if (!config.type) {
    throw new Error('Missing schema type. Provide config.type when generating schema.');
  }

  const program = createProgram(config);

  const generator: SchemaGenerator = new SchemaGenerator(
    program,
    createParser(program, config),
    createFormatter(config),
  );

  const result = generator.createSchema(config.type);

  if (!result.definitions || !result.definitions[config.type]) {
    throw new Error(`Schema definition not found for type: ${config.type}`);
  }

  const props = (result.definitions[config.type] as Definition).properties as Definition;

  return props;
};
