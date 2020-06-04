import { storyFileInfo } from '../../../../../__manual_mocks__/utils/story-file-info';

const loadStoryData = jest.fn();

loadStoryData.mockImplementation(() => {
  const data = storyFileInfo();
  return new Promise((resolve) => {
    resolve(data);
  });
});

export { loadStoryData };
