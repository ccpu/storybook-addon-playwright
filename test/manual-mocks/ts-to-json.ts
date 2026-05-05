export const createProgramMock = vi.fn<(...args: unknown[]) => unknown>();
export const createParserMock = vi.fn<(...args: unknown[]) => unknown>();
export const createFormatterMock = vi.fn<(...args: unknown[]) => unknown>();
export const SchemaGeneratorMock = vi
  .fn<(...args: unknown[]) => unknown>()
  .mockImplementation(() => {
    return {
      createSchema: () => ({
        definitions: { ['MyType']: { properties: { props: true } } },
      }),
    };
  });
vi.mock('ts-to-json', () => ({
  SchemaGenerator: SchemaGeneratorMock,
  createFormatter: createFormatterMock,
  createParser: createParserMock,
  createProgram: createProgramMock,
}));
