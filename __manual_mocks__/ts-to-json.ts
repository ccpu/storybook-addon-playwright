export const createProgramMock = vi.fn();
export const createParserMock = vi.fn();
export const createFormatterMock = vi.fn();
export const SchemaGeneratorMock = vi.fn().mockImplementation(() => {
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
