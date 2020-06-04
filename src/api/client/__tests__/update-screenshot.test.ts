import { updateScreenshot } from '../update-screenshot';
import fetch from 'jest-fetch-mock';

describe('deleteStoryScreenshots', () => {
  it('should ', async () => {
    const fetchMock = fetch.mockResponseOnce('');

    await updateScreenshot({ hash: 'hash', storyId: 'story-id' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/screenshot/update',
      {
        body: '{"hash":"hash","storyId":"story-id"}',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'post',
      },
    );
  });
});
