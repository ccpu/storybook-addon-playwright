import { testScreenshot } from '../test-screenshot';
import { Request, Response } from 'express';
import { ScreenshotInfo } from '../../../../typings';

jest.mock('../../services/test-screenshot-service.ts');

describe('testScreenshot', () => {
  it('should have result', async () => {
    const jsonMock = jest.fn();

    await testScreenshot(
      {
        body: { hash: 'hash-1' } as ScreenshotInfo,
        headers: { host: 'localhost' },
      } as Request,
      ({ json: jsonMock } as unknown) as Response,
    );
    expect(jsonMock).toHaveBeenCalledWith({
      pass: true,
      screenshotHash: 'hash-1',
    });
  });
});
