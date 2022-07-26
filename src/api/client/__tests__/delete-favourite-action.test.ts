import { deleteFavouriteAction } from '../delete-favourite-action';

import fetch from 'jest-fetch-mock';
import { DeleteFavouriteAction } from '../../typings';

describe('deleteFavouriteAction', () => {
  const data: DeleteFavouriteAction = {
    actionSetId: 'action-set-id',
  };

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should have data in body', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await deleteFavouriteAction(data);
    expect(fetch.mock.calls[0][1].body).toStrictEqual(JSON.stringify(data));
  });
});
