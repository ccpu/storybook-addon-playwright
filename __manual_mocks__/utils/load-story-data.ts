import * as load from '../../src/api/server/utils/load-story-data';
import { storyFileInfo } from './story-file-info';

export const spyOnLoadStoryData = jest
  .spyOn(load, 'loadStoryData')
  .mockImplementation(() => {
    const data = storyFileInfo();
    return new Promise((resolve) => {
      resolve(data);
    });
  });
