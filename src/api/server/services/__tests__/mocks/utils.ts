import { storyFileInfo } from '../utils';
import * as utils from '../../../utils';

export const spyOnSaveStoryFile = jest
  .spyOn(utils, 'saveStoryFile')
  .mockImplementation(() => {
    return new Promise((resolve) => {
      resolve();
    });
  });

export const spyOnLoadStoryData = jest
  .spyOn(utils, 'loadStoryData')
  .mockImplementation(() => {
    const data = storyFileInfo();
    return new Promise((resolve) => {
      resolve(data);
    });
  });

export const spyOnExecuteAction = jest
  .spyOn(utils, 'executeAction')
  .mockImplementation(() => {
    return new Promise((resolve) => {
      resolve();
    });
  });
