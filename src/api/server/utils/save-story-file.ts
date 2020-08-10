import { StoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import { PlaywrightData } from '../../../typings';
import { writeFileSync } from 'jsonfile';
import * as fs from 'fs';
import { getVersion } from './get-version';

export const saveStoryFile = (
  fileInfo: StoryPlaywrightFileInfo,
  data: PlaywrightData,
) => {
  if (data && data.stories) {
    Object.keys(data.stories).forEach((key) => {
      if (!Object.keys(data.stories[key]).length) {
        delete data.stories[key];
      }
    });
  }

  if (data && data.stories && Object.keys(data.stories).length > 0) {
    const newData: PlaywrightData = {
      version: getVersion(),
      ...data,
    };
    writeFileSync(fileInfo.path, newData, {
      EOL: '\r\n',
      spaces: 2,
    });
  } else {
    fs.unlinkSync(fileInfo.path);
  }
};
