import { deleteStoryScreenshots } from '../delete-story-screenshots';
import { deleteScreenshot } from '../delete-screenshot';

vi.mock('../../utils/save-story-file');
vi.mock('../../utils/load-story-data');
vi.mock('../delete-screenshot');

describe('deleteStoryScreenshots', () => {
  it('should delete all', async () => {
    await deleteStoryScreenshots({ fileName: 'story.ts', storyId: 'story-id' });
    expect(deleteScreenshot).toHaveBeenCalledTimes(2);
  });
});
