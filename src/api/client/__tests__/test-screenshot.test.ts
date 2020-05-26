import { testScreenshot } from '../test-screenshot';
import fetch from 'jest-fetch-mock';

describe('testScreenshot', () => {
  it('should test', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await testScreenshot({ hash: 'hash', storyId: 'story-id' });
    expect(mock).toHaveBeenCalledWith('http://localhost/screenshot/test', {
      body: '{"hash":"hash","storyId":"story-id"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});
