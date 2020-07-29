export const createProgramMock = jest.fn();
export const createParserMock = jest.fn();
export const createFormatterMock = jest.fn();
export const SchemaGeneratorMock = jest.fn().mockImplementation(() => {
  return {
    createSchema: () => ({
      definitions: { ['MyType']: { properties: { props: true } } },
    }),
  };
});
jest.mock('ts-to-json', () => ({
  SchemaGenerator: SchemaGeneratorMock,
  createFormatter: createFormatterMock,
  createParser: createParserMock,
  createProgram: createProgramMock,
}));
