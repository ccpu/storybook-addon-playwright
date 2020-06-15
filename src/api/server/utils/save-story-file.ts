import { StoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import { StoryPlaywrightData } from '../../../typings';
import { writeFile } from 'jsonfile';
import * as fs from 'fs';

export const saveStoryFile = async (
  fileInfo: StoryPlaywrightFileInfo,
  data: StoryPlaywrightData,
) => {
  Object.keys(data).forEach((key) => {
    if (!Object.keys(data[key]).length) {
      delete data[key];
    }
  });

  if (Object.keys(data).length) {
    await writeFile(fileInfo.path, data, {
      EOL: '\r\n',
      spaces: 2,
    });
  } else {
    fs.unlinkSync(fileInfo.path);
  }
};
