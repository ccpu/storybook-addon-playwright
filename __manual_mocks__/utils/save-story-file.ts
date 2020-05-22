import * as save from '../../src/api/server/utils/save-story-file';

export const spyOnSaveStoryFile = jest
  .spyOn(save, 'saveStoryFile')
  .mockImplementation(() => {
    return new Promise((resolve) => {
      resolve();
    });
  });
