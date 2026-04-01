export const useActionSchemaLoader = vi.fn();

useActionSchemaLoader.mockImplementation(() => ({
  loading: false,
}));
