import { storyFileInfo } from '../../__test_data__/story-file-info';

export const loadStoryDataMock = vi.fn();

vi.unmock('../../src/api/server/utils/load-story-data');

vi.mock('../../src/api/server/utils/load-story-data', () => ({
  loadStoryData: loadStoryDataMock,
}));

loadStoryDataMock.mockImplementation(() => {
  const data = storyFileInfo();
  return new Promise((resolve) => {
    resolve(data);
  });
});
