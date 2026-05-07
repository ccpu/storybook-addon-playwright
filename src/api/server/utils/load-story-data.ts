import type { PlaywrightData } from '../../../typings';
import fs from 'node:fs';
import { readFile } from 'jsonfile';

export async function loadStoryData(
  storyDataPath: string,
  storyId: string,
  create = true,
): Promise<PlaywrightData | undefined> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(storyDataPath)) {
      if (!create) {
        resolve(undefined);
        return;
      }

      if (storyId === '*') {
        resolve({ stories: {} });
      } else {
        resolve({ stories: { [storyId]: {} } });
      }
      return;
    }

    readFile(storyDataPath, (err, data?: PlaywrightData) => {
      if (err) {
        reject(err);
        return;
      }

      const loadedData: PlaywrightData = data || { stories: {} };

      if (!loadedData.stories) {
        loadedData.stories = {};
      }

      if (!loadedData.stories[storyId] && storyId !== '*') {
        loadedData.stories[storyId] = {};
      }

      resolve(loadedData);
    });
  });
}
