import type { PlaywrightData } from '../../../typings';
import type { StoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import * as fs from 'node:fs';
import { writeFileSync } from 'jsonfile';
import { getVersion } from './get-version';

export function saveStoryFile(fileInfo: StoryPlaywrightFileInfo, data?: PlaywrightData) {
  const stories = data?.stories;

  if (stories) {
    Object.keys(stories).forEach((key) => {
      if (!Object.keys(stories[key] || {}).length) {
        delete stories[key];
      }
    });
  }

  if (data && stories && Object.keys(stories).length > 0) {
    const newData: PlaywrightData = {
      version: getVersion(),
      ...data,
    };
    writeFileSync(fileInfo.path, newData, {
      EOL: '\r\n',
      spaces: 2,
    });
  } else {
    try {
      fs.unlinkSync(fileInfo.path);
    } catch {
      // Ignore missing file errors when there is nothing to persist.
    }
  }
}
