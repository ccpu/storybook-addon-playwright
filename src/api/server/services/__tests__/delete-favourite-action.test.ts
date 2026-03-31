import { FavouriteActionSet } from '../../../../typings';
import { deleteFavouriteAction } from '../delete-favourite-action';
import { getFavouriteActions } from '../get-favourite-actions';
import jsonfile from 'jsonfile';

vi.mock('../get-favourite-actions');

describe('deleteFavouriteAction', () => {
  const actionSet: FavouriteActionSet = {
    actions: [
      {
        id: 'action-id',
        name: 'action-name',
      },
    ],
    id: 'action-set-id',
    title: 'action-set-desc',
  };

  vi.mocked(getFavouriteActions).mockImplementation(() => {
    return new Promise((resolve) => {
      resolve([actionSet]);
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(deleteFavouriteAction).toBeDefined();
  });

  it('should delete action', async () => {
    const spyOnWriteFileSync = vi.spyOn(jsonfile, 'writeFileSync');
    vi.mocked(spyOnWriteFileSync).mockImplementationOnce(() => undefined);

    await deleteFavouriteAction({ actionSetId: 'action-set-id' });

    expect(vi.mocked(spyOnWriteFileSync).mock.calls[0][1]).toStrictEqual({
      actionSets: [],
    });
  });
});
