import { deleteScreenshot } from '../delete-screenshot';

jest.mock('../../services/delete-screenshot.ts');

describe('deleteScreenshot', () => {
  const statusMock = jest.fn();
  const endMock = jest.fn();

  it('should send 200', async () => {
    await deleteScreenshot(
      {} as Request,
      ({ end: endMock, status: statusMock } as unknown) as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
