import { deleteStoryScreenshots } from '../delete-story-screenshots';
import { deleteScreenshot } from '../delete-screenshot';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');
jest.mock('../delete-screenshot');

describe('deleteStoryScreenshots', () => {
  it('should delete all', async () => {
    await deleteStoryScreenshots({ fileName: 'story.ts', storyId: 'story-id' });
    expect(deleteScreenshot).toHaveBeenCalledTimes(2);
  });
});
