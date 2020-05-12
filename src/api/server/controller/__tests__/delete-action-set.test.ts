import { deleteActionSet } from '../delete-action-set';
import { Response, Request } from 'express';

jest.mock('../../services/delete-action-set', () => ({
  deleteActionSet: jest.fn(),
}));

describe('deleteActionSet', () => {
  const statusMock = jest.fn();
  const endMock = jest.fn();

  it('should send 200', async () => {
    await deleteActionSet(
      {} as Request,
      ({ end: endMock, status: statusMock } as unknown) as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
