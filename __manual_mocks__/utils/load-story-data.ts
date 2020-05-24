import { storyFileInfo } from './story-file-info';

export const loadStoryDataMock = jest.fn();

jest.mock('../../src/api/server/utils/load-story-data', () => ({
  loadStoryData: loadStoryDataMock,
}));

loadStoryDataMock.mockImplementation(() => {
  const data = storyFileInfo();
  return new Promise((resolve) => {
    resolve(data);
  });
});
