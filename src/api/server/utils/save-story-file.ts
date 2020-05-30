import { StoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import { StoryPlaywrightData } from '../../../typings';
import { writeFile } from 'jsonfile';

export const saveStoryFile = async (
  fileInfo: StoryPlaywrightFileInfo,
  data: StoryPlaywrightData,
) => {
  await writeFile(fileInfo.path, data, {
    EOL: '\r\n',
    spaces: 2,
  });
};
