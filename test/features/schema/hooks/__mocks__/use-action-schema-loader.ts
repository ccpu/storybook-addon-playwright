import { useActionSchemaLoader as orgUseActionSchemaLoader } from '../../../../../src/features/schema/hooks/use-action-schema-loader';

export const useActionSchemaLoader = vi.fn<typeof orgUseActionSchemaLoader>();

useActionSchemaLoader.mockImplementation(
  () =>
    ({
      loaded: false,
      loading: false,
    }) as ReturnType<typeof orgUseActionSchemaLoader>,
);
