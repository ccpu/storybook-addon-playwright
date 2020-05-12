import { saveActionSet } from '../save-action-set';
import { Request, Response } from 'express';

jest.mock('../../services/save-action-set', () => ({
  saveActionSet: jest.fn(),
}));

describe('saveActionSet', () => {
  it('should send 200 status', async () => {
    const statusMock = jest.fn();
    const endMock = jest.fn();
    await saveActionSet(
      {} as Request,
      ({ end: endMock, status: statusMock } as unknown) as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
