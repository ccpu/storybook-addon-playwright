import { deleteFavouriteAction } from '../delete-favourite-action';
import { Response, Request } from 'express';

jest.mock('../../services/delete-favourite-action', () => ({
  deleteFavouriteAction: jest.fn(),
}));

describe('deleteFavouriteAction', () => {
  const statusMock = jest.fn();
  const endMock = jest.fn();

  it('should be defined', () => {
    expect(deleteFavouriteAction).toBeDefined();
  });

  it('should send 200', async () => {
    await deleteFavouriteAction(
      {} as Request,
      { end: endMock, status: statusMock } as unknown as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
