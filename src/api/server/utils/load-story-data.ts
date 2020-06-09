import { StoryPlaywrightData } from '../../../typings';
import { readFile } from 'jsonfile';
import fs from 'fs';

export const loadStoryData = async (
  storyDataPath: string,
  storyId: string,
): Promise<StoryPlaywrightData> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(storyDataPath)) {
      if (storyId === '*') {
        resolve({});
      } else {
        resolve({ [storyId]: {} });
      }
      return;
    }
    readFile(storyDataPath, (err, data) => {
      if (err) {
        reject(err);
      }
      if (!data[storyId] && storyId !== '*') {
        data[storyId] = {};
      }
      resolve(data);
    });
  });
};
