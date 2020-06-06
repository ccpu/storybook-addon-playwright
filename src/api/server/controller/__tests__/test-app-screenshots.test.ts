import { testAppScreenshots } from '../test-app-screenshots';
import { Request, Response } from 'express';

jest.mock('../../services/test-app-screenshots.ts');

describe('testAppScreenshots', () => {
  it('should return result', async () => {
    const jsonMock = jest.fn();

    await testAppScreenshots(
      ({ headers: { host: 'localhost' } } as unknown) as Request,
      ({ json: jsonMock } as unknown) as Response,
    );
    expect(jsonMock).toHaveBeenCalledWith([
      { pass: true, screenshotHash: 'hash' },
    ]);
  });
});
