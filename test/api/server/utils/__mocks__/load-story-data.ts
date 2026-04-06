import { storyFileInfo } from '../../../../configs/story-file-info';

const loadStoryData = vi.fn();

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
