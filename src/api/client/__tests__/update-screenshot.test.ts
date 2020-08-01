import { updateScreenshot } from '../update-screenshot';
import fetch from 'jest-fetch-mock';

describe('deleteStoryScreenshots', () => {
  it('should ', async () => {
    const fetchMock = fetch.mockResponseOnce('');

    await updateScreenshot({
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/screenshot/update',
      {
        body: '{"screenshotId":"screenshot-id","storyId":"story-id"}',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'post',
      },
    );
  });
});
