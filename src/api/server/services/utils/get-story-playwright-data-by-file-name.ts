import { getStoryPlaywrightFileInfo, loadStoryData } from '../../utils';

export const getStoryPlaywrightDataByFileName = async (fileName: string) => {
  const fileInfo = getStoryPlaywrightFileInfo(fileName);
  const storyData = await loadStoryData(fileInfo.path, '*');
  return storyData;
};
