import { getFavouriteActions } from '../get-favourite-actions';
import fetch from 'jest-fetch-mock';
import { FavouriteActionSet } from '../../../typings';

describe('getFavouriteActions', () => {
  it('should be defined', () => {
    expect(getFavouriteActions).toBeDefined();
  });

  const resData: FavouriteActionSet[] = [
    {
      actions: [
        {
          id: 'action-id',
          name: 'action-name',
        },
      ],
      id: 'action-set-id',
      title: 'desc',
    },
  ];

  beforeEach(() => {
    fetch.doMock();
  });

  it('should have response', async () => {
    fetch.mockResponseOnce(JSON.stringify(resData));
    const res = await getFavouriteActions();
    expect(res).toStrictEqual(resData);
  });

  it('should throw error on server reject', async () => {
    fetch.mockReject(new Error('foo'));
    await expect(getFavouriteActions()).rejects.toThrowError('foo');
  });
});
