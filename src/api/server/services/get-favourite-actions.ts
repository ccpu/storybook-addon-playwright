import { readFile } from 'jsonfile';
import { ActionSet } from '../../../typings';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';
import * as fs from 'fs';
import { FavouriteActions } from '../../typings/favourite-actions';

export const getFavouriteActions = async (): Promise<ActionSet[]> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(FAVOURITE_ACTIONS_FILE_PATH)) {
      resolve([]);
      return;
    }

    readFile(FAVOURITE_ACTIONS_FILE_PATH, (err, data?: FavouriteActions) => {
      if (err) {
        reject(err);
      }

      resolve(data.actionSets);
    });
  });
};
