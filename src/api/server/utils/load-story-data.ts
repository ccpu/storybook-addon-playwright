import { StoryPlaywrightData } from '../../../typings';
import { readFile } from 'jsonfile';
import fs from 'fs';

export const loadStoryData = async (
  storyDataPath: string,
): Promise<StoryPlaywrightData> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(storyDataPath)) {
      resolve({});
      return;
    }
    readFile(storyDataPath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
