import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
} from '../../../api/server/utils';

export const getStoryPlaywrightDataByFileName = async (filePath: string) => {
  const fileInfo = getStoryPlaywrightFileInfo(filePath);
  const storyData = await loadStoryData(fileInfo.path, '*');
  return storyData;
};
