import { favouriteActionsRouter } from './favourite-actions.router';
import { createCallerFactory } from '../../trpc/trpc';
import * as service from './favourite-actions.service';

jest.mock('./favourite-actions.service');

const createCaller = createCallerFactory(favouriteActionsRouter);
const caller = createCaller({} as any);

describe('favouriteActionsRouter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('addFavouriteAction calls addFavouriteAction service', async () => {
    (service.addFavouriteAction as jest.Mock).mockResolvedValue(undefined);

    const input = { actions: [], id: 'fav-1' };
    const result = await caller.addFavouriteAction(input);

    expect(service.addFavouriteAction).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });

  it('getFavouriteActions calls getFavouriteActions service', async () => {
    const mockResult = [{ actions: [], id: 'fav-1' }];
    (service.getFavouriteActions as jest.Mock).mockResolvedValue(mockResult);

    const result = await caller.getFavouriteActions();

    expect(service.getFavouriteActions).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('deleteFavouriteAction calls deleteFavouriteAction service', async () => {
    (service.deleteFavouriteAction as jest.Mock).mockResolvedValue(undefined);

    const input = { actionSetId: 'fav-1' };
    const result = await caller.deleteFavouriteAction(input);

    expect(service.deleteFavouriteAction).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });
});
