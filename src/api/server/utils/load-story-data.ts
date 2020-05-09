import { StoryData } from '../../../typings';
import { readFile } from 'jsonfile';
import fs from 'fs';
import * as path from 'path';
import { StoryFileInfo } from './get-story-file-info';

export const loadStoryData = async (
  fileInfo: StoryFileInfo,
): Promise<StoryData> => {
  return new Promise((resolve, reject) => {
    const jsonFileName = path.join(fileInfo.path);
    if (!fs.existsSync(jsonFileName)) {
      resolve({});
      return;
    }
    readFile(jsonFileName, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
