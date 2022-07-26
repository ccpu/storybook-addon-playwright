import { getFavouriteActions } from '../get-favourite-actions';
import fs from 'fs';
import { FavouriteActions } from '../../../typings/favourite-actions';
import { FavouriteActionSet } from '../../../../typings';

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

const spyOnFs = jest.spyOn(fs, 'existsSync');

jest.mock('jsonfile', () => ({
  readFile: (
    _file: string,
    callBack: (err?: string, data?: unknown) => void,
  ) => {
    callBack(undefined, favouriteActions);
  },
}));

describe('getFavouriteActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
