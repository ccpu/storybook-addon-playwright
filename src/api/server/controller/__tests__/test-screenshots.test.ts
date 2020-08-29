import { testScreenshots } from '../test-screenshots';
import { Request, Response } from 'express';

jest.mock('../../services/test-screenshots.ts');

describe('testScreenshots', () => {
  it('should return result', async () => {
    const jsonMock = jest.fn();

    await testScreenshots(
      ({ headers: { host: 'localhost' } } as unknown) as Request,
      ({ json: jsonMock } as unknown) as Response,
    );
    expect(jsonMock).toHaveBeenCalledWith([
      { pass: true, screenshotId: 'screenshot-id' },
    ]);
  });
});
