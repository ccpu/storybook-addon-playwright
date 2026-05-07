import { getStoryPlaywrightFileInfo, loadStoryData } from '../../../api/server/utils';

export async function getStoryPlaywrightDataByFileName(filePath: string) {
  const fileInfo = getStoryPlaywrightFileInfo(filePath);
  const storyData = await loadStoryData(fileInfo.path, '*');
  return storyData;
}
