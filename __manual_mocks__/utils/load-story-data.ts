import { storyFileInfo } from '../../__test_data__/story-file-info';

export const loadStoryDataMock = jest.fn();

jest.unmock('../../src/api/server/utils/load-story-data');

jest.mock('../../src/api/server/utils/load-story-data', () => ({
  loadStoryData: loadStoryDataMock,
}));

loadStoryDataMock.mockImplementation(() => {
  const data = storyFileInfo();
  return new Promise((resolve) => {
    resolve(data);
  });
});
