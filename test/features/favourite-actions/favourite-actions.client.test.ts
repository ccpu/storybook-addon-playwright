vi.mock(
  '../../../src/api/trpc/client',
  async () => await import('../../api/trpc/__mocks__/client'),
);

import { trpc } from '../../../src/api/trpc/client';
import {
  addFavouriteAction,
  getFavouriteActions,
  deleteFavouriteAction,
} from '../../../src/api/trpc/clients/favourite-actions.client';

describe('favourite-actions client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('addFavouriteAction calls trpc.favouriteActions.addFavouriteAction.mutate', async () => {
    (
      trpc.favouriteActions.addFavouriteAction.mutate as Mock
    ).mockResolvedValueOnce(undefined);

    const input = { actions: [], id: 'fav-1' };
    await expect(addFavouriteAction(input as any)).resolves.toBeUndefined();
    expect(
      trpc.favouriteActions.addFavouriteAction.mutate,
    ).toHaveBeenCalledWith(input);
  });

  it('getFavouriteActions calls trpc.favouriteActions.getFavouriteActions.query', async () => {
    const mockResponse = [{ actions: [], id: 'fav-1' }];
    (
      trpc.favouriteActions.getFavouriteActions.query as Mock
    ).mockResolvedValueOnce(mockResponse);

    const result = await getFavouriteActions();

    expect(trpc.favouriteActions.getFavouriteActions.query).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('deleteFavouriteAction calls trpc.favouriteActions.deleteFavouriteAction.mutate', async () => {
    (
      trpc.favouriteActions.deleteFavouriteAction.mutate as Mock
    ).mockResolvedValueOnce(undefined);

    const input = { actionSetId: 'fav-1' };
    await expect(deleteFavouriteAction(input as any)).resolves.toBeUndefined();
    expect(
      trpc.favouriteActions.deleteFavouriteAction.mutate,
    ).toHaveBeenCalledWith(input);
  });
});
