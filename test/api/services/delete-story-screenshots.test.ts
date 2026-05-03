import { deleteStoryScreenshots } from '../../../src/api/services/delete-story-screenshots';
import { deleteScreenshot } from '../../../src/api/services/delete-screenshot';

vi.mock(
  '../../../src/api/server/utils/save-story-file',
  async () => await import('../server/utils/__mocks__/save-story-file'),
);
vi.mock(
  '../../../src/api/server/utils/load-story-data',
  async () => await import('../server/utils/__mocks__/load-story-data'),
);
vi.mock(
  '../../../src/api/services/delete-screenshot',
  async () => await import('./__mocks__/delete-screenshot'),
);

describe('deleteStoryScreenshots', () => {
  it('should delete all', async () => {
    await deleteStoryScreenshots({ filePath: 'story.ts', storyId: 'story-id' });
    expect(deleteScreenshot).toHaveBeenCalledTimes(2);
  });
});
