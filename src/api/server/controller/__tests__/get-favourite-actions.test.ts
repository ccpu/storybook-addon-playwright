import { getFavouriteActions } from '../get-favourite-actions';
import { Request, Response } from 'express';
import { ActionSet } from '../../../../typings';

jest.mock('../../services/get-favourite-actions', () => ({
  getFavouriteActions: (): ActionSet[] => {
    return [
      {
        actions: [
          {
            id: 'action-id',
            name: 'name',
          },
        ],
        id: 'id',
        title: 'desc',
      },
    ];
  },
}));

describe('getFavouriteActions', () => {
  it('should be defined', () => {
    expect(getFavouriteActions).toBeDefined();
  });

  it('should send action set', async () => {
    const jsonMock = jest.fn();
    await getFavouriteActions(
      {} as Request,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { json: jsonMock } as Partial<Response>,
    );
    expect(jsonMock).toHaveBeenCalledWith([
      {
        actions: [
          {
            id: 'action-id',
            name: 'name',
          },
        ],
        id: 'id',
        title: 'desc',
      },
    ]);
  });
});
