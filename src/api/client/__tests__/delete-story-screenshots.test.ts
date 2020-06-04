import { deleteStoryScreenshots } from '../delete-story-screenshots';
import fetch from 'jest-fetch-mock';
describe('deleteStoryScreenshots', () => {
  it('should ', async () => {
    const fetchMock = fetch.mockResponseOnce('');

    await deleteStoryScreenshots({
      fileName: 'file-name',
      storyId: 'story-id',
    });

    expect(
      fetchMock,
    ).toHaveBeenCalledWith('http://localhost/screenshot/deleteStory', {
      body: '{"fileName":"file-name","storyId":"story-id"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});
