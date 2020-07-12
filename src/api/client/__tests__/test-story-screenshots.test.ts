import { testStoryScreenshots } from '../test-story-screenshots';
import fetch from 'jest-fetch-mock';

describe('testStoryScreenshots', () => {
  it('should test', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await testStoryScreenshots({
      fileName: 'story.ts',
      requestId: 'request-id',
      storyId: 'story-id',
    });
    expect(mock).toHaveBeenCalledWith('http://localhost/screenshot/testStory', {
      body:
        '{"fileName":"story.ts","requestId":"request-id","storyId":"story-id"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});
