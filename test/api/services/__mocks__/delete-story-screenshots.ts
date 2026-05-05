import { deleteStoryScreenshots as orgDeleteStoryScreenshots } from '../../../../src/api/services/delete-story-screenshots';

const deleteStoryScreenshots = vi.fn<typeof orgDeleteStoryScreenshots>();

export { deleteStoryScreenshots };
