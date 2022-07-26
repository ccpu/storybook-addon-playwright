import { addToFavourite } from '../add-to-favourite';
import fs from 'fs';
import jsonfile from 'jsonfile';
import { mocked } from 'ts-jest/utils';
import { FavouriteActions } from '../../../typings/favourite-actions';
import { FavouriteActionSet } from '../../../../typings';

const spyOnFs = jest.spyOn(fs, 'existsSync');

const spyOnReadFileSync = jest.spyOn(jsonfile, 'readFileSync');
const spyOnWriteFileSync = jest.spyOn(jsonfile, 'writeFileSync');

describe('addToFavourite', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(addToFavourite).toBeDefined();
  });

  it('should call writeFileSync to save', () => {
    spyOnFs.mockImplementationOnce(() => {
      return true;
    });

    mocked(spyOnReadFileSync).mockImplementationOnce(() => favouriteActions);
    mocked(spyOnWriteFileSync).mockImplementationOnce(() => undefined);

    addToFavourite(actionSet);

    expect(spyOnWriteFileSync).toHaveBeenCalledTimes(1);
  });
});
