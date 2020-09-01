import { testScreenshots } from '../test-screenshots';
import fetch from 'jest-fetch-mock';

describe('testScreenshots', () => {
  it('should teat', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await testScreenshots({
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });
    expect(mock).toHaveBeenCalledWith(
      'http://localhost/screenshot/testScreenshots',
      {
        body:
          '{"requestId":"request-id","requestType":"all","storyId":"story-id"}',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'post',
      },
    );
  });
});
