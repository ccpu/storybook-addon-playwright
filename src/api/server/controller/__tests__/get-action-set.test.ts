import { getActionSet } from '../get-action-set';
import { ActionSet } from '../../../../typings';
import { Request, Response } from 'express';

jest.mock('../../services/get-action-set', () => ({
  getActionSet: (): ActionSet[] => {
    return [
      {
        actions: [
          {
            id: 'action-id',
            name: 'name',
          },
        ],
        description: 'desc',
        id: 'id',
      },
    ];
  },
}));

describe('getActionSet', () => {
  it('should send action set', async () => {
    const jsonMock = jest.fn();
    await getActionSet({} as Request, { json: jsonMock } as Partial<Response>);
    expect(jsonMock).toHaveBeenCalledWith([
      {
        actions: [
          {
            id: 'action-id',
            name: 'name',
          },
        ],
        description: 'desc',
        id: 'id',
      },
    ]);
  });
});
