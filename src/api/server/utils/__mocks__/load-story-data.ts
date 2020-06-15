import { storyFileInfo } from '../../../../../__manual_mocks__/utils/story-file-info';

const loadStoryData = jest.fn();

loadStoryData.mockImplementation((_filePAth: string, storyId: string) => {
  const data = storyFileInfo();
  if (!data[storyId] && storyId !== '*') data[storyId] = {};
  return new Promise((resolve) => {
    resolve(data);
  });
});

export { loadStoryData };
