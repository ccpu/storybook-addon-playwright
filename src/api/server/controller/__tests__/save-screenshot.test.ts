import { saveScreenshot } from '../save-screenshot';
import { Request, Response } from 'express';

jest.mock('../../services/save-snapshot-data', () => ({
  saveScreenshot: jest.fn(),
}));

describe('saveScreenshot', () => {
  it('should send 200 status', async () => {
    const statusMock = jest.fn();
    const endMock = jest.fn();
    await saveScreenshot(
      {} as Request,
      ({ end: endMock, status: statusMock } as unknown) as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
