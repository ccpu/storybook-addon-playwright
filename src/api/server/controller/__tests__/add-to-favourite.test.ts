import { addToFavourite } from '../add-to-favourite';
import { Request, Response } from 'express';

jest.mock('../../services/add-to-favourite', () => ({
  addToFavourite: jest.fn(),
}));

describe('addToFavourite', () => {
  it('should be defined', () => {
    expect(addToFavourite).toBeDefined();
  });

  it('should send 200 status', async () => {
    const statusMock = jest.fn();
    const endMock = jest.fn();
    await addToFavourite(
      {} as Request,
      { end: endMock, status: statusMock } as unknown as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
