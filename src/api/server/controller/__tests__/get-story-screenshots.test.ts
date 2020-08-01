import { getStoryScreenshots } from '../get-story-screenshots';
import { StoryInfo } from '../../../../typings';
import { Request, Response } from 'express';

jest.mock('../../services/get-story-screenshots.ts');

describe('getStoryScreenshots', () => {
  it('should have result', async () => {
    const jsonMock = jest.fn();

    await getStoryScreenshots(
      {
        body: {
          fileName: 'story-filename',
          storyId: 'story-id',
        } as StoryInfo,
        headers: { host: 'localhost' },
      } as Request,
      ({ json: jsonMock } as unknown) as Response,
    );

    expect(jsonMock).toHaveBeenCalledWith([
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'story-filename-screenshot',
      },
    ]);
  });
});
