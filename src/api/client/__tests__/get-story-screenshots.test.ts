import { getStoryScreenshots } from '../get-story-screenshots';
import fetch from 'jest-fetch-mock';

describe('getStoryScreenshots', () => {
  it('should have request payload', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await getStoryScreenshots({ fileName: 'story.ts', storyId: 'story-id' });
    expect(mock).toHaveBeenCalledWith('http://localhost/screenshot/all', {
      body: '{"fileName":"story.ts","storyId":"story-id"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});
