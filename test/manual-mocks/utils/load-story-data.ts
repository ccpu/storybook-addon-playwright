import { storyFileInfo } from '../../configs/story-file-info';

export const loadStoryDataMock = vi.fn<(...args: unknown[]) => unknown>();

vi.unmock('../../../src/api/server/utils/load-story-data');

vi.mock('../../../src/api/server/utils/load-story-data', () => ({
  loadStoryData: loadStoryDataMock,
}));

loadStoryDataMock.mockImplementation(() => {
  const data = storyFileInfo();
  return new Promise((resolve) => {
    resolve(data);
  });
});
