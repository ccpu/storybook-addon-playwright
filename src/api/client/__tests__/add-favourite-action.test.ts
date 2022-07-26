import { ActionSet } from '../../../typings';
import { addFavouriteAction } from '../add-favourite-action';
import fetch from 'jest-fetch-mock';

describe('addFavouriteAction', () => {
  const actionSet: ActionSet = {
    actions: [
      {
        id: 'action-id',
        name: 'action-name',
      },
    ],
    id: 'action-set-id',
    title: 'action-set-desc',
  };

  beforeEach(() => {
    fetch.doMock();
  });

  it('should be defined', () => {
    expect(addFavouriteAction).toBeDefined();
  });

  it('should call successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));
    await expect(() => addFavouriteAction(actionSet)).not.toThrowError();
  });

  it('should throw error on server reject', async () => {
    fetch.mockReject(new Error('foo'));
    await expect(addFavouriteAction(actionSet)).rejects.toThrowError('foo');
  });
});
