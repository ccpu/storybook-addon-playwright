jest.mock('../../trpc/client');

import { trpc } from '../../trpc/client';
import {
  addFavouriteAction,
  getFavouriteActions,
  deleteFavouriteAction,
} from './favourite-actions.client';

describe('favourite-actions client', () => {
  beforeEach(() => jest.clearAllMocks());

  it('addFavouriteAction calls trpc.favouriteActions.addFavouriteAction.mutate', async () => {
    (
      trpc.favouriteActions.addFavouriteAction.mutate as jest.Mock
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
      trpc.favouriteActions.getFavouriteActions.query as jest.Mock
    ).mockResolvedValueOnce(mockResponse);

    const result = await getFavouriteActions();

    expect(trpc.favouriteActions.getFavouriteActions.query).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('deleteFavouriteAction calls trpc.favouriteActions.deleteFavouriteAction.mutate', async () => {
    (
      trpc.favouriteActions.deleteFavouriteAction.mutate as jest.Mock
    ).mockResolvedValueOnce(undefined);

    const input = { actionSetId: 'fav-1' };
    await expect(deleteFavouriteAction(input as any)).resolves.toBeUndefined();
    expect(
      trpc.favouriteActions.deleteFavouriteAction.mutate,
    ).toHaveBeenCalledWith(input);
  });
});
