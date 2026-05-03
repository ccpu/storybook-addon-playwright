import {
  saveActionSet,
  getActionSet,
  deleteActionSet,
} from '../../../src/api/trpc/clients/action-set.client';
import { server } from '../../msw-server';
import { trpcMswBatch, unwrapBatchInput } from '../../trpc-msw-batch';

describe('action-set client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('saveActionSet calls actionSet.saveActionSet mutation', async () => {
    const spy = vi.fn().mockReturnValue(undefined);
    server.use(
      trpcMswBatch.actionSet.saveActionSet.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const input = {
      actionSet: { actions: [], id: 'as-1' },
      fileName: 'file.ts',
      storyId: 'story--name',
    };

    await expect(saveActionSet(input as any)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith(input);
  });

  it('getActionSet calls actionSet.getActionSet mutation', async () => {
    const mockResponse = [{ actions: [], id: 'as-1' }];
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.actionSet.getActionSet.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const input = { fileName: 'file.ts', storyId: 'story--name' };
    const result = await getActionSet(input as any);

    expect(spy).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });

  it('deleteActionSet calls actionSet.deleteActionSet mutation', async () => {
    const spy = vi.fn().mockReturnValue(undefined);
    server.use(
      trpcMswBatch.actionSet.deleteActionSet.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const input = {
      actionSetId: 'as-1',
      fileName: 'file.ts',
      storyId: 'story--name',
    };

    await expect(deleteActionSet(input as any)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith(input);
  });
});
