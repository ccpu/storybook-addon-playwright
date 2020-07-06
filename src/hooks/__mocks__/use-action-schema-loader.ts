export const useActionSchemaLoader = jest.fn();

useActionSchemaLoader.mockImplementation(() => ({
  loading: false,
}));
