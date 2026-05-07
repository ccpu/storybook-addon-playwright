import { addToFavourite } from '../../../src/api/services/add-to-favourite';
import fs from 'node:fs';
import jsonfile from 'jsonfile';
import { FavouriteActions } from '../../../src/api/typings/favourite-actions';
import { FavouriteActionSet } from '../../../src/typings';

const spyOnFs = vi.spyOn(fs, 'existsSync');

const spyOnReadFileSync = vi.spyOn(jsonfile, 'readFileSync');
const spyOnWriteFileSync = vi.spyOn(jsonfile, 'writeFileSync');

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
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(addToFavourite).toBeDefined();
  });

  it('should call writeFileSync to save', () => {
    spyOnFs.mockImplementationOnce(() => {
      return true;
    });

    vi.mocked(spyOnReadFileSync).mockImplementationOnce(() => favouriteActions);
    vi.mocked(spyOnWriteFileSync).mockImplementationOnce(() => undefined);

    addToFavourite(actionSet);

    expect(spyOnWriteFileSync).toHaveBeenCalledTimes(1);
  });
});
