import { favouriteActionsRouter } from '../../../src/api/trpc/routers/favourite-actions.router';
import { createCallerFactory } from '../../../src/api/trpc/trpc';
import { addToFavourite } from '../../../src/api/services/add-to-favourite';
import { getFavouriteActions } from '../../../src/api/services/get-favourite-actions';
import { deleteFavouriteAction } from '../../../src/api/services/delete-favourite-action';

vi.mock('../../../src/api/services/add-to-favourite');
vi.mock('../../../src/api/services/get-favourite-actions');
vi.mock('../../../src/api/services/delete-favourite-action');

const createCaller = createCallerFactory(favouriteActionsRouter);
const caller = createCaller({} as any);

describe('favouriteActionsRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('addFavouriteAction calls addToFavourite service', async () => {
    (addToFavourite as Mock).mockResolvedValue(undefined);

    const input = { actions: [], id: 'fav-1' };
    const result = await caller.addFavouriteAction(input);

    expect(addToFavourite).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });

  it('getFavouriteActions calls getFavouriteActions service', async () => {
    const mockResult = [{ actions: [], id: 'fav-1' }];
    (getFavouriteActions as Mock).mockResolvedValue(mockResult);

    const result = await caller.getFavouriteActions();

    expect(getFavouriteActions).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('deleteFavouriteAction calls deleteFavouriteAction service', async () => {
    (deleteFavouriteAction as Mock).mockResolvedValue(undefined);

    const input = { actionSetId: 'fav-1' };
    const result = await caller.deleteFavouriteAction(input);

    expect(deleteFavouriteAction).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });
});
