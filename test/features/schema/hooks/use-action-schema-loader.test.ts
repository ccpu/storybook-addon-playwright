import { useActionSchemaLoader } from '../../../../src/features/schema/hooks/use-action-schema-loader';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { getActionSchemaData } from '../../../configs';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

describe('useActionSchemaLoader', () => {
  it('should test useActionSchemaLoader', async () => {
    server.use(
      trpcMsw.schema.getActionsSchema.query(() => getActionSchemaData() as any),
    );

    const { result } = renderHook(() => useActionSchemaLoader());

    await waitFor(() => expect(result.current.loaded).toBe(true));
  });
});
