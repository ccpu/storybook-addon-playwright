import { readFile } from 'jsonfile';
import { FavouriteActionSet } from '../../typings';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';
import * as fs from 'fs';
import { FavouriteActionsData } from '../../schema';

export const getFavouriteActions = async (): Promise<FavouriteActionSet[]> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(FAVOURITE_ACTIONS_FILE_PATH)) {
      resolve([]);
      return;
    }

    readFile(
      FAVOURITE_ACTIONS_FILE_PATH,
      (err, data?: FavouriteActionsData) => {
        if (err) {
          reject(err);
        }

        resolve(data.actionSets);
      },
    );
  });
};
