import { PlaywrightData } from '../../../typings';
import { readFile } from 'jsonfile';
import fs from 'fs';

export const loadStoryData = async (
  storyDataPath: string,
  storyId: string,
  create = true,
): Promise<PlaywrightData | undefined> => {
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
};
