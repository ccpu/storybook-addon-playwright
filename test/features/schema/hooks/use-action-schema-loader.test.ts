import { useActionSchemaLoader } from '../../../../src/features/schema/hooks/use-action-schema-loader';
import { renderHook } from '@testing-library/react-hooks';
import { getActionSchemaData } from '../../../configs';
import { getActionsSchema } from '../../../../src/api/trpc/clients/schema.client';
import * as context from '../../../../src/features/action-set/store/ActionContext';

vi.mock('../../../../src/api/trpc/clients/schema.client');

describe('useActionSchemaLoader', () => {
  it('should test useActionSchemaLoader', async () => {
    vi.mocked(getActionsSchema).mockResolvedValueOnce(getActionSchemaData());

    const { waitForNextUpdate, result } = renderHook(
      () => useActionSchemaLoader(),
      {
        wrapper: context.ActionProvider,
      },
    );

    await waitForNextUpdate();

    expect(result.current.loaded).toBe(true);
  });
});
