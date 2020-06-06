import { updateScreenshot } from '../update-screenshot';
import { Request, Response } from 'express';
import { UpdateScreenshot } from '../../../typings';

jest.mock('../../services//update-screenshot-service.ts');

describe('updateScreenshot', () => {
  it('should have result', async () => {
    const jsonMock = jest.fn();

    await updateScreenshot(
      {
        body: {
          base64: 'base64-image',
          hash: 'hash-1',
          storyId: 'story-id',
        } as UpdateScreenshot,
        headers: { host: 'localhost' },
      } as Request,
      ({ json: jsonMock } as unknown) as Response,
    );

    expect(jsonMock).toHaveBeenCalledWith({
      newScreenshot: 'base64-image',
      pass: true,
      screenshotHash: 'hash-1',
    });
  });
});
