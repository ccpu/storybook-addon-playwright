import { getFavouriteActions } from '../../../src/api/services/get-favourite-actions';
import fs from 'fs';
import { FavouriteActions } from '../../../src/api/typings/favourite-actions';
import { FavouriteActionSet } from '../../../src/typings';

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

const favouriteActions: FavouriteActions = {
  actionSets: [actionSet],
};

const spyOnFs = vi.spyOn(fs, 'existsSync');

vi.mock('jsonfile', () => ({
  readFile: (
    _file: string,
    callBack: (err?: string, data?: unknown) => void,
  ) => {
    callBack(undefined, favouriteActions);
  },
}));

describe('getFavouriteActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getFavouriteActions).toBeDefined();
  });

  it('should return actionSets', async () => {
    spyOnFs.mockImplementationOnce(() => {
      return true;
    });

    const result = await getFavouriteActions();

    expect(result).toStrictEqual([actionSet]);
  });
});
