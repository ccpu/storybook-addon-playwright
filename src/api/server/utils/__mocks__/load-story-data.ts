import { storyFileInfo } from '../../../../../__test_data__/story-file-info';

const loadStoryData = jest.fn();

loadStoryData.mockImplementation(
  (_filePAth: string, storyId: string, create = true) => {
    return new Promise((resolve) => {
      const data = storyFileInfo();
      if (!data.stories[storyId] && storyId !== '*') {
        if (!create) {
          resolve(undefined);
          return;
        }
        data.stories[storyId] = {};
      }
      resolve(data);
    });
  },
);

export { loadStoryData };
