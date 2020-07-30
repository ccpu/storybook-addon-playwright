import { storyFileInfo } from '../../../../../__test_data__/story-file-info';

const loadStoryData = jest.fn();

loadStoryData.mockImplementation((_filePAth: string, storyId: string) => {
  const data = storyFileInfo();
  if (!data.stories[storyId] && storyId !== '*') data.stories[storyId] = {};
  return new Promise((resolve) => {
    resolve(data);
  });
});

export { loadStoryData };
