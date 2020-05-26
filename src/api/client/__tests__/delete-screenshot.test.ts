import { deleteScreenshot } from '../delete-screenshot';
import fetch from 'jest-fetch-mock';

describe('deleteScreenshot', () => {
  it('should delete', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await deleteScreenshot({
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
    });
    expect(mock).toHaveBeenCalledWith('http://localhost/screenshot/delete', {
      body: '{"fileName":"story.ts","hash":"hash","storyId":"story-id"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});
