import { StoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import { StoryPlaywrightData } from '../../../typings';
import { writeFile } from 'jsonfile';
import * as fs from 'fs';

export const saveStoryFile = async (
  fileInfo: StoryPlaywrightFileInfo,
  data: StoryPlaywrightData,
) => {
  if (data.stories) {
    Object.keys(data.stories).forEach((key) => {
      if (!Object.keys(data.stories[key]).length) {
        delete data.stories[key];
      }
    });
  }

  if (data.stories && Object.keys(data.stories).length) {
    await writeFile(fileInfo.path, data, {
      EOL: '\r\n',
      spaces: 2,
    });
  } else {
    fs.unlinkSync(fileInfo.path);
  }
};
