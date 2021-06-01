import { fixScreenshotFileName } from '../fix-screenshot-file-name';

jest.mock('../../services/fix-screenshot-file-name');

describe('fixScreenshotFileName', () => {
  it('should be defined', () => {
    expect(fixScreenshotFileName).toBeDefined();
  });

  it('should handle data', async () => {
    const jsonMock = jest.fn();
    await fixScreenshotFileName(
      {} as Request,
      { json: jsonMock } as Partial<Response>,
    );
    expect(jsonMock).toHaveBeenCalledTimes(1);
  });
});
