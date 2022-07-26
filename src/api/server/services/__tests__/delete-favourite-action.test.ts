import { mocked } from 'ts-jest/utils';
import { FavouriteActionSet } from '../../../../typings';
import { deleteFavouriteAction } from '../delete-favourite-action';
import { getFavouriteActions } from '../get-favourite-actions';
import jsonfile from 'jsonfile';

jest.mock('../get-favourite-actions');

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

  mocked(getFavouriteActions).mockImplementation(() => {
    return new Promise((resolve) => {
      resolve([actionSet]);
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(deleteFavouriteAction).toBeDefined();
  });

  it('should delete action', async () => {
    const spyOnWriteFileSync = jest.spyOn(jsonfile, 'writeFileSync');
    mocked(spyOnWriteFileSync).mockImplementationOnce(() => undefined);

    await deleteFavouriteAction({ actionSetId: 'action-set-id' });

    expect(mocked(spyOnWriteFileSync).mock.calls[0][1]).toStrictEqual({
      actionSets: [],
    });
  });
});
