import { testStoryScreenshots } from '../test-story-screenshots';
import { Request, Response } from 'express';
import { StoryInfo } from '../../../../typings';

jest.mock('../../services/test-story-screenshots.ts');

describe('testStoryScreenshots', () => {
  it('should have result', async () => {
    const jsonMock = jest.fn();

    await testStoryScreenshots(
      {
        body: { fileName: 'file-name' } as StoryInfo,
        headers: { host: 'localhost' },
      } as Request,
      ({ json: jsonMock } as unknown) as Response,
    );
    expect(jsonMock).toHaveBeenCalledWith([
      { pass: true, screenshotHash: 'hash' },
    ]);
  });
});
