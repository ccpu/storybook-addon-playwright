import { saveScreenshot } from '../save-screenshot';
import { Request, Response } from 'express';
import { SaveScreenshotRequest } from '../../../typings';

jest.mock('../../services/save-screenshot.ts');

describe('saveScreenshot', () => {
  it('should return result', async () => {
    const jsonMock = jest.fn();

    await saveScreenshot(
      { body: { id: 'screenshot-id' } as SaveScreenshotRequest } as Request,
      ({ json: jsonMock } as unknown) as Response,
    );
    expect(jsonMock).toHaveBeenCalledWith({
      pass: true,
      screenshotId: 'screenshot-id',
    });
  });
});
