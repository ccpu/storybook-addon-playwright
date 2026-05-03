import {
  addFavouriteAction,
  getFavouriteActions,
  deleteFavouriteAction,
} from '../../../src/api/trpc/clients/favourite-actions.client';
import { server } from '../../msw-server';
import { trpcMswBatch, unwrapBatchInput } from '../../trpc-msw-batch';

describe('favourite-actions client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('addFavouriteAction calls favouriteActions.addFavouriteAction mutation', async () => {
    const spy = vi.fn().mockReturnValue(undefined);
    server.use(
      trpcMswBatch.favouriteActions.addFavouriteAction.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const input = { actions: [], id: 'fav-1' };
    await expect(addFavouriteAction(input as any)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith(input);
  });

  it('getFavouriteActions calls favouriteActions.getFavouriteActions query', async () => {
    const mockResponse = [{ actions: [], id: 'fav-1' }];
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.favouriteActions.getFavouriteActions.query(
        () => spy() as any,
      ),
    );

    const result = await getFavouriteActions();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('deleteFavouriteAction calls favouriteActions.deleteFavouriteAction mutation', async () => {
    const spy = vi.fn().mockReturnValue(undefined);
    server.use(
      trpcMswBatch.favouriteActions.deleteFavouriteAction.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const input = { actionSetId: 'fav-1' };
    await expect(deleteFavouriteAction(input as any)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith(input);
  });
});
